import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background effects */}
        <div className="orb orb-purple h-[300px] w-[300px] top-[10%] opacity-30" />
        
        <div className="relative z-10">
          <div className="text-[120px] font-bold leading-none tracking-tighter gradient-text opacity-50 mb-4 select-none">
            404
          </div>
          <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
          <p className="text-sol-muted max-w-sm mx-auto mb-8">
            The migration you are looking for has either been pruned or never existed. 
            Lost in the blockchain.
          </p>
          <Link
            href="/"
            className="rounded-xl glass px-8 py-3 font-semibold text-foreground transition-all hover:bg-sol-green hover:text-background glow-green inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Base
          </Link>
        </div>
      </main>
    </>
  );
}
