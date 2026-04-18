import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-mono font-bold text-xl tracking-tight text-slate-200 flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-500" />
          ClawSearch<span className="text-cyan-400">DarkDesk</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-mono text-slate-400">
          <Link href="/trade" className="hover:text-cyan-400 transition-colors">Dark Pool</Link>
          <a href="#" className="hover:text-cyan-400 transition-colors">Docs</a>
        </nav>
      </div>
    </header>
  );
}
