"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Sparkles,
  Key,
  Sliders,
  CheckCircle2,
  Video,
  Globe,
  Share2,
  Wand2,
  ShieldCheck,
  Terminal,
  Copy,
  RefreshCw,
  ExternalLink,
  Save,
  Check,
  Zap,
  Layers,
  FileText,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { DynamicAiConfig } from "@/lib/dynamicAiConfig";

interface AdminAiClientViewProps {
  initialConfig: DynamicAiConfig;
}

export default function AdminAiClientView({ initialConfig }: AdminAiClientViewProps) {
  const [config, setConfig] = useState<DynamicAiConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Playground state
  const [testProductTitle, setTestProductTitle] = useState("Noor-e-Jahan Handcrafted Jamawar");
  const [testProductFabric, setTestProductFabric] = useState("Pure Chiffon & Zari Tilla");
  const [testProductTone, setTestProductTone] = useState("ultra_luxury");
  const [testLoading, setTestLoading] = useState(false);
  const [testOutput, setTestOutput] = useState<string>("");

  const handleSave = async (updatedConfig: Partial<DynamicAiConfig>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig),
      });

      if (!res.ok) throw new Error("Failed to save AI configuration");

      const data = await res.json();
      setConfig(data.config);
      toast.success("AI Configuration updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTestGeneration = async () => {
    setTestLoading(true);
    setTestOutput("");
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: testProductTitle,
          fabric: testProductFabric,
          category: "Luxury Formals",
          price: 18500,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setTestOutput(data.caption);
      toast.success("AI Generation Test Successful!");
    } catch (err: any) {
      toast.error(err.message || "Test failed");
    } finally {
      setTestLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B0A09] via-[#14120E] to-[#1F1B14] border border-[#C5A059]/30 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic AI Automation Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FCFBF7] tracking-tight">
              AI Engines, Models & Storefront Automation
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Configure models (Google Gemini & Veo 3), brand tone, and automation switches dynamically without touching code. All settings persist in the database and take effect immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/reels"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#0B0A09] text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#C5A059]/20"
            >
              <Video className="w-4 h-4" />
              Runway Reels & Videos
            </Link>
            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium tracking-wide rounded-xl transition"
            >
              <Globe className="w-4 h-4" />
              SEO AI Suite
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Settings & Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Configuration */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Core AI Model & API Key */}
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#FCFBF7]">Core Model & Credentials</h2>
                  <p className="text-xs text-neutral-400">Select active generation model and API keys</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Gemini Text & Vision Model
                </label>
                <select
                  value={config.activeModel}
                  onChange={(e) => setConfig({ ...config, activeModel: e.target.value })}
                  className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-[#C5A059] transition"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Fast & Smart - Recommended)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Creative Copy & Reasoning)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (High Throughput)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (High Context)</option>
                </select>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  Used for SEO generation, descriptions, size advisor, and customer support.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Google Veo Video Engine
                </label>
                <select
                  value={config.veoModel}
                  onChange={(e) => setConfig({ ...config, veoModel: e.target.value })}
                  className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-[#C5A059] transition"
                >
                  <option value="google-veo-3">Google Veo 3 (Cinematic 4K Runway Walks)</option>
                  <option value="google-veo-2">Google Veo 2 (Fast Generation)</option>
                </select>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  Generates photorealistic Pakistani fashion runway and model walk reels.
                </p>
              </div>
            </div>

            {/* API Key Override */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                  Custom Google Gemini / Veo API Key (Optional)
                </label>
                <span className="text-[11px] text-neutral-500">
                  {config.apiKey ? "Custom Key Configured" : "Using Server ENV Key"}
                </span>
              </div>
              <input
                type="password"
                placeholder="AIzaSy... (Leave blank to use default server key)"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-4 py-2.5 text-sm font-mono text-neutral-200 focus:outline-none focus:border-[#C5A059] transition"
              />
              <p className="text-[11px] text-neutral-400 mt-1.5">
                Allows you to switch to your own dedicated Gemini quota anytime without restarting the application.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSave(config)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#0B0A09] text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Model Settings
              </button>
            </div>
          </div>

          {/* Card 2: Brand Voice & Custom Prompting */}
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#FCFBF7]">Brand Voice & Editorial Persona</h2>
                <p className="text-xs text-neutral-400">Direct how AI writes descriptions, titles, and social captions</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Brand Tone Preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: "Royal Haute Couture",
                    value: "Royal Pakistani Haute Couture & Heritage Craftsmanship",
                    desc: "Opulent, regal vocabulary emphasizing master artisan needlework and heirloom aesthetics.",
                  },
                  {
                    name: "Modern Minimalist",
                    value: "Contemporary Luxury & Elegant Minimalist Chic",
                    desc: "Sleek, refined, highlighting silhouette purity, breathable drape, and subtle luxury.",
                  },
                  {
                    name: "Festive & Bridal",
                    value: "Exquisite Pakistani Bridal & Wedding Glamour",
                    desc: "Vibrant and celebratory tone focusing on celebratory moments, zari shine, and grandeur.",
                  },
                  {
                    name: "Everyday Luxury Pret",
                    value: "Sophisticated Daily Wear & Premium Breathable Pret",
                    desc: "Practical elegance emphasizing all-day comfort, Swiss lawn weave, and effortless styling.",
                  },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setConfig({ ...config, brandVoice: preset.value })}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      config.brandVoice === preset.value
                        ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                        : "bg-[#0B0A09] border-white/10 hover:border-white/20 text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FCFBF7]">{preset.name}</span>
                      {config.brandVoice === preset.value && (
                        <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Custom AI Instruction Prefix (Injected into all prompts)
              </label>
              <textarea
                rows={3}
                value={config.customPromptPrefix}
                onChange={(e) => setConfig({ ...config, customPromptPrefix: e.target.value })}
                className="w-full bg-[#0B0A09] border border-white/15 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059] transition"
                placeholder="e.g. Always mention free nationwide shipping on orders above Rs. 10,000..."
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Customize brand guidelines, return policy mentions, or artisanal heritage notes injected across all prompts.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSave(config)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B38F46] text-[#0B0A09] text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Brand Persona
              </button>
            </div>
          </div>

          {/* Card 3: Automation Master Switches */}
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-[#FCFBF7]">Storefront Automation Switches</h2>
                <p className="text-xs text-neutral-400">Toggle automatic background AI intelligence rules</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "autoSeoOnSave",
                  title: "Automatic Google SEO Meta Generation",
                  desc: "Automatically synthesize click-optimized title, description, and keywords when a product is created.",
                  state: config.autoSeoOnSave,
                },
                {
                  key: "autoCopywriterOnSave",
                  title: "Automatic Luxury Description & Bullet Polish",
                  desc: "Auto-format product highlights, care guides, and fabric specifications into editorial luxury layout.",
                  state: config.autoCopywriterOnSave,
                },
                {
                  key: "autoReelCaptionOnSave",
                  title: "Automatic Social Media & Reels Captions",
                  desc: "Create ready-to-publish Instagram Reel & TikTok captions with trending Pakistani fashion hashtags.",
                  state: config.autoReelCaptionOnSave,
                },
                {
                  key: "enableStylistOnStorefront",
                  title: "Storefront AI Fashion Stylist Widget",
                  desc: "Enable interactive outfit pairing recommendations and drape advisor on customer-facing product pages.",
                  state: config.enableStylistOnStorefront,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0B0A09] border border-white/10"
                >
                  <div className="pr-4">
                    <h3 className="text-sm font-semibold text-[#FCFBF7]">{item.title}</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...config, [item.key]: !item.state };
                      setConfig(updated);
                      handleSave(updated);
                    }}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      item.state ? "bg-[#C5A059]" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        item.state ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live AI Playground & API Reference */}
        <div className="space-y-8">
          {/* Live Playground */}
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-[#FCFBF7]">Live AI Studio Playground</h2>
                <p className="text-xs text-neutral-400">Test copywriter & caption generator</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Product Sample Name
                </label>
                <input
                  type="text"
                  value={testProductTitle}
                  onChange={(e) => setTestProductTitle(e.target.value)}
                  className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Fabric & Embroidery Details
                </label>
                <input
                  type="text"
                  value={testProductFabric}
                  onChange={(e) => setTestProductFabric(e.target.value)}
                  className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                onClick={handleTestGeneration}
                disabled={testLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B38F46] hover:to-[#C5A059] text-[#0B0A09] text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {testLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Reel Caption & Copy
                  </>
                )}
              </button>

              {testOutput && (
                <div className="mt-4 p-4 rounded-xl bg-[#0B0A09] border border-[#C5A059]/30 text-xs text-neutral-200 space-y-3 relative group">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase font-bold text-[#C5A059]">Generated Result</span>
                    <button
                      onClick={() => copyToClipboard(testOutput, "test-output")}
                      className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      {copiedEndpoint === "test-output" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEndpoint === "test-output" ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-neutral-300 font-serif">{testOutput}</p>
                </div>
              )}
            </div>
          </div>

          {/* Direct API Endpoints & Developer Integration */}
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-[#FCFBF7]">Public & Admin APIs</h2>
                <p className="text-xs text-neutral-400">Call Tauheed AI from webhooks, CRM or scripts</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Runway Reels API",
                  method: "GET / POST / DELETE",
                  path: "/api/admin/reels",
                  desc: "Manages authentic runway reels and attaches manual MP4 videos to dresses.",
                },
                {
                  name: "Dynamic AI Config API",
                  method: "GET / POST",
                  path: "/api/ai/config",
                  desc: "Read and update models, keys, and brand tones programmatically.",
                },
                {
                  name: "Reels & Social Caption AI",
                  method: "POST",
                  path: "/api/ai/caption",
                  desc: "Synthesizes viral Instagram/TikTok captions with Pakistani fashion tags.",
                },
                {
                  name: "Storefront SEO Optimizer",
                  method: "POST",
                  path: "/api/admin/seo/optimize-all",
                  desc: "Performs bulk AI optimization of all product titles and meta tags.",
                },
                {
                  name: "Dynamic Sitemap XML",
                  method: "GET",
                  path: "/sitemap.xml",
                  desc: "Auto-generated XML sitemap with all active products for Google indexing.",
                },
              ].map((api) => (
                <div key={api.path} className="p-3 bg-[#0B0A09] border border-white/10 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#FCFBF7]">{api.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#C5A059]">
                      {api.method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-neutral-300 border border-white/5">
                    <span className="truncate">{api.path}</span>
                    <button
                      onClick={() => copyToClipboard(api.path, api.path)}
                      className="ml-2 text-neutral-500 hover:text-white"
                      title="Copy endpoint path"
                    >
                      {copiedEndpoint === api.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{api.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
