import { supabase } from "./supabase";

export async function logAction(action: string, target?: string, details?: Record<string, unknown>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email ?? "unknown";
    await supabase.from("audit_logs").insert({
      admin_email: email,
      action,
      target: target ?? null,
      details: details ?? null,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("audit log failed", e);
  }
}
