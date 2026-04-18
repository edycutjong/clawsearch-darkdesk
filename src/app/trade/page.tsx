'use client';

import { Header } from '@/components/Header';
import { Shield, Radio } from 'lucide-react';
import { AIChat } from '@/components/AIChat';
import { DarkDeskEscrow } from '@/components/DarkDeskEscrow';
import { PriceOracle } from '@/components/PriceOracle';
import { SplitScreenVerifier } from '@/components/SplitScreenVerifier';

function PanelHeader({ title, accent = 'cyan' }: { title: string; accent?: string }) {
  const dotColor = accent === 'purple' ? 'bg-purple-500' : accent === 'emerald' ? 'bg-emerald-500' : 'bg-cyan-500';
  return (
    <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className={`w-2 h-2 rounded-full ${dotColor} glow-dot animate-pulse`} />
        <h2 className="font-mono text-sm font-semibold text-slate-200">{title}</h2>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 hover:bg-red-500 transition-colors cursor-pointer" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 hover:bg-yellow-500 transition-colors cursor-pointer" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 hover:bg-green-500 transition-colors cursor-pointer" />
      </div>
    </div>
  );
}

export default function TradingDeskPage() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />

      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="animated-grid" style={{ opacity: 0.4 }} />
        <div className="orb orb-purple" style={{ width: 400, height: 400, top: '20%', right: '10%' }} />
        <div className="orb orb-green" style={{ width: 300, height: 300, bottom: '10%', left: '5%' }} />
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-6 relative z-10">
        {/* Title Bar */}
        <div className="mb-6 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono tracking-tight gradient-text">Institutional Trading Desk</h1>
            <div className="animated-badge-border flex items-center gap-1.5 rounded-full px-3 py-1">
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest font-mono">TEE Encrypted</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400">CONNECTED</span>
            <span className="text-slate-700">|</span>
            <span>Arbitrum Sepolia</span>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-10rem)]">
          {/* Left Column: AI Negotiator (40%) */}
          <div
            className="lg:col-span-5 flex flex-col rounded-xl glass-strong shadow-2xl overflow-hidden shimmer-border animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <PanelHeader title="AI Negotiator" accent="purple" />
            <div className="flex-1 overflow-hidden relative scanlines terminal-glow">
              <AIChat />
            </div>
          </div>

          {/* Center Column: Escrow Panel (35%) */}
          <div
            className="lg:col-span-4 flex flex-col rounded-xl glass shadow-2xl overflow-hidden gradient-border animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <PanelHeader title="Confidential Escrow" accent="emerald" />
            <div className="flex-1 overflow-hidden">
              <DarkDeskEscrow />
            </div>
          </div>

          {/* Right Column: Market Data (25%) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div
              className="flex-1 rounded-xl glass shadow-2xl overflow-hidden flex flex-col animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <PanelHeader title="Live RWA Pricing" accent="cyan" />
              <div className="flex-1 overflow-hidden">
                <PriceOracle />
              </div>
            </div>

            <div
              className="flex-1 rounded-xl glass shadow-2xl overflow-hidden flex flex-col animate-slide-up"
              style={{ animationDelay: '400ms' }}
            >
              <PanelHeader title="Dark Pool Analytics" accent="emerald" />
              <div className="flex-1 overflow-hidden relative scanlines">
                <SplitScreenVerifier />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
