"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Video,
  Play,
  Sparkles,
  Zap,
  Activity,
  Terminal,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Film,
  Flame,
  Check,
  Sliders,
  Layers,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { AiVideoBotState } from "@/lib/aiVideoBot";

interface AdminAiBotClientViewProps {
  initialState: AiVideoBotState;
  activeReels: any[];
}

export default function AdminAiBotClientView({
  initialState,
  activeReels,
}: AdminAiBotClientViewProps) {
  const [botState, setBotState] = useState<AiVideoBotState>(initialState);
  const [runningBot, setRunningBot] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleRunBot = async (mode: "missing_only" | "all" = "missing_only") => {
    setRunningBot(true);
    try {
      const res = await fetch("/api/ai/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run_auto_video",
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bot execution failed");

      setBotState(data.state);
      toast.success(
        `🎬 AI Video Bot completed! Generated & published ${data.result?.processedCount || 0} videos.`,
        { icon: "🤖", duration: 5000 }
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to execute bot");
    } finally {
      setRunningBot(false);
    }
  };

  const handleOptimizeStreaming = async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/ai/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimize_reels",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Optimization failed");

      setBotState(data.state);
      toast.success("🚀 Video buffer preloading & streams optimized!", { icon: "⚡" });
    } catch (err: any) {
      toast.error(err.message || "Optimization failed");
    } finally {
      setOptimizing(false);
    }
  };

  const handleToggleAutoPilot = async () => {
    try {
      const res = await fetch("/api/ai/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_auto_pilot",
          enabled: !botState.isAutoPilot,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Toggle failed");

      setBotState(data.state);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || "Toggle failed");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B0A09] via-[#121419] to-[#1E1B14] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Bot className="w-3.5 h-3.5 text-[#C5A059]" />
              Automatic Dress Video Bot
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FCFBF7] tracking-tight">
              Automatic Dress Video Bot
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              This smart bot automatically finds dresses on your website without videos, makes real model runway walk videos using Google Veo 3, and puts them right on your website for customers to watch and buy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleRunBot("missing_only")}
              disabled={runningBot}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B38F46] hover:to-[#C5A059] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#C5A059]/20 disabled:opacity-50 cursor-pointer"
            >
              {runningBot ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Bot Is Making Runway Videos...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  ▶️ Run Video Bot Now
                </>
              )}
            </button>
            <button
              onClick={handleOptimizeStreaming}
              disabled={optimizing}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold tracking-wide rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              {optimizing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4 text-[#C5A059]" />}
              ⚡ Speed Up Videos
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14120E] border border-white/10 p-5 rounded-2xl text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Bot Autonomous Mode</span>
            <div className={`w-2.5 h-2.5 rounded-full ${botState.isAutoPilot ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-serif text-[#FCFBF7]">
              {botState.isAutoPilot ? "Active (Auto-Pilot)" : "Manual Trigger"}
            </h3>
            <button
              onClick={handleToggleAutoPilot}
              className="text-[10px] font-bold text-[#C5A059] hover:underline"
            >
              Toggle
            </button>
          </div>
          <p className="text-[11px] text-neutral-500">Auto-runs Veo 3 on new arrivals</p>
        </div>

        <div className="bg-[#14120E] border border-white/10 p-5 rounded-2xl text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Active Storefront Reels</span>
            <Film className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#FCFBF7]">
            {botState.totalReelsActive} Active Reels
          </h3>
          <p className="text-[11px] text-emerald-400 font-semibold">Streaming on Homepage</p>
        </div>

        <div className="bg-[#14120E] border border-white/10 p-5 rounded-2xl text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Videos Generated</span>
            <Video className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#FCFBF7]">
            {botState.totalVideosGenerated} Runway Walks
          </h3>
          <p className="text-[11px] text-neutral-500">Google Veo 3 Engine</p>
        </div>

        <div className="bg-[#14120E] border border-white/10 p-5 rounded-2xl text-white space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Video Streaming Buffer</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-emerald-400">
            &lt; 100ms
          </h3>
          <p className="text-[11px] text-neutral-500">Preload=&quot;metadata&quot; active</p>
        </div>
      </div>

      {/* Main Bot Grid: Terminal & Live Reels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Terminal Logs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B0A09] border border-white/15 rounded-2xl p-5 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  AI Bot Execution Terminal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-neutral-400">STATUS: {botState.status}</span>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-black/70 border border-white/10 rounded-xl p-4 font-mono text-xs text-neutral-300 h-80 overflow-y-auto space-y-2.5">
              {botState.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                  <span className="text-neutral-500 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                      log.level === "SUCCESS"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : log.level === "WARN"
                        ? "bg-amber-500/20 text-amber-400"
                        : log.level === "ERROR"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-neutral-300">{log.message}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
              <span>Auto-refreshing on each background action</span>
              <button
                onClick={() => handleRunBot("missing_only")}
                disabled={runningBot}
                className="text-xs text-[#C5A059] hover:underline font-bold"
              >
                Trigger Manual Run →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Storefront Video Reels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-5 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-sm font-serif font-bold text-[#FCFBF7]">Active Storefront Reels</h3>
              </div>
              <Link
                href="/admin/layout"
                className="text-xs text-[#C5A059] hover:underline font-bold"
              >
                Manage Order →
              </Link>
            </div>

            <div className="space-y-3">
              {activeReels.slice(0, 4).map((reel) => (
                <div
                  key={reel.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0B0A09] border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 bg-black rounded-lg overflow-hidden relative shrink-0 border border-white/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-[#FCFBF7] line-clamp-1">
                        {reel.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {reel.product?.title || "Storefront Shoppable"}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono">Live on Watch & Buy</span>
                    </div>
                  </div>

                  <a
                    href={reel.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs"
                    title="Preview Video Stream"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
