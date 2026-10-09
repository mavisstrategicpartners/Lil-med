import { useEffect, useState } from "react";
import { supabase, type DbProduct } from "../lib/supabase";

export function useLiveProducts() {
  const [items, setItems] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name)")
        .order("created_at", { ascending: false });
      if (mounted) {
        setItems((data as DbProduct[]) || []);
        setLoading(false);
      }
    }
    load();

    const ch = supabase
      .channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => load())
      .subscribe();

    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  return { items, loading };
}
