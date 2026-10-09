import { Resend } from "resend";

type QuoteItem = { name: string; qty: number; price?: number; sku?: string };

type Body = {
  reference: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  };
  items: QuoteItem[];
  total: number;
  pdfBase64?: string;
};

export const config = { runtime: "nodejs" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL || "info@lilmed.co.za";
  const from = process.env.QUOTE_FROM_EMAIL || "LilMed Quotes <onboarding@resend.dev>";

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (!body?.reference || !Array.isArray(body.items) || body.items.length === 0) {
    return json({ error: "Missing reference or items" }, 400);
  }

  const html = renderEmailHtml(body);
  const attachments = body.pdfBase64
    ? [{ filename: `LilMed-Quote-${body.reference}.pdf`, content: body.pdfBase64 }]
    : undefined;

  const replyTo = body.customer?.email && isEmail(body.customer.email) ? body.customer.email : undefined;

  if (!apiKey) {
    // No key configured — return a soft OK so the UX still completes.
    // eslint-disable-next-line no-console
    console.warn("[send-quote] RESEND_API_KEY not set — skipping email delivery.");
    return json({ ok: true, emailed: false, warning: "RESEND_API_KEY not configured" });
  }

  try {
    const resend = new Resend(apiKey);
    // Send to LilMed
    const primary = await resend.emails.send({
      from,
      to,
      subject: `New quote request · ${body.reference}`,
      html,
      replyTo,
      attachments,
    });
    // If customer supplied an email, send them a copy
    if (replyTo) {
      await resend.emails.send({
        from,
        to: replyTo,
        subject: `Your LilMed quotation · ${body.reference}`,
        html: renderCustomerCopy(body),
        attachments,
      }).catch(() => null);
    }
    return json({ ok: true, emailed: true, id: primary.data?.id ?? null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to send email";
    // eslint-disable-next-line no-console
    console.error("[send-quote] Resend error:", msg);
    return json({ ok: false, error: msg }, 502);
  }
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function esc(s: string | undefined | null) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmtR(n: number) {
  return "R " + Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function renderEmailHtml(b: Body) {
  const rows = b.items
    .map(
      (i) => `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${esc(i.name)}${i.sku ? ` <span style='color:#888;font-size:12px'>[${esc(i.sku)}]</span>` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${i.price ? fmtR(i.price) : "On request"}</td>
      </tr>`,
    )
    .join("");
  const c = b.customer || {};
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#0B1220">
    <div style="background:#0B3A6F;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#0FB5B0">New quote request</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px">LilMed · ${esc(b.reference)}</div>
    </div>
    <div style="background:#fff;padding:20px 24px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
      <h3 style="margin:0 0 8px">Customer</h3>
      <p style="margin:0 0 12px;line-height:1.6">
        <b>${esc(c.name || "—")}</b><br/>
        ${esc(c.company || "")}<br/>
        ${esc(c.email || "")}<br/>
        ${esc(c.phone || "")}
      </p>
      ${c.notes ? `<h3 style="margin:16px 0 4px">Notes</h3><p style="white-space:pre-wrap;margin:0 0 12px">${esc(c.notes)}</p>` : ""}
      <h3 style="margin:16px 0 8px">Items (${b.items.length})</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#F3F8FB">
          <th style="padding:8px;text-align:left">Item</th>
          <th style="padding:8px;text-align:center">Qty</th>
          <th style="padding:8px;text-align:right">Price</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:12px;text-align:right;font-size:16px">
        <b>Est. total:</b> ${fmtR(b.total)}
      </div>
      <p style="color:#888;font-size:12px;margin-top:20px">Sent from lilmed.co.za</p>
    </div>
  </div>`;
}

function renderCustomerCopy(b: Body) {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#0B1220">
    <div style="background:#0B3A6F;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <div style="font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#0FB5B0">LilMed</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px">Thanks for your enquiry</div>
    </div>
    <div style="background:#fff;padding:20px 24px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
      <p>Hi ${esc(b.customer?.name || "there")},</p>
      <p>We've received your quotation request <b>${esc(b.reference)}</b> and our team will get back to you shortly.</p>
      <p>Your PDF quote is attached for your records.</p>
      <p style="margin-top:24px">— The LilMed team</p>
      <p style="color:#888;font-size:12px">info@lilmed.co.za</p>
    </div>
  </div>`;
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}
