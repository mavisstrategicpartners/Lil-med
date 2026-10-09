import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, FileText, Clock, CheckCircle2, XCircle, Mail } from "lucide-react";
import { formatZAR } from "../data/products";

type QuoteItem = { name: string; qty: number; price?: number; sku?: string };
type QuoteResult = {
  reference: string;
  status: "new" | "contacted" | "closed" | string;
  total: number;
  created_at: string;
  customer_name: string;
  company: string;
  itemCount: number;
  items: QuoteItem[];
};

const STATUS_META: Record<
  string,
  { label: string; tone: string; icon: JSX.Element; blurb: string }
> = {
  new: {
    label: "Received",
    tone: "bg-brand-teal/10 text-brand-teal",
    icon: <Clock size={16} />,
    blurb: "We've received your quote and it's in our queue.",
  },
  contacted: {
    label: "In progress",
    tone: "bg-amber-100 text-amber-700",
    icon: <Mail size={16} />,
    blurb: "Our team has reached out with pricing or follow-up questions.",
  },
  closed: {
    label: "Closed",
    tone: "bg-brand-green/15 text-brand-green",
    icon: <CheckCircle2 size={16} />,
    blurb: "This quote has been completed or archived.",
  },
};

export default function MyQuote() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [reference, setReference] = useState(params.get("ref") || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuoteResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setBusy(true);
    try {
      const res = await fetch("/api/track-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reference }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lookup failed.");
      } else {
        setResult(data.quote);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const meta = result ? STATUS_META[result.status] || STATUS_META.new : null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
        Track a quote
      </span>
      <h1 className="mt-2 font-display text-4xl text-brand-navy md:text-5xl">
        My quote
      </h1>
      <p className="mt-3 max-w-xl text-brand-charcoal/70">
        Enter the email you submitted with and your reference number
        (e.g. <b>LM-ABC123</b>) to see the current status.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/60">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/60">
              Reference
            </span>
            <input
              required
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              placeholder="LM-XXXXXX"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm uppercase tracking-widest outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="btn-shine btn-lift inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
          >
            <Search size={16} /> {busy ? "Looking up…" : "Check status"}
          </button>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-navy hover:text-brand-teal"
          >
            Browse products →
          </Link>
        </div>
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {result && meta && (
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/60">
                Reference
              </div>
              <div className="mt-1 font-display text-2xl text-brand-navy">
                {result.reference}
              </div>
              <div className="mt-1 text-xs text-brand-charcoal/60">
                Submitted {new Date(result.created_at).toLocaleDateString()}
                {result.customer_name ? ` · ${result.customer_name}` : ""}
                {result.company ? ` · ${result.company}` : ""}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest ${meta.tone}`}
            >
              {meta.icon} {meta.label}
            </span>
          </div>
          <p className="mt-4 text-sm text-brand-charcoal/70">{meta.blurb}</p>

          <div className="mt-6 rounded-2xl bg-brand-cream/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-charcoal/60">
              <FileText size={14} /> {result.itemCount} item
              {result.itemCount === 1 ? "" : "s"}
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {result.items.map((i, ix) => (
                <div
                  key={ix}
                  className="flex justify-between gap-3 border-b border-black/5 pb-1 last:border-0"
                >
                  <span className="truncate">
                    {i.qty} × {i.name}
                  </span>
                  <span className="font-semibold text-brand-navy">
                    {i.price ? formatZAR(i.price * i.qty) : "On request"}
                  </span>
                </div>
              ))}
            </div>
            {result.total > 0 && (
              <div className="mt-3 flex justify-between text-sm font-bold text-brand-navy">
                <span>Est. total</span>
                <span>{formatZAR(result.total)}</span>
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-brand-charcoal/60">
            Questions? Email{" "}
            <a
              href={`mailto:info@lilmed.co.za?subject=Quote%20${encodeURIComponent(result.reference)}`}
              className="font-semibold text-brand-teal hover:underline"
            >
              info@lilmed.co.za
            </a>{" "}
            with your reference.
          </p>
        </div>
      )}
    </section>
  );
}
