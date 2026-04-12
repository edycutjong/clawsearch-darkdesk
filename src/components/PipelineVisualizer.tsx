"use client";

import { type SweepStatus } from "@/lib/database.types";

const PIPELINE_STEPS: { key: SweepStatus; label: string; icon: string }[] = [
  { key: "cloning", label: "Cloning", icon: "📥" },
  { key: "ast", label: "AST Transforms", icon: "⚙️" },
  { key: "ai_loop", label: "Compiler-in-the-Loop", icon: "🧠" },
  { key: "testing", label: "Testing", icon: "🧪" },
  { key: "pr_open", label: "Publishing PR", icon: "🚀" },
];

const STATUS_ORDER: SweepStatus[] = [
  "queued",
  "cloning",
  "ast",
  "ai_loop",
  "testing",
  "pr_open",
  "complete",
  "failed",
];

const VALID_STATUSES = new Set<string>([...STATUS_ORDER, "complete", "failed", "queued"]);

function getStepState(
  stepKey: SweepStatus,
  currentStatus: SweepStatus
): "done" | "active" | "pending" {
  if (currentStatus === "complete") return "done";
  if (currentStatus === "failed") {
    const ci = STATUS_ORDER.indexOf(currentStatus);
    const si = STATUS_ORDER.indexOf(stepKey);
    /* istanbul ignore next -- fallback if STATUS_ORDER changes */
    return si < ci ? "done" : si === ci ? "active" : "pending";
  }
  const ci = STATUS_ORDER.indexOf(currentStatus);
  const si = STATUS_ORDER.indexOf(stepKey);
  if (si < ci) return "done";
  if (si === ci) return "active";
  return "pending";
}

export default function PipelineVisualizer({
  status,
}: {
  status: SweepStatus;
}) {
  if (!status || !VALID_STATUSES.has(status)) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
      {PIPELINE_STEPS.map((step, i) => {
        const state = getStepState(step.key, status);
        return (
          <div key={step.key} className="flex items-center shrink-0">
            {/* Step node */}
            <div
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-500 ${
                status === "failed"
                  ? "glass text-sol-red shadow-lg shadow-sol-red/10 border border-sol-red/20"
                  : state === "done"
                  ? "glass text-sol-green shadow-lg shadow-sol-green/10"
                  : state === "active"
                  ? "glass text-sol-purple shadow-lg shadow-sol-purple/20 animate-ring-pulse"
                  : "bg-sol-dark/50 text-sol-muted/50 border border-sol-border/30"
              }`}
            >
              <span className={`text-base ${state === "active" ? "animate-float" : ""}`}>
                {step.icon}
              </span>
              <span className="inline">{step.label}</span>
              {state === "done" && (
                <svg
                  className="h-4 w-4 text-sol-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {state === "active" && (
                <span className="relative flex h-2.5 w-2.5 ml-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-purple opacity-75" />
                  <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-sol-purple" />
                </span>
              )}
            </div>
            {/* Connector */}
            {i < PIPELINE_STEPS.length - 1 && (
               <div
                  className={`mx-1 w-6 sm:w-8 transition-all duration-500 ${
                    state === "done"
                      ? "animate-data-flow h-[3px]"
                      : "bg-sol-border/30 h-0.5"
                  }`}
               />
            )}
          </div>
        );
      })}
    </div>
  );
}
