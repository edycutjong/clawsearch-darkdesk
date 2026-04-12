import { insertSweep, insertLog, getAllSweeps } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    // Extract repo name from URL (e.g. https://github.com/org/repo -> org/repo)
    let repoName = repoUrl;
    try {
      const url = new URL(repoUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        repoName = `${parts[0]}/${parts[1]}`;
      }
    } catch {
      // Ignore invalid URL parsing errors for the name
    }

    const { data: sweep, error } = await insertSweep({
      repo_url: repoUrl,
      repo_name: repoName,
      status: "queued",
    });

    if (error || !sweep) {
      console.error("Error inserting sweep:", error);
      return NextResponse.json({ error: "Failed to create sweep" }, { status: 500 });
    }

    // Insert initial log
    await insertLog({
      sweep_id: sweep.id,
      level: "info",
      message: `Queued migration for ${repoName}`,
    });

    // Fire-and-forget the background worker (for demo purposes)
    // In production, use an actual queue or edge function
    fetch(`${request.nextUrl.origin}/api/sweep/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sweepId: sweep.id }),
    }).catch(console.error);

    return NextResponse.json(sweep, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const { data: sweeps, error } = await getAllSweeps();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sweeps);
}
