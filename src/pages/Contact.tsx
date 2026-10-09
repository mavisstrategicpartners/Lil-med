import { useState } from "react";
import { Mail } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: "MSG-" + Date.now().toString(36).toUpperCase(),
          customer: { name: form.name, email: form.email, notes: form.message },
          items: [{ name: "General enquiry (no items)", qty: 1, price: 0 }],
          total: 0,
        }),
      });
    } catch {
      /* ignore — email is a nice-to-have here */
    }
    setSent(true);
  }

  return (
    <div className="bg-white">
      <section className="bg-brand-navy py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Get in touch
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Contact LilMed</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Email us any time — we reply within one business day.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-4xl gap-10 px-4 md:grid-cols-2 md:px-8">
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-brand-navy">Direct</h2>
            <a
              href="mailto:info@lilmed.co.za"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-cream p-4 font-semibold text-brand-navy hover:bg-brand-teal hover:text-white"
            >
              <Mail size={18} /> info@lilmed.co.za
            </a>
            <p className="text-sm text-brand-charcoal/70">
              For faster service, use the quote form on any product page — your PDF quotation
              is emailed straight to our team.
            </p>
          </div>
          <form
            onSubmit={submit}
            className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            {sent ? (
              <div className="p-6 text-center">
                <div className="font-display text-2xl text-brand-navy">Thanks!</div>
                <p className="mt-2 text-sm text-brand-charcoal/70">
                  We'll be in touch shortly at <b>{form.email}</b>.
                </p>
              </div>
            ) : (
              <>
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
                    Message
                  </span>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
                  />
                </label>
                <button className="btn-shine btn-lift w-full rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white">
                  Send
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
        {label}
      </span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
      />
    </label>
  );
}
