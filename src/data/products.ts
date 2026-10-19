import data from "./lilmed-data.json";
import { categoryImageOverrides, productImageOverrides } from "./image-overrides";

export type ProductCategory = string;

export interface Product {
  id: string;
  sap: string;                 // model / SKU
  name: string;
  category: ProductCategory;   // human readable category name (used for filtering)
  rawCategory: string;         // subcategory
  subcategory: string;
  casePack: string;
  innerMoq: string;
  price: number;
  image: string;               // resolved public URL
  description?: string;
  longDescription?: string;
  specs?: Record<string, string>;
  featured?: boolean;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  blurb: string;
  color: string;
  image: string;
}

interface RawProduct {
  id: number | string;
  name: string;
  model?: string;
  category?: string;
  categoryName?: string;
  price?: string | number;
  description?: string;
  image?: string;
  imageFolder?: string;
  productSubcategory?: string;
  productSubcategoryName?: string;
  minOrder?: string;
  longDescription?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
}
interface RawCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  imageFolder?: string;
}

const raw = data as { products: RawProduct[]; categories: RawCategory[] };

// Category palette — cycles through medical brand tokens
const palette = ["#0B3A6F", "#0FB5B0", "#22C08A", "#1B5FA6", "#158A61", "#087A78", "#F5B841"];

function publicPath(folder: string, image: string): string {
  return encodeURI(`/${folder}/${image}`.replace(/\/+/g, "/"));
}

function resolveImage(p: RawProduct): string {
  const override = productImageOverrides[String(p.id)];
  if (override) return override;
  if (!p.image) return "";
  // Absolute URL
  if (/^https?:\/\//i.test(p.image)) return p.image;
  if (p.image.startsWith("/")) return encodeURI(p.image.replace(/\/+/g, "/"));
  const folder = p.imageFolder ? p.imageFolder.replace(/^\/+/, "") : "imgs";
  return publicPath(folder, p.image);
}

function resolveCategoryImage(c: RawCategory): string {
  const override = categoryImageOverrides[c.name];
  if (override) return override;
  if (c.image) {
    if (/^https?:\/\//i.test(c.image)) return c.image;
    if (c.image.startsWith("/")) return encodeURI(c.image.replace(/\/+/g, "/"));
    return publicPath(c.imageFolder || "imgs", c.image);
  }
  return products.find((p) => p.category === c.name && p.image)?.image || "/landing.webp";
}

export const products: Product[] = raw.products.map((p, i) => ({
  id: String(p.id),
  sap: p.model || "",
  name: p.name,
  category: p.categoryName || p.category || "Medical Products",
  rawCategory: p.productSubcategoryName || p.categoryName || "",
  subcategory: p.productSubcategoryName || "",
  casePack: "",
  innerMoq: p.minOrder || "",
  price: typeof p.price === "number" ? p.price : 0, // 0 = "Request Quote"
  image: resolveImage(p),
  description: p.description || "",
  longDescription: p.longDescription || "",
  specs: p.specifications || undefined,
  featured: !!p.featured,
  _sort: i,
} as Product));

export const categories: CategoryInfo[] = raw.categories.map((c, i) => ({
  name: c.name,
  slug: c.id,
  blurb:
    c.description ||
    "Medical, laboratory & diagnostic supplies carefully selected for South African clinics, labs and dental practices.",
  color: palette[i % palette.length],
  image: resolveCategoryImage(c),
}));

export function formatZAR(n: number) {
  if (!n || n <= 0) return "Request Quote";
  return "R " + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ---------------------------------------------------------------------------
// Client-defined sub-category structure (additive — nothing above is changed).
// 1. Laboratory Products  → Laboratory Plastic Consumables (YingMed & Citotest)
//                         → Laboratory Bottle Consumables (Gongdong)
// 2. Blood Collection Tubes & Needles → Blood Collection Tubes (Gongdong)
//                                     → Blood Collection Needles (Gongdong)
// ---------------------------------------------------------------------------
export interface SubcategoryInfo {
  name: string;
  blurb: string;
}

export const categorySubcategories: Record<string, SubcategoryInfo[]> = {
  "Laboratory Products": [
    {
      name: "Laboratory Plastic Consumables",
      blurb: "YingMed & Citotest plastic laboratory consumables.",
    },
    {
      name: "Laboratory Bottle Consumables",
      blurb: "Gongdong bottle, vial and glassware consumables.",
    },
  ],
  "Autosampler Vials & Headspace Vials": [
    { name: "HPLC & GC Autosampler Vials", blurb: "Screw, crimp and snap-ring 2ml vials, caps and septa." },
    { name: "Headspace Vials & Caps", blurb: "6ml, 10ml and 20ml headspace vials with magnetic caps." },
  ],
  "EPA VOA & TOC Vials": [
    { name: "EPA & TOC Vials", blurb: "VOA, TOC and purge-and-trap vials with 24-400 / 15-425 caps." },
  ],
  "Culture Tubes": [
    { name: "Culture & Test Tubes", blurb: "COD digestion, sample cells and screw-cap culture tubes." },
  ],
  "Micro Vials & Inserts": [
    { name: "Micro Vials", blurb: "0.3ml and 1ml micro and shell vials with integrated inserts." },
    { name: "Vial Inserts", blurb: "150 – 300µl flat, conical and polymer-foot glass inserts." },
  ],
  "Reagent Bottles": [
    { name: "GL45 Reagent Bottles", blurb: "Borosilicate 3.3 clear and amber media bottles, 100 – 1000ml." },
  ],
  "Blood Collection Tubes & Needles": [
    {
      name: "Paediatric Tubes 0.5ml",
      blurb: "IMPROMINI 0.5ml capillary tubes: clot activator, gel & clot activator, lithium heparin, EDTA K2 and EDTA K2 Plus.",
    },
    { name: "Blood Collection Needles", blurb: "Hypodermic and safety blood collection needles." },
    { name: "Blood Collection Tubes", blurb: "Vacuum blood collection tubes, including Vacu Lab EDTA, citrate and serum gel." },
  ],
  "Cleaning Products & Equipment": [
    {
      name: "Cleaning Machines & Equipment",
      blurb: "R46 rotary machines, GT50 autoscrubbers, Columbus vacuums, spares and service contracts.",
    },
    {
      name: "Cleaning Chemicals",
      blurb: "Detergents, disinfectants, floor polymers, hand soaps and automotive chemicals in 5lt & 25lt.",
    },
    {
      name: "Paper & Wiping Products",
      blurb: "Toilet paper, hand towels, reel towels, serviettes, wipers and refuse bags by the case.",
    },
    {
      name: "Dispensers",
      blurb: "Toilet roll, towel, soap, foam, air-freshener and hand dryer dispensers.",
    },
    {
      name: "Stainless Steel Range",
      blurb: "Clean Cut stainless steel washroom dispensers, bins and covers.",
    },
    {
      name: "Janitorial Trolleys & Buckets",
      blurb: "Mop buckets, wringers, janitorial trolleys, wet floor signs and square buckets.",
    },
    {
      name: "Safety Wear & Gloves",
      blurb: "Dust masks, mop caps and rubber, PVC, nitrile and examination gloves.",
    },
    {
      name: "Aerosols, Soaps & Sundries",
      blurb: "Aerosols, air fresheners, bar soaps, toilet soaps and housekeeping sundries.",
    },
  ],
  "Medical Equipments": [
    { name: "Surgical & Medical Disposables", blurb: "Sterile gauze, drapes, suction catheters, bags and clinical disposables." },
    { name: "Hypodermic Products", blurb: "Syringes, hypodermic needles, scalp vein sets and infusion sets." },
    { name: "Gynecological Consumables", blurb: "Cervical cytology brushes, speculums, and examination disposables." },
    { name: "Surgical Products", blurb: "Surgical blades, sutures, umbilical cord clamps and surgical essentials." },
  ],
  "Dental Equipment": [
    { name: "Dental Products", blurb: "Dental restorative, periodontal, impression materials and instruments." },
    { name: "Autoclave", blurb: "Class B benchtop autoclaves, sterilization sealers and monitoring systems." },
    { name: "Endodontic", blurb: "Endo motors, apex locators and root canal treatment instruments." },
    { name: "Ultrasonic Scaler", blurb: "Piezo ultrasonic scalers, tips, cleaners and prophy handpieces." },
    { name: "Curing Light", blurb: "High-intensity LED curing lights and composite polymerization units." },
    { name: "Delivery Unit", blurb: "Mobile dental delivery units, compressors, stools and handpiece kits." },
  ],
  "Laboratory Equipments": [
    { name: "Freezers", blurb: "Deep storage -20°C, -25°C, -30°C and -40°C medical and laboratory freezers." },
    { name: "Autoclaves", blurb: "Vertical and benchtop laboratory steam sterilizers and autoclaves." },
    { name: "Incubators", blurb: "CO2 incubators, lighting incubators and constant-temperature chambers." },
    { name: "Refrigerators", blurb: "Pharmacy refrigerators, 2-8°C vaccine storage and blood bank refrigeration." },
    { name: "Laboratory Instruments & Accessories", blurb: "Centrifuges, mixers, shakers, water baths and bench instruments." },
  ],
};


export function subcategoriesFor(categoryName: string): SubcategoryInfo[] {
  return categorySubcategories[categoryName] || [];
}

export function countInSubcategory(list: Product[], categoryName: string, sub: string): number {
  return list.filter((p) => p.category === categoryName && p.rawCategory === sub).length;
}
