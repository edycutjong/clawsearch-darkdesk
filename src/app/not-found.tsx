import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center relative overflow-hidden font-mono">
        {/* Background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="text-[120px] font-bold leading-none tracking-tighter text-cyan-500/20 mb-4 select-none">
            404
          </div>
          <h2 className="text-2xl font-bold mb-3 text-cyan-400">&gt; [MARKET_NOT_FOUND]</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-8">
            The requested RWA market is currently hidden in the dark pool, has settled confidentially, or never existed. Access Denied.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-slate-900/50 border border-slate-800 px-8 py-3 font-semibold text-slate-300 transition-all hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            RETRN TO TRADING DESK
          </Link>
        </div>
      </main>
    </>
  );
}
