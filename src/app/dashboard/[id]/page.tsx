"use client";

import { useEffect, useState, use } from "react";
import Header from "@/components/Header";
import PipelineVisualizer from "@/components/PipelineVisualizer";
import LogTerminal from "@/components/LogTerminal";
import Link from "next/link";
import type { Sweep, LogEntry } from "@/lib/database.types";

interface RawLogRow {
  created_at: string;
  level: LogEntry["level"];
  message: string;
}

export default function SweepDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [sweep, setSweep] = useState<Sweep | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/sweep/${id}`);
        if (!res.ok) {
          if (res.status === 404) setSweep(null);
          return;
        }
        const data = await res.json();
        
        const normalized: Sweep = {
          id: data.id,
          repoUrl: data.repo_url,
          repoName: data.repo_name,
          status: data.status,
          prUrl: data.pr_url,
          filesChanged: data.files_changed,
          astFixes: data.ast_fixes,
          aiFixes: data.ai_fixes,
          startedAt: data.started_at,
          completedAt: data.completed_at,
          logs: (data.clawsearchdarkdesk_logs as RawLogRow[]).map((l) => ({
            timestamp: l.created_at,
            level: l.level,
            message: l.message,
          })),
        };
        setSweep(normalized);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [id]);

  if (!loading && !sweep) {
    return (
      <>
        <Header />
        <main className="flex-1 px-6 py-8 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-4">Sweep Not Found</h1>
          <Link href="/dashboard" className="text-sol-green hover:underline">Return to Dashboard</Link>
        </main>
      </>
    );
  }

  if (loading || !sweep) {
    return (
      <>
        <Header />
        <main className="flex-1 px-6 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <span className="relative flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
              <span className="relative inline-block h-5 w-5 rounded-full bg-sol-green" />
            </span>
            <div className="text-sol-muted font-mono animate-pulse">Loading Sweep Data...</div>
          </div>
        </main>
      </>
    );
  }

  const isActive = ["ai_loop", "cloning", "ast", "testing"].includes(sweep.status);
  const duration = sweep.completedAt
    ? Math.round(
        (new Date(sweep.completedAt).getTime() -
          new Date(sweep.startedAt).getTime()) /
          60000
      )
    : null;

  return (
    <>
      <Header />
      <main className="flex-1 px-6 py-8 relative overflow-hidden">
        {/* Background effects */}
        <div className="hero-mesh" />
        <div className="animated-grid" style={{ opacity: 0.3 }} />
        <div className="orb orb-green h-[300px] w-[300px] top-[10%] right-[15%] opacity-40" />
        <div className="orb orb-purple h-[250px] w-[250px] bottom-[15%] left-[10%] opacity-30" />

        {/* Particles */}
        <div className="particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-sol-muted animate-slide-up">
            <Link href="/dashboard" className="hover:text-sol-green transition-colors">
              Dashboard
            </Link>
            <svg className="h-3 w-3 text-sol-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground font-medium">{sweep.repoName}</span>
          </div>

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{sweep.repoName}</h1>
                {isActive && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sol-purple/10 border border-sol-purple/20 px-3 py-1 text-xs font-semibold text-sol-purple shadow-lg shadow-sol-purple/10 animated-badge-border">
                    <span className="relative flex h-2 w-2 glow-dot text-sol-purple">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-purple opacity-75" />
                      <span className="relative inline-block h-2 w-2 rounded-full bg-sol-purple" />
                    </span>
                    Processing
                  </span>
                )}
              </div>
              <a
                href={sweep.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sol-muted hover:text-sol-green transition-colors font-mono"
              >
                {sweep.repoUrl} ↗
              </a>
            </div>

            {sweep.prUrl && (
              <a
                href={sweep.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl glass px-5 py-2.5 text-sm font-semibold text-sol-green transition-all hover:shadow-lg hover:shadow-sol-green/20 glow-green-intense cta-magnetic"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Pull Request
              </a>
            )}
          </div>

          {/* Pipeline */}
          <div className="mb-8 rounded-2xl glass p-6 animate-slide-up shimmer-border" style={{ animationDelay: "200ms" }}>
            <h2 className="mb-4 text-xs font-bold text-sol-muted uppercase tracking-widest">
              Pipeline Status
            </h2>
            <PipelineVisualizer status={sweep.status} />
          </div>

          {/* Metrics */}
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children animate-slide-up" style={{ animationDelay: "300ms" }}>
            {[
              { value: sweep.astFixes, label: "AST Transforms", color: "text-sol-warning", icon: "⚙️", ringColor: "#f59e0b" },
              { value: sweep.aiFixes, label: "AI Loop Fixes", color: "text-sol-purple", icon: "🧠", ringColor: "#9945FF" },
              { value: sweep.filesChanged, label: "Files Changed", color: "text-foreground", icon: "📁", ringColor: "#e2e8f0" },
              { value: duration !== null && duration > 0 ? duration : null, label: "Duration", color: "text-sol-green", icon: "⏱️", ringColor: "#14F195", suffix: duration !== null && duration > 0 ? "m" : sweep.completedAt ? "< 1m" : "—" },
            ].map(({ value, label, color, icon, ringColor, suffix }) => (
              <div key={label} className="rounded-xl glass p-5 text-center card-hover shine-effect group">
                <div className="relative inline-flex items-center justify-center mx-auto mb-2">
                  <svg className="absolute h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(30, 41, 59, 0.3)" strokeWidth="2" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke={ringColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="stat-ring"
                      style={{ "--ring-offset": value ? `${283 - (283 * Math.min((value as number) / 200, 1))}` : "283" } as React.CSSProperties}
                      opacity="0.4"
                    />
                  </svg>
                  <div className="text-xl mb-0.5">{icon}</div>
                </div>
                <div className={`text-3xl font-bold tabular-nums ${color} transition-all group-hover:scale-110`}>
                  {value !== null ? value : ""}{suffix && typeof suffix === "string" ? suffix : ""}
                </div>
                <div className="mt-1 text-xs text-sol-muted font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Terminal */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <LogTerminal logs={sweep.logs} />
          </div>

          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-sol-muted hover:text-sol-green transition-colors group animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}
