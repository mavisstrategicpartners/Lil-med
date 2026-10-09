import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy py-24 text-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-teal/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            About LilMed
          </span>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            Medical supplies, made simple for South Africa.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            We source dependable medical, laboratory and dental consumables — from vials
            and centrifuge tubes to dental instruments and blood-collection systems —
            and put them in one clean catalogue for clinics, labs and practices.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3 md:px-8">
          {[
            {
              t: "Our promise",
              d: "Only manufacturers we trust — Citotest, Gongdong and dependable local partners.",
            },
            {
              t: "Our people",
              d: "Product specialists on the phone. No call-centre scripts, no runaround.",
            },
            {
              t: "Our reach",
              d: "Nationwide delivery, priced in Rands, from Cape Town to Polokwane.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <div className="rounded-3xl bg-brand-cream p-8 ring-1 ring-black/5">
                <h3 className="font-display text-2xl text-brand-navy">{c.t}</h3>
                <p className="mt-3 text-brand-charcoal/75">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-cream py-16">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="font-display text-3xl text-brand-navy md:text-4xl">
            Ready to place an order?
          </h2>
          <p className="mt-3 text-brand-charcoal/75">
            Add items to your cart and we'll email you a professional PDF quote.
          </p>
          <Link
            to="/products"
            className="btn-shine btn-lift mt-6 inline-block rounded-full bg-brand-teal px-8 py-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            Browse products
          </Link>
        </div>
      </section>
    </div>
  );
}
