import { getSweepById } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { LogRow } from "@/lib/database.types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: sweep, error } = await getSweepById(id);

    if (error || !sweep) {
      return NextResponse.json({ error: "Sweep not found" }, { status: 404 });
    }

    // Sort logs by created_at
    if (sweep.clawsearchdarkdesk_logs) {
      sweep.clawsearchdarkdesk_logs.sort((a: LogRow, b: LogRow) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }

    return NextResponse.json(sweep);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
