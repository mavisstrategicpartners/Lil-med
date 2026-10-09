import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { formatZAR } from "../data/products";
import { downloadQuote } from "../lib/quote";

interface QuoteLine { name: string; price: number; qty: number; sku?: string }
interface LocalQuote {
  reference: string;
  customer: { name: string; email?: string; company?: string; phone?: string; notes?: string };
  items: QuoteLine[];
  total: number;
  date: string;
}

export default function Success() {
  const [params] = useSearchParams();
  const [quote, setQuote] = useState<LocalQuote | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lilmed:last-quote");
      if (raw) setQuote(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  async function onDownload() {
    if (!quote) return;
    setBusy(true);
    try {
      await downloadQuote(quote);
    } finally {
      setBusy(false);
    }
  }

  const reference = quote?.reference || params.get("ref") || "QUOTE";

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
        <CheckCircle2 size={44} strokeWidth={2} />
      </div>
      <span className="mt-6 inline-block text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
        Quote received
      </span>
      <h1 className="mt-2 font-display text-4xl text-brand-navy md:text-5xl">
        Thanks — we've got it.
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-brand-charcoal/70">
        Your reference is <b>{reference}</b>. A PDF quotation has been emailed to
        {" "}<b>info@lilmed.co.za</b>{quote?.customer?.email ? <> and to <b>{quote.customer.email}</b></> : null}. Our team will
        follow up shortly.
      </p>

      {quote && (
        <div className="mx-auto mt-8 max-w-xl rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/60">
            Summary
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {quote.items.map((i, ix) => (
              <div key={ix} className="flex justify-between border-b border-black/5 pb-1">
                <span className="truncate pr-3">
                  {i.qty} × {i.name}
                </span>
                <span className="font-semibold text-brand-navy">
                  {formatZAR(i.price * i.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-base font-bold text-brand-navy">
            <span>Est. total</span>
            <span>{formatZAR(quote.total)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {quote && (
          <button
            onClick={onDownload}
            disabled={busy}
            className="btn-shine btn-lift inline-flex items-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
          >
            <Download size={16} /> {busy ? "Preparing…" : "Download PDF"}
          </button>
        )}
        <Link
          to="/products"
          className="btn-lift rounded-full border border-brand-navy px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-white"
        >
          Keep browsing
        </Link>
        <Link
          to={`/my-quote?ref=${encodeURIComponent(reference)}${quote?.customer?.email ? `&email=${encodeURIComponent(quote.customer.email)}` : ""}`}
          className="btn-lift rounded-full border border-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-teal hover:bg-brand-teal hover:text-white"
        >
          Track this quote
        </Link>
      </div>
    </section>
  );
}
