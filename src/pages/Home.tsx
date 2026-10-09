import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories, subcategoriesFor } from "../data/products";
import CountUp from "../components/CountUp";
import Reveal from "../components/Reveal";
import landing from "../assets/landing-hero-v3.png";
import lilmedLogo from "../assets/lilmed-logo.png";

const tickerWords = [
  "Vials", "Syringes", "Pipette Tips", "Culture Plates", "Centrifuge Tubes",
  "Blood Collection", "Dental Instruments", "Speculums", "Gloves", "Reagents",
  "Autoclaves", "Microscopes", "Freezers", "Sample Cells", "Cuvettes",
];

export default function Home() {
  return (
    <>
      {/* HERO — full-viewport medical background image, LilMed cursive wordmark on top */}
      <section className="relative isolate min-h-[92vh] overflow-hidden text-white">
        {/* background image — full bleed, subtle ken-burns, never harshly cropped */}
        <img
          src={landing}
          alt="Modern medical laboratory with microscope and scientific glassware"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center animate-ken-burns"
          fetchPriority="high"
        />
        {/* readability scrim: the new image is bright/light — darken the left where copy lives while letting the medical scene glow on the right */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy-dark/90 via-brand-navy-dark/60 to-brand-navy-dark/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy-dark/70 via-transparent to-brand-navy-dark/20" />
        <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-brand-green/20 blur-[140px] animate-pulse-soft" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 h-[520px] w-[520px] rounded-full bg-brand-teal/25 blur-[140px] animate-drift" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-16 md:gap-12 md:px-8 md:pb-24 md:pt-24 lg:grid-cols-12 lg:pb-32 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-teal sm:text-xs">
              <span className="h-px w-8 bg-brand-green sm:w-12" />
              Medical · Laboratory · Dental
            </div>

            <h1 className="mt-6 leading-[0.9] text-shadow-soft">
              {/* Logo sits on its own white card — only the logo gets a white
                  background, not the rest of the hero. Sized/padded so the
                  wordmark reads cleanly against the dark hero scrim. */}
              <span className="inline-block rounded-2xl bg-white px-5 py-3 shadow-[0_6px_24px_rgba(11,58,111,0.35)] sm:px-6 sm:py-4">
                <img
                  src={lilmedLogo}
                  alt="LilMed"
                  className="block h-auto w-[220px] sm:w-[300px] md:w-[400px] lg:w-[460px]"
                  draggable={false}
                />
              </span>
              <span className="mt-4 block font-display text-2xl italic text-white/90 sm:text-3xl md:text-4xl">
                supplies that clinics, labs & dentists trust.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg text-shadow-soft">
              Vials, centrifuge tubes, dental consumables, blood-collection systems and
              lab equipment —{" "}
              <em className="not-italic font-semibold text-brand-teal">curated</em>,
              priced in Rands and delivered across South Africa.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="btn-shine btn-lift group inline-flex items-center gap-3 rounded-full bg-brand-teal px-6 py-3 text-xs font-bold uppercase tracking-widest text-white md:px-7 md:py-4 md:text-sm"
              >
                Shop the catalogue{" "}
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/enquiry"
                className="btn-shine btn-lift inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-xs font-bold uppercase tracking-widest text-white md:px-7 md:py-4 md:text-sm"
              >
                Request a quotation
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-brand-navy md:px-7 md:py-4 md:text-sm"
              >
                Our story
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              <CoverLine k="290+" t="Products across every clinical category." />
              <CoverLine k="5" t="Focused ranges: Lab, Dental, Blood & more." />
              <CoverLine k="ZAR" t="Real South African pricing." />
            </div>
          </motion.div>
        </div>


        {/* Ticker */}
        <div className="relative overflow-hidden border-y border-white/10 bg-brand-navy-dark/85 py-4">
          <div className="flex whitespace-nowrap animate-ticker gap-10 text-sm font-bold uppercase tracking-[0.3em] text-white/65">
            {[...tickerWords, ...tickerWords, ...tickerWords].map((w, i) => (
              <span key={i} className="flex items-center gap-10">
                {w}
                <span className="text-brand-teal">✚</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { k: "01", t: "Curated", d: "Only proven manufacturers — Citotest, Gongdong and trusted local partners." },
              { k: "02", t: "Delivered", d: "Consistent supply for hospitals, private practice, labs and dental rooms." },
              { k: "03", t: "Supported", d: "Real product experts on the phone — not a call-centre script." },
            ].map((c, i) => (
              <Reveal key={c.k} delay={i * 0.1}>
                <div className="group relative flex h-full flex-col rounded-3xl border border-brand-ink/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-2xl">
                  <span className="font-display text-6xl italic text-brand-teal/80">{c.k}</span>
                  <h3 className="mt-4 font-display text-3xl text-brand-navy">{c.t}</h3>
                  <p className="mt-3 text-brand-charcoal/75">{c.d}</p>
                  <div className="mt-6 h-px w-16 bg-brand-teal transition-all group-hover:w-24" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
          {[
            { n: 250, s: "+", label: "Products" },
            { n: 5,   s: "+", label: "Categories" },
            { n: 100, s: "%", label: "South African Owned" },
            { n: 24,  s: "/7", label: "Support & Reliability" },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 0.08} className="text-center">
              <div className="font-display text-5xl text-brand-navy md:text-7xl">
                <CountUp to={stat.n} suffix={stat.s} />
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-charcoal/60">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-cream py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
                  The Catalogue
                </span>
                <h2 className="mt-3 font-display text-4xl leading-[0.95] text-brand-navy md:text-6xl">
                  Shop by category
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden shrink-0 rounded-full border border-brand-navy/20 px-5 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy transition hover:bg-brand-navy hover:text-white md:inline-block"
              >
                View all →
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link
                  to={`/products?category=${encodeURIComponent(c.name)}`}
                  className="img-shine group relative block h-72 overflow-hidden rounded-3xl bg-brand-navy shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-teal">
                      Category
                    </span>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{c.name}</h3>
                    <p className="mt-1 text-sm text-white/80 line-clamp-2">{c.blurb}</p>
                    {subcategoriesFor(c.name).length > 0 && (
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {subcategoriesFor(c.name).map((s) => (
                          <span
                            key={s.name}
                            className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur"
                          >
                            {s.name}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy py-24 text-white">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-teal/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
              Ready when you are
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
              Get a quote in minutes.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              Add items to your cart, tell us who you are, and we'll email you a
              professional PDF quotation — no account needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              to="/products"
              className="btn-shine btn-lift rounded-full bg-brand-teal px-7 py-4 text-sm font-bold uppercase tracking-widest text-white"
            >
              Browse products
            </Link>
            <Link
              to="/contact"
              className="btn-shine btn-lift rounded-full border border-white/40 px-7 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-white hover:text-brand-navy"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function CoverLine({ k, t }: { k: string; t: string }) {
  return (
    <div className="border-l-2 border-brand-teal/70 pl-3 sm:pl-4">
      <div className="font-display text-xl leading-none text-brand-teal sm:text-2xl">{k}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/75 sm:text-xs">
        {t}
      </div>
    </div>
  );
}