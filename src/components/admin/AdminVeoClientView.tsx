"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Video, 
  Sparkles, 
  Play, 
  Download, 
  Share2, 
  Check, 
  Film, 
  Layers, 
  Maximize2, 
  ExternalLink,
  ChevronRight,
  Sliders,
  Eye,
  Zap,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminVeoClientViewProps {
  products: any[];
  existingReels: any[];
}

export default function AdminVeoClientView({
  products,
  existingReels: initialReels,
}: AdminVeoClientViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [modelStyle, setModelStyle] = useState<any>("pakistani_supermodel");
  const [walkDynamic, setWalkDynamic] = useState<any>("slow_motion_catwalk");
  const [backdropSetting, setBackdropSetting] = useState<any>("shalimar_bagh");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [durationSeconds, setDurationSeconds] = useState<5 | 10>(5);
  const [customNotes, setCustomNotes] = useState("");

  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>({
    videoUrl: "/assets/runway-walk-1.mp4",
    promptUsed: "Cinematic 4K fashion film of an elegant Pakistani supermodel walking gracefully wearing Gul-e-Noor Luxury Lawn. Dupatta flutters in gentle breeze, 85mm anamorphic portrait lens, golden hour sunlight, slow-motion catwalk.",
    aspectRatio: "9:16",
    engineUsed: "Google Veo 3 (Ultra HD)",
    durationSeconds: 5,
  });

  const [reels, setReels] = useState(initialReels);
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Dynamic Prompt Synthesizer Preview
  const livePromptPreview = `Cinematic 4K fashion film of an elegant Pakistani model walking gracefully wearing ${selectedProduct?.title || "Luxury Ensemble"} in pure ${selectedProduct?.fabric || "silk and lawn"}. Motion: ${walkDynamic.replace(/_/g, " ")}. Setting: ${backdropSetting.replace(/_/g, " ")}. Shot on 85mm portrait lens, 60fps slow motion, ultra-sharp fabric texture.`;

  // Handle Generate with Google Veo 3
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/veo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          productTitle: selectedProduct?.title,
          fabric: selectedProduct?.fabric,
          workType: selectedProduct?.workType,
          imageUrl: selectedProduct?.images[0]?.url,
          modelStyle,
          walkDynamic,
          backdropSetting,
          aspectRatio,
          durationSeconds,
          customNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setGeneratedVideo(data.result);
      toast.success("✨ Google Veo 3 AI Runway Video synthesized successfully!", {
        icon: "🎬",
        duration: 4000,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate video");
    } finally {
      setGenerating(false);
    }
  };

  // Handle Publish Video to Product & Storefront Watch & Buy
  const handlePublish = async (publishToReels: boolean) => {
    if (!selectedProduct || !generatedVideo?.videoUrl) return;
    setPublishing(true);

    try {
      const res = await fetch("/api/ai/veo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish",
          productId: selectedProduct.id,
          videoUrl: generatedVideo.videoUrl,
          title: `${selectedProduct.title} Runway Walk`,
          publishToReels,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");

      if (data.result?.reel) {
        setReels((prev: any[]) => [data.result.reel, ...prev.filter((r) => r.id !== data.result.reel.id)]);
      }

      toast.success(
        publishToReels
          ? "🎉 Published to Product Page & Storefront Watch & Buy Reels!"
          : "✅ Video attached to Product Page successfully!",
        { icon: "🛍️", duration: 4000 }
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to publish video");
    } finally {
      setPublishing(false);
    }
  };

  // Copy AI Instagram Reel Caption
  const handleCopyCaption = async () => {
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedProduct?.title,
          fabric: selectedProduct?.fabric,
          price: selectedProduct?.basePrice,
        }),
      });
      const data = await res.json();
      if (data.caption) {
        await navigator.clipboard.writeText(data.caption);
        toast.success("📋 AI Reel Caption copied to clipboard with hashtags!", { icon: "✨" });
      }
    } catch {
      toast.error("Could not generate caption");
    }
  };

  return (
    <div className="space-y-8 text-sand-950">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-700" />
              Google Veo 3 Video Studio
            </span>
            <span className="text-[10px] font-mono bg-brand-900 text-gold-300 px-2 py-0.5 rounded font-bold">
              4K CINEMATIC ENGINE
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            AI Model Walks & Runway Studio
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Generate photorealistic Pakistani supermodel runway walks, 360-degree fabric motion, and shoppable video reels with Google Veo 3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/marketing"
            className="px-3.5 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-gold-700" />
            <span>Manage All Reels</span>
          </Link>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Model & Walk Studio Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Outfit */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>Select Catalog Outfit for Runway Walk</span>
              </h3>
              <span className="text-xs text-brand-500 font-mono">{products.length} Products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {products.map((p) => {
                const isSelected = selectedProductId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-brand-950 text-sand-50 border-gold-500 shadow-md ring-1 ring-gold-500/50"
                        : "bg-sand-50/70 hover:bg-sand-100/80 border-sand-200 text-brand-950"
                    }`}
                  >
                    <div className="relative w-12 h-14 rounded-xl bg-sand-200 overflow-hidden shrink-0">
                      <Image
                        src={p.images[0]?.url || "/assets/prod-nafasat.jpg"}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate">{p.title}</h4>
                      <p className={`text-[10px] truncate ${isSelected ? "text-gold-300" : "text-brand-500"}`}>
                        {p.fabric}
                      </p>
                      <span className={`text-[11px] font-bold font-serif block mt-0.5 ${isSelected ? "text-gold-400" : "text-emerald-700"}`}>
                        PKR {p.basePrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Model & Runway Walk Parameters */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-sand-100 pb-3">
              <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-500 text-brand-950 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>Google Veo 3 Runway Walk Settings</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Model Persona */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Model Persona & Face Type
                </label>
                <select
                  value={modelStyle}
                  onChange={(e) => setModelStyle(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-gold-500"
                >
                  <option value="pakistani_supermodel">Pakistani Supermodel (Classic Elegance)</option>
                  <option value="editorial_catwalk">Editorial Catwalk Strut (Fashion Week)</option>
                  <option value="royal_mughal_bride">Royal Mughal Bride (Barat Grandeur)</option>
                  <option value="minimalist_high_tea">Minimalist Pret Muse (Modern Lahore)</option>
                </select>
              </div>

              {/* Walk Dynamic */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Walk Dynamic & Fabric Motion
                </label>
                <select
                  value={walkDynamic}
                  onChange={(e) => setWalkDynamic(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-gold-500"
                >
                  <option value="slow_motion_catwalk">Slow-Motion Catwalk (Fabric Sway)</option>
                  <option value="fabric_spin_360">360-Degree Silk Spin (Hem Volume)</option>
                  <option value="dupatta_wind_flutter">Wind-Blown Dupatta Flutter</option>
                  <option value="sunlight_lawn_walk">Golden Hour Sunlight Lawn Walk</option>
                  <option value="festive_barat_turn">Festive Ballroom Chandelier Turn</option>
                </select>
              </div>

              {/* Backdrop */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Architectural Setting / Backdrop
                </label>
                <select
                  value={backdropSetting}
                  onChange={(e) => setBackdropSetting(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-gold-500"
                >
                  <option value="shalimar_bagh">Shalimar Bagh Mughal Marble Veranda</option>
                  <option value="minimalist_concrete_runway">Minimalist Concrete Runway (Modern)</option>
                  <option value="haveli_courtyard">Old Lahore Haveli Courtyard</option>
                  <option value="studio_amber_spotlight">Studio Obsidian & Amber Spotlight</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="block font-bold text-brand-900 mb-1">
                  Video Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["9:16", "16:9", "1:1"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 px-1 rounded-xl font-mono text-xs font-bold border transition-all ${
                        aspectRatio === ratio
                          ? "bg-brand-950 text-gold-400 border-gold-500 shadow-sm"
                          : "bg-sand-50 text-sand-700 border-sand-300 hover:bg-sand-100"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Synthesized Prompt Box */}
            <div className="p-4 rounded-2xl bg-brand-950 text-sand-200 text-xs space-y-1.5 border border-gold-500/20">
              <div className="flex items-center justify-between text-[10px] text-gold-400 font-mono uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-gold-400" /> Google Veo 3 Live Prompt Stream
                </span>
                <span>4K • 60 FPS</span>
              </div>
              <p className="text-[11px] text-sand-300 font-mono leading-relaxed italic">
                "{livePromptPreview}"
              </p>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-brand-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-brand-950 ${generating ? "animate-spin" : "animate-pulse"}`} />
              <span>{generating ? "Synthesizing Model Video with Google Veo 3..." : "Generate AI Model Runway Video (Veo 3)"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Video Player & Publishing Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Video Player Card */}
          <div className="bg-brand-950 text-sand-50 rounded-3xl border border-gold-500/30 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-sand-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-sand-50">Veo 3 Studio Output</h3>
              </div>
              <span className="text-[10px] font-mono text-gold-400 bg-sand-900 px-2 py-0.5 rounded">
                READY
              </span>
            </div>

            {/* Responsive Video Container */}
            <div className="relative w-full aspect-[9/16] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-black border border-sand-800 shadow-inner flex items-center justify-center">
              {generating ? (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gold-400 font-mono tracking-widest uppercase">
                    Synthesizing Veo 3 Video...
                  </span>
                  <p className="text-[10px] text-sand-400 max-w-xs">
                    Computing photorealistic Pakistani fabric movement, drape physics, and high-fashion gait.
                  </p>
                </div>
              ) : (
                <video
                  src={generatedVideo.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Video Details & Attribution */}
            <div className="text-xs space-y-1 pt-1 border-t border-sand-800">
              <div className="flex items-center justify-between text-sand-300">
                <span>Model Outfit:</span>
                <span className="font-bold text-gold-400 truncate max-w-[200px]">
                  {selectedProduct?.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-sand-400 text-[11px]">
                <span>Engine:</span>
                <span className="font-mono">{generatedVideo.engineUsed}</span>
              </div>
            </div>

            {/* Publishing Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handlePublish(true)}
                disabled={publishing}
                className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-brand-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Film className="w-4 h-4 text-brand-950" />
                <span>Publish to Storefront Watch & Buy Reels</span>
              </button>

              <button
                onClick={() => handlePublish(false)}
                disabled={publishing}
                className="w-full py-2.5 px-4 rounded-xl bg-sand-900 hover:bg-sand-850 text-sand-200 border border-sand-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-gold-400" />
                <span>Attach to Product Page Only</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={generatedVideo.videoUrl}
                  download="tauheed-veo3-walk.mp4"
                  target="_blank"
                  className="py-2 px-3 rounded-xl bg-brand-900 hover:bg-brand-850 border border-sand-800 text-sand-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <Download className="w-3.5 h-3.5 text-gold-400" />
                  <span>Download MP4</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="py-2 px-3 rounded-xl bg-brand-900 hover:bg-brand-850 border border-sand-800 text-sand-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Copy AI Caption</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Shoppable Reels Counter */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-sand-100 pb-2">
              <span className="font-bold text-brand-950 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-gold-600" />
                Active Storefront Video Reels
              </span>
              <span className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                {reels.length} Active
              </span>
            </div>
            <div className="space-y-2">
              {reels.slice(0, 3).map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="font-medium text-brand-900 truncate max-w-[200px]">{r.title}</span>
                  <span className="text-[10px] text-gold-700 font-bold">Watch & Buy</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
