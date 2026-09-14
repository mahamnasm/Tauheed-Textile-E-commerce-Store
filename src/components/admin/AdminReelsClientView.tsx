"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Video,
  UploadCloud,
  Film,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Plus,
  Shirt,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

interface ProductOption {
  id: string;
  title: string;
  slug: string;
  fabric: string;
  basePrice: number;
  videoUrl?: string | null;
  images: { url: string }[];
}

interface ReelItem {
  id: string;
  title: string;
  videoUrl: string;
  displayOrder: number;
  isActive: boolean;
  product: {
    id: string;
    title: string;
    slug: string;
    fabric: string;
    basePrice: number;
    images: { url: string }[];
  };
}

interface AdminReelsClientViewProps {
  initialReels: ReelItem[];
  products: ProductOption[];
}

export default function AdminReelsClientView({
  initialReels,
  products,
}: AdminReelsClientViewProps) {
  const [reels, setReels] = useState<ReelItem[]>(initialReels);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [reelTitle, setReelTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showOnHomeReels, setShowOnHomeReels] = useState(true);

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activePreviewVideo, setActivePreviewVideo] = useState<string>(
    initialReels[0]?.videoUrl || "/assets/runway-walk-1.mp4"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Handle direct file upload from PC or Mobile phone
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov)$/i)) {
      toast.error("Please upload a valid MP4 or WebM video file.");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading runway video from your device...");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const uploadedUrl = data.url || data.urls?.[0];
      setVideoUrl(uploadedUrl);
      setActivePreviewVideo(uploadedUrl);
      if (!reelTitle && selectedProduct) {
        setReelTitle(`${selectedProduct.title} Runway Walk`);
      }

      toast.success("Video uploaded successfully!", { id: toastId, icon: "🎬" });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload video", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  // Handle save & attach reel
  const handleSaveReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) {
      toast.error("Please upload a video or paste a video URL first.");
      return;
    }
    if (!selectedProductId) {
      toast.error("Please select a target dress.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reelTitle || `${selectedProduct?.title || "Luxury"} Runway Reel`,
          videoUrl,
          productId: selectedProductId,
          attachToProduct: true,
          isActive: true,
          displayOrder: reels.length + 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save reel");

      toast.success("Runway video saved and attached to dress!", { icon: "✨" });

      if (data.reel) {
        setReels([data.reel, ...reels]);
      }
      setVideoUrl("");
      setReelTitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save reel");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete reel
  const handleDeleteReel = async (reelId: string) => {
    if (!confirm("Are you sure you want to remove this runway reel from the storefront?")) return;

    try {
      const res = await fetch(`/api/admin/reels?id=${reelId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      setReels(reels.filter((r) => r.id !== reelId));
      toast.success("Runway reel removed.");
    } catch (err: any) {
      toast.error(err.message || "Could not delete reel");
    }
  };

  return (
    <div className="space-y-8 text-sand-950 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-800 bg-gold-100 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 font-mono">
              <Film className="w-3.5 h-3.5 text-gold-700" />
              Manual Runway Video Center
            </span>
            <span className="text-[10px] font-mono bg-brand-900 text-gold-300 px-2 py-0.5 rounded font-bold">
              DIRECT MP4 UPLOAD
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Runway Reels & Videos
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Upload your real catwalk and dress videos directly from your mobile phone or computer. Attach them to any dress and stream them on your homepage Watch & Buy reels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Shirt className="w-3.5 h-3.5 text-gold-700" />
            <span>Manage Dresses</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Upload Form (Left) & Live Stage + Reels (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Video Uploader (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-sand-100 pb-3">
              <h2 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gold-500 text-brand-950 text-xs font-bold flex items-center justify-center">
                  +
                </span>
                <span>Upload New Runway Video</span>
              </h2>
              <p className="text-xs text-brand-500 mt-0.5">
                Upload authentic catwalk clips (MP4 / WebM) for any dress
              </p>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4">
              {/* 1. Target Dress Selection */}
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1.5">
                  1. Select Dress for this Video
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p && !reelTitle) {
                      setReelTitle(`${p.title} Runway Walk`);
                    }
                  }}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-brand-950 focus:outline-none focus:border-gold-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — PKR {p.basePrice?.toLocaleString()} ({p.fabric})
                    </option>
                  ))}
                </select>

                {/* Selected Dress Preview Card */}
                {selectedProduct && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-sand-50 border border-sand-200 flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-xl bg-sand-200 overflow-hidden shrink-0">
                      <Image
                        src={selectedProduct.images[0]?.url || "/assets/prod-nafasat.jpg"}
                        alt={selectedProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs truncate text-brand-950">{selectedProduct.title}</h4>
                      <p className="text-[10px] text-brand-500 truncate">{selectedProduct.fabric}</p>
                      <span className="text-[11px] font-serif font-bold text-emerald-700">
                        PKR {selectedProduct.basePrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Direct MP4 Video File Upload */}
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1.5">
                  2. Upload MP4 Video File (From Phone or Computer)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    videoUrl
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-sand-300 hover:border-gold-500 bg-sand-50/70 hover:bg-sand-100/80"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                      <>
                        <RefreshCw className="w-8 h-8 text-gold-600 animate-spin" />
                        <span className="text-xs font-bold text-gold-800">
                          Uploading video from device...
                        </span>
                      </>
                    ) : videoUrl ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-800">
                          Video Uploaded Successfully!
                        </span>
                        <span className="text-[10px] font-mono text-sand-500 truncate max-w-xs">
                          {videoUrl}
                        </span>
                        <span className="text-[10px] text-gold-700 underline font-bold mt-1">
                          Click to replace with a different video
                        </span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-sand-400 group-hover:text-gold-600" />
                        <span className="text-xs font-bold text-brand-950">
                          Click to Select Video File from Mobile / PC
                        </span>
                        <p className="text-[10px] text-sand-500">
                          Supports MP4, WebM, MOV. Ideal for 9:16 vertical reels.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Or Paste Video URL */}
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Or Paste Video URL (Optional)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    if (e.target.value) setActivePreviewVideo(e.target.value);
                  }}
                  placeholder="e.g. /assets/runway-walk-1.mp4 or https://..."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-brand-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* 4. Reel Title */}
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">
                  Reel Title
                </label>
                <input
                  type="text"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. Gul-e-Noor Luxury Silk Runway Catwalk"
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2.5 text-xs text-brand-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* 5. Publish Settings Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnHomeReels}
                    onChange={(e) => setShowOnHomeReels(e.target.checked)}
                    className="w-4 h-4 rounded border-sand-300 text-gold-600 focus:ring-gold-500 accent-gold-500"
                  />
                  <span className="text-xs text-brand-800 font-medium">
                    Show in Homepage Watch & Buy Reels (Shoppable Video)
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-brand-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-950" />
                    <span>Saving Video to Dress...</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 text-brand-950" />
                    <span>Save & Publish Runway Video</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Player & Existing Reels (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Preview Stage */}
          <div className="bg-brand-950 text-sand-50 rounded-3xl border border-gold-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-sand-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-serif font-bold text-sm text-sand-50">
                  Live Video Player Stage
                </h3>
              </div>
              <span className="text-[10px] font-mono text-gold-400 bg-sand-900 px-2 py-0.5 rounded">
                ACTIVE
              </span>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-[9/16] max-h-[440px] mx-auto rounded-2xl overflow-hidden bg-black border border-sand-800 shadow-inner flex items-center justify-center">
              {activePreviewVideo ? (
                <video
                  key={activePreviewVideo}
                  src={activePreviewVideo}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center text-xs text-sand-400">
                  Select or upload a video to preview
                </div>
              )}
            </div>
          </div>

          {/* Existing Storefront Reels List */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-brand-950">
                  Active Runway Reels on Storefront
                </h3>
                <p className="text-xs text-brand-500">
                  {reels.length} Reels Streaming on Homepage
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {reels.length === 0 ? (
                <div className="p-8 text-center text-xs text-sand-400">
                  No runway reels active yet. Upload your first video above!
                </div>
              ) : (
                reels.map((reel) => (
                  <div
                    key={reel.id}
                    className="p-3 rounded-2xl border border-sand-200 bg-sand-50/70 flex items-center justify-between gap-3 hover:bg-sand-100/70 transition-colors"
                  >
                    <div
                      onClick={() => setActivePreviewVideo(reel.videoUrl)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative w-12 h-14 rounded-xl bg-black overflow-hidden shrink-0 border border-sand-300">
                        <video
                          src={reel.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs truncate text-brand-950">
                          {reel.title}
                        </h4>
                        <p className="text-[10px] text-brand-500 truncate">
                          {reel.product?.title || "Dress"} • {reel.product?.fabric}
                        </p>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold block">
                          PKR {reel.product?.basePrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteReel(reel.id)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                        title="Delete Reel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
