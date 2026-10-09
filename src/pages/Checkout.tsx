import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatZAR } from "../data/products";
import { supabase } from "../lib/supabase";
import { buildQuotePdf } from "../lib/quote";

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const initial: FormState = { name: "", email: "", phone: "", company: "", notes: "" };

export default function Checkout() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.name.trim() || !form.email.trim()) {
      setErr("Please enter your name and email.");
      return;
    }
    setLoading(true);
    setErr(null);

    const reference = "QUOTE-" + Date.now().toString(36).toUpperCase();
    const quotePayload = {
      reference,
      customer: { ...form },
      items: items.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        sku: i.id,
      })),
      total,
      date: new Date().toISOString(),
    };

    try {
      // Build PDF and get base64 for the email attachment
      const pdf = await buildQuotePdf(quotePayload);
      const pdfBase64 = pdf
        .output("datauristring")
        .replace(/^data:application\/pdf;filename=generated\.pdf;base64,/, "")
        .replace(/^data:application\/pdf;base64,/, "");

      // Save to localStorage so /success can offer the download
      try {
        localStorage.setItem("lilmed:last-quote", JSON.stringify(quotePayload));
      } catch {
        /* ignore */
      }

      // Store in Supabase (best effort — RLS insert allowed for anon)
      try {
        await supabase.from("quotes").insert({
          reference,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          company: form.company,
          notes: form.notes,
          items: quotePayload.items,
          total,
          status: "new",
        });
      } catch {
        /* ignore — email is the source of truth */
      }

      // Send email through Vercel serverless function.
      // Never block the user's success flow on email failures — the quote
      // is already saved (Supabase + localStorage) and downloadable as PDF.
      try {
        const res = await fetch("/api/send-quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            customer: form,
            items: quotePayload.items,
            total,
            pdfBase64,
          }),
        });
        if (!res.ok) {
          // eslint-disable-next-line no-console
          console.warn("[send-quote] non-2xx response, continuing", res.status);
        }
      } catch (emailErr) {
        // eslint-disable-next-line no-console
        console.warn("[send-quote] request failed, continuing", emailErr);
      }

      clear();
      nav(`/success?ref=${encodeURIComponent(reference)}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Request a quotation
          </span>
          <h1 className="mt-2 font-display text-4xl text-brand-navy">Send us your list</h1>
          <p className="mt-2 max-w-xl text-brand-charcoal/70">
            Fill in your details and we'll email you a professional PDF quotation and get back
            to you within one business day.
          </p>
        </div>
        <Link to="/cart" className="text-sm font-semibold text-brand-navy hover:text-brand-teal">
          Edit cart
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/10 bg-brand-cream p-12 text-center">
          <p className="text-brand-charcoal/70">Your cart is empty.</p>
          <Link
            to="/products"
            className="btn-shine btn-lift mt-6 inline-block rounded-full bg-brand-teal px-6 py-3 text-sm font-bold text-white"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" required value={form.name} onChange={(v) => update("name", v)} />
              <Field label="Email" required type="email" value={form.email} onChange={(v) => update("email", v)} />
              <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
              <Field label="Company / practice" value={form.company} onChange={(v) => update("company", v)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
                Notes for our team
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                placeholder="Delivery address, preferred sizes, extra items, deadlines…"
                className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
              />
            </div>
            {err && (
              <p className="rounded-xl bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red">
                {err}
              </p>
            )}
            <button
              disabled={loading}
              className="btn-shine btn-lift w-full rounded-full bg-brand-teal px-8 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
            >
              {loading ? "Sending quote…" : "Send my quote"}
            </button>
            <p className="text-center text-xs text-brand-charcoal/60">
              Your PDF quote will be emailed to <b>info@lilmed.co.za</b> and to you.
            </p>
          </form>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="font-display text-xl text-brand-navy">Your items ({items.length})</h3>
            <div className="mt-4 space-y-3 text-sm">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3 border-b border-black/5 pb-2">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-brand-navy">{i.name}</div>
                    <div className="text-xs text-brand-charcoal/60">
                      {i.qty} × {formatZAR(i.price)}
                    </div>
                  </div>
                  <div className="whitespace-nowrap font-bold text-brand-navy">
                    {formatZAR(i.price * i.qty)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold text-brand-navy">
              <span>Est. total</span>
              <span>{formatZAR(total)}</span>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
        {label}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
      />
    </label>
  );
}
