import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Logo from "../components/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr(error.message);
    else nav("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5"
      >
        <div className="flex justify-center">
          <Logo className="h-14" />
        </div>
        <div className="mt-4 text-center">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">
            Admin portal
          </div>
          <h1 className="mt-1 font-display text-2xl text-brand-navy">Sign in</h1>
        </div>
        <div className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-brand-navy">
              Password
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-brand-teal"
            />
          </label>
          {err && (
            <p className="rounded-xl bg-brand-red/10 px-3 py-2 text-sm font-semibold text-brand-red">
              {err}
            </p>
          )}
          <button
            disabled={busy}
            className="btn-shine btn-lift w-full rounded-full bg-brand-teal px-6 py-3 text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
