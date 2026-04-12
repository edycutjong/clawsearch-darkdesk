"use client";

import { type LogEntry } from "@/lib/database.types";
import { useEffect, useRef } from "react";

const LEVEL_COLORS: Record<LogEntry["level"], string> = {
  info: "text-sol-muted",
  success: "text-sol-green",
  error: "text-sol-error",
  warn: "text-sol-warning",
  ai: "text-sol-purple",
};

const LEVEL_LABELS: Record<LogEntry["level"], string> = {
  info: "INFO",
  success: " OK ",
  error: " ERR",
  warn: "WARN",
  ai: "  AI",
};

const LEVEL_ICONS: Record<LogEntry["level"], string> = {
  info: "○",
  success: "✓",
  error: "✗",
  warn: "▲",
  ai: "◆",
};

const CODE_RAIN_WORDS = [
  "connection.send",
  "Keypair.gen()",
  "PublicKey",
  "blockhash",
  "lamports",
  "signTx()",
  "confirm()",
  "getSlot()",
  "airdrop()",
  "decode()",
];

export default function LogTerminal({ logs }: { logs: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="flex flex-col rounded-2xl glass overflow-hidden relative scanlines terminal-glow shimmer-border">
      {/* Code rain background */}
      <div className="code-rain">
        {CODE_RAIN_WORDS.map((word, i) => (
          <span
            key={i}
            style={{
              left: `${5 + i * 10}%`,
              animationDuration: `${10 + i * 2}s`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-sol-border/50 px-4 py-3 bg-sol-dark/50 relative z-10">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-sol-error/80 hover:bg-sol-error transition-all hover:scale-110 cursor-pointer" />
          <div className="h-3 w-3 rounded-full bg-sol-warning/80 hover:bg-sol-warning transition-all hover:scale-110 cursor-pointer" />
          <div className="h-3 w-3 rounded-full bg-sol-success/80 hover:bg-sol-success transition-all hover:scale-110 cursor-pointer" />
        </div>
        <div className="ml-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2 glow-dot text-sol-green">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sol-green opacity-75" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-sol-green" />
          </span>
          <span className="text-xs font-mono font-bold text-sol-green/80 tracking-wider uppercase">
            Live Compiler Logs
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-[10px] text-sol-muted/40 font-mono">
            {logs.length} entries
          </div>
          {/* Mini activity indicator */}
          <div className="flex gap-0.5 items-end h-3">
            {[3, 5, 2, 6, 4].map((h, i) => (
              <div
                key={i}
                className="w-[2px] bg-sol-green/30 rounded-full animate-pulse-glow"
                style={{
                  height: `${h * 2}px`,
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Log body */}
      <div className="max-h-80 overflow-y-auto p-4 bg-linear-to-b from-transparent to-sol-dark/30 relative z-10">
        {logs.map((log, i) => (
          <div
            key={i}
            className="terminal-line flex gap-3 py-0.5 hover:bg-white/2 rounded px-1 -mx-1 transition-colors group"
          >
            <span className="shrink-0 text-sol-muted/40 font-mono tabular-nums group-hover:text-sol-muted/60 transition-colors">
              {new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour12: false,
              })}
            </span>
            <span className={`shrink-0 font-bold ${LEVEL_COLORS[log.level]} transition-all group-hover:scale-110`}>
              {LEVEL_ICONS[log.level]}
            </span>
            <span
              className={`shrink-0 font-bold font-mono text-[11px] ${LEVEL_COLORS[log.level]}`}
            >
              [{LEVEL_LABELS[log.level]}]
            </span>
            <span
              className={
                log.level === "success"
                  ? "text-sol-green"
                  : log.level === "error"
                  ? "text-sol-error"
                  : log.level === "ai"
                  ? "text-sol-purple"
                  : "text-foreground/70"
              }
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
        {/* Blinking cursor */}
        <div className="terminal-line mt-2 flex items-center gap-1.5 text-sol-green">
          <span className="text-sol-green/60">❯</span>
          <span className="inline-block h-4 w-2 bg-sol-green/70 animate-blink rounded-sm" />
        </div>
      </div>
    </div>
  );
}
