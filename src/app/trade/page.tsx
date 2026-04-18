import { Header } from '@/components/Header';
import { Shield } from 'lucide-react';
import { AIChat } from '@/components/AIChat';
import { DarkDeskEscrow } from '@/components/DarkDeskEscrow';
import { PriceOracle } from '@/components/PriceOracle';
import { SplitScreenVerifier } from '@/components/SplitScreenVerifier';

export default function TradingDeskPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold font-mono tracking-tight">Institutional Trading Desk</h1>
          <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 border border-cyan-500/20">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">TEE Encrypted</span>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
          {/* Left Column: AI Negotiator (40%) */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
              <h2 className="font-mono text-sm font-semibold text-slate-200">AI Negotiator</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIChat />
            </div>
          </div>

          {/* Center Column: Escrow Panel (35%) */}
          <div className="lg:col-span-4 flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
              <h2 className="font-mono text-sm font-semibold text-slate-200">Confidential Escrow</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <DarkDeskEscrow />
            </div>
          </div>

          {/* Right Column: Market Data (25%) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden flex flex-col">
              <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
                <h2 className="font-mono text-sm font-semibold text-slate-200">Live RWA Pricing</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <PriceOracle />
              </div>
            </div>

            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden flex flex-col">
              <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
                <h2 className="font-mono text-sm font-semibold text-slate-200">Dark Pool Analytics</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <SplitScreenVerifier />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
