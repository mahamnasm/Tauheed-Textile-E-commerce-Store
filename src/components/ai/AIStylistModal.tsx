"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
  stylingTips?: string[];
  occasionMatch?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "What should I wear to an evening wedding Barat?",
  "Recommend breathable luxury lawn for summer daytime",
  "Show me formal chiffons with hand-embroidered Adda work",
  "Looking for elegant minimalist pret for high-tea",
];

export default function AIStylistModal() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Welcome to Tauheed Textile's Haute Couture Concierge. I am your personal AI Stylist. Tell me your upcoming occasion, preferred fabric, or silhouette, and I will curate the perfect ensemble for you.",
      stylingTips: [
        "Complimentary nationwide Cash on Delivery on all orders",
        "Bespoke stitching and custom measurements available",
      ],
      occasionMatch: "Bespoke Fashion Concierge",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          history: chatHistory,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          products: data.recommendedProducts || [],
          stylingTips: data.stylingTips || [],
          occasionMatch: data.occasionMatch,
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Failed to generate styling advice");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize for the brief pause. Our atelier recommends exploring our Festive Zari Royale collection for timeless Pakistani grace.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-brand-950/95 hover:bg-black border border-gold-500/70 hover:border-gold-400 text-gold-300 hover:text-gold-200 rounded-full shadow-[0_4px_25px_rgba(197,160,89,0.35)] transition-all duration-300 hover:scale-105 backdrop-blur-md"
          aria-label="Open AI Fashion Stylist"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-ping" />
          </div>
          <span className="font-serif text-xs font-bold tracking-wider uppercase text-sand-50">
            AI Stylist
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-gold-500/20 border border-gold-500/40 text-[9px] font-sans font-semibold rounded text-gold-300">
            Couture Concierge
          </span>
        </button>
      </div>

      {/* Modal / Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-ink-black border-l border-sand-800 shadow-2xl flex flex-col h-full z-10 animate-slideLeft">
            {/* Header */}
            <div className="p-5 border-b border-sand-800 flex items-center justify-between bg-brand-950/90">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-8 shrink-0">
                  <Image
                    src="/logo-calligraphy.png"
                    alt="Tauheed Calligraphy"
                    fill
                    className="object-contain drop-shadow-[0_2px_8px_rgba(197,160,89,0.4)]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-sand-50 tracking-wide">
                      Tauheed AI Stylist
                    </h3>
                    <span className="px-1.5 py-0.2 bg-gold-500/20 text-gold-300 border border-gold-500/40 rounded text-[9px] font-bold uppercase tracking-wider">
                      Live Concierge
                    </span>
                  </div>
                  <p className="text-[11px] text-sand-400">
                    Bespoke Pakistani luxury styling & ensemble curator
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-sand-400 hover:text-sand-100 hover:bg-sand-900 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold-600 text-brand-950 font-medium rounded-tr-none shadow-md"
                        : "bg-brand-900/80 border border-sand-800 text-sand-100 rounded-tl-none space-y-3"
                    }`}
                  >
                    {msg.occasionMatch && msg.role === "assistant" && (
                      <div className="inline-block px-2 py-0.5 bg-gold-500/20 text-gold-300 border border-gold-500/30 rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                        {msg.occasionMatch}
                      </div>
                    )}

                    <p className="whitespace-pre-line text-sand-100">{msg.content}</p>

                    {/* Styling Tips */}
                    {msg.stylingTips && msg.stylingTips.length > 0 && (
                      <div className="pt-2 border-t border-sand-800/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                          Styling Tips:
                        </span>
                        <ul className="space-y-1">
                          {msg.stylingTips.map((tip, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] text-sand-300 flex items-start gap-1.5"
                            >
                              <span className="text-gold-400 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="pt-3 border-t border-sand-800 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                          Curated Ensembles:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.products.map((prod: any) => (
                            <Link
                              key={prod.id}
                              href={`/product/${prod.slug}`}
                              onClick={() => setIsOpen(false)}
                              className="group p-2 rounded-xl bg-ink-black/80 border border-sand-800 hover:border-gold-500/60 transition-all flex items-center gap-3"
                            >
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-sand-900 shrink-0 border border-sand-800">
                                <Image
                                  src={prod.images?.[0]?.url || "/assets/hero-model.jpg"}
                                  alt={prod.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-serif font-bold text-xs text-sand-50 truncate group-hover:text-gold-300 transition-colors">
                                  {prod.title}
                                </p>
                                <p className="text-[10px] text-sand-400 truncate">
                                  {prod.fabric} • {prod.category?.name}
                                </p>
                                <p className="font-serif font-bold text-xs text-gold-400 mt-0.5">
                                  Rs. {prod.basePrice.toLocaleString()}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-sand-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-brand-900/80 border border-sand-800 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce delay-300" />
                    <span className="text-[11px] text-sand-400 ml-1">
                      Curating couture advice...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-brand-950/60 border-t border-sand-800/80 overflow-x-auto whitespace-nowrap scrollbar-none">
              <div className="flex gap-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1 rounded-full bg-brand-900/90 hover:bg-gold-500/20 border border-sand-800 hover:border-gold-500/40 text-[10px] text-sand-300 hover:text-gold-300 transition-colors shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-sand-800 bg-brand-950">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about wedding outfits, lawn, styling..."
                  className="flex-1 bg-ink-black border border-sand-800 focus:border-gold-500 rounded-xl px-3.5 py-2.5 text-xs text-sand-50 placeholder-sand-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-brand-950 font-bold rounded-xl transition-all shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
