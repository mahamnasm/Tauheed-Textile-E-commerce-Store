"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Layers,
  Download,
  Check,
  Zap,
  ArrowRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  ShieldCheck,
  Video
} from "lucide-react";
import toast from "react-hot-toast";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  fabric: string;
  workType: string;
  basePrice: number;
  images: { url: string }[];
}

interface AdminNanoBananaClientViewProps {
  products: ProductItem[];
}

export default function AdminNanoBananaClientView({ products }: AdminNanoBananaClientViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [stylePreset, setStylePreset] = useState<"viral_clickbait" | "royal_haveli" | "vogue_editorial" | "festive_eid">("viral_clickbait");
  const [aspectRatio, setAspectRatio] = useState<"3:4" | "9:16" | "1:1">("3:4");
  const [customPrompt, setCustomPrompt] = useState("");

  const [generating, setGenerating] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [settingCover, setSettingCover] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const [generatedResult, setGeneratedResult] = useState<any>({
    imageUrl: selectedProduct?.images?.[0]?.url || "/assets/reel-1.jpg",
    stylePreset: "viral_clickbait",
    clickbaitScore: 98,
    model: "Google Nano Banana (Imagen 3 / Gemini Image)",
    generatedAt: new Date().toISOString(),
  });

  const handleGenerate = async () => {
    if (!selectedProduct) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/nano-banana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          fabric: selectedProduct.fabric,
          workType: selectedProduct.workType,
          stylePreset,
          aspectRatio,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setGeneratedResult(data.result);
      toast.success("🍌 Nano Banana Front Pic Generated!", { icon: "✨" });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  const handleSetCover = async () => {
    if (!selectedProduct || !generatedResult?.imageUrl) return;
    setSettingCover(true);
    try {
      const res = await fetch("/api/ai/nano-banana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_cover",
          productId: selectedProduct.id,
          imageUrl: generatedResult.imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set cover");

      toast.success("⭐ Set as primary front cover for customers!", { icon: "🔥" });
    } catch (err: any) {
      toast.error(err.message || "Failed to set cover");
    } finally {
      setSettingCover(false);
    }
  };

  const handleBatchGenerate = async () => {
    setBatchGenerating(true);
    try {
      const res = await fetch("/api/ai/nano-banana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_generate",
          stylePreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch generation failed");

      toast.success(data.message || "Batch generation complete!", { icon: "🚀", duration: 5000 });
    } catch (err: any) {
      toast.error(err.message || "Batch generation failed");
    } finally {
      setBatchGenerating(false);
    }
  };

  const presets = [
    {
      id: "viral_clickbait",
      name: "⚡ Viral High-Fashion Clickbait",
      desc: "Maximum CTR cover: vibrant saturation, dramatic wind-swept dupatta flare, glistening zari sheen.",
    },
    {
      id: "royal_haveli",
      name: "👑 Royal Lahore Haveli Heritage",
      desc: "Begum royalty aesthetic with carved sandstone arches, warm oil lamp glow, and ancestral luxury.",
    },
    {
      id: "vogue_editorial",
      name: "📸 Modern Vogue Minimalist",
      desc: "Studio cyclorama, chiaroscuro softbox contrast, crisp pret silhouette and clean magazine framing.",
    },
    {
      id: "festive_eid",
      name: "✨ Festive Eid & Wedding Radiance",
      desc: "Celebratory bridal and festive edit with shimmering micro-sequins and radiant warm beauty lighting.",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B0A09] via-[#14120E] to-[#1E1B14] border border-[#C5A059]/40 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Google Nano Banana (Imagen 3 / Gemini Image) Plugin
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FCFBF7] tracking-tight">
              Clickbait Front Outfit Photo Studio
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Generate photorealistic, high-converting front cover photography for every outfit. Turn casual browsers into buyers with viral magazine-grade Pakistani fashion covers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBatchGenerate}
              disabled={batchGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg disabled:opacity-50"
            >
              {batchGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              Batch Generate All Outfits
            </button>
            <Link
              href="/admin/bot"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-medium tracking-wide rounded-xl transition"
            >
              <Video className="w-4 h-4 text-[#C5A059]" />
              AI Video Bot
            </Link>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Outfit Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-serif font-bold text-[#FCFBF7]">Outfit Selection & Style</h2>
                <p className="text-xs text-neutral-400">Choose catalog ensemble and visual aesthetic</p>
              </div>
            </div>

            {/* Select Product */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Target Outfit
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-[#C5A059] transition"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Rs. {p.basePrice.toLocaleString()})
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 space-y-1">
                  <p><strong className="text-neutral-300">Fabric:</strong> {selectedProduct.fabric}</p>
                  <p><strong className="text-neutral-300">Needlework:</strong> {selectedProduct.workType}</p>
                </div>
              )}
            </div>

            {/* Style Presets */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Clickbait Framing Preset
              </label>
              <div className="space-y-2.5">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setStylePreset(p.id as any)}
                    className={`w-full p-3 rounded-xl border text-left transition ${
                      stylePreset === p.id
                        ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                        : "bg-[#0B0A09] border-white/10 hover:border-white/20 text-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FCFBF7]">{p.name}</span>
                      {stylePreset === p.id && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "3:4", label: "3:4 (Catalog)" },
                  { id: "9:16", label: "9:16 (Story)" },
                  { id: "1:1", label: "1:1 (Feed)" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setAspectRatio(r.id as any)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      aspectRatio === r.id
                        ? "bg-[#C5A059] text-black border-[#C5A059]"
                        : "bg-[#0B0A09] text-neutral-400 border-white/10 hover:border-white/20"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Custom Director Instructions (Optional)
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. dramatic emerald dupatta drape, gold jhumka earrings..."
                className="w-full bg-[#0B0A09] border border-white/15 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:from-[#B38F46] hover:to-[#C5A059] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating with Nano Banana...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Front Clickbait Pic
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live High-CTR Preview & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#14120E] border border-white/10 rounded-2xl p-6 text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-[#FCFBF7]">
                    Generated Front Cover Preview
                  </h2>
                  <p className="text-xs text-neutral-400">
                    High-CTR commercial photo preview with clickbait badges
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                ESTIMATED CTR: 98%
              </span>
            </div>

            {/* Visual Photo Card */}
            <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-black group">
              <Image
                src={generatedResult.imageUrl}
                alt="Nano Banana Clickbait Front Pic"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Clickbait Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40 text-[10px] font-bold uppercase tracking-wider shadow">
                  ★ LUXURY COUTURE
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-extrabold uppercase tracking-wider shadow w-fit">
                  HOT SELLER
                </span>
              </div>

              {/* Bottom Gradient with Product Info */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-12 text-white">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                  Tauheed Textile
                </p>
                <h3 className="font-serif font-bold text-sm text-white line-clamp-1">
                  {selectedProduct?.title}
                </h3>
                <p className="text-xs font-mono text-[#C5A059] font-bold mt-0.5">
                  Rs. {selectedProduct?.basePrice?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleSetCover}
                disabled={settingCover}
                className="w-full sm:flex-1 py-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#0B0A09] text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {settingCover ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Set as Primary Front Cover
              </button>

              <a
                href={generatedResult.imageUrl}
                download="tauheed-clickbait-cover.jpg"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#C5A059]" />
                Download High-Res
              </a>

              {selectedProduct && (
                <Link
                  href={`/product/${selectedProduct.slug}`}
                  target="_blank"
                  className="w-full sm:w-auto px-4 py-3 bg-sand-900 border border-sand-800 text-sand-200 hover:text-gold-400 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5"
                  title="View on Storefront"
                >
                  <Eye className="w-4 h-4 text-gold-400" />
                  View Look
                </Link>
              )}
            </div>

            {/* Prompt Transparency Details */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between text-neutral-400 border-b border-white/10 pb-1.5">
                <span className="font-semibold text-neutral-300">Synthesized Nano Banana Prompt:</span>
                <span className="font-mono text-[10px] text-amber-400">{generatedResult.model}</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                {generatedResult.promptUsed || "High-CTR front outfit photography with cinematic couture lighting and intricate textile sheen."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
