'use client';

import { useState } from 'react';
import { Lock, FileText, CheckCircle2 } from 'lucide-react';

export function DarkDeskEscrow() {
  const [escrowStatus, setEscrowStatus] = useState<'idle' | 'created' | 'funded' | 'executed'>('idle');

  return (
    <div className="flex flex-col h-full bg-slate-950/20 p-6 space-y-8 overflow-y-auto">
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-mono font-medium text-slate-200">Execution Block</h3>
          <p className="text-sm font-mono text-slate-500 mt-1">iExec Nox TEE Encrypted Environment</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Lock className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      {escrowStatus === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 space-y-4">
          <FileText className="h-12 w-12 text-slate-600" />
          <div className="space-y-1">
            <p className="font-mono text-sm text-slate-400">Awaiting AI Negotiation</p>
            <p className="text-xs text-slate-500">The escrow link will deploy once an agreement is reached.</p>
          </div>
          
          {/* Mock hook for development visual */}
          <button 
            disabled
            onClick={() => setEscrowStatus('created')}
            className="mt-4 opacity-0"
          >
            Trigger
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-4 space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-500">Asset</span>
              <span className="text-slate-200">cUSDC / cT-BILL</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-500">Volume</span>
              <span className="text-slate-200">100,000.00</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-500">Yield Oracle</span>
              <span className="text-cyan-400">4.12% (Alpaca)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className={`p-4 rounded-lg flex items-center gap-3 transition-colors ${escrowStatus !== 'idle' ? 'bg-slate-800 text-slate-200' : 'bg-slate-900/50 text-slate-600'}`}>
              <CheckCircle2 className={`h-5 w-5 ${escrowStatus !== 'idle' ? 'text-emerald-400' : 'text-slate-700'}`} />
              <span className="font-mono text-sm">Contract Deployed via iExec</span>
            </div>
            <div className={`p-4 rounded-lg flex items-center gap-3 transition-colors ${(escrowStatus === 'funded' || escrowStatus === 'executed') ? 'bg-slate-800 text-slate-200' : 'bg-slate-900/50 text-slate-600'}`}>
              <CheckCircle2 className={`h-5 w-5 ${(escrowStatus === 'funded' || escrowStatus === 'executed') ? 'text-emerald-400' : 'text-slate-700'}`} />
              <span className="font-mono text-sm">Counterparties Funded</span>
            </div>
            <div className={`p-4 rounded-lg flex items-center gap-3 transition-colors ${escrowStatus === 'executed' ? 'bg-emerald-950/30 border border-emerald-900/50 text-emerald-400' : 'bg-slate-900/50 text-slate-600'}`}>
              <Lock className="h-5 w-5" />
              <span className="font-mono text-sm font-medium">Atomic Swap Executed</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
