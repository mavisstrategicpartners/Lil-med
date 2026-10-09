import { useEffect, useState } from "react";
import { supabase, type DbQuote } from "../../lib/supabase";
import { formatZAR } from "../../data/products";

type Props = { status: "new" | "contacted" | "closed" | "all" };

export default function AdminOrders({ status }: Props) {
  const [rows, setRows] = useState<DbQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<DbQuote | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let q = supabase.from("quotes").select("*").order("created_at", { ascending: false }).limit(500);
      if (status !== "all") q = q.eq("status", status);
      const { data } = await q;
      setRows((data as DbQuote[]) || []);
      setLoading(false);
    }
    load();
    const ch = supabase
      .channel(`quotes-${status}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "quotes" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [status]);

  async function markClosed(q: DbQuote) {
    await supabase.from("quotes").update({ status: "closed" }).eq("id", q.id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">
            {status === "closed" ? "Closed quotes" : "New quotes"}
          </h1>
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${rows.length} ${rows.length === 1 ? "quote" : "quotes"}`}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-left text-brand-navy">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-brand-cream/40">
                <td className="px-4 py-2 font-mono text-xs">{r.reference}</td>
                <td className="px-4 py-2 font-semibold">{r.customer_name || "—"}</td>
                <td className="px-4 py-2 text-xs text-gray-600">{r.customer_email || "—"}</td>
                <td className="px-4 py-2">{r.items?.length ?? 0}</td>
                <td className="px-4 py-2 text-right font-bold text-brand-navy">
                  {formatZAR(Number(r.total))}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => setOpen(r)}
                    className="rounded-full border border-brand-navy px-3 py-1 text-xs font-bold text-brand-navy hover:bg-brand-navy hover:text-white"
                  >
                    View
                  </button>
                  {r.status !== "closed" && (
                    <button
                      onClick={() => markClosed(r)}
                      className="ml-2 rounded-full bg-brand-green px-3 py-1 text-xs font-bold text-white hover:bg-brand-green-dark"
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  No quotes here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-teal">
                  Quote {open.reference}
                </div>
                <h2 className="mt-1 text-xl font-bold text-brand-navy">
                  {open.customer_name || "Unknown customer"}
                </h2>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="rounded-full border px-3 py-1 text-sm font-bold text-brand-navy"
              >
                ×
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="Email" value={open.customer_email || "—"} />
              <Info label="Phone" value={open.customer_phone || "—"} />
              <Info label="Company" value={open.company || "—"} />
              <Info label="Received" value={new Date(open.created_at).toLocaleString()} />
            </div>
            {open.notes && (
              <div className="mt-4">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-navy">
                  Notes
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{open.notes}</p>
              </div>
            )}
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-navy">
                Items
              </div>
              <table className="mt-1 w-full text-sm">
                <thead className="bg-brand-cream text-left">
                  <tr>
                    <th className="px-2 py-2">Item</th>
                    <th className="px-2 py-2 text-center">Qty</th>
                    <th className="px-2 py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {open.items?.map((i, ix) => (
                    <tr key={ix} className="border-t">
                      <td className="px-2 py-2">{i.name}</td>
                      <td className="px-2 py-2 text-center">{i.qty}</td>
                      <td className="px-2 py-2 text-right">{formatZAR(i.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 text-right text-lg font-bold text-brand-navy">
                Total: {formatZAR(Number(open.total))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</div>
      <div className="font-semibold text-brand-navy">{value}</div>
    </div>
  );
}
