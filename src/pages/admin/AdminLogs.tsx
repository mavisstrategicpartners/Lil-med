import { useEffect, useState } from "react";
import { supabase, type DbAudit } from "../../lib/supabase";

export default function AdminLogs() {
  const [logs, setLogs] = useState<DbAudit[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("audit_logs")
        .select("*").order("created_at", { ascending: false }).limit(500);
      setLogs((data as DbAudit[]) || []);
    }
    load();
    const ch = supabase.channel("admin-logs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "audit_logs" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Audit Log</h1>
        <p className="text-sm text-gray-500">Every action performed in the admin portal.</p>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-left text-brand-navy">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-t align-top">
                <td className="px-4 py-2 text-xs text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{l.admin_email}</td>
                <td className="px-4 py-2 font-mono text-xs">{l.action}</td>
                <td className="px-4 py-2 font-mono text-xs">{l.target || "—"}</td>
                <td className="px-4 py-2 text-xs text-gray-600"><pre className="whitespace-pre-wrap break-all">{l.details ? JSON.stringify(l.details) : ""}</pre></td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">No activity yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
