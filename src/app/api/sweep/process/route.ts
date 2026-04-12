import { insertLog, updateSweepStatus } from "@/lib/supabase";
import { type NextRequest, NextResponse } from "next/server";
import type { LogLevel, SweepStatus } from "@/lib/database.types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulateSweepWorker(sweepId: string) {
  const log = async (level: LogLevel, message: string) => {
    await insertLog({ sweep_id: sweepId, level, message });
  };

  const setStatus = async (status: SweepStatus, extra: Record<string, string | number | null> = {}) => {
    await updateSweepStatus(sweepId, status, extra);
  };

  try {
    // 1. Cloning
    await setStatus("cloning");
    await log("info", "Starting container...");
    await sleep(2000);
    await log("info", "Cloning repository...");
    await sleep(3000);
    await log("success", "Clone complete. 421 files indexed.");

    // 2. AST Codemod
    await setStatus("ast");
    await log("info", "Running @solana/kit AST codemod (ast-grep / Codemod)...");
    await sleep(3000);
    await log("success", "AST: 32 transforms applied across 6 files");
    await setStatus("ast", { ast_fixes: 32, files_changed: 6 });

    // 3. AI Loop
    await setStatus("ai_loop");
    await log("info", "Running initial TypeScript compilation (tsc)...");
    await sleep(2000);
    await log("warn", "tsc: 2 type errors detected in src/instructions.ts");
    await sleep(1500);
    await log("ai", "Compiler-Loop: Feeding error TS2322 to Claude Sonnet...");
    await sleep(4000);
    await log("ai", "Patch applied: AccountMeta mutability mismatch resolved.");
    await setStatus("ai_loop", { ai_fixes: 1, files_changed: 7 });
    
    await log("info", "Running tests...");
    await sleep(3000);
    await log("success", "Tests: 14/14 passed");

    // 4. PR Open
    await setStatus("pr_open");
    await log("info", "Committing changes and pushing branch 'clawsearchdarkdesk/migrate-kit'...");
    await sleep(2000);
    await log("success", "Commit successful. Opening Pull Request...");
    await sleep(2000);
    
    const prUrl = "https://github.com/solana-labs/solana-pay/pull/example";
    await setStatus("complete", { 
      pr_url: prUrl, 
      completed_at: new Date().toISOString() 
    });
    await log("success", `PR opened successfully → ${prUrl}`);
    
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown worker error";
    await log("error", `Worker error: ${message}`);
    await setStatus("failed", { 
      error_message: message,
      completed_at: new Date().toISOString() 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sweepId } = await request.json();

    if (!sweepId) {
      return NextResponse.json({ error: "sweepId is required" }, { status: 400 });
    }

    // Fire and forget worker simulation
    simulateSweepWorker(sweepId);

    return NextResponse.json({ status: "processing started" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
