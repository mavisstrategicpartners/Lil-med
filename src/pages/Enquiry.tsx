import { Link } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import { useEnquiry } from "../context/EnquiryContext";

export default function Enquiry() {
  const { items, remove, clear } = useEnquiry();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Your enquiry
          </span>
          <h1 className="mt-2 font-display text-4xl text-brand-navy">Quote list</h1>
          <p className="mt-2 max-w-lg text-brand-charcoal/70">
            Items you've flagged to enquire about. Ready? Send them through the quote form —
            we'll email you a PDF quotation.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-brand-navy/15 bg-brand-cream p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
            <FileText size={28} />
          </div>
          <h2 className="mt-4 font-display text-2xl text-brand-navy">
            No items on your quote list
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-brand-charcoal/70">
            Add products from the catalogue to build a quotation.
          </p>
          <Link
            to="/products"
            className="btn-shine btn-lift mt-6 inline-block rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <div className="font-semibold text-brand-navy">{i.name}</div>
                  <div className="text-xs text-brand-charcoal/60">{i.category}</div>
                </div>
                <button
                  onClick={() => remove(i.id)}
                  className="rounded-full border border-brand-red px-3 py-1 text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between gap-3">
            <button onClick={clear} className="text-sm text-brand-charcoal/70 hover:underline">
              Clear list
            </button>
            <Link
              to="/checkout"
              className="btn-shine btn-lift rounded-full bg-brand-teal px-8 py-3 text-sm font-bold uppercase tracking-widest text-white"
            >
              Send for quotation
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
