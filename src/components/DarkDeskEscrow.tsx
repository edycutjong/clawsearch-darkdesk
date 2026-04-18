'use client';

import { useState, useEffect } from 'react';
import { Lock, FileText, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

const PIPELINE_STEPS = [
  { label: 'Contract Deployed via iExec', key: 'created' as const },
  { label: 'Counterparties Funded', key: 'funded' as const },
  { label: 'Atomic Swap Executed', key: 'executed' as const },
];

type EscrowStatus = 'idle' | 'created' | 'funded' | 'executed';
const STATUS_ORDER: EscrowStatus[] = ['idle', 'created', 'funded', 'executed'];

export function DarkDeskEscrow() {
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatus>('idle');
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateFlow = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setEscrowStatus('created');
    
    setTimeout(() => setEscrowStatus('funded'), 2000);
    setTimeout(() => setEscrowStatus('executed'), 4000);
    setTimeout(() => setIsSimulating(false), 4500);
  };

  // Auto-reset after showing executed for a while
  useEffect(() => {
    if (escrowStatus === 'executed') {
      const timeout = setTimeout(() => {
        setEscrowStatus('idle');
      }, 8000);
      return () => clearTimeout(timeout);
    }
  }, [escrowStatus]);

  const currentIndex = STATUS_ORDER.indexOf(escrowStatus);

  return (
    <div className="flex flex-col h-full bg-slate-950/20 p-5 space-y-6 overflow-y-auto">
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-mono font-medium text-slate-200">Execution Block</h3>
          <p className="text-sm font-mono text-slate-500 mt-1">iExec Nox TEE Encrypted Environment</p>
        </div>
        <div className={`p-2.5 rounded-lg transition-all duration-500 ${
          escrowStatus === 'executed'
            ? 'bg-emerald-500/20 border border-emerald-500/40 glow-green-intense'
            : 'bg-emerald-500/10 border border-emerald-500/20'
        }`}>
          {escrowStatus === 'executed' ? (
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          ) : (
            <Lock className="h-5 w-5 text-emerald-400" />
          )}
        </div>
      </div>

      {escrowStatus === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
          <div className="relative">
            <FileText className="h-14 w-14 text-slate-700 animate-float" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 animate-pulse glow-dot" />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-sm text-slate-400">Awaiting AI Negotiation</p>
            <p className="text-xs text-slate-500 max-w-[220px]">The escrow link will deploy once an agreement is reached.</p>
          </div>
          
          <button
            onClick={simulateFlow}
            className="cta-magnetic mt-4 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white px-5 py-2.5 font-mono text-xs font-medium transition-all flex items-center gap-2"
          >
            <Lock className="h-3.5 w-3.5" />
            Simulate Escrow Flow
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in-scale">
          {/* Trade Summary */}
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-4 space-y-3 font-mono text-sm shine-effect">
            {[
              { label: 'Asset', value: 'cUSDC / cT-BILL', color: 'text-slate-200' },
              { label: 'Volume', value: '100,000.00', color: 'text-slate-200' },
              { label: 'Yield Oracle', value: '4.12% (Alpaca)', color: 'text-cyan-400' },
            ].map((row, i) => (
              <div
                key={i}
                className={`flex justify-between ${i < 2 ? 'border-b border-slate-800/50 pb-3' : 'pb-1'}`}
              >
                <span className="text-slate-500">{row.label}</span>
                <span className={row.color}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-2">
            {PIPELINE_STEPS.map((step, i) => {
              const stepIndex = i + 1; // 1=created, 2=funded, 3=executed
              const isComplete = currentIndex >= stepIndex;
              const isActive = currentIndex === stepIndex;
              const isPending = currentIndex < stepIndex;

              return (
                <div key={step.key} className="flex flex-col gap-1.5">
                  <div
                    className={`p-3.5 rounded-lg flex items-center gap-3 transition-all duration-500 ${
                      isComplete
                        ? step.key === 'executed'
                          ? 'bg-emerald-950/40 border border-emerald-500/30 glow-green'
                          : 'bg-slate-800/80 border border-slate-700/50'
                        : isActive
                          ? 'bg-slate-800/60 border border-cyan-500/30'
                          : 'bg-slate-900/30 border border-slate-800/30'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${step.key === 'executed' ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 shrink-0 text-cyan-400 animate-spin" />
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-700" />
                    )}
                    <span className={`font-mono text-sm ${
                      isComplete ? 'text-slate-200' : isPending ? 'text-slate-600' : 'text-cyan-300'
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto animate-ring-pulse rounded-full w-2 h-2 bg-cyan-400" />
                    )}
                  </div>
                  {/* Connector */}
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="ml-[22px] w-0.5 h-3 rounded-full transition-colors duration-500"
                      style={{ background: isComplete ? 'var(--sol-green)' : 'rgba(30,41,59,0.5)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
