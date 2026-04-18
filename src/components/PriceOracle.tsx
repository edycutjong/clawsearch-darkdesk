'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from 'lucide-react';

interface OracleData {
  tbill: { symbol: string; name: string; yield: number; change: number };
  reference: { symbol: string; price: number; change: number };
}

function TickerCard({
  icon: Icon,
  iconBg,
  iconColor,
  symbol,
  label,
  mainValue,
  change,
}: {
  icon: typeof Activity;
  iconBg: string;
  iconColor: string;
  symbol: string;
  label: string;
  mainValue: string;
  change: number;
}) {
  return (
    <div className="card-hover flex items-center justify-between rounded-lg bg-slate-900/70 border border-slate-800/60 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} border border-current/20`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <div className="font-mono text-sm font-semibold text-slate-200">{symbol}</div>
          <div className="text-xs text-slate-500">{label}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-lg font-bold text-white">
          {mainValue}
        </div>
        <div className={`flex items-center justify-end gap-1 text-xs font-mono font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span className="tabular-nums">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}

export function PriceOracle() {
  const { data, isLoading, isError } = useQuery<{ success: boolean; data: OracleData }>({
    queryKey: ['price-oracle'],
    queryFn: async () => {
      const res = await fetch('/api/price');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
          <span className="text-slate-500 font-mono text-xs">Initializing Oracle Feeds...</span>
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 font-mono text-sm gap-2 p-4">
        <span>ERROR: Oracle connection lost</span>
        <span className="text-slate-500 text-xs text-center">Ensure Alpaca API keys are valid or mock fallbacks are active.</span>
      </div>
    );
  }

  const { tbill, reference } = data.data;

  return (
    <div className="flex flex-col w-full px-3 gap-3 h-full pt-3 pb-2">
      <TickerCard
        icon={Activity}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-400"
        symbol={tbill.symbol}
        label={tbill.name}
        mainValue={`${tbill.yield.toFixed(2)}% APY`}
        change={tbill.change}
      />
      <TickerCard
        icon={TrendingUp}
        iconBg="bg-slate-800"
        iconColor="text-slate-400"
        symbol={reference.symbol}
        label="Equity Reference"
        mainValue={`$${reference.price.toFixed(2)}`}
        change={reference.change}
      />
      
      <div className="mt-auto px-1 flex flex-col gap-1.5 pb-1 section-divider pt-3">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-wide uppercase">
          <span>Data Provider</span>
          <span>Status</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400">Alpaca Markets SIP</span>
          <span className="text-green-400 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 glow-dot animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
