import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Truck, PackageCheck } from "lucide-react";
import {
  products as LOCAL,
  categories as CATS,
  formatZAR,
  type Product,
} from "../data/products";
import { useCart } from "../context/CartContext";
import { useLiveProducts } from "../hooks/useProducts";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { items: dbItems } = useLiveProducts();
  const [added, setAdded] = useState(false);

  const product: Product | undefined = useMemo(() => {
    const local = LOCAL.find((p) => p.id === id);
    if (local) return local;
    const db = dbItems.find((p) => p.id === id);
    if (!db) return undefined;
    return {
      id: db.id,
      sap: db.sap || "",
      name: db.name,
      category: db.categories?.name || "Medical Products",
      rawCategory: db.raw_category || db.categories?.name || "",
      subcategory: "",
      casePack: "",
      innerMoq: db.inner_moq || "",
      price: Number(db.price) || 0,
      image: db.image_url || "",
      description: db.description || "",
    };
  }, [id, dbItems]);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-brand-navy">Product not found</h1>
        <p className="mt-3 text-sm text-brand-charcoal/70">
          This item may have been renamed or removed from the catalogue.
        </p>
        <Link
          to="/products"
          className="btn-shine btn-lift mt-8 inline-block rounded-full bg-brand-navy px-8 py-3 text-sm font-bold uppercase tracking-wider text-white"
        >
          Browse all products
        </Link>
      </div>
    );
  }

  const info = CATS.find((c) => c.name === product.category) || CATS[0];
  const specs = Object.entries(product.specs || {});
  const related = LOCAL.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const payload = () => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  });
  const onAdd = () => {
    add(payload());
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };
  const onQuote = () => {
    add(payload());
    navigate("/checkout");
  };

  return (
    <div className="bg-white">
      <section className="border-b border-black/5 bg-brand-cream/60">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/70 transition hover:text-brand-teal"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <nav className="mt-2 text-xs text-brand-charcoal/60">
            <Link to="/products" className="hover:text-brand-teal">
              Products
            </Link>
            <span className="px-2">/</span>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              className="hover:text-brand-teal"
            >
              {product.category}
            </Link>
            {product.rawCategory && product.rawCategory !== product.category && (
              <>
                <span className="px-2">/</span>
                <span>{product.rawCategory}</span>
              </>
            )}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="group flex h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-sm md:h-[520px]"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-[0_24px_28px_rgba(11,58,111,0.16)] transition duration-700 group-hover:scale-105"
              />
            ) : (
              <span className="text-xs uppercase tracking-widest text-brand-navy/40">
                No image
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ background: info?.color || "#0B3A6F" }}
            >
              {product.rawCategory || product.category}
            </span>
            <h1 className="mt-4 font-display text-3xl leading-tight text-brand-navy md:text-4xl">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/80">
                {product.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-2xl font-bold text-brand-navy">
                {formatZAR(product.price)}
              </div>
              {product.sap && (
                <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-navy">
                  SKU: {product.sap}
                </span>
              )}
              {product.innerMoq && (
                <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold text-brand-navy">
                  Pack: {product.innerMoq}
                </span>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
              <button
                onClick={onAdd}
                className={`btn-shine btn-lift rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition ${
                  added ? "bg-brand-green" : "bg-brand-teal hover:bg-brand-teal-dark"
                }`}
              >
                {added ? "Added ✓" : "Add to Quote"}
              </button>
              <button
                onClick={onQuote}
                className="btn-lift rounded-full border border-brand-navy bg-white px-5 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy transition hover:bg-brand-navy hover:text-white"
              >
                Quote Now
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "Quality assured", copy: "Lab-grade materials" },
                { icon: Truck, label: "Nationwide", copy: "Delivered across SA" },
                { icon: PackageCheck, label: "Bulk friendly", copy: "Volume pricing on request" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-black/5 bg-brand-cream/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <f.icon size={18} className="text-brand-teal" />
                  <div className="mt-2 text-xs font-bold text-brand-navy">{f.label}</div>
                  <div className="text-[11px] text-brand-charcoal/60">{f.copy}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-brand-navy">Product description</h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80">
              {product.longDescription || product.description ||
                "Contact our team for full technical details and availability on this product."}
            </p>
          </div>

          {specs.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-brand-navy">Specifications</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/5">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map(([k, v], i) => (
                      <tr key={k} className={i % 2 ? "bg-white" : "bg-brand-cream/60"}>
                        <th className="w-2/5 px-4 py-3 text-left align-top font-semibold text-brand-navy">
                          {k}
                        </th>
                        <td className="px-4 py-3 text-brand-charcoal/80">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-brand-navy">Related products</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/product/${r.id}`}
                  className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-44 items-center justify-center bg-white p-3">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-110"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-sm leading-tight text-brand-navy line-clamp-2">
                      {r.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
