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
    <div className={`flex w-full gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div 
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
          isUser 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-purple-600/20 border-purple-500/50'
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
        <span className="font-mono text-xs text-slate-500">
          {isUser ? 'Trader' : 'ChainGPT Negotiator'}
        </span>
        <div 
          className={`rounded-lg px-4 py-2.5 ${
            isUser 
              ? 'bg-slate-800 text-slate-200' 
              : 'bg-purple-950/40 text-slate-200 border border-purple-900/50'
          }`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
