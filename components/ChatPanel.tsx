"use client";
import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ChatPanel({
  title = "AI Assistant",
  systemPrompt,
  placeholder = "Ask anything...",
  quickActions = [],
}: {
  title?: string;
  systemPrompt?: string;
  placeholder?: string;
  quickActions?: string[];
}) {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, status, regenerate } = useChat({
    // @ts-ignore
    api: "/api/ai",
    body: { system: systemPrompt },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleInputChange = (e: any) => setInput(e.target.value);
  const handleSubmit = (e?: any) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ content: input, role: "user" } as any);
    setInput("");
  };
  const reload = () => regenerate();

  return (
    <aside className="w-80 xl:w-96 border-l border-border bg-bg-surface flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-p flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-tx">{title}</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              <span className="text-[10px] text-tx-muted font-medium">Active</span>
            </div>
          </div>
        </div>
        <button onClick={() => reload()} className="p-1.5 hover:bg-bg-soft rounded-lg transition-colors text-tx-muted">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-p-soft flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-p" />
            </div>
            <p className="text-sm font-medium text-tx mb-1">Ready to help</p>
            <p className="t-small">Ask me anything</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m: any) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-p text-white rounded-br-sm"
                  : "bg-bg-soft text-tx rounded-bl-sm border border-border"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-bg-soft border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0,1,2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-tx-muted"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick actions */}
      {quickActions.length > 0 && messages.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <button key={a}
              onClick={() => { /* set input and submit */ }}
              className="text-xs px-3 py-1.5 rounded-pill bg-p-soft text-p font-medium hover:bg-p hover:text-white transition-colors">
              {a}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border flex items-end gap-2">
        <div className="flex-1 bg-bg-soft border border-border rounded-xl px-3 py-2.5">
          <textarea value={input} onChange={handleInputChange} placeholder={placeholder} rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
            className="w-full bg-transparent text-sm text-tx placeholder:text-tx-muted resize-none outline-none"
            style={{ maxHeight: 80, overflowY: "auto" }}
          />
        </div>
        <button type="submit" disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-p text-white flex items-center justify-center hover:bg-p-h disabled:opacity-40 transition-colors shrink-0">
          <Send size={15} />
        </button>
      </form>
    </aside>
  );
}
