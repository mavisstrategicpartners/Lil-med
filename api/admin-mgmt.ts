import { createClient } from "@supabase/supabase-js";

export const config = { runtime: "nodejs" };

type Body = {
  email?: string;
  name?: string;
  role?: "admin" | "lead_admin";
  password?: string;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders("POST, OPTIONS"),
    });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return json({ error: "Admin creation is not configured yet." }, 503);
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ error: "Please sign in as a lead admin first." }, 401);

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } = await admin.auth.getUser(token);
  const callerEmail = authData.user?.email?.toLowerCase();
  if (authError || !callerEmail) return json({ error: "Your admin session has expired." }, 401);

  const { data: caller } = await admin
    .from("admins")
    .select("role,email")
    .eq("email", callerEmail)
    .maybeSingle();
  if (caller?.role !== "lead_admin") {
    return json({ error: "Only a lead admin can add new admins." }, 403);
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  const name = (body.name || "").trim();
  const role = body.role === "lead_admin" ? "lead_admin" : "admin";
  const password = body.password || "";

  if (!isEmail(email)) return json({ error: "Enter a valid email address." }, 400);
  if (password.length < 12) return json({ error: "Generate a password with at least 12 characters." }, 400);

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (created.error) {
    const message = created.error.message.toLowerCase().includes("already")
      ? "That email already has an account. Add them to the admins table manually or use a different email."
      : created.error.message;
    return json({ error: message }, 400);
  }

  const { data: adminRow, error: rowError } = await admin
    .from("admins")
    .upsert({ email, name, role }, { onConflict: "email" })
    .select("id,email,name,role,created_at")
    .single();
  if (rowError) return json({ error: rowError.message }, 500);

  await admin.from("audit_logs").insert({
    admin_email: callerEmail,
    action: "admin.create",
    target: email,
    details: { role },
  });

  return json({ ok: true, admin: adminRow });
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function corsHeaders(methods: string) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders("POST, OPTIONS") },
  });
}