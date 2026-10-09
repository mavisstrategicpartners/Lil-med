import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

const items = [
  { k: "01", t: "Quality-vetted suppliers", d: "Every product comes from a manufacturer we've qualified." },
  { k: "02", t: "Real Rand pricing", d: "No dollar-to-rand surprises at invoicing time." },
  { k: "03", t: "One-stop catalogue", d: "Lab, dental, medical and diagnostic in one place." },
  { k: "04", t: "Fast quotes", d: "Same-day quotations — your PDF hits your inbox in minutes." },
  { k: "05", t: "Human support", d: "Product experts on the phone, not a chat bot." },
  { k: "06", t: "SA-owned", d: "Proudly South African, backing local clinics and labs." },
];

export default function WhyUs() {
  return (
    <div className="bg-white">
      <section className="bg-brand-navy py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Why LilMed
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">
            Reliable supply. Real support.
          </h1>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-8">
          {items.map((i, ix) => (
            <Reveal key={i.k} delay={ix * 0.05}>
              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                <div className="font-display text-4xl italic text-brand-teal/80">{i.k}</div>
                <h3 className="mt-2 font-display text-xl text-brand-navy">{i.t}</h3>
                <p className="mt-2 text-brand-charcoal/75">{i.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            to="/products"
            className="btn-shine btn-lift inline-block rounded-full bg-brand-teal px-8 py-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            Start shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
