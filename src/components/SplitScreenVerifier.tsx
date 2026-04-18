'use client';

import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const PUBLIC_LINES = [
  { label: 'Tx', value: '0xabc...123' },
  { label: 'From', value: '0xDark...Pool' },
  { label: 'To', value: '0xDark...Pool' },
  { label: 'Data', value: '0xEncryptedPayload...' },
  { label: 'Details', value: '[OBFUSCATED C-TOKEN]' },
];

const PRIVATE_LINES = [
  { label: 'Tx', value: '0xabc...123' },
  { label: 'Swap', value: '100,000 cUSDC' },
  { label: 'For', value: '~100k cT-BILL' },
  { label: 'Condition', value: 'Yield >= 4.12%' },
  { label: 'Status', value: 'Atomic Execution ✓' },
];

export function SplitScreenVerifier() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealed((prev) => (prev >= PRIVATE_LINES.length ? 0 : prev + 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950/40 p-3 space-y-3">
      <div className="grid grid-cols-2 gap-3 flex-1">
        
        {/* Public View (Arbiscan) */}
        <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-3 space-y-2.5 flex flex-col card-hover">
          <div className="flex items-center gap-2 border-b border-red-900/30 pb-2">
            <Eye className="h-3.5 w-3.5 text-red-500" />
            <h4 className="text-[10px] font-mono font-medium text-red-400 uppercase tracking-wider">Public Arbiscan</h4>
          </div>
          <div className="flex-1 space-y-1.5 font-mono text-[10px] text-slate-500 break-all overflow-hidden flex flex-col justify-center opacity-70">
            {PUBLIC_LINES.map((line, i) => (
              <p key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-slate-600">{line.label}:</span> {line.value}
              </p>
            ))}
          </div>
        </div>

        {/* Private View (Confidential) */}
        <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3 space-y-2.5 flex flex-col card-hover">
          <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2">
            <EyeOff className="h-3.5 w-3.5 text-emerald-500" />
            <h4 className="text-[10px] font-mono font-medium text-emerald-400 uppercase tracking-wider">iExec TEE</h4>
          </div>
          <div className="flex-1 space-y-1.5 font-mono text-[10px] break-all overflow-hidden flex flex-col justify-center">
            {PRIVATE_LINES.map((line, i) => (
              <p
                key={i}
                className={`transition-all duration-500 ${
                  i < revealed ? 'text-emerald-400 opacity-100 translate-x-0' : 'text-emerald-900 opacity-30 -translate-x-1'
                }`}
              >
                <span className="text-emerald-700">{line.label}:</span> {line.value}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Data Flow Connector */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[9px] font-mono text-red-500/60 uppercase">Public</span>
        <div className="flex-1 h-0.5 rounded-full connector-active" />
        <ArrowRight className="h-3 w-3 text-emerald-400 animate-pulse" />
        <span className="text-[9px] font-mono text-emerald-400 uppercase">Private</span>
      </div>
    </div>
  );
}
