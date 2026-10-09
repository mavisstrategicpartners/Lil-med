import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileText, Boxes, Users, ScrollText, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import Logo from "./Logo";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/quotes", label: "New quotes", icon: FileText },
  { to: "/admin/closed", label: "Closed quotes", icon: FileText },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/users", label: "Admins", icon: Users },
  { to: "/admin/logs", label: "Audit log", icon: ScrollText },
];

export default function AdminLayout() {
  const [email, setEmail] = useState<string>("");
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) nav("/admin-login");
      else setEmail(data.user.email || "");
    });
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    nav("/admin-login");
  }

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="w-64 shrink-0 border-r border-black/10 bg-white">
        <div className="border-b border-black/5 p-5">
          <Logo className="h-10" />
          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-brand-teal">
            Admin portal
          </div>
        </div>
        <nav className="p-3">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-navy text-white"
                    : "text-brand-navy hover:bg-brand-navy/10"
                }`
              }
            >
              <it.icon size={16} />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-3">
          <div className="mb-2 truncate text-xs text-gray-500">{email}</div>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
