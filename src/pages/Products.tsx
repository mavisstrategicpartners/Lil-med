import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  categories as CATS,
  products as LOCAL,
  formatZAR,
  type Product,
} from "../data/products";
import { useCart } from "../context/CartContext";
import { useLiveProducts } from "../hooks/useProducts";

const ALL = "All" as const;

// Older catalogue rows that repeat the paediatric tray products.
const repeatedBloodProducts = new Set([
  "disposable blood collection tube (serum clot activator tube)",
  "disposable blood collection tube (serum gel & clot activator tube)",
  "disposable vacuum blood collection tube (edta tube)",
  "disposable vacuum blood collection tube (heparin with separator gel tube)",
  "micro blood collection tubes",
]);

export default function Products() {
  const { items: dbItems } = useLiveProducts();
  const [params, setParams] = useSearchParams();
  const initial = params.get("category");
  const [category, setCategory] = useState<string>(initial ?? ALL);
  const [rawCat, setRawCat] = useState<string>("All");
  const [subCat, setSubCat] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(48);

  useEffect(() => {
    const p = params.get("category");
    if (p) setCategory(p);
    const s = params.get("sub");
    setSubCat(s || "All");
  }, [params]);
  useEffect(() => {
    setVisible(48);
  }, [category, rawCat, subCat, query]);

  // Prefer live DB products once seeded. Fallback to local catalog if DB empty.
  const products: Product[] = useMemo(() => {
    const visible = (list: Product[]) =>
      list.filter((p) => !repeatedBloodProducts.has(p.name.trim().toLowerCase()));
    if (dbItems.length === 0) return visible(LOCAL);
    const mapped: Product[] = dbItems.map((p) => ({
      id: p.id,
      sap: p.sap || "",
      name: p.name,
      category: p.categories?.name || "Medical Products",
      rawCategory: p.raw_category || p.categories?.name || "",
      subcategory: p.description || "",
      casePack: "",
      innerMoq: p.inner_moq || "",
      price: Number(p.price) || 0,
      image: p.image_url || "",
      description: p.description || "",
    }));
    // Merge by product name: DB rows win, local-only catalogue items (newly
    // added ranges not yet seeded to the database) stay visible. Keying on the
    // name avoids duplicates because DB rows use generated UUIDs.
    const key = (n: string) => n.trim().toLowerCase();
    const merged = new Map<string, Product>(LOCAL.map((p) => [key(p.name), p]));
    mapped.forEach((p) => merged.set(key(p.name), { ...merged.get(key(p.name)), ...p }));
    return visible(Array.from(merged.values()));
  }, [dbItems]);

  const rawCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.rawCategory).filter(Boolean))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (rawCat !== "All" && p.rawCategory !== rawCat) return false;
      if (subCat !== "All" && p.rawCategory !== subCat) return false;
      if (
        query &&
        !(
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.rawCategory || "").toLowerCase().includes(query.toLowerCase()) ||
          (p.sap || "").toLowerCase().includes(query.toLowerCase())
        )
      )
        return false;
      return true;
    });
    if (category !== "Blood Collection Tubes & Needles") return list;
    const rank = (p: Product) => {
      const sub = p.subcategory || p.rawCategory || "";
      if (sub === "Paediatric Tubes 0.5ml") return 0;
      if (sub === "Blood Collection Needles") {
        return p.image.includes("/blood-collection/needles/") ? 1 : 2;
      }
      return 3;
    };
    return list
      .map((p, index) => ({ p, index }))
      .sort((a, b) => rank(a.p) - rank(b.p) || a.index - b.index)
      .map(({ p }) => p);
  }, [products, category, rawCat, subCat, query]);

  function updateCategory(c: string) {
    setCategory(c);
    setSubCat("All");
    if (c === ALL) setParams({});
    else setParams({ category: c });
  }

  function updateSub(s: string) {
    setSubCat(s);
    if (s === "All") setParams(category === ALL ? {} : { category });
    else setParams({ category, sub: s });
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy py-16 text-white">
        <div className="pointer-events-none absolute -top-24 -right-16 h-96 w-96 rounded-full bg-brand-teal/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-brand-green/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Complete product range
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Every product. One catalogue.</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Medical, laboratory & dental consumables — priced in Rands and ready to ship across
            South Africa.
          </p>
        </div>
      </section>

      <section className="sticky top-14 z-30 border-b border-black/5 bg-white/95 backdrop-blur md:top-16">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, SKU…"
              className="min-w-[200px] flex-1 rounded-full border border-black/10 px-5 py-2.5 text-sm outline-none focus:border-brand-teal"
            />
            <select
              value={rawCat}
              onChange={(e) => setRawCat(e.target.value)}
              className="rounded-full border border-black/10 px-4 py-2.5 text-sm"
            >
              <option value="All">All product types ({products.length})</option>
              {rawCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {[ALL, ...CATS.map((c) => c.name)].map((c) => (
              <button
                key={c}
                onClick={() => updateCategory(c)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  category === c
                    ? "bg-brand-navy text-white"
                    : "bg-brand-cream text-brand-navy hover:bg-brand-navy/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {subCat !== "All" && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-brand-charcoal/70">Filtered by sub-category:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-semibold text-brand-teal">
                {subCat}
                <button
                  type="button"
                  onClick={() => updateSub("All")}
                  className="ml-1 text-brand-teal/80 hover:text-brand-navy font-bold"
                  title="Clear sub-category filter"
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
      </section>


      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6 text-sm text-brand-charcoal/70">
          Showing {Math.min(visible, filtered.length)} of {filtered.length} products
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-brand-cream p-16 text-center">
            <h3 className="font-display text-2xl text-brand-navy">No products match your search.</h3>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visible).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + 48)}
                  className="btn-shine btn-lift rounded-full bg-brand-navy px-8 py-3 text-sm font-bold uppercase tracking-wider text-white"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const info = CATS.find((c) => c.name === product.category) || CATS[0];
  const [added, setAdded] = useState(false);
  const [preview, setPreview] = useState(false);

  const payload = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  });
  const onAdd = () => {
    add(payload());
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  const onQuote = () => {
    add(payload());
    navigate("/checkout");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      >
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="relative flex h-64 items-center justify-center overflow-hidden bg-white p-3 text-left ring-1 ring-black/5"
          aria-label={`View ${product.name}`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain drop-shadow-[0_18px_20px_rgba(11,58,111,0.14)] transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-cream text-brand-navy/40">
              <span className="text-xs uppercase tracking-widest">No image</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 rounded-full bg-brand-navy/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition group-hover:opacity-100">
            View
          </span>
        </button>
        <div className="flex flex-1 flex-col p-4">
          <span
            className="inline-block w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ background: info.color }}
          >
            {product.rawCategory || product.category}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="mt-2 flex-1 font-display text-sm leading-tight text-brand-navy line-clamp-3 transition hover:text-brand-teal"
          >
            {product.name}
          </Link>
          <div className="mt-3 grid gap-1 text-[11px] text-brand-charcoal/60">
            {product.sap && <span>SKU: {product.sap}</span>}
            {product.innerMoq && <span>Pack: {product.innerMoq}</span>}
          </div>
          <div className="mt-3 font-bold text-lg text-brand-navy">{formatZAR(product.price)}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={onAdd}
              className={`btn-shine btn-lift rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white transition ${
                added ? "bg-brand-green" : "bg-brand-teal hover:bg-brand-teal-dark"
              }`}
            >
              {added ? "Added ✓" : "Add to Quote"}
            </button>
            <button
              onClick={onQuote}
              className="btn-lift rounded-full border border-brand-navy bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-brand-navy transition hover:bg-brand-navy hover:text-white"
            >
              Quote Now
            </button>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="mt-2 block text-center text-[11px] font-bold uppercase tracking-widest text-brand-teal transition hover:text-brand-navy"
          >
            View full details →
          </Link>
        </div>
      </motion.div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreview(false)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-brand-teal">
                  Product preview
                </div>
                <h3 className="mt-2 font-display text-2xl leading-tight text-brand-navy">
                  {product.name}
                </h3>
                {product.sap && (
                  <div className="mt-1 text-xs text-brand-charcoal/60">SKU: {product.sap}</div>
                )}
              </div>
              <button
                onClick={() => setPreview(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-sm font-bold text-brand-navy"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-brand-cream p-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="mx-auto max-h-[420px] object-contain"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-brand-navy/40">
                    No image
                  </div>
                )}
              </div>
              <div>
                <div className="text-lg font-bold text-brand-navy">
                  {formatZAR(product.price)}
                </div>
                {product.description && (
                  <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={onAdd}
                    className="btn-shine btn-lift rounded-full bg-brand-teal px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
                  >
                    Add to Quote
                  </button>
                  <button
                    onClick={onQuote}
                    className="btn-lift rounded-full border border-brand-navy bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-navy hover:bg-brand-navy hover:text-white"
                  >
                    Quote Now
                  </button>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="btn-shine btn-lift mt-3 block rounded-full bg-brand-navy px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white"
                >
                  View full product page
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
