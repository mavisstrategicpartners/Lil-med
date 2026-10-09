import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-24 bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="rounded-lg bg-white p-3 inline-block">
            <Logo className="h-10" />
          </div>
          <p className="mt-4 text-sm text-white/70">
            Medical, laboratory & dental consumables. Proudly South African supplier.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-brand-teal">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-brand-green" to="/">Home</Link></li>
            <li><Link className="hover:text-brand-green" to="/about">About</Link></li>
            <li><Link className="hover:text-brand-green" to="/products">Products</Link></li>
            <li><Link className="hover:text-brand-green" to="/services">Services</Link></li>
            <li><Link className="hover:text-brand-green" to="/why-us">Why Us</Link></li>
            <li><Link className="hover:text-brand-green" to="/contact">Contact</Link></li>
            <li><Link className="hover:text-brand-green" to="/my-quote">Track my quote</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-brand-teal">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><a href="mailto:info@lilmed.co.za" className="hover:text-brand-green">info@lilmed.co.za</a></li>
            <li>South Africa</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-brand-teal">Trust</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>SA-owned & operated</li>
            <li>Quality assured suppliers</li>
            <li>Nationwide delivery</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/60 md:px-8">
          © {new Date().getFullYear()} LilMed. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
