import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, FileText, Menu, X } from "lucide-react";
import { useEnquiry } from "../context/EnquiryContext";
import { useCart } from "../context/CartContext";
import Logo, { LilMedWordmark } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/why-us", label: "Why Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useEnquiry();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Only the Home page ("/") swaps the header logo image for the styled
  // "LilMed" wordmark text. Every other route keeps the image logo.
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerH = scrolled ? "h-16 md:h-20" : "h-20 md:h-24";
  const logoH = scrolled ? "h-10 md:h-14" : "h-14 md:h-20";

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div
        className={`mx-auto flex ${headerH} max-w-7xl items-center justify-between gap-2 px-3 md:px-8 transition-[height] duration-300`}
      >
        <Link
          to="/"
          className="flex items-center shrink-0"
          onClick={() => setOpen(false)}
          aria-label="LilMed home"
        >
          {isHome ? (
            <LilMedWordmark
              className={`text-3xl transition-all duration-300 sm:text-4xl ${
                scrolled ? "md:text-4xl" : "md:text-5xl"
              }`}
            />
          ) : (
            <Logo className={`${logoH} w-auto transition-all duration-300`} />
          )}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `nav-link text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? "text-brand-teal is-active" : "text-brand-navy hover:text-brand-teal"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="relative inline-flex">
            <Link
              to="/cart"
              className="btn-shine btn-lift inline-flex items-center gap-1.5 rounded-full border border-brand-navy/10 px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
              aria-label="View cart"
            >
              <ShoppingCart size={14} strokeWidth={2.4} />
              Cart
            </Link>
            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-2 -top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-teal px-1 text-[11px] font-bold leading-none text-white shadow ring-2 ring-white animate-breathe">
                {cartCount}
              </span>
            )}
          </div>
          <div className="relative hidden sm:inline-flex">
            <Link
              to="/enquiry"
              className="btn-shine btn-lift inline-flex items-center gap-1.5 rounded-full border border-brand-navy/10 px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-navy hover:text-white"
              aria-label="View quote list"
            >
              <FileText size={14} strokeWidth={2.4} />
              Quote
            </Link>
            {count > 0 && (
              <span className="pointer-events-none absolute -right-2 -top-2 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green px-1 text-[11px] font-bold leading-none text-white shadow ring-2 ring-white animate-breathe">
                {count}
              </span>
            )}
          </div>
          <button
            className="md:hidden rounded-md border border-brand-navy/10 p-2 text-brand-navy"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <div className="flex flex-col px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold text-brand-navy">
              Cart ({cartCount})
            </Link>
            <Link to="/enquiry" onClick={() => setOpen(false)} className="py-2 text-sm font-semibold text-brand-navy">
              Quote ({count})
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
