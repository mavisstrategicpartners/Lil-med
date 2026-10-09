// Public quote-status lookup. Requires BOTH email + reference to prevent
// enumeration; returns a minimal, safe subset of quote fields.

export const config = { runtime: "nodejs" };

type Body = { email?: string; reference?: string };

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
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return json({ error: "Quote tracking is not configured yet." }, 503);
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  const reference = (body.reference || "").trim().toUpperCase();
  if (!isEmail(email) || !reference) {
    return json(
      { error: "Enter the email you used and your quote reference (e.g. LM-XXXXXX)." },
      400,
    );
  }

  // Use PostgREST directly to avoid pulling in the JS client.
  const q = new URL(`${url.replace(/\/$/, "")}/rest/v1/quotes`);
  q.searchParams.set(
    "select",
    "reference,status,total,created_at,customer_name,company,items",
  );
  q.searchParams.set("reference", `eq.${reference}`);
  q.searchParams.set("customer_email", `ilike.${email}`);
  q.searchParams.set("limit", "1");

  const res = await fetch(q, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    return json({ error: "Lookup failed. Please try again." }, 502);
  }
  const rows = (await res.json()) as Array<Record<string, unknown>>;
  if (!rows.length) {
    // Do NOT differentiate between "no such reference" and "email mismatch".
    return json({ error: "We couldn't find a quote matching those details." }, 404);
  }
  const row = rows[0];
  const items = Array.isArray(row.items) ? (row.items as unknown[]) : [];
  return json({
    quote: {
      reference: row.reference,
      status: row.status || "new",
      total: Number(row.total || 0),
      created_at: row.created_at,
      customer_name: row.customer_name || "",
      company: row.company || "",
      itemCount: items.length,
      items: items.slice(0, 50),
    },
  });
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
