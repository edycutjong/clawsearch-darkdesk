'use client';

import { Bot, User } from 'lucide-react';
import { ReactNode } from 'react';

export interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string | ReactNode;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div 
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
          isUser 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-purple-600/20 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-slate-300" />
        ) : (
          <Bot className="h-4 w-4 text-purple-400" />
        )}
      </div>
      
      <div 
        className={`flex max-w-[85%] flex-col gap-1 text-sm ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <span className={`font-mono text-[10px] uppercase tracking-widest ${
          isUser ? 'text-slate-500' : 'text-purple-500/80'
        }`}>
          {isUser ? 'Trader' : 'ChainGPT Negotiator'}
        </span>
        <div 
          className={`rounded-xl px-4 py-3 transition-all duration-300 ${
            isUser 
              ? 'bg-slate-800/80 text-slate-200 border border-slate-700/50' 
              : 'bg-purple-950/30 text-slate-200 border border-purple-800/30 backdrop-blur-sm shadow-[0_0_20px_rgba(168,85,247,0.06)]'
          }`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
