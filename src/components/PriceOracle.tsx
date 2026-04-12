'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface OracleData {
  tbill: { symbol: string; name: string; yield: number; change: number };
  reference: { symbol: string; price: number; change: number };
}

export function PriceOracle() {
  const { data, isLoading, isError } = useQuery<{ success: boolean; data: OracleData }>({
    queryKey: ['price-oracle'],
    queryFn: async () => {
      const res = await fetch('/api/price');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-500 font-mono text-sm animate-pulse">
        Initializing Oracle Feeds...
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center text-red-400 font-mono text-sm gap-2">
        <span>ERROR: Oracle connection lost</span>
        <span className="text-slate-500 text-xs text-center px-4">Ensure Alpaca API keys are valid or mock fallbacks are active.</span>
      </div>
    );
  }

  const { tbill, reference } = data.data;

  return (
    <div className="flex flex-col w-full px-2 gap-4 h-full pt-2">
      {/* T-Bill Ticker */}
      <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-slate-200">{tbill.symbol}</div>
            <div className="text-xs text-slate-400">{tbill.name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-white">
            {tbill.yield.toFixed(2)}% APY
          </div>
          <div className={`flex items-center justify-end gap-1 text-xs font-mono font-medium ${tbill.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {tbill.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(tbill.change)}%
          </div>
        </div>
      </div>

      {/* Reference Asset Ticker */}
      <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 border border-slate-700">
            <span className="font-mono font-bold text-slate-400">EQ</span>
          </div>
          <div>
            <div className="font-mono text-sm font-semibold text-slate-200">{reference.symbol}</div>
            <div className="text-xs text-slate-400">Equity Reference</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-bold text-white">
            ${reference.price.toFixed(2)}
          </div>
          <div className={`flex items-center justify-end gap-1 text-xs font-mono font-medium ${reference.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {reference.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(reference.change)}%
          </div>
        </div>
      </div>
      
      <div className="mt-auto px-1 flex flex-col gap-1 pb-1">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-wide uppercase">
          <span>Data Provider</span>
          <span>Status</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Alpaca Markets SIP</span>
          <span className="text-green-400 flex items-center justify-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>LIVE</span>
        </div>
      </div>
    </div>
  );
}
