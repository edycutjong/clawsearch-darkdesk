"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="rounded-2xl glass border-sol-error/20 p-8 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-sol-error/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-sol-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-sm text-sol-muted mb-6">
          The ClawSearchDarkDesk engine encountered an unexpected error.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-sol-green px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-sol-green-light glow-green"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
