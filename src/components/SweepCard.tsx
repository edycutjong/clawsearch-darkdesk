"use client";

import { type Sweep } from "@/lib/database.types";
import Link from "next/link";

function StatusBadge({ status }: { status: Sweep["status"] }) {
  const map: Record<
    Sweep["status"],
    { label: string; color: string; bg: string; glow?: string }
  > = {
    queued: { label: "Queued", color: "text-sol-muted", bg: "bg-sol-muted/10" },
    cloning: {
      label: "Cloning",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      glow: "shadow-blue-400/20",
    },
    ast: {
      label: "AST",
      color: "text-sol-warning",
      bg: "bg-sol-warning/10",
      glow: "shadow-sol-warning/20",
    },
    ai_loop: {
      label: "AI Loop",
      color: "text-sol-purple",
      bg: "bg-sol-purple/10",
      glow: "shadow-sol-purple/20",
    },
    testing: {
      label: "Testing",
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      glow: "shadow-cyan-400/20",
    },
    pr_open: {
      label: "PR Open",
      color: "text-sol-green",
      bg: "bg-sol-green/10",
      glow: "shadow-sol-green/20",
    },
    complete: {
      label: "Complete",
      color: "text-sol-green",
      bg: "bg-sol-green/10",
    },
    failed: { label: "Failed", color: "text-sol-error", bg: "bg-sol-error/10" },
  };
  const s = map[status];
  const isActive = ["ai_loop", "cloning", "ast", "testing"].includes(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.color} ${s.bg} ${s.glow ? `shadow-lg ${s.glow}` : ""}`}
    >
      {isActive && (
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${s.bg}`} />
          <span className={`relative inline-block h-2 w-2 rounded-full bg-current`} />
        </span>
      )}
      {s.label}
    </span>
  );
}

function ProgressBar({ status }: { status: Sweep["status"] }) {
  const progressMap: Record<Sweep["status"], number> = {
    queued: 5,
    cloning: 20,
    ast: 45,
    ai_loop: 65,
    testing: 80,
    pr_open: 90,
    complete: 100,
    failed: 0,
  };
  const progress = progressMap[status];
  const isComplete = status === "complete";
  const isFailed = status === "failed";

  return (
    <div className="h-1 w-full rounded-full bg-sol-border/50 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          isFailed
            ? "bg-sol-error"
            : isComplete
            ? "bg-linear-to-r from-sol-green to-emerald-400"
            : "bg-linear-to-r from-sol-green to-sol-purple"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function SweepCard({ sweep }: { sweep: Sweep }) {
  const isActive = ["ai_loop", "cloning", "ast", "testing"].includes(sweep.status);

  return (
    <Link href={`/dashboard/${sweep.id}`}>
      <div className={`group rounded-2xl glass p-5 card-hover shine-effect cursor-pointer relative ${
        isActive ? "border-sol-purple/20" : ""
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* GitHub icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-sol-border/80 to-sol-border/30 group-hover:from-sol-green/20 group-hover:to-sol-purple/20 transition-all duration-300">
              <svg
                className="h-5 w-5 text-foreground/70 group-hover:text-sol-green transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold group-hover:text-sol-green transition-colors">
                {sweep.repoName}
              </h3>
              <p className="text-[11px] text-sol-muted mt-0.5 truncate max-w-[200px] font-mono">
                {sweep.repoUrl.replace("https://github.com/", "")}
              </p>
            </div>
          </div>
          <StatusBadge status={sweep.status} />
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar status={sweep.status} />
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs text-sol-muted">
          <div className="flex items-center gap-1.5">
            <span className="text-sol-warning font-medium">{sweep.astFixes}</span>
            <span>AST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sol-purple font-medium">{sweep.aiFixes}</span>
            <span>AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-foreground/80 font-medium">{sweep.filesChanged}</span>
            <span>files</span>
          </div>
          {sweep.status === "complete" && (
            <div className="ml-auto flex items-center gap-1 text-sol-green font-medium">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </div>
          )}
        </div>

        {/* PR link */}
        {sweep.prUrl && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-sol-green/80 font-mono">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            PR opened
          </div>
        )}
      </div>
    </Link>
  );
}
