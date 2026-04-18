"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { Shield, Lock, Cpu, BarChart3, Layers, ArrowRight, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    /* istanbul ignore next */
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const volume = useCountUp(847, 2200, 800);
  const trades = useCountUp(312, 2000, 1000);
  const latency = useCountUp(12, 1500, 1200);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-200">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* ═══ Background Layers ═══ */}
        <div className="hero-mesh" />
        <div className="animated-grid" />

        {/* Floating Orbs */}
        <div className="orb orb-green" style={{ width: 600, height: 600, top: "10%", left: "5%" }} />
        <div className="orb orb-purple" style={{ width: 500, height: 500, bottom: "5%", right: "5%" }} />
        <div className="orb orb-green" style={{ width: 300, height: 300, top: "60%", left: "60%", animationDelay: "-6s" }} />

        {/* Rising Particles */}
        <div className="particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="particle" />
          ))}
        </div>

        {/* Code Rain */}
        <div className="code-rain">
          {["0xDEAD", "SWAP()", "TEE::OK", "VERIFY", "0xBEEF", "ESCROW", "ATOMIC", "0xCAFE", "SEALED", "NOX_VM"].map((text, i) => (
            <span
              key={i}
              style={{
                left: `${5 + i * 10}%`,
                animationDuration: `${8 + (i % 5) * 3}s`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              {text}
            </span>
          ))}
        </div>

        {/* ═══ Hero Content ═══ */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-8 text-center max-w-5xl mx-auto">

          {/* Animated Badge */}
          <div
            className="animated-badge-border inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-medium text-cyan-400 font-mono badge-glow animate-slide-up mb-8"
            style={{ animationDelay: "200ms" }}
          >
            <Lock className="h-4 w-4" />
            <span>iExec Nox Powered TEE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 glow-dot animate-pulse" />
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold font-mono tracking-tight gradient-text-shimmer animate-headline leading-[1.1]">
            Confidential OTC
            <br />
            Dark Pool.
          </h1>
          
          <p
            className="max-w-2xl text-lg md:text-xl text-slate-400 mt-8 text-balance leading-relaxed animate-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            Trade tokenized Real World Assets securely off-market. Powered by{" "}
            <span className="text-cyan-400 font-medium">iExec Nox TEE</span>,{" "}
            <span className="text-purple-400 font-medium">Arbitrum Sepolia</span>, and{" "}
            <span className="text-cyan-400 font-medium">AI-brokered</span> chain intelligence.
          </p>

          {/* CTA Row */}
          <div
            className="flex flex-col sm:flex-row gap-4 pt-10 animate-slide-up"
            style={{ animationDelay: "600ms" }}
          >
            <Link
              href="/trade"
              className="cta-magnetic group relative rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 text-white px-8 py-4 font-mono font-semibold flex items-center justify-center gap-3"
            >
              <Shield className="h-5 w-5" />
              Initialize Secure Terminal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://github.com/edycutjong/clawsearchdarkdesk"
              target="_blank"
              rel="noopener noreferrer"
              className="github-cta rounded-xl px-8 py-4 font-mono font-medium"
            >
              <Layers className="h-4 w-4" />
              View Source
            </a>
          </div>

          {/* Live Stats Ticker */}
          <div
            className="grid grid-cols-3 gap-8 mt-16 animate-slide-up"
            style={{ animationDelay: "800ms" }}
          >
            {[
              { label: "Volume (cUSDC)", value: `$${volume.toLocaleString()}K`, icon: BarChart3 },
              { label: "OTC Trades", value: trades.toString(), icon: Zap },
              { label: "Avg Latency", value: `${latency}ms`, icon: Cpu },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <stat.icon className="h-4 w-4 text-slate-600 mb-1" />
                <span className="font-mono text-2xl md:text-3xl font-bold gradient-text animate-count-up">
                  {stat.value}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Feature Grid ═══ */}
        <div
          className="section-divider w-full max-w-6xl mx-auto px-6 pt-20 pb-24 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                title: "AI Negotiator",
                desc: "Determine execution prices dynamically via ChainGPT oracle networks based on live real-world benchmarks.",
                badge: "ChainGPT",
                icon: Cpu,
                color: "purple",
              },
              {
                title: "Live Yield Oracle",
                desc: "Ingesting live T-Bill yields via Alpaca SIP to provide factual reference points for Dark Pool negotiations.",
                badge: "Alpaca API",
                icon: BarChart3,
                color: "cyan",
              },
              {
                title: "TEE Encrypted Escrow",
                desc: "Swap execution condition hashed and verified entirely within iExec Nox Intel SGX enclave.",
                badge: "Confidential VM",
                icon: Lock,
                color: "emerald",
              },
            ].map((feature, i) => (
              <div key={i} className="card-3d animate-slide-up" style={{ animationDelay: `${900 + i * 120}ms` }}>
                <SpotlightCard className="card-3d-inner card-hover glass rounded-2xl p-6 text-left flex flex-col gap-4 shine-effect h-full">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-semibold tracking-wider uppercase ${
                      feature.color === "purple" ? "text-purple-400" :
                      feature.color === "cyan" ? "text-cyan-400" : "text-emerald-400"
                    }`}>
                      {feature.badge}
                    </span>
                    <div className={`p-2 rounded-lg ${
                      feature.color === "purple" ? "bg-purple-500/10 border border-purple-500/20" :
                      feature.color === "cyan" ? "bg-cyan-500/10 border border-cyan-500/20" :
                      "bg-emerald-500/10 border border-emerald-500/20"
                    }`}>
                      <feature.icon className={`h-4 w-4 ${
                        feature.color === "purple" ? "text-purple-400" :
                        feature.color === "cyan" ? "text-cyan-400" : "text-emerald-400"
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="section-divider border-t border-slate-800/50 py-8 text-center relative z-10">
        <p className="text-sm font-mono text-slate-500">
          Built for{" "}
          <span className="text-cyan-500">DoraHacks</span>{" "}
          iExec Vibe Coding Hackathon 2026.
        </p>
      </footer>
    </div>
  );
}
