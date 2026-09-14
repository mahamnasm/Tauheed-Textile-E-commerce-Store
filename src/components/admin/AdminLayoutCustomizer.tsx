"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sliders, 
  Video, 
  Image as ImageIcon, 
  Layers, 
  Check, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  MapPin,
  Play
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SiteLayoutSettings } from "@/lib/settings";

interface AdminLayoutCustomizerProps {
  initialSettings: SiteLayoutSettings;
  initialVideos: any[];
  products: any[];
}

const HERO_MEDIA_PRESETS = [
  { label: "Haute Couture Peach Editorial", url: "/assets/hero-model.jpg", type: "IMAGE" },
  { label: "Emerald Chiffon Model", url: "/assets/reel-1.jpg", type: "IMAGE" },
  { label: "Pastel Luxury Lawn Model", url: "/assets/reel-2.jpg", type: "IMAGE" },
  { label: "Al-Hassan Noir Model", url: "/assets/prod-alhassan.jpg", type: "IMAGE" },
  { label: "Armani Schiffli Lawn Model", url: "/assets/prod-armani.jpg", type: "IMAGE" },
  { label: "Noor-e-Jahan Bridal Barat Model", url: "/assets/prod-bridal.jpg", type: "IMAGE" },
  { label: "Sample Luxury Video Reel (MP4)", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", type: "VIDEO" },
];

export default function AdminLayoutCustomizer({
  initialSettings,
  initialVideos,
  products,
}: AdminLayoutCustomizerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"layout" | "hero" | "videos" | "contact">("layout");
  const [settings, setSettings] = useState<SiteLayoutSettings>(initialSettings);
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // New Video State
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoProductId, setNewVideoProductId] = useState(products[0]?.id || "");
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Direct Product Video Update State
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [productVideoUrl, setProductVideoUrl] = useState(products[0]?.videoUrl || "");
  const [isUpdatingProdVideo, setIsUpdatingProdVideo] = useState(false);

  const handleProductSelectChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    setProductVideoUrl(prod?.videoUrl || "");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSuccessMsg("Website layout settings successfully saved and applied live!");
      setTimeout(() => setSuccessMsg(""), 4000);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update layout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoUrl || !newVideoProductId) return;

    setIsAddingVideo(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newVideo: {
            title: newVideoTitle,
            videoUrl: newVideoUrl,
            productId: newVideoProductId,
            displayOrder: videos.length,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add video reel");

      setVideos(data.videos || []);
      setNewVideoTitle("");
      setNewVideoUrl("");
      setSuccessMsg("New shoppable video reel attached to product!");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add video");
    } finally {
      setIsAddingVideo(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to remove this video reel?")) return;

    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteVideoId: videoId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete video");

      setVideos(data.videos || []);
      setSuccessMsg("Video reel removed.");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove video");
    }
  };

  const handleSaveProductVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setIsUpdatingProdVideo(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updateProductVideo: {
            productId: selectedProductId,
            videoUrl: productVideoUrl,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product video");

      setSuccessMsg("Product video URL updated successfully! Customer can now view it on the product page.");
      setTimeout(() => setSuccessMsg(""), 3000);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update product video");
    } finally {
      setIsUpdatingProdVideo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Storefront Design Engine</span>
          <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Website Layout & Media Customizer</h1>
          <p className="text-xs text-brand-600 mt-1">
            Customize homepage sections, hero banners, shoppable video reels, and brand contacts in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold-700" /> View Live Storefront
          </Link>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-gold-400" />
            {isSaving ? "Saving Live..." : "Save Layout Changes"}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-maroon-50 border border-maroon-200 text-maroon-800 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-sand-300 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("layout")}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "layout"
              ? "border-gold-600 text-gold-700 bg-sand-50"
              : "border-transparent text-brand-700 hover:text-brand-950"
          }`}
        >
          <Layers className="w-4 h-4" /> Homepage Section Toggles
        </button>

        <button
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "hero"
              ? "border-gold-600 text-gold-700 bg-sand-50"
              : "border-transparent text-brand-700 hover:text-brand-950"
          }`}
        >
          <Sparkles className="w-4 h-4" /> Hero Banner & Announcement
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "videos"
              ? "border-gold-600 text-gold-700 bg-sand-50"
              : "border-transparent text-brand-700 hover:text-brand-950"
          }`}
        >
          <Video className="w-4 h-4" /> Product Videos & Shoppable Reels
        </button>

        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "contact"
              ? "border-gold-600 text-gold-700 bg-sand-50"
              : "border-transparent text-brand-700 hover:text-brand-950"
          }`}
        >
          <Phone className="w-4 h-4" /> Store Contacts & WhatsApp
        </button>
      </div>

      {/* TAB 1: SECTION TOGGLES & ORDERING */}
      {activeTab === "layout" && (
        <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-950">Homepage Sections Layout & Visibility</h3>
            <p className="text-xs text-brand-600">
              Toggle visibility of individual sections on the homepage. Changes take effect on the live store immediately after saving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hero Section Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">1. Hero Haute Couture Showcase</h4>
                <p className="text-[11px] text-brand-500">Editorial model background, main brand typography, and primary CTA buttons</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showHero: !s.showHero }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showHero ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showHero ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Curated Categories Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">2. Curated Categories Showcase</h4>
                <p className="text-[11px] text-brand-500">6-category visual navigation (Lawn, Chiffon, Pret, Wedding, Unstitched, Sale)</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showCategories: !s.showCategories }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showCategories ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showCategories ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Trending Products Feed Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">3. Interactive Product Feed</h4>
                <p className="text-[11px] text-brand-500">Trending, New Arrivals, and Bestsellers catalog tabs with quick-bag & modal</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showTrending: !s.showTrending }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showTrending ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showTrending ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Campaign Lookbook Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">4. Campaign Lookbook & Spotlight</h4>
                <p className="text-[11px] text-brand-500">Full-bleed editorial cards highlighting Zehra Chiffon and Gul-e-Noor Lawn</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showLookbook: !s.showLookbook }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showLookbook ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showLookbook ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Shoppable Video Reels Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">5. Runway Video Reels (Watch & Buy)</h4>
                <p className="text-[11px] text-brand-500">Video reels player linked directly to product checkout</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showVideos: !s.showVideos }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showVideos ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showVideos ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Customer Reviews Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">6. Customer Testimonials & Reviews</h4>
                <p className="text-[11px] text-brand-500">Verified buyer testimonials, ratings, and social proof</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showReviews: !s.showReviews }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showReviews ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showReviews ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>

            {/* Brand Heritage Banner Toggle */}
            <div className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between sm:col-span-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-brand-950">7. Brand Heritage & Craftsmanship Banner</h4>
                <p className="text-[11px] text-brand-500">Footer-adjacent signature banner celebrating centuries of Pakistani needlework</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showHeritage: !s.showHeritage }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${
                  settings.showHeritage ? "bg-emerald-700 text-white" : "bg-sand-300 text-brand-700"
                }`}
              >
                {settings.showHeritage ? <><Eye className="w-3.5 h-3.5" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO BANNER & ANNOUNCEMENT */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-950">Hero Showcase & Announcement Bar Content</h3>
            <p className="text-xs text-brand-600">Customize the headline, subtitle, buttons, and background picture or video</p>
          </div>

          {/* Announcement Bar */}
          <div className="space-y-3 p-4 rounded-xl bg-sand-50 border border-sand-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-brand-950">Top Announcement Bar Text</label>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={settings.announcementEnabled}
                  onChange={(e) => setSettings((s) => ({ ...s, announcementEnabled: e.target.checked }))}
                  className="rounded text-gold-600 focus:ring-gold-500"
                />
                <span className="font-medium text-brand-900">Enable Ticker</span>
              </label>
            </div>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings((s) => ({ ...s, announcementText: e.target.value }))}
              className="w-full p-2.5 border border-sand-300 rounded-lg bg-white text-xs font-medium text-brand-900"
            />
          </div>

          {/* Hero Typography */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-brand-950 border-b border-sand-100 pb-1">
              Hero Copywriting
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={settings.heroBadge}
                  onChange={(e) => setSettings((s) => ({ ...s, heroBadge: e.target.value }))}
                  placeholder="e.g. Festive Edit 2026 — Live Now"
                  className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs text-brand-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings((s) => ({ ...s, heroTitle: e.target.value }))}
                  placeholder="e.g. Elegance Woven with Pure Heritage"
                  className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs font-serif font-bold text-brand-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1">Subtitle / Descriptive Copy</label>
              <textarea
                rows={2}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings((s) => ({ ...s, heroSubtitle: e.target.value }))}
                className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs text-brand-900"
              />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                <span className="font-bold text-xs text-brand-900 block">Primary CTA Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={settings.heroPrimaryBtnText}
                  onChange={(e) => setSettings((s) => ({ ...s, heroPrimaryBtnText: e.target.value }))}
                  className="w-full p-2 border border-sand-300 rounded-lg bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Link (/shop?category=...)"
                  value={settings.heroPrimaryBtnLink}
                  onChange={(e) => setSettings((s) => ({ ...s, heroPrimaryBtnLink: e.target.value }))}
                  className="w-full p-2 border border-sand-300 rounded-lg bg-white text-xs font-mono"
                />
              </div>

              <div className="p-3 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2">
                <span className="font-bold text-xs text-brand-900 block">Secondary CTA Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={settings.heroSecondaryBtnText}
                  onChange={(e) => setSettings((s) => ({ ...s, heroSecondaryBtnText: e.target.value }))}
                  className="w-full p-2 border border-sand-300 rounded-lg bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Link (/shop?category=...)"
                  value={settings.heroSecondaryBtnLink}
                  onChange={(e) => setSettings((s) => ({ ...s, heroSecondaryBtnLink: e.target.value }))}
                  className="w-full p-2 border border-sand-300 rounded-lg bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hero Background Media (Image or Video) */}
          <div className="space-y-4 pt-2 border-t border-sand-200">
            <h4 className="font-serif font-bold text-sm text-brand-950 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-gold-600" /> Hero Background Media (Picture or Video)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Media Format</label>
                <select
                  value={settings.heroMediaType}
                  onChange={(e) => setSettings((s) => ({ ...s, heroMediaType: e.target.value as any }))}
                  className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs font-medium"
                >
                  <option value="IMAGE">Still High-Fashion Editorial Image</option>
                  <option value="VIDEO">Background Video Loop (MP4 or WebM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-900 mb-1">Media URL</label>
                <input
                  type="text"
                  value={settings.heroMediaUrl}
                  onChange={(e) => setSettings((s) => ({ ...s, heroMediaUrl: e.target.value }))}
                  placeholder="/assets/hero-model.jpg or https://..."
                  className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs font-mono"
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-bold text-brand-800 block mb-1.5">
                Quick Select From Generated Studio Assets:
              </span>
              <div className="flex flex-wrap gap-2">
                {HERO_MEDIA_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, heroMediaUrl: p.url, heroMediaType: p.type as any }))}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1.5 ${
                      settings.heroMediaUrl === p.url
                        ? "bg-gold-600 text-white border-gold-600 shadow-sm"
                        : "bg-sand-50 hover:bg-sand-100 border-sand-300 text-brand-900"
                    }`}
                  >
                    {p.type === "VIDEO" ? <Video className="w-3 h-3 text-gold-400" /> : <ImageIcon className="w-3 h-3 text-gold-600" />}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT VIDEOS & SHOPPABLE REELS */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          {/* Section A: Direct Product Video Integration */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-950 flex items-center gap-2">
                <Video className="w-5 h-5 text-gold-700" /> Direct Product Video Integration
              </h3>
              <p className="text-xs text-brand-600">
                Attach a runway walk, lookbook video, or reel to ANY product in your store. When attached, a "Watch Video Reel" button & video player appears right on the product page.
              </p>
            </div>

            <form onSubmit={handleSaveProductVideo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-brand-900 mb-1">Select Product from Catalog *</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelectChange(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-sand-50 text-xs font-medium text-brand-950"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.sku}] {p.title} {p.videoUrl ? "(Has Video)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Product Video URL (MP4, YouTube, or Reel) *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://example.com/dress-walk.mp4 or https://youtu.be/..."
                    value={productVideoUrl}
                    onChange={(e) => setProductVideoUrl(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProdVideo}
                  className="px-5 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow"
                >
                  <Save className="w-3.5 h-3.5 text-gold-400" />
                  {isUpdatingProdVideo ? "Updating..." : "Save Product Video URL"}
                </button>
              </div>
            </form>
          </div>

          {/* Section B: Homepage Shoppable Video Reels (Watch & Buy) */}
          <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-brand-950 flex items-center gap-2">
                <Play className="w-5 h-5 text-gold-700" /> Homepage Shoppable Runway Reels ({videos.length})
              </h3>
              <p className="text-xs text-brand-600">
                Shoppable video clips displayed on the homepage lookbook. Customers can watch the model in motion and tap "Shop This Look".
              </p>
            </div>

            {/* List of current videos */}
            {videos.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-sand-50 border border-dashed border-sand-300 text-xs text-brand-600">
                No video reels added yet. Use the form below to attach a video reel to any product!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((vid) => (
                  <div key={vid.id} className="p-4 rounded-xl border border-sand-200 bg-sand-50/60 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded bg-brand-950 text-gold-300 text-[10px] font-bold uppercase">
                          Reel
                        </span>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1 rounded text-maroon-600 hover:bg-maroon-50"
                          title="Delete reel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-brand-950 mt-1">{vid.title}</h4>
                      <p className="text-[11px] text-brand-600 truncate font-mono">{vid.videoUrl}</p>
                    </div>

                    <div className="pt-2 border-t border-sand-200 text-[11px] flex items-center justify-between">
                      <span className="text-brand-800 font-bold truncate max-w-[180px]">{vid.product?.title || "Linked Product"}</span>
                      <span className="text-gold-700 font-mono font-bold">Rs. {vid.product?.basePrice?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form: Add New Video Reel */}
            <form onSubmit={handleAddVideo} className="p-4 rounded-xl bg-sand-50/80 border border-sand-200 space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-brand-950">Add New Shoppable Video Reel</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-900 mb-1">Reel Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zehra Chiffon Runway Walk"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Video Stream / MP4 URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://.../video.mp4"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Linked Catalog Product *</label>
                  <select
                    value={newVideoProductId}
                    onChange={(e) => setNewVideoProductId(e.target.value)}
                    className="w-full p-2.5 border border-sand-300 rounded-lg bg-white font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (PKR {p.basePrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isAddingVideo}
                  className="px-4 py-2 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingVideo ? "Adding..." : "Add Video Reel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: STORE CONTACTS & WHATSAPP */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-950">Storewide Contact Information</h3>
            <p className="text-xs text-brand-600">
              Update your customer care WhatsApp hotline, email, and flagship studio address. Updates automatically reflect across the Header, Footer, and Checkout page!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-700" /> Official WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={settings.contactWhatsApp}
                onChange={(e) => setSettings((s) => ({ ...s, contactWhatsApp: e.target.value }))}
                placeholder="0340 0262732"
                className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-xs font-bold text-brand-950"
              />
              <span className="text-[10px] text-brand-500 mt-1 block">
                Formatted as 0340 0262732. Automatically generates click-to-chat links for customers.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-700" /> Customer Support Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                placeholder="care@tauheedtextile.com"
                className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-xs text-brand-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-900 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-700" /> Flagship Studio Physical Address
              </label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => setSettings((s) => ({ ...s, contactAddress: e.target.value }))}
                placeholder="Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan"
                className="w-full p-3 border border-sand-300 rounded-xl bg-sand-50 text-xs text-brand-950"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
