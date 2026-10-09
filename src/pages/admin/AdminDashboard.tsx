import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { formatZAR } from "../../data/products";

interface Stats {
  quotes: number;
  newQuotes: number;
  products: number;
  totalValue: number;
}

export default function AdminDashboard() {
  const [s, setS] = useState<Stats>({ quotes: 0, newQuotes: 0, products: 0, totalValue: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: quotes }, { count: newQuotes }, { count: products }, { data: totals }] =
        await Promise.all([
          supabase.from("quotes").select("*", { count: "exact", head: true }),
          supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("quotes").select("total"),
        ]);
      const totalValue = (totals || []).reduce(
        (a: number, r: { total?: number | string }) => a + Number(r.total || 0),
        0,
      );
      setS({
        quotes: quotes ?? 0,
        newQuotes: newQuotes ?? 0,
        products: products ?? 0,
        totalValue,
      });
    })();
  }, []);

  const cards = [
    { k: "Total quotes", v: s.quotes.toString() },
    { k: "New (open)", v: s.newQuotes.toString() },
    { k: "Products", v: s.products.toString() },
    { k: "Est. value", v: formatZAR(s.totalValue) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
        <p className="text-sm text-gray-500">Snapshot of your LilMed portal.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.k}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-brand-teal">
              {c.k}
            </div>
            <div className="mt-2 font-display text-3xl text-brand-navy">{c.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="font-display text-xl text-brand-navy">Quick actions</h2>
        <ul className="mt-3 grid gap-2 text-sm text-brand-navy md:grid-cols-2">
          <li>• Review new quotes in <b>New quotes</b> and reach out to the customer.</li>
          <li>• Add or rename products in <b>Products</b>; upload new images.</li>
          <li>• Invite team admins in <b>Admins</b>.</li>
          <li>• Every action is recorded in <b>Audit log</b>.</li>
        </ul>
      </div>
    </div>
  );
}
