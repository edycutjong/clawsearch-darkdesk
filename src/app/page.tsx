"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-950/50 border border-cyan-900/50 px-4 py-1.5 text-sm font-medium text-cyan-400 font-mono">
            <Lock className="h-4 w-4" />
            <span>iExec Nox Powered TEE</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent transform transition-all duration-700 ease-out">
            Confidential OTC Dark Pool.
          </h1>
          
          <p className="max-w-2xl text-lg text-slate-400 mb-4 text-balance leading-relaxed">
            Trade tokenized Real World Assets securely off-market. Powered by iExec Nox TEE, Arbitrum Sepolia, and AI-brokered chain intelligence. Execute atomic swaps with zero information leakage.
          </p>

          <div className="flex gap-4 pt-4">
            <Link 
              href="/trade"
              className="group relative rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 font-mono font-medium transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] flex items-center justify-center"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Initialize Secure Terminal
              </span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24 relative z-10">
          {[
            {
              title: "AI Negotiator",
              desc: "Determine execution prices dynamically via ChainGPT oracle networks based on live real-world benchmarks.",
              badge: "ChainGPT"
            },
            {
              title: "Live Yield Oracle",
              desc: "Ingesting live T-Bill yields via Alpaca SIP to provide factual reference points for Dark Pool negotiations.",
              badge: "Alpaca API"
            },
            {
              title: "TEE Encrypted Escrow",
              desc: "Swap execution condition hashed and verified entirely within iExec Nox Intel SGX enclave.",
              badge: "Confidential VM"
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm text-left flex flex-col gap-3">
              <span className="text-xs font-mono font-semibold text-purple-400 tracking-wider uppercase">
                {feature.badge}
              </span>
              <h3 className="text-lg font-bold text-slate-200">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm font-mono text-slate-500">
        Built for DoraHacks iExec Vibe Coding Hackathon 2026.
      </footer>
    </div>
  );
}
