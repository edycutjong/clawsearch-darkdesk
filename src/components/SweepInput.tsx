"use client";

import { useState } from "react";

export default function SweepInput({
  onSubmit,
}: {
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div
        className={`flex items-center gap-3 rounded-2xl glass px-5 py-3.5 transition-all duration-300 ${
          isFocused
            ? "shadow-xl shadow-sol-green/15 border-sol-green/40"
            : ""
        }`}
      >
        {/* Git icon */}
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          isFocused ? "bg-sol-green/10" : "bg-sol-border/30"
        }`}>
          <svg
            className={`h-4 w-4 shrink-0 transition-colors ${isFocused ? "text-sol-green" : "text-sol-muted"}`}
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
        </div>
        <input
          id="sweep-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="https://github.com/org/repo"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-sol-muted/50 outline-none font-mono"
        />
        <button
          id="start-sweep-btn"
          type="submit"
          className="shrink-0 rounded-xl bg-linear-to-r from-sol-green to-sol-purple px-6 py-2.5 text-sm font-bold text-sol-dark transition-all hover:opacity-90 hover:shadow-xl hover:shadow-sol-green/25 active:scale-95"
        >
          Start Sweep →
        </button>
      </div>
    </form>
  );
}
