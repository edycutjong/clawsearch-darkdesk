'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Terminal } from 'lucide-react';
import { ChatBubble } from '@/components/ChatBubble';

export function AIChat() {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: 'DarkDesk Terminal initialized. Connected to Alpaca SIP and ChainGPT Network. State your trading intent or target execution price to begin negotiations.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      // Append a temporary assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error('API routing error');
      if (!res.body) throw new Error('No readable stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      let textBuffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          textBuffer += chunk;
          
          // Update the last message in the array
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].content = textBuffer;
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = '[SYSTEM ERROR] Connection to ChainGPT failed. Ensure endpoints are reachable.';
        return updated;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-h-full min-h-0 bg-slate-950/20">
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs animate-pulse opacity-70">
            <Terminal className="h-3 w-3" /> Processing counter-offer...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="E.g., Sell 100,000 cUSDC worth of cT-BILL at market..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50 font-mono"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
