import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { subcategoriesFor } from "../data/products";

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function CategoryMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: CategoryMegaMenuProps) {
  const navigate = useNavigate();

  const handleCategoryClick = (catName: string) => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  const handleSubClick = (catName: string, subName: string) => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(catName)}&sub=${encodeURIComponent(subName)}`);
  };

  // Group columns to match the Reflecta screenshot layout:
  // Column 1: Laboratory Consumables, Vials & Glassware
  const col1Categories = [
    "Laboratory Products",
    "Autosampler Vials & Headspace Vials",
    "Micro Vials & Inserts",
    "EPA VOA & TOC Vials",
    "Culture Tubes",
    "Reagent Bottles",
  ];

  // Column 2: Laboratory Equipment
  const col2Categories = ["Laboratory Equipments"];

  // Column 3: Medical Consumables & Blood Collection
  const col3Categories = ["Medical Equipments", "Blood Collection Tubes & Needles"];

  // Column 4: Dental Equipment & Dental Products
  const col4Categories = ["Dental Equipment"];

  // Column 5: Cleaning Products & Equipment + Quick Links
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
          <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform text-sm">
            »»
          </span>
          <span className="hover:underline underline-offset-2">{catName}</span>
        </button>

        {subs.length > 0 && (
          <ul className="space-y-1 pl-3.5 border-l border-brand-teal/20 text-[13px] text-brand-charcoal/80">
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="w-full border-t border-black/10 bg-white shadow-[0_30px_70px_rgba(11,58,111,0.18)] max-h-[82vh] overflow-y-auto"
        >
          <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
            {/* 5-Column Grid matching Reflecta Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-2">
              {/* Column 1: Lab Consumables, Vials & Reagents */}
              <div>{col1Categories.map((c) => renderCategoryBlock(c))}</div>

              {/* Column 2: Laboratory Equipment */}
              <div>{col2Categories.map((c) => renderCategoryBlock(c))}</div>

              {/* Column 3: Medical Equipment & Blood Collection */}
              <div>{col3Categories.map((c) => renderCategoryBlock(c))}</div>

              {/* Column 4: Dental Equipment */}
              <div>{col4Categories.map((c) => renderCategoryBlock(c))}</div>

              {/* Column 5: Cleaning Products & Highlight Links */}
              <div>
                {col5Categories.map((c) => renderCategoryBlock(c))}

                <div className="space-y-3 pt-3 border-t border-black/10 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/products");
                    }}
                    className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-teal transition hover:text-brand-navy"
                  >
                    <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform text-sm">
                      »»
                    </span>
                    <span>ALL PRODUCTS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/enquiry");
                    }}
                    className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy transition hover:text-brand-teal"
                  >
                    <span className="text-brand-teal font-extrabold group-hover:translate-x-0.5 transition-transform text-sm">
                      »»
                    </span>
                    <span>REQUEST QUOTATION</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="mt-8 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-4 text-xs text-brand-charcoal/70 bg-brand-cream/40 -mx-6 -mb-8 px-8 py-3.5">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-green" />
                <span className="font-semibold text-brand-navy">LilMed South Africa</span>
                <span>— Complete medical, laboratory & dental clinical supplies</span>
              </span>
              <Link
                to="/products"
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 font-bold text-brand-teal hover:text-brand-navy transition"
              >
                <span>View Complete Catalogue</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
