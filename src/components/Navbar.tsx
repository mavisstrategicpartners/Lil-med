import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ShoppingCart, FileText, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useEnquiry } from "../context/EnquiryContext";
import { useCart } from "../context/CartContext";
import Logo, { LilMedWordmark } from "./Logo";
import CategoryMegaMenu from "./CategoryMegaMenu";
import { categories, subcategoriesFor } from "../data/products";

export default function Navbar() {
  const { count } = useEnquiry();
  const { count: cartCount } = useCart();
  const [open, setOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { pathname } = useLocation();

  // Close menus on page navigation
  useEffect(() => {
    setMegaMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerH = scrolled ? "h-16 md:h-20" : "h-20 md:h-24";
  const logoH = scrolled ? "h-10 md:h-14" : "h-14 md:h-20";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 220);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-sm font-semibold tracking-wide transition-colors inline-flex items-center ${
      isActive ? "text-brand-teal is-active" : "text-brand-navy hover:text-brand-teal"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          {/* Products Mega-Menu Dropdown Trigger */}
          <div
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `nav-link text-sm font-semibold tracking-wide transition-colors inline-flex items-center gap-1 ${
                  isActive || megaMenuOpen
                    ? "text-brand-teal is-active"
                    : "text-brand-navy hover:text-brand-teal"
                }`
              }
            >
              <span>Products</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  megaMenuOpen ? "rotate-180 text-brand-teal" : "text-current opacity-70"
                }`}
              />
            </NavLink>
          </div>

          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/why-us" className={navLinkClass}>
            Why Us
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Header Right Actions */}
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

      {/* Reflecta-style Full-Width Mega-Dropdown rendered directly below navbar */}
      <CategoryMegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-t border-black/5 bg-white md:hidden max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col px-4 py-3 space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
              }
            >
              About
            </NavLink>

            {/* Mobile Products & Categories Accordion */}
            <div className="border-y border-black/5 py-1">
              <div className="flex items-center justify-between">
                <Link
                  to="/products"
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-semibold text-brand-navy hover:text-brand-teal"
                >
                  Products Catalogue
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className="p-2 text-brand-navy hover:text-brand-teal"
                  aria-label="Toggle categories list"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileCategoriesOpen ? "rotate-180 text-brand-teal" : ""
                    }`}
                  />
                </button>
              </div>

              {mobileCategoriesOpen && (
                <div className="pl-3 pr-1 pb-2 space-y-2 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-brand-teal pt-1">
                    Categories & Sub-Categories
                  </div>
                  {categories.map((cat) => {
                    const subs = subcategoriesFor(cat.name);
                    const isExpanded = expandedMobileCategory === cat.name;
                    return (
                      <div key={cat.slug} className="rounded-xl border border-black/5 bg-brand-cream/40 p-2">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={() => setOpen(false)}
                            className="font-semibold text-brand-navy hover:text-brand-teal flex items-center gap-1.5"
                          >
                            <span className="text-brand-teal font-bold">»»</span>
                            <span>{cat.name}</span>
                          </Link>
                          {subs.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMobileCategory(isExpanded ? null : cat.name)
                              }
                              className="p-1 text-brand-charcoal/60"
                            >
                              <ChevronRight
                                className={`h-3.5 w-3.5 transition-transform ${
                                  isExpanded ? "rotate-90 text-brand-teal" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Mobile Sub-Categories */}
                        {isExpanded && subs.length > 0 && (
                          <div className="mt-2 pl-2 space-y-1 border-l-2 border-brand-teal/40">
                            {subs.map((s) => (
                              <Link
                                key={s.name}
                                to={`/products?category=${encodeURIComponent(
                                  cat.name
                                )}&sub=${encodeURIComponent(s.name)}`}
                                onClick={() => setOpen(false)}
                                className="block py-1 text-[11px] text-brand-charcoal/80 hover:text-brand-teal"
                              >
                                • {s.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <NavLink
              to="/services"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/why-us"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
              }
            >
              Why Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-2 text-sm font-semibold ${isActive ? "text-brand-teal" : "text-brand-navy"}`
              }
            >
              Contact
            </NavLink>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="py-1 text-sm font-semibold text-brand-navy"
              >
                Cart ({cartCount})
              </Link>
              <Link
                to="/enquiry"
                onClick={() => setOpen(false)}
                className="py-1 text-sm font-semibold text-brand-teal"
              >
                Quote ({count})
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
