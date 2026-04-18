'use client';

import { Eye, EyeOff } from 'lucide-react';

export function SplitScreenVerifier() {
  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4 flex-1">
        
        {/* Public View (Arbiscan) */}
        <div className="rounded-lg border border-red-900/30 bg-red-950/10 p-3 space-y-3 flex flex-col">
          <div className="flex items-center gap-2 border-b border-red-900/30 pb-2">
            <Eye className="h-4 w-4 text-red-500" />
            <h4 className="text-xs font-mono font-medium text-red-400 uppercase tracking-wider">Public Arbiscan</h4>
          </div>
          <div className="flex-1 space-y-2 font-mono text-[10px] text-slate-500 break-all overflow-hidden flex flex-col justify-center opacity-70">
            <p><span className="text-slate-600">Tx:</span> 0xabc...123</p>
            <p><span className="text-slate-600">From:</span> 0xDark...Pool</p>
            <p><span className="text-slate-600">To:</span> 0xDark...Pool</p>
            <p><span className="text-slate-600">Data:</span> 0xEncryptedPayloadData...</p>
            <p><span className="text-slate-600">Details:</span> [OBFUSCATED C-TOKEN]</p>
          </div>
        </div>

        {/* Private View (Confidential) */}
        <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/10 p-3 space-y-3 flex flex-col">
          <div className="flex items-center gap-2 border-b border-emerald-900/30 pb-2">
            <EyeOff className="h-4 w-4 text-emerald-500" />
            <h4 className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">iExec TEE</h4>
          </div>
          <div className="flex-1 space-y-2 font-mono text-[10px] text-emerald-600 break-all overflow-hidden flex flex-col justify-center">
            <p><span className="text-emerald-800">Tx:</span> 0xabc...123</p>
            <p><span className="text-emerald-800">Swap:</span> 100,000 cUSDC</p>
            <p><span className="text-emerald-800">For:</span> ~100k cT-BILL</p>
            <p><span className="text-emerald-800">Condition:</span> Yield &gt;= 4.12%</p>
            <p><span className="text-emerald-800">Status:</span> Atomic Execution</p>
          </div>
        </div>

      </div>
    </div>
  );
}
