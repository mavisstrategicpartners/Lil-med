import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatZAR } from "../data/products";

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Your quote basket
          </span>
          <h1 className="mt-2 font-display text-4xl text-brand-navy">Cart</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 overflow-hidden rounded-3xl border border-dashed border-brand-navy/15 bg-gradient-to-br from-brand-cream to-white p-14 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
            <ShoppingCart size={36} strokeWidth={1.6} />
          </div>
          <h2 className="mt-6 font-display text-3xl text-brand-navy">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-md text-brand-charcoal/70">
            Nothing here yet — start browsing our catalogue and add products to build a quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="btn-shine btn-lift inline-flex items-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white"
            >
              Browse products <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="btn-lift inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              View categories
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 p-4">
                {i.image && (
                  <img
                    src={i.image}
                    alt={i.name}
                    className="h-24 w-24 rounded-xl bg-white object-contain p-1 ring-1 ring-black/5"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate font-semibold text-brand-navy">{i.name}</div>
                  <div className="text-sm text-brand-charcoal/70">{formatZAR(i.price)} each</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => setQty(i.id, parseInt(e.target.value) || 1)}
                  className="w-16 rounded-md border border-black/10 px-2 py-1 text-center"
                />
                <div className="w-24 text-right font-bold text-brand-navy">
                  {formatZAR(i.price * i.qty)}
                </div>
                <button
                  onClick={() => remove(i.id)}
                  className="ml-2 text-brand-red hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={clear} className="text-sm text-brand-charcoal/70 hover:underline">
              Clear cart
            </button>
            <div className="text-right">
              <div className="text-sm text-brand-charcoal/70">Estimated total</div>
              <div className="font-display text-3xl text-brand-navy">{formatZAR(total)}</div>
              <div className="mt-1 text-xs text-brand-charcoal/60">
                Items marked "Request Quote" are priced on request.
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Link
              to="/products"
              className="btn-lift rounded-full border border-brand-navy bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-white"
            >
              Continue shopping
            </Link>
            <Link
              to="/checkout"
              className="btn-shine btn-lift rounded-full bg-brand-teal px-8 py-3 text-sm font-bold uppercase tracking-widest text-white"
            >
              Request quote
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
