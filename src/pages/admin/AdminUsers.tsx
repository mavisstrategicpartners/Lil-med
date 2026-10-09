import { useEffect, useState } from "react";
import { Copy, RefreshCw, UserPlus } from "lucide-react";
import { supabase, type DbAdmin } from "../../lib/supabase";

export default function AdminUsers() {
  const [admins, setAdmins] = useState<DbAdmin[]>([]);
  const [isLeadAdmin, setIsLeadAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "lead_admin">("admin");
  const [password, setPassword] = useState(() => generatePassword());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [{ data: adminRows }, { data: userData }] = await Promise.all([
      supabase.from("admins").select("*").order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]);
    const rows = (adminRows as DbAdmin[]) || [];
    setAdmins(rows);
    const signedInEmail = userData.user?.email?.toLowerCase();
    setIsLeadAdmin(
      rows.some((admin) => admin.email.toLowerCase() === signedInEmail && admin.role === "lead_admin"),
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      setBusy(false);
      setError("Please sign in again before adding an admin.");
      return;
    }

    const res = await fetch("/api/admin-mgmt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, role, password }),
    });
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);

    if (!res.ok) {
      setError(payload.error || "Could not create admin.");
      return;
    }

    setMessage(`Admin created. Copy the password now and share it securely with ${email}.`);
    setName("");
    setEmail("");
    setRole("admin");
    await load();
  }

  async function copyPassword() {
    await navigator.clipboard.writeText(password);
    setMessage("Password copied. Share it securely with the new admin.");
  }

  function refreshPassword() {
    setPassword(generatePassword());
    setMessage("New password generated.");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Admins</h1>
        <p className="text-sm text-gray-500">
          Lead admins can create new portal users, generate secure temporary passwords, and assign roles.
        </p>
      </div>

      {isLeadAdmin ? (
        <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-brand-teal">
                Add portal admin
              </div>
              <h2 className="mt-1 font-display text-xl text-brand-navy">Create login details</h2>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              <UserPlus size={16} /> {busy ? "Creating…" : "Create admin"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Full name" value={name} onChange={setName} placeholder="e.g. Thando Maseko" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="name@company.co.za" required />
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
                Role
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value === "lead_admin" ? "lead_admin" : "admin")}
                className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:border-brand-teal"
              >
                <option value="admin">Admin</option>
                <option value="lead_admin">Lead admin</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
                Generated password
              </span>
              <div className="flex overflow-hidden rounded-xl border border-black/10 bg-brand-cream">
                <input
                  readOnly
                  value={password}
                  className="min-w-0 flex-1 bg-transparent p-3 font-mono text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={refreshPassword}
                  className="px-3 text-brand-navy hover:bg-white"
                  title="Generate new password"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={copyPassword}
                  className="px-3 text-brand-navy hover:bg-white"
                  title="Copy password"
                >
                  <Copy size={16} />
                </button>
              </div>
            </label>
          </div>

          {message && <p className="mt-3 rounded-xl bg-brand-teal/10 px-3 py-2 text-sm font-semibold text-brand-teal">{message}</p>}
          {error && <p className="mt-3 rounded-xl bg-brand-red/10 px-3 py-2 text-sm font-semibold text-brand-red">{error}</p>}
        </form>
      ) : (
        <div className="rounded-2xl bg-white p-4 text-sm text-gray-600 shadow-sm ring-1 ring-black/5">
          Signed-in admins can view the team list. Only a lead admin can add or promote portal users.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-left text-brand-navy">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2 font-medium">{a.name || "—"}</td>
                <td className="px-4 py-2">{a.email}</td>
                <td className="px-4 py-2 text-xs uppercase text-gray-500">
                  {a.role.replace("_", " ")}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No admins yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
        {label}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
      />
    </label>
  );
}

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%&*";
  const bytes = new Uint32Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}
