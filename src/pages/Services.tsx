import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

const services = [
  {
    t: "Laboratory consumables",
    d: "Vials, centrifuge tubes, pipette tips, culture plates, cuvettes and specimen containers from Citotest, Gongdong and trusted partners.",
  },
  {
    t: "Blood collection",
    d: "Vacuum blood-collection tubes, needles and holders — the full workflow for clinics, pathology and labs.",
  },
  {
    t: "Dental supplies",
    d: "Dental instruments, surface disinfectants + barriers, curing lights, scalers, and everyday consumables.",
  },
  {
    t: "Medical equipment",
    d: "Freezers and refrigerators, autoclaves, examination tables, microscopes and diagnostic equipment.",
  },
  {
    t: "Nursing & PPE",
    d: "Gloves, masks, gowns, catheters and everyday nursing consumables at wholesale prices.",
  },
  {
    t: "Custom sourcing",
    d: "Looking for something we don't list? Send us the spec — we source it and quote in one email.",
  },
];

export default function Services() {
  return (
    <div className="bg-white">
      <section className="bg-brand-navy py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            What we do
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">
            Services
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            One supplier for the lab, the clinic and the dental room.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-8">
          {services.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.05}>
              <div className="rounded-3xl border border-black/5 bg-brand-cream p-6">
                <h3 className="font-display text-xl text-brand-navy">{s.t}</h3>
                <p className="mt-2 text-sm text-brand-charcoal/75">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/enquiry"
            className="btn-shine btn-lift inline-block rounded-full bg-brand-green px-8 py-3 text-sm font-bold uppercase tracking-widest text-white"
          >
            Request a quotation
          </Link>
        </div>
      </section>
    </div>
  );
}
