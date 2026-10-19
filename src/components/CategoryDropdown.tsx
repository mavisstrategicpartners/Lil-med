import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { categories, subcategoriesFor } from "../data/products";

interface CategoryDropdownProps {
  onNavigate?: () => void;
}

export default function CategoryDropdown({ onNavigate }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Close on Escape or outside click
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  const handleCategoryClick = (catName: string) => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  const handleSubClick = (catName: string, subName: string) => {
    setIsOpen(false);
    if (onNavigate) onNavigate();
    navigate(`/products?category=${encodeURIComponent(catName)}&sub=${encodeURIComponent(subName)}`);
  };

  // Group columns to match the Reflecta layout exactly:
  // Col 1: Laboratory Products, Vials, Culture Tubes, Reagent Bottles
  // Col 2: Laboratory Equipments
  // Col 3: Medical Equipments & Blood Collection Tubes & Needles
  // Col 4: Dental Equipment
  // Col 5: Cleaning Products & Equipment + Quick Links
  const col1Categories = [
    "Laboratory Products",
    "Autosampler Vials & Headspace Vials",
    "Micro Vials & Inserts",
    "EPA VOA & TOC Vials",
    "Culture Tubes",
    "Reagent Bottles",
  ];
  const col2Categories = ["Laboratory Equipments"];
  const col3Categories = ["Medical Equipments", "Blood Collection Tubes & Needles"];
  const col4Categories = ["Dental Equipment"];
  const col5Categories = ["Cleaning Products & Equipment"];

  const renderCategoryBlock = (catName: string) => {
    const subs = subcategoriesFor(catName);
    return (
      <div key={catName} className="space-y-2 mb-6">
        <button
          type="button"
          onClick={() => handleCategoryClick(catName)}
          className="group flex items-center gap-1.5 text-left text-xs font-bold uppercase tracking-wider text-brand-teal transition hover:text-brand-navy"
        >
          <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform">
            »»
          </span>
          <span className="hover:underline underline-offset-2">{catName}</span>
        </button>

        {subs.length > 0 && (
          <ul className="space-y-1.5 pl-3 border-l border-brand-teal/20 text-[13px] text-brand-charcoal/85">
            {subs.map((s) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => handleSubClick(catName, s.name)}
                  className="text-left text-brand-charcoal/80 transition hover:text-brand-teal hover:translate-x-0.5 transform inline-block py-0.5"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navbar trigger link */}
      <div className="flex items-center">
        <Link
          to="/products"
          onClick={() => {
            setIsOpen(false);
            if (onNavigate) onNavigate();
          }}
          className={`nav-link text-sm font-semibold tracking-wide flex items-center gap-1 py-2 transition-colors ${
            isOpen ? "text-brand-teal is-active" : "text-brand-navy hover:text-brand-teal"
          }`}
        >
          <span>Products</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="p-0.5 rounded transition"
            aria-expanded={isOpen}
            aria-label="Toggle categories dropdown"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-brand-teal" : "text-brand-navy/60"
              }`}
            />
          </button>
        </Link>
      </div>

      {/* Reflecta-style Full-Width Mega-Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed left-0 right-0 top-20 md:top-24 w-full bg-white border-y border-black/10 shadow-[0_30px_70px_rgba(11,58,111,0.18)] z-50 overflow-y-auto max-h-[82vh]"
          >
            <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
              {/* 5-Column Grid matching Reflecta Screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-4">
                {/* Column 1: Lab Products, Vials & Bottles */}
                <div>{col1Categories.map((c) => renderCategoryBlock(c))}</div>

                {/* Column 2: Laboratory Equipment */}
                <div>{col2Categories.map((c) => renderCategoryBlock(c))}</div>

                {/* Column 3: Medical Equipments & Blood Collection */}
                <div>{col3Categories.map((c) => renderCategoryBlock(c))}</div>

                {/* Column 4: Dental Equipment */}
                <div>{col4Categories.map((c) => renderCategoryBlock(c))}</div>

                {/* Column 5: Cleaning Products & Featured Quick Links */}
                <div>
                  {col5Categories.map((c) => renderCategoryBlock(c))}

                  {/* Quick Highlight Links */}
                  <div className="space-y-3 pt-3 border-t border-black/10 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (onNavigate) onNavigate();
                        navigate("/products");
                      }}
                      className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-teal transition hover:text-brand-navy"
                    >
                      <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform">
                        »»
                      </span>
                      <span>ALL PRODUCTS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (onNavigate) onNavigate();
                        navigate("/enquiry");
                      }}
                      className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy transition hover:text-brand-teal"
                    >
                      <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform">
                        »»
                      </span>
                      <span>REQUEST QUOTATION</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Catalogue Summary Strip */}
              <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-charcoal/70 bg-brand-cream/30 -mx-6 -mb-8 px-8 py-3.5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-green" />
                  <span className="font-semibold text-brand-navy">
                    South African Clinical & Lab Supply
                  </span>
                  <span>— 250+ certified products ready for quotation & delivery</span>
                </span>
                <Link
                  to="/products"
                  onClick={() => {
                    setIsOpen(false);
                    if (onNavigate) onNavigate();
                  }}
                  className="group inline-flex items-center gap-1.5 font-bold text-brand-teal hover:text-brand-navy transition"
                >
                  <span>Open Interactive Catalogue</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
