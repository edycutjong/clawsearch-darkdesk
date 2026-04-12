import { createClient } from "@supabase/supabase-js";
import type { SweepRow, LogRow, SweepInsert, LogInsert, SweepStatus } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

/**
 * Untyped Supabase client for direct use (e.g. Realtime subscriptions).
 * For typed CRUD operations, use the helper functions below.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/** Server-side Supabase client (same key for now — RLS handles access) */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseKey);
}

/* ──────────────────────── Typed Query Helpers ──────────────────────── */

/** Fetch a single sweep by ID, joined with its logs. */
export async function getSweepById(id: string) {
  const { data, error } = await createServerClient()
    .from("clawsearchdarkdesk_sweeps")
    .select("*, clawsearchdarkdesk_logs ( * )")
    .eq("id", id)
    .single();
  return { data: data as (SweepRow & { clawsearchdarkdesk_logs: LogRow[] }) | null, error };
}

/** Fetch all sweeps, ordered by created_at desc, with logs. */
export async function getAllSweeps() {
  const { data, error } = await createServerClient()
    .from("clawsearchdarkdesk_sweeps")
    .select("*, clawsearchdarkdesk_logs ( * )")
    .order("created_at", { ascending: false });
  return { data: data as (SweepRow & { clawsearchdarkdesk_logs: LogRow[] })[] | null, error };
}

/** Insert a new sweep record. */
export async function insertSweep(row: Pick<SweepInsert, "repo_url" | "repo_name" | "status">) {
  const { data, error } = await createServerClient()
    .from("clawsearchdarkdesk_sweeps")
    .insert(row)
    .select()
    .single();
  return { data: data as SweepRow | null, error };
}

/** Insert a log entry. */
export async function insertLog(row: Pick<LogInsert, "sweep_id" | "level" | "message">) {
  return createServerClient().from("clawsearchdarkdesk_logs").insert(row);
}

/** Update a sweep's status and optional extra fields. */
export async function updateSweepStatus(
  id: string,
  status: SweepStatus,
  extra: Record<string, string | number | null> = {}
) {
  return createServerClient()
    .from("clawsearchdarkdesk_sweeps")
    .update({ status, ...extra })
    .eq("id", id);
}

/** Delete all logs for a specific sweep ID. */
export async function deleteLogsBySweepId(sweepId: string) {
  const { error } = await createServerClient()
    .from("clawsearchdarkdesk_logs")
    .delete()
    .eq("sweep_id", sweepId);

  if (error) {
    console.error(`Error deleting logs for sweep ${sweepId}:`, error);
    // Continue anyway, it's not fatal
  }
  return { error };
}
