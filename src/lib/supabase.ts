import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.warn(
    "[lilmed] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — admin & live-catalog features are disabled until you add them.",
  );
}

export const supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder", {
  auth: { persistSession: true, autoRefreshToken: true },
  realtime: { params: { eventsPerSecond: 10 } },
});

export type DbCategory = { id: string; name: string; slug: string };
export type DbProduct = {
  id: string;
  sap: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  raw_category: string | null;
  inner_moq: string | null;
  price: number;
  image_url: string | null;
  categories?: { name: string } | null;
  created_at?: string;
};
export type DbQuote = {
  id: string;
  reference: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  company: string | null;
  notes: string | null;
  items: Array<{ name: string; qty: number; price: number; sku?: string }>;
  total: number;
  status: "new" | "contacted" | "closed";
  emailed: boolean;
  created_at: string;
};
// Alias so existing admin code referencing DbOrder keeps compiling.
export type DbOrder = DbQuote;
export type DbAdmin = { id: string; email: string; name: string; role: string; created_at: string };
export type DbAudit = {
  id: string;
  admin_email: string;
  action: string;
  target: string | null;
  details: unknown;
  created_at: string;
};
