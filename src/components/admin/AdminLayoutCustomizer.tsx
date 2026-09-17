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
  Play,
  Megaphone,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Globe,
  Share2,
  HelpCircle,
  Palette,
  Layout,
  RefreshCw,
  Smartphone,
  Monitor,
  Upload,
  MessageCircle,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SiteLayoutSettings } from "@/lib/settings";
import DestinationLinkSelector from "@/components/admin/DestinationLinkSelector";
import UniversalVideoPlayer from "@/components/common/UniversalVideoPlayer";

interface AdminLayoutCustomizerProps {
  initialSettings: SiteLayoutSettings;
  initialVideos: any[];
  products: any[];
  categories?: any[];
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
  categories = [],
}: AdminLayoutCustomizerProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "announcement" | "marquee" | "hero" | "sections" | "heritage" | "perks" | "contact" | "social" | "footer" | "videos" | "preview"
  >("announcement");

  const [settings, setSettings] = useState<SiteLayoutSettings>(initialSettings);
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [isSaving, setIsSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  // Per-banner preview mode: Desktop vs Mobile simulator
  const [bannerPreviewMode, setBannerPreviewMode] = useState<Record<number, "desktop" | "mobile">>({
    1: "desktop",
    2: "desktop",
    3: "desktop",
    4: "desktop",
  });

  const toggleBannerMode = (index: number) => {
    setBannerPreviewMode((prev) => ({
      ...prev,
      [index]: prev[index] === "desktop" ? "mobile" : "desktop",
    }));
  };

  // New Video Reel State
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoProductId, setNewVideoProductId] = useState(products[0]?.id || "");
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  const [uploadingBanner, setUploadingBanner] = useState<number | null>(null);

  // Field change helper
  const updateField = <K extends keyof SiteLayoutSettings>(key: K, value: SiteLayoutSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleBannerFileUpload = async (bannerIndex: 1 | 2 | 3 | 4, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(bannerIndex);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      const uploadedUrl = data.url || data.urls?.[0];
      if (uploadedUrl) {
        if (bannerIndex === 1) updateField("banner1Image", uploadedUrl);
        else if (bannerIndex === 2) updateField("banner2Image", uploadedUrl);
        else if (bannerIndex === 3) updateField("banner3Image", uploadedUrl);
        else if (bannerIndex === 4) updateField("banner4Image", uploadedUrl);

        toast.success(`Banner ${bannerIndex} uploaded successfully!`, { icon: "📸" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload banner image");
    } finally {
      setUploadingBanner(null);
      e.target.value = "";
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      toast.success("Website customizations applied live to storefront!", { icon: "âœ¨" });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update layout settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle || !newVideoUrl || !newVideoProductId) {
      toast.error("Please fill in video title, video URL, and select a product.");
      return;
    }

    setIsAddingVideo(true);
    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newVideo: {
            title: newVideoTitle,
            videoUrl: newVideoUrl,
            productId: newVideoProductId,
            displayOrder: videos.length.toString(),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add video reel");

      setVideos(data.videos || []);
      setNewVideoTitle("");
      setNewVideoUrl("");
      toast.success("Shoppable runway video added to storefront!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to add video reel");
    } finally {
      setIsAddingVideo(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to remove this video reel from the homepage?")) return;

    try {
      const res = await fetch("/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteVideoId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete video");

      setVideos(data.videos || []);
      toast.success("Video reel deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    }
  };

  const tabs = [
    { id: "announcement", label: "Announcement Bar", icon: Megaphone, badge: "Top" },
    { id: "marquee", label: "Festive Ticker", icon: Sparkles, badge: "Live" },
    { id: "hero", label: "Hero Banner & Media", icon: ImageIcon, badge: "Main" },
    { id: "sections", label: "Homepage Sections", icon: Layers },
    { id: "heritage", label: "Brand Heritage Story", icon: Layout },
    { id: "perks", label: "Pakistan Trust Perks", icon: ShieldCheck },
    { id: "contact", label: "WhatsApp & Studio", icon: Phone },
    { id: "social", label: "Social Media Links", icon: Share2 },
    { id: "footer", label: "Footer & Copyright", icon: Globe },
    { id: "videos", label: "Shoppable Reels", icon: Video },
    { id: "preview", label: "Live Visual Preview", icon: Eye, badge: "Interactive" },
  ] as const;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sand-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-800 text-xs font-bold uppercase tracking-wider">
              Complete Store Customizer
            </span>
            <span className="text-xs text-brand-500 font-medium">100% Live Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-brand-950 mt-1">
            Website Customization Suite
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 mt-0.5">
            Modify announcements, banners, headlines, WhatsApp contact, trust perks, and homepage sections with 1-click live sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-sand-300 text-brand-800 hover:bg-sand-50 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-brand-950 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 shrink-0 font-serif"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Applying Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Apply Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand-200 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-brand-950 text-sand-50 shadow-md"
                  : "bg-white text-brand-700 hover:bg-sand-100 border border-sand-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-brand-500"}`} />
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest font-mono ${
                    isActive ? "bg-gold-500 text-brand-950 font-black" : "bg-sand-200 text-brand-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANNOUNCEMENT BAR */}
      {activeTab === "announcement" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>📍 Store Location:</span>
                  <span className="text-gold-700 font-bold">Top of every store page (Above Header)</span>
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
                <Megaphone className="w-5 h-5 text-gold-600" />
                Top Announcement Ribbon
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                The top bar displayed across the website above the navigation header.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-sand-50 px-3 py-1.5 rounded-xl border border-sand-200">
              <input
                type="checkbox"
                checked={settings.announcementEnabled}
                onChange={(e) => updateField("announcementEnabled", e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs font-bold text-brand-900">Enable Bar</span>
            </label>
          </div>

          {/* Live In-Place Preview */}
          <div className="space-y-2 p-4 rounded-2xl bg-sand-50/70 border border-sand-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gold-600" />
                <span>Live Storefront Ribbon Simulation</span>
              </span>
              <span className="text-[10px] text-brand-500 font-medium">Updates in real time</span>
            </div>
            <div className={`w-full py-2.5 px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner transition-all duration-300 ${
              settings.announcementTheme === "midnight" ? "bg-[#171717] border-white/10 text-sand-200" :
              settings.announcementTheme === "gold" ? "bg-amber-950 border-amber-800/40 text-amber-200" :
              settings.announcementTheme === "emerald" ? "bg-emerald-950 border-emerald-800/40 text-emerald-200" :
              "bg-rose-950 border-rose-800/40 text-rose-200"
            }`}>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold tracking-wide">{settings.announcementText || "Festive Luxury Collection 2026 Live Now"}</span>
                {settings.announcementSubtext && (
                  <>
                    <span className="opacity-40 hidden sm:inline">|</span>
                    <span className="text-[11px] opacity-90 hidden sm:inline">{settings.announcementSubtext}</span>
                  </>
                )}
              </div>
              <div className="text-[10px] opacity-75 font-mono">
                COD Free Above Rs. {settings.freeShippingThreshold?.toLocaleString() || "5,000"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Main Announcement Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => updateField("announcementText", e.target.value)}
                placeholder="e.g. Festive Luxury Collection 2026 Live Now"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-medium"
              />
              <p className="text-[11px] text-brand-500">Highlighted title text shown with a glowing pulse dot.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Subtext / Secondary Promotion</label>
              <input
                type="text"
                value={settings.announcementSubtext}
                onChange={(e) => updateField("announcementSubtext", e.target.value)}
                placeholder="e.g. Flat 5% Off on Advance Payment Orders"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-medium"
              />
              <p className="text-[11px] text-brand-500">Shown next to the main announcement.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Free Delivery Threshold (Rs.)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => updateField("freeShippingThreshold", parseInt(e.target.value || "0", 10))}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
              <p className="text-[11px] text-brand-500">Cart value required for automatic free shipping.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Optional Banner Click URL</label>
              <input
                type="text"
                value={settings.announcementLink}
                onChange={(e) => updateField("announcementLink", e.target.value)}
                placeholder="/shop?category=sale"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
              <p className="text-[11px] text-brand-500">When visitors click the announcement, take them here.</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Announcement Color Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { id: "midnight", name: "Midnight Noir", bg: "bg-brand-950", border: "border-sand-700", text: "text-sand-300" },
                  { id: "gold", name: "Imperial Gold", bg: "bg-amber-950", border: "border-amber-700", text: "text-amber-300" },
                  { id: "emerald", name: "Festive Emerald", bg: "bg-emerald-950", border: "border-emerald-700", text: "text-emerald-300" },
                  { id: "maroon", name: "Royal Maroon", bg: "bg-rose-950", border: "border-rose-700", text: "text-rose-300" },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => updateField("announcementTheme", th.id as any)}
                    className={`p-3 rounded-2xl border flex items-center gap-2 transition-all ${
                      settings.announcementTheme === th.id
                        ? "border-gold-500 ring-2 ring-gold-400 bg-sand-50"
                        : "border-sand-200 hover:border-sand-400"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${th.bg} ${th.border} border`} />
                    <span className="text-xs font-bold text-brand-950">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FESTIVE MARQUEE TICKER */}
      {activeTab === "marquee" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>📍 Store Location:</span>
                  <span className="text-gold-700 font-bold">Sliding strip directly below the main navigation header</span>
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
                <Sparkles className="w-5 h-5 text-gold-600" />
                Festive Sliding Marquee Ticker
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                A gold animated sliding ticker tape shown across the storefront for sales, drops, and festive notices.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-sand-50 px-3 py-1.5 rounded-xl border border-sand-200">
              <input
                type="checkbox"
                checked={settings.marqueeEnabled}
                onChange={(e) => updateField("marqueeEnabled", e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs font-bold text-brand-900">Enable Ticker</span>
            </label>
          </div>

          {/* Live In-Place Preview with sliding simulation */}
          <div className="space-y-2 p-4 rounded-2xl bg-sand-50/70 border border-sand-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gold-600" />
                <span>Live Sliding Animation Simulation</span>
              </span>
              <span className="text-[10px] text-brand-500 font-medium">Real-time simulation</span>
            </div>
            <div className="w-full bg-gold-500 text-brand-950 py-2.5 px-4 rounded-xl overflow-hidden font-bold text-xs uppercase tracking-widest shadow-inner relative">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
                <span>{settings.marqueeText || "⚡ EID LUXURY LAWN DROP NOW LIVE • CASH ON DELIVERY NATIONWIDE • EXCLUSIVE SWISS VOILE • EXPRESS 2-4 DAY COURIER DISPATCH"}</span>
                <span>{settings.marqueeText || "⚡ EID LUXURY LAWN DROP NOW LIVE • CASH ON DELIVERY NATIONWIDE • EXCLUSIVE SWISS VOILE • EXPRESS 2-4 DAY COURIER DISPATCH"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Marquee Ticker Text</label>
              <textarea
                rows={3}
                value={settings.marqueeText}
                onChange={(e) => updateField("marqueeText", e.target.value)}
                placeholder="⚡ EID LUXURY LAWN DROP NOW LIVE • CASH ON DELIVERY NATIONWIDE • EXCLUSIVE SWISS VOILE & REGAL EMBROIDERY • EXPRESS 2-4 DAY COURIER DISPATCH"
                className="w-full px-4 py-3 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-sans leading-relaxed"
              />
              <p className="text-[11px] text-brand-500">
                Tip: Separate key points with bullets (•) or emojis (⚡, ✨) for luxury editorial styling.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Optional Destination Link</label>
              <input
                type="text"
                value={settings.marqueeLink}
                onChange={(e) => updateField("marqueeLink", e.target.value)}
                placeholder="/shop"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HERO BANNER & MEDIA */}
      {activeTab === "hero" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>📍 Store Location:</span>
                  <span className="text-gold-700 font-bold">First full-screen section visitors see on Homepage</span>
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
                <ImageIcon className="w-5 h-5 text-gold-600" />
                Hero Banner Showcase & Media
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                The massive high-impact showcase that visitors see when first entering the website.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHero}
                onChange={(e) => updateField("showHero", e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs font-bold text-brand-900">Show Hero</span>
            </label>
          </div>

          {/* SECTION: 4 AUTO-MOVING EDITORIAL BANNERS (LIMELIGHT STYLE) */}
          <div className="bg-sand-50 border border-sand-200 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-brand-950 text-[10px] font-black uppercase tracking-wider">
                    Limelight-Style Slider
                  </span>
                  <span className="text-xs font-bold text-brand-950 font-serif">4 Auto-Moving Homepage Banners</span>
                </div>
                <p className="text-xs text-brand-600 mt-1">
                  Upload high-resolution model photos directly from your PC or enter URLs. Customize titles, subtitles, tags, and button links.
                </p>
              </div>
            </div>

            {/* Banner Size Guide for Mobile & Desktop */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-brand-950">
                      Master Banner Creation &amp; Mobile Cropping Guide
                    </h3>
                    <p className="text-xs text-brand-700">
                      Follow these exact canvas dimensions so your models look gorgeous on all iPhones, Androids, and laptops without being cropped.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] bg-amber-200 text-amber-950 font-bold px-3 py-1 rounded-full font-mono shrink-0">
                  📱 Mobile First (~85% of Shoppers)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Mobile Dimension */}
                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      1. Mobile Phone View
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      4:5 Portrait
                    </span>
                  </div>
                  <div className="text-sm font-mono font-black text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
                    1080 × 1350 px
                  </div>
                  <p className="text-[11px] text-brand-600 leading-relaxed">
                    Mobile screens are vertical. Keep the model's head and neck embroidery centered in the canvas.
                  </p>
                </div>

                {/* Desktop Dimension */}
                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950 flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-amber-700" />
                      2. Desktop / PC View
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      16:6 Widescreen
                    </span>
                  </div>
                  <div className="text-sm font-mono font-black text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 text-center">
                    1920 × 750 px
                  </div>
                  <p className="text-[11px] text-brand-600 leading-relaxed">
                    Desktop screens are wide. Left 40% holds headline and buttons; right 60% shows the dress clearly.
                  </p>
                </div>

                {/* Safe Zone Rule */}
                <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      3. The Golden Safe Zone
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      Middle 60%
                    </span>
                  </div>
                  <div className="text-xs text-emerald-900 bg-white p-2 rounded-xl border border-emerald-200 leading-relaxed">
                    Always place model in the <strong>center 60%</strong>. This guarantees her face, dupatta, and embroidery never get cut off on any phone!
                  </div>
                  <p className="text-[10px] text-emerald-800 font-semibold">
                    ✓ Use the [Desktop | Mobile] toggle below on each banner to verify cropping live!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* BANNER 1: FESTIVE SALE */}
              <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-100 pb-2">
                  <span className="text-xs font-bold font-serif text-brand-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#9B3D3D] text-white flex items-center justify-center text-[10px] font-mono">1</span>
                    Banner 1 (Featured Sale Banner)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#9B3D3D] bg-red-50 px-2 py-0.5 rounded-full">
                    Sale Special
                  </span>
                </div>

                {/* Banner 1 Image Preview & Live Simulator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-900">
                      Banner Photo &amp; Live Simulation
                    </label>
                    <div className="flex items-center gap-1 bg-sand-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 1: "desktop" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[1] === "desktop"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop (16:7)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 1: "mobile" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[1] === "mobile"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile (375px)</span>
                      </button>
                    </div>
                  </div>

                  {bannerPreviewMode[1] === "desktop" ? (
                    <div className="relative aspect-[16/7] w-full bg-brand-950 rounded-xl overflow-hidden border border-sand-300 shadow-inner">
                      {settings.banner1Image ? (
                        <Image
                          src={settings.banner1Image}
                          alt="Banner 1"
                          fill
                          className="object-cover object-top sm:object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent flex items-center p-4 pointer-events-none">
                        <div className="max-w-[240px] space-y-1 text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner1Tag || "FESTIVE SALE"}
                            </span>
                            {settings.banner1SaleBadge && (
                              <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-[#9B3D3D] text-white">
                                {settings.banner1SaleBadge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner1Title || "UP TO 50% OFF"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner1Subtitle || "Exclusive seasonal markdowns..."}
                          </p>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-white text-brand-950 text-[9px] font-bold uppercase tracking-wider shadow">
                            {settings.banner1BtnText || "SHOP SALE"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <label className="cursor-pointer px-3 py-1.5 bg-white/95 hover:bg-white text-brand-950 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all">
                          {uploadingBanner === 1 ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-brand-900" />
                              <span>Upload from PC</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingBanner === 1}
                            onChange={(e) => handleBannerFileUpload(1, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <div className="relative w-[240px] aspect-[9/16] max-h-[340px] mx-auto bg-black rounded-[28px] overflow-hidden border-4 border-brand-950 shadow-2xl flex flex-col justify-end">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-brand-950 rounded-full z-20" />
                        {settings.banner1Image ? (
                          <Image
                            src={settings.banner1Image}
                            alt="Banner 1 Mobile"
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                        )}
                        <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1 text-white text-left">
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner1Tag || "FESTIVE SALE"}
                            </span>
                            {settings.banner1SaleBadge && (
                              <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-[#9B3D3D] text-white">
                                {settings.banner1SaleBadge}
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner1Title || "UP TO 50% OFF"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner1Subtitle || "Exclusive seasonal markdowns..."}
                          </p>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-brand-950 text-[8px] font-bold uppercase tracking-wider shadow">
                            {settings.banner1BtnText || "SHOP SALE"}
                          </span>
                        </div>
                        <div className="absolute top-5 right-2 z-20">
                          <label className="cursor-pointer px-2 py-1 bg-white/90 hover:bg-white text-brand-950 text-[10px] font-bold rounded-lg shadow flex items-center gap-1 transition-all">
                            <Upload className="w-3 h-3 text-brand-900" />
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBanner === 1}
                              onChange={(e) => handleBannerFileUpload(1, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-500 font-medium block">
                        📱 375px Mobile View: Verify that model's face is visible and embroidery is clear.
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={settings.banner1Image}
                    onChange={(e) => updateField("banner1Image", e.target.value)}
                    placeholder="/assets/banners/banner-sale.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Banner Tag</label>
                    <input
                      type="text"
                      value={settings.banner1Tag}
                      onChange={(e) => updateField("banner1Tag", e.target.value)}
                      placeholder="FESTIVE SALE"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Sale Badge</label>
                    <input
                      type="text"
                      value={settings.banner1SaleBadge}
                      onChange={(e) => updateField("banner1SaleBadge", e.target.value)}
                      placeholder="UP TO 50% OFF"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 text-[#9B3D3D] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Headline Title</label>
                  <input
                    type="text"
                    value={settings.banner1Title}
                    onChange={(e) => updateField("banner1Title", e.target.value)}
                    placeholder="UP TO 50% OFF"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Subtitle / Caption</label>
                  <input
                    type="text"
                    value={settings.banner1Subtitle}
                    onChange={(e) => updateField("banner1Subtitle", e.target.value)}
                    placeholder="Exclusive seasonal markdowns on luxury stitched & unstitched"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Button Text</label>
                    <input
                      type="text"
                      value={settings.banner1BtnText}
                      onChange={(e) => updateField("banner1BtnText", e.target.value)}
                      placeholder="SHOP SALE"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-bold"
                    />
                  </div>
                  <DestinationLinkSelector
                    label="Banner 1 Landing Destination (Click to Choose)"
                    value={settings.banner1Link}
                    onChange={(v) => updateField("banner1Link", v)}
                    products={products}
                    categories={categories}
                  />
                </div>
              </div>

              {/* BANNER 2: SUMMER LAWN */}
              <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-100 pb-2">
                  <span className="text-xs font-serif font-bold text-brand-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-mono">2</span>
                    Banner 2 (Summer Lawn)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-600 bg-sand-100 px-2 py-0.5 rounded-full">
                    Lawn Drop
                  </span>
                </div>

                {/* Banner 2 Image Preview & Live Simulator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-900">
                      Banner Photo &amp; Live Simulation
                    </label>
                    <div className="flex items-center gap-1 bg-sand-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 2: "desktop" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[2] === "desktop"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop (16:7)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 2: "mobile" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[2] === "mobile"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile (375px)</span>
                      </button>
                    </div>
                  </div>

                  {bannerPreviewMode[2] === "desktop" ? (
                    <div className="relative aspect-[16/7] w-full bg-brand-950 rounded-xl overflow-hidden border border-sand-300 shadow-inner">
                      {settings.banner2Image ? (
                        <Image
                          src={settings.banner2Image}
                          alt="Banner 2"
                          fill
                          className="object-cover object-top sm:object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent flex items-center p-4 pointer-events-none">
                        <div className="max-w-[240px] space-y-1 text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner2Tag || "NEW ARRIVALS 2026"}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner2Title || "SUMMER LAWN '26"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner2Subtitle || "Breathable pure Egyptian cotton lawn..."}
                          </p>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-white text-brand-950 text-[9px] font-bold uppercase tracking-wider shadow">
                            {settings.banner2BtnText || "EXPLORE LAWN"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <label className="cursor-pointer px-3 py-1.5 bg-white/95 hover:bg-white text-brand-950 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all">
                          {uploadingBanner === 2 ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-brand-900" />
                              <span>Upload from PC</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingBanner === 2}
                            onChange={(e) => handleBannerFileUpload(2, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <div className="relative w-[240px] aspect-[9/16] max-h-[340px] mx-auto bg-black rounded-[28px] overflow-hidden border-4 border-brand-950 shadow-2xl flex flex-col justify-end">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-brand-950 rounded-full z-20" />
                        {settings.banner2Image ? (
                          <Image
                            src={settings.banner2Image}
                            alt="Banner 2 Mobile"
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                        )}
                        <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1 text-white text-left">
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner2Tag || "NEW ARRIVALS 2026"}
                            </span>
                          </div>
                          <h4 className="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner2Title || "SUMMER LAWN '26"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner2Subtitle || "Breathable pure Egyptian cotton lawn..."}
                          </p>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-brand-950 text-[8px] font-bold uppercase tracking-wider shadow">
                            {settings.banner2BtnText || "EXPLORE LAWN"}
                          </span>
                        </div>
                        <div className="absolute top-5 right-2 z-20">
                          <label className="cursor-pointer px-2 py-1 bg-white/90 hover:bg-white text-brand-950 text-[10px] font-bold rounded-lg shadow flex items-center gap-1 transition-all">
                            <Upload className="w-3 h-3 text-brand-900" />
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBanner === 2}
                              onChange={(e) => handleBannerFileUpload(2, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-500 font-medium block">
                        📱 375px Mobile View: Verify that model's face is visible and embroidery is clear.
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={settings.banner2Image}
                    onChange={(e) => updateField("banner2Image", e.target.value)}
                    placeholder="/assets/banners/banner-lawn.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Banner Tag</label>
                  <input
                    type="text"
                    value={settings.banner2Tag}
                    onChange={(e) => updateField("banner2Tag", e.target.value)}
                    placeholder="NEW ARRIVALS 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Headline Title</label>
                  <input
                    type="text"
                    value={settings.banner2Title}
                    onChange={(e) => updateField("banner2Title", e.target.value)}
                    placeholder="SUMMER LAWN '26"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Subtitle / Caption</label>
                  <input
                    type="text"
                    value={settings.banner2Subtitle}
                    onChange={(e) => updateField("banner2Subtitle", e.target.value)}
                    placeholder="Breathable pure Egyptian cotton lawn with handcrafted dupattas"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Button Text</label>
                    <input
                      type="text"
                      value={settings.banner2BtnText}
                      onChange={(e) => updateField("banner2BtnText", e.target.value)}
                      placeholder="EXPLORE LAWN"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-bold"
                    />
                  </div>
                  <DestinationLinkSelector
                    label="Banner 2 Landing Destination (Click to Choose)"
                    value={settings.banner2Link}
                    onChange={(v) => updateField("banner2Link", v)}
                    products={products}
                    categories={categories}
                  />
                </div>
              </div>

              {/* BANNER 3: ROYAL CHIFFON */}
              <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-100 pb-2">
                  <span className="text-xs font-serif font-bold text-brand-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-mono">3</span>
                    Banner 3 (Luxury Formals & Chiffon)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-600 bg-sand-100 px-2 py-0.5 rounded-full">
                    Formals
                  </span>
                </div>

                {/* Banner 3 Image Preview & Live Simulator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-900">
                      Banner Photo &amp; Live Simulation
                    </label>
                    <div className="flex items-center gap-1 bg-sand-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 3: "desktop" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[3] === "desktop"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop (16:7)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 3: "mobile" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[3] === "mobile"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile (375px)</span>
                      </button>
                    </div>
                  </div>

                  {bannerPreviewMode[3] === "desktop" ? (
                    <div className="relative aspect-[16/7] w-full bg-brand-950 rounded-xl overflow-hidden border border-sand-300 shadow-inner">
                      {settings.banner3Image ? (
                        <Image
                          src={settings.banner3Image}
                          alt="Banner 3"
                          fill
                          className="object-cover object-top sm:object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent flex items-center p-4 pointer-events-none">
                        <div className="max-w-[240px] space-y-1 text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner3Tag || "LUXURY FORMALS"}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner3Title || "ROYAL CHIFFON EDIT"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner3Subtitle || "Hand-embellished tilla, sequins..."}
                          </p>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-white text-brand-950 text-[9px] font-bold uppercase tracking-wider shadow">
                            {settings.banner3BtnText || "SHOP FORMALS"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <label className="cursor-pointer px-3 py-1.5 bg-white/95 hover:bg-white text-brand-950 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all">
                          {uploadingBanner === 3 ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-brand-900" />
                              <span>Upload from PC</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingBanner === 3}
                            onChange={(e) => handleBannerFileUpload(3, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <div className="relative w-[240px] aspect-[9/16] max-h-[340px] mx-auto bg-black rounded-[28px] overflow-hidden border-4 border-brand-950 shadow-2xl flex flex-col justify-end">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-brand-950 rounded-full z-20" />
                        {settings.banner3Image ? (
                          <Image
                            src={settings.banner3Image}
                            alt="Banner 3 Mobile"
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                        )}
                        <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1 text-white text-left">
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner3Tag || "LUXURY FORMALS"}
                            </span>
                          </div>
                          <h4 className="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner3Title || "ROYAL CHIFFON EDIT"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner3Subtitle || "Hand-embellished tilla, sequins..."}
                          </p>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-brand-950 text-[8px] font-bold uppercase tracking-wider shadow">
                            {settings.banner3BtnText || "SHOP FORMALS"}
                          </span>
                        </div>
                        <div className="absolute top-5 right-2 z-20">
                          <label className="cursor-pointer px-2 py-1 bg-white/90 hover:bg-white text-brand-950 text-[10px] font-bold rounded-lg shadow flex items-center gap-1 transition-all">
                            <Upload className="w-3 h-3 text-brand-900" />
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBanner === 3}
                              onChange={(e) => handleBannerFileUpload(3, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-500 font-medium block">
                        📱 375px Mobile View: Verify that model's face is visible and embroidery is clear.
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={settings.banner3Image}
                    onChange={(e) => updateField("banner3Image", e.target.value)}
                    placeholder="/assets/banners/banner-chiffon.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Banner Tag</label>
                  <input
                    type="text"
                    value={settings.banner3Tag}
                    onChange={(e) => updateField("banner3Tag", e.target.value)}
                    placeholder="LUXURY FORMALS"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Headline Title</label>
                  <input
                    type="text"
                    value={settings.banner3Title}
                    onChange={(e) => updateField("banner3Title", e.target.value)}
                    placeholder="ROYAL CHIFFON EDIT"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Subtitle / Caption</label>
                  <input
                    type="text"
                    value={settings.banner3Subtitle}
                    onChange={(e) => updateField("banner3Subtitle", e.target.value)}
                    placeholder="Hand-embellished tilla, sequins and master-tailored silhouettes"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Button Text</label>
                    <input
                      type="text"
                      value={settings.banner3BtnText}
                      onChange={(e) => updateField("banner3BtnText", e.target.value)}
                      placeholder="SHOP FORMALS"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-bold"
                    />
                  </div>
                  <DestinationLinkSelector
                    label="Banner 3 Landing Destination (Click to Choose)"
                    value={settings.banner3Link}
                    onChange={(v) => updateField("banner3Link", v)}
                    products={products}
                    categories={categories}
                  />
                </div>
              </div>

              {/* BANNER 4: SIGNATURE COUTURE */}
              <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-100 pb-2">
                  <span className="text-xs font-serif font-bold text-brand-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-900 text-white flex items-center justify-center text-[10px] font-mono">4</span>
                    Banner 4 (Signature Couture & Pret)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-600 bg-sand-100 px-2 py-0.5 rounded-full">
                    Pret / Couture
                  </span>
                </div>

                {/* Banner 4 Image Preview & Live Simulator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-brand-900">
                      Banner Photo &amp; Live Simulation
                    </label>
                    <div className="flex items-center gap-1 bg-sand-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 4: "desktop" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[4] === "desktop"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop (16:7)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerPreviewMode((prev) => ({ ...prev, 4: "mobile" }))}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          bannerPreviewMode[4] === "mobile"
                            ? "bg-brand-950 text-white shadow-xs"
                            : "text-brand-700 hover:text-brand-950"
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile (375px)</span>
                      </button>
                    </div>
                  </div>

                  {bannerPreviewMode[4] === "desktop" ? (
                    <div className="relative aspect-[16/7] w-full bg-brand-950 rounded-xl overflow-hidden border border-sand-300 shadow-inner">
                      {settings.banner4Image ? (
                        <Image
                          src={settings.banner4Image}
                          alt="Banner 4"
                          fill
                          className="object-cover object-top sm:object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/25 to-transparent flex items-center p-4 pointer-events-none">
                        <div className="max-w-[240px] space-y-1 text-white">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner4Tag || "SIGNATURE COUTURE"}
                            </span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner4Title || "EVERYDAY ELEGANCE"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner4Subtitle || "Timeless ivory & antique gold..."}
                          </p>
                          <span className="inline-block px-2.5 py-1 rounded-full bg-white text-brand-950 text-[9px] font-bold uppercase tracking-wider shadow">
                            {settings.banner4BtnText || "SHOP COLLECTION"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <label className="cursor-pointer px-3 py-1.5 bg-white/95 hover:bg-white text-brand-950 text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all">
                          {uploadingBanner === 4 ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-600" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5 text-brand-900" />
                              <span>Upload from PC</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingBanner === 4}
                            onChange={(e) => handleBannerFileUpload(4, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <div className="relative w-[240px] aspect-[9/16] max-h-[340px] mx-auto bg-black rounded-[28px] overflow-hidden border-4 border-brand-950 shadow-2xl flex flex-col justify-end">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-brand-950 rounded-full z-20" />
                        {settings.banner4Image ? (
                          <Image
                            src={settings.banner4Image}
                            alt="Banner 4 Mobile"
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-sand-400">No Image Selected</div>
                        )}
                        <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1 text-white text-left">
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 text-[8px] font-bold tracking-widest uppercase rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                              {settings.banner4Tag || "SIGNATURE COUTURE"}
                            </span>
                          </div>
                          <h4 className="font-serif text-xs font-bold text-white leading-tight drop-shadow truncate">
                            {settings.banner4Title || "EVERYDAY ELEGANCE"}
                          </h4>
                          <p className="text-[9px] text-white/80 line-clamp-1">
                            {settings.banner4Subtitle || "Timeless ivory & antique gold..."}
                          </p>
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-brand-950 text-[8px] font-bold uppercase tracking-wider shadow">
                            {settings.banner4BtnText || "SHOP COLLECTION"}
                          </span>
                        </div>
                        <div className="absolute top-5 right-2 z-20">
                          <label className="cursor-pointer px-2 py-1 bg-white/90 hover:bg-white text-brand-950 text-[10px] font-bold rounded-lg shadow flex items-center gap-1 transition-all">
                            <Upload className="w-3 h-3 text-brand-900" />
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingBanner === 4}
                              onChange={(e) => handleBannerFileUpload(4, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <span className="text-[10px] text-brand-500 font-medium block">
                        📱 375px Mobile View: Verify that model's face is visible and embroidery is clear.
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    value={settings.banner4Image}
                    onChange={(e) => updateField("banner4Image", e.target.value)}
                    placeholder="/assets/banners/banner-festive.jpg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Banner Tag</label>
                  <input
                    type="text"
                    value={settings.banner4Tag}
                    onChange={(e) => updateField("banner4Tag", e.target.value)}
                    placeholder="SIGNATURE COUTURE"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Headline Title</label>
                  <input
                    type="text"
                    value={settings.banner4Title}
                    onChange={(e) => updateField("banner4Title", e.target.value)}
                    placeholder="EVERYDAY ELEGANCE"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-serif font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-900">Subtitle / Caption</label>
                  <input
                    type="text"
                    value={settings.banner4Subtitle}
                    onChange={(e) => updateField("banner4Subtitle", e.target.value)}
                    placeholder="Timeless ivory & antique gold ensembles for weddings and soirees"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900">Button Text</label>
                    <input
                      type="text"
                      value={settings.banner4BtnText}
                      onChange={(e) => updateField("banner4BtnText", e.target.value)}
                      placeholder="SHOP COLLECTION"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-bold"
                    />
                  </div>
                  <DestinationLinkSelector
                    label="Banner 4 Landing Destination (Click to Choose)"
                    value={settings.banner4Link}
                    onChange={(v) => updateField("banner4Link", v)}
                    products={products}
                    categories={categories}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-sand-200 pt-6">
            <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider mb-4">
              Single Hero Media / Fallback Headline Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Hero Floating Badge</label>
              <input
                type="text"
                value={settings.heroBadge}
                onChange={(e) => updateField("heroBadge", e.target.value)}
                placeholder="Festive Edit 2026 â€” Live Now"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Main Headline Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => updateField("heroTitle", e.target.value)}
                placeholder="Elegance Woven with Pure Heritage"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-serif font-bold"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => updateField("heroSubtitle", e.target.value)}
                placeholder="Discover authentic luxury lawn..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Primary Button Label</label>
              <input
                type="text"
                value={settings.heroPrimaryBtnText}
                onChange={(e) => updateField("heroPrimaryBtnText", e.target.value)}
                placeholder="Shop Summer Lawn"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <DestinationLinkSelector
              label="Primary Button Destination Landing Page (Click to Choose)"
              value={settings.heroPrimaryBtnLink}
              onChange={(v) => updateField("heroPrimaryBtnLink", v)}
              products={products}
              categories={categories}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Secondary Button Label</label>
              <input
                type="text"
                value={settings.heroSecondaryBtnText}
                onChange={(e) => updateField("heroSecondaryBtnText", e.target.value)}
                placeholder="Wedding Royale"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <DestinationLinkSelector
              label="Secondary Button Destination Landing Page (Click to Choose)"
              value={settings.heroSecondaryBtnLink}
              onChange={(v) => updateField("heroSecondaryBtnLink", v)}
              products={products}
              categories={categories}
            />

            {/* 3 Trust Badges */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Hero Stat Badge 1 (Value|Label)</label>
              <input
                type="text"
                value={settings.heroStats1}
                onChange={(e) => updateField("heroStats1", e.target.value)}
                placeholder="100%|Pure Swiss & Egyptian Fabrics"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Hero Stat Badge 2 (Value|Label)</label>
              <input
                type="text"
                value={settings.heroStats2}
                onChange={(e) => updateField("heroStats2", e.target.value)}
                placeholder="COD|Available across Pakistan"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Hero Stat Badge 3 (Value|Label)</label>
              <input
                type="text"
                value={settings.heroStats3}
                onChange={(e) => updateField("heroStats3", e.target.value)}
                placeholder="2-4 Days|Express Courier Delivery"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            {/* Media Selector */}
            <div className="space-y-3 md:col-span-2 pt-2 border-t border-sand-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-brand-900">Hero Background Media</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("heroMediaType", "IMAGE")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.heroMediaType === "IMAGE"
                        ? "bg-brand-950 text-gold-400 shadow-sm"
                        : "bg-sand-100 text-brand-700"
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("heroMediaType", "VIDEO")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.heroMediaType === "VIDEO"
                        ? "bg-brand-950 text-gold-400 shadow-sm"
                        : "bg-sand-100 text-brand-700"
                    }`}
                  >
                    Ambient Video (MP4)
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={settings.heroMediaUrl}
                onChange={(e) => updateField("heroMediaUrl", e.target.value)}
                placeholder="/assets/hero-model.jpg"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />

              {/* Preset Gallery Picker */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-brand-600 block mb-2">Or Choose from High-Res Presets:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HERO_MEDIA_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateField("heroMediaUrl", preset.url);
                        updateField("heroMediaType", preset.type as any);
                      }}
                      className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        settings.heroMediaUrl === preset.url
                          ? "border-gold-500 ring-2 ring-gold-400 bg-sand-50"
                          : "border-sand-200 hover:border-sand-400"
                      }`}
                    >
                      <span className="text-xs font-bold text-brand-950 truncate block">{preset.label}</span>
                      <span className="text-[10px] text-brand-500 font-mono mt-1">{preset.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOMEPAGE SECTIONS & TITLES */}
      {activeTab === "sections" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="border-b border-sand-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span>📍 Store Location:</span>
                <span className="text-gold-700 font-bold">Homepage Body — Vertical layout stack from top to footer</span>
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
              <Layers className="w-5 h-5 text-gold-600" />
              Homepage Sections & Section Headings
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Turn individual sections on/off and customize their titles and subheadings. Changes apply directly to storefront visitors.
            </p>
          </div>

          {/* Visual Layout Blueprint */}
          <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200 space-y-2">
            <span className="text-xs font-bold text-brand-900 block">
              Live Homepage Section Blueprint &amp; Active Visibility
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "1. Categories", active: settings.showCategories !== false },
                { name: "2. New Arrivals", active: settings.showTrending !== false },
                { name: "3. Runway Reels", active: settings.showVideos !== false },
                { name: "4. Trust Perks", active: settings.showTrustPerks !== false },
                { name: "5. Reviews", active: settings.showReviews !== false },
                { name: "6. Heritage", active: settings.showHeritage !== false },
                { name: "7. Newsletter", active: settings.showNewsletter !== false },
                { name: "8. Instagram", active: settings.showInstagramGrid !== false },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    s.active
                      ? "bg-white border-emerald-300 text-emerald-900 shadow-xs"
                      : "bg-sand-100/60 border-sand-200 text-brand-400 opacity-60"
                  }`}
                >
                  <span className="block truncate">{s.name}</span>
                  <span className={`text-[9px] uppercase tracking-wider font-mono ${s.active ? "text-emerald-600" : "text-brand-400"}`}>
                    {s.active ? "● Live On Site" : "○ Hidden"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 divide-y divide-sand-100">
            {/* 1. Categories Section */}
            <div className="pt-4 first:pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-950 font-serif">1. Curated Collections / Categories</h3>
                  <p className="text-xs text-brand-500">The grid of 6 dress categories (Lawn, Chiffon, Pret, etc.)</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCategories}
                    onChange={(e) => updateField("showCategories", e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-brand-900">Show Section</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={settings.categoriesTitle}
                  onChange={(e) => updateField("categoriesTitle", e.target.value)}
                  placeholder="Curated Luxury Collections"
                  className="px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
                />
                <input
                  type="text"
                  value={settings.categoriesSubtitle}
                  onChange={(e) => updateField("categoriesSubtitle", e.target.value)}
                  placeholder="From effortless daily lawn to breathtaking bridal kalidars..."
                  className="px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* 2. Trending & New Arrivals */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-950 font-serif">2. Trending, New Arrivals & Best Sellers</h3>
                  <p className="text-xs text-brand-500">Interactive tabbed feed with quick add-to-cart and stock badges</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showTrending}
                    onChange={(e) => updateField("showTrending", e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-brand-900">Show Section</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={settings.trendingTitle}
                  onChange={(e) => updateField("trendingTitle", e.target.value)}
                  placeholder="Trending & New Arrivals"
                  className="px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
                />
                <input
                  type="text"
                  value={settings.trendingSubtitle}
                  onChange={(e) => updateField("trendingSubtitle", e.target.value)}
                  placeholder="The season's most sought-after silhouettes..."
                  className="px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* 3. Lookbook Spotlight */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-950 font-serif">3. Haute Couture Lookbook / Editorial</h3>
                  <p className="text-xs text-brand-500">Two-column editorial campaign spotlight</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showLookbook}
                    onChange={(e) => updateField("showLookbook", e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-brand-900">Show Section</span>
                </label>
              </div>
              <input
                type="text"
                value={settings.lookbookTitle}
                onChange={(e) => updateField("lookbookTitle", e.target.value)}
                placeholder="The Couture Editorial"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            {/* 4. Runway Video Reels */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-950 font-serif">4. Shoppable Runway Video Reels</h3>
                  <p className="text-xs text-brand-500">Watch & Buy vertical reel video cards with direct product links</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showVideos}
                    onChange={(e) => updateField("showVideos", e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-brand-900">Show Section</span>
                </label>
              </div>
              <input
                type="text"
                value={settings.videosTitle}
                onChange={(e) => updateField("videosTitle", e.target.value)}
                placeholder="Runway Watch & Buy"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            {/* 5. Customer Reviews */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-950 font-serif">5. Verified Customer Reviews</h3>
                  <p className="text-xs text-brand-500">Testimonials from real buyers across Pakistan</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showReviews}
                    onChange={(e) => updateField("showReviews", e.target.checked)}
                    className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs font-bold text-brand-900">Show Section</span>
                </label>
              </div>
              <input
                type="text"
                value={settings.reviewsTitle}
                onChange={(e) => updateField("reviewsTitle", e.target.value)}
                placeholder="Voices of Elegance"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BRAND HERITAGE & STORY */}
      {activeTab === "heritage" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-100 pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2">
                <Layout className="w-5 h-5 text-gold-600" />
                Brand Heritage, Story & Craftsmanship
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                The authentic heritage narrative about Tauheed Textile and its needlecraft artistry.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHeritage}
                onChange={(e) => updateField("showHeritage", e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs font-bold text-brand-900">Show Heritage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Heritage Badge / Established Year</label>
              <input
                type="text"
                value={settings.heritageBadge}
                onChange={(e) => updateField("heritageBadge", e.target.value)}
                placeholder="Crafting Luxury Since 1994"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Heritage Main Headline</label>
              <input
                type="text"
                value={settings.heritageTitle}
                onChange={(e) => updateField("heritageTitle", e.target.value)}
                placeholder="Tauheed Textile â€” Where Heritage Meets Modern Grace"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-serif font-bold"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Heritage Full Story Narrative</label>
              <textarea
                rows={4}
                value={settings.heritageSubtitle}
                onChange={(e) => updateField("heritageSubtitle", e.target.value)}
                placeholder="Every thread is an ode to centuries of subcontinental needlecraft..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>

            {/* 3 Pillars */}
            <div className="space-y-2 md:col-span-2 pt-2 border-t border-sand-100">
              <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wider">3 Heritage Pillars</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Pillar 1 Title</label>
              <input
                type="text"
                value={settings.heritageHighlight1Title}
                onChange={(e) => updateField("heritageHighlight1Title", e.target.value)}
                placeholder="100% Pure Natural Fibers"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
              <textarea
                rows={2}
                value={settings.heritageHighlight1Text}
                onChange={(e) => updateField("heritageHighlight1Text", e.target.value)}
                placeholder="Finest combed cotton lawn..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Pillar 2 Title</label>
              <input
                type="text"
                value={settings.heritageHighlight2Title}
                onChange={(e) => updateField("heritageHighlight2Title", e.target.value)}
                placeholder="Artisanal Subcontinental Needlework"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
              <textarea
                rows={2}
                value={settings.heritageHighlight2Text}
                onChange={(e) => updateField("heritageHighlight2Text", e.target.value)}
                placeholder="Hand-rendered tilla, sequins..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Pillar 3 Title</label>
              <input
                type="text"
                value={settings.heritageHighlight3Title}
                onChange={(e) => updateField("heritageHighlight3Title", e.target.value)}
                placeholder="Impeccable Pret Tailoring"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
              />
              <textarea
                rows={2}
                value={settings.heritageHighlight3Text}
                onChange={(e) => updateField("heritageHighlight3Text", e.target.value)}
                placeholder="Ready-to-wear perfection featuring structured silhouettes..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PAKISTAN TRUST PERKS */}
      {activeTab === "perks" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sand-100 pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-600" />
                Pakistan Trust Bar (Perks & Guarantees)
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                The 4 guarantee cards shown in the footer and across product pages.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTrustBar}
                onChange={(e) => updateField("showTrustBar", e.target.checked)}
                className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
              />
              <span className="text-xs font-bold text-brand-900">Show Trust Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perk 1 */}
            <div className="p-5 rounded-2xl border border-sand-200 bg-sand-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-950">
                <Truck className="w-4 h-4 text-gold-600" />
                Perk 1: Courier Delivery
              </div>
              <input
                type="text"
                value={settings.trustPerk1Title}
                onChange={(e) => updateField("trustPerk1Title", e.target.value)}
                placeholder="Nationwide Delivery"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold bg-white"
              />
              <input
                type="text"
                value={settings.trustPerk1Desc}
                onChange={(e) => updateField("trustPerk1Desc", e.target.value)}
                placeholder="TCS, Trax & Leopards to 250+ cities in Pakistan"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 bg-white"
              />
            </div>

            {/* Perk 2 */}
            <div className="p-5 rounded-2xl border border-sand-200 bg-sand-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-950">
                <CreditCard className="w-4 h-4 text-gold-600" />
                Perk 2: Payment Option
              </div>
              <input
                type="text"
                value={settings.trustPerk2Title}
                onChange={(e) => updateField("trustPerk2Title", e.target.value)}
                placeholder="Cash On Delivery"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold bg-white"
              />
              <input
                type="text"
                value={settings.trustPerk2Desc}
                onChange={(e) => updateField("trustPerk2Desc", e.target.value)}
                placeholder="Pay cash upon parcel receipt or direct Bank Transfer"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 bg-white"
              />
            </div>

            {/* Perk 3 */}
            <div className="p-5 rounded-2xl border border-sand-200 bg-sand-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-950">
                <RotateCcw className="w-4 h-4 text-gold-600" />
                Perk 3: Return Window
              </div>
              <input
                type="text"
                value={settings.trustPerk3Title}
                onChange={(e) => updateField("trustPerk3Title", e.target.value)}
                placeholder="7-Day Return Policy"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold bg-white"
              />
              <input
                type="text"
                value={settings.trustPerk3Desc}
                onChange={(e) => updateField("trustPerk3Desc", e.target.value)}
                placeholder="Customer-first replacement or exchange policy"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 bg-white"
              />
            </div>

            {/* Perk 4 */}
            <div className="p-5 rounded-2xl border border-sand-200 bg-sand-50/50 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-950">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                Perk 4: Fabric Guarantee
              </div>
              <input
                type="text"
                value={settings.trustPerk4Title}
                onChange={(e) => updateField("trustPerk4Title", e.target.value)}
                placeholder="100% Authentic Fabric"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold bg-white"
              />
              <input
                type="text"
                value={settings.trustPerk4Desc}
                onChange={(e) => updateField("trustPerk4Desc", e.target.value)}
                placeholder="Pure Swiss lawn, genuine chiffon and master tailoring"
                className="w-full px-4 py-2 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: WHATSAPP CONCIERGE, CONTACT & STUDIO */}
      {activeTab === "contact" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>📍 Store Location:</span>
                  <span className="text-gold-700 font-bold">Floating bottom-right corner across all store pages &amp; mobile menu</span>
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
                <Phone className="w-5 h-5 text-gold-600" />
                Direct Concierge, WhatsApp & Studio Info
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                These details control the floating WhatsApp chat button, VIP Community invite, footer address, customer hotline, and contact links across the entire store.
              </p>
            </div>
          </div>

          {/* Live Storefront Widget Preview */}
          <div className="space-y-2 p-5 rounded-2xl bg-sand-50/80 border border-sand-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gold-600" />
                <span>Live Floating WhatsApp Widget Simulation</span>
              </span>
              <span className="text-[10px] text-brand-500 font-medium">As shown on customer screen (bottom-right)</span>
            </div>
            <div className="h-32 bg-sand-100/50 rounded-xl border border-dashed border-sand-300 relative flex flex-col items-end justify-end p-4 gap-2 overflow-hidden">
              <span className="absolute top-3 left-4 text-[11px] text-brand-500 font-mono">
                Storefront Screen (Bottom-Right Corner)
              </span>

              {/* VIP Community Button Simulator */}
              {settings.showWhatsappCommunity !== false && settings.whatsappCommunityLink && (
                <div className="flex items-center gap-2 bg-[#128C7E] text-white px-3 py-1.5 rounded-full shadow-lg border border-white text-xs font-bold transition-all">
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-emerald-200" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-semibold flex items-center gap-1">
                    <span>VIP Community</span>
                    <span className="text-[8px] bg-amber-400 text-black px-1 rounded font-black">JOIN</span>
                  </span>
                </div>
              )}

              {/* 1-on-1 Chat Button Simulator */}
              <div className="flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-2 rounded-full shadow-lg border-2 border-white text-xs font-bold">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span className="text-xs font-semibold">Chat with Us ({settings.contactWhatsApp || "0340 0262732"})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Official WhatsApp Number</label>
              <input
                type="text"
                value={settings.contactWhatsApp}
                onChange={(e) => updateField("contactWhatsApp", e.target.value)}
                placeholder="0340 0262732"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono font-bold"
              />
              <p className="text-[11px] text-brand-500">Powers floating WhatsApp button &amp; click-to-chat links.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Default WhatsApp Inquiry Message</label>
              <input
                type="text"
                value={settings.whatsappMessage}
                onChange={(e) => updateField("whatsappMessage", e.target.value)}
                placeholder="Assalam-o-Alaikum Tauheed Textile, I would like assistance with my order."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
              <p className="text-[11px] text-brand-500">Auto-filled in customer's WhatsApp when they tap chat.</p>
            </div>

            <div className="space-y-3 md:col-span-2 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-emerald-950">WhatsApp VIP Customer Community Channel</label>
                  <p className="text-[11px] text-emerald-800">
                    Direct invite link to your VIP broadcast channel or group for special sale announcements.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
                  <input
                    type="checkbox"
                    checked={settings.showWhatsappCommunity !== false}
                    onChange={(e) => updateField("showWhatsappCommunity", e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-emerald-950">Enable VIP Button</span>
                </label>
              </div>
              <input
                type="url"
                value={settings.whatsappCommunityLink || ""}
                onChange={(e) => updateField("whatsappCommunityLink", e.target.value)}
                placeholder="https://chat.whatsapp.com/TauheedVIP"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:border-emerald-600 font-mono bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Customer Support Phone Hotline</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateField("contactPhone", e.target.value)}
                placeholder="0340 0262732"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Official Customer Care Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="care@tauheedtextile.com"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Flagship Studio Physical Address</label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => updateField("contactAddress", e.target.value)}
                placeholder="Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-medium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-brand-900">Customer Service Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => updateField("operatingHours", e.target.value)}
                placeholder="Monday - Saturday: 10:00 AM - 9:00 PM PKT"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SOCIAL MEDIA CHANNELS */}
      {activeTab === "social" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gold-600" />
              Social Media Profiles & Channels
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Connect your official Instagram, Facebook, TikTok, and YouTube pages to the storefront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Instagram Profile URL</label>
              <input
                type="text"
                value={settings.socialInstagram}
                onChange={(e) => updateField("socialInstagram", e.target.value)}
                placeholder="https://instagram.com/tauheedtextile"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Facebook Page URL</label>
              <input
                type="text"
                value={settings.socialFacebook}
                onChange={(e) => updateField("socialFacebook", e.target.value)}
                placeholder="https://facebook.com/tauheedtextile"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">TikTok Profile URL</label>
              <input
                type="text"
                value={settings.socialTikTok}
                onChange={(e) => updateField("socialTikTok", e.target.value)}
                placeholder="https://tiktok.com/@tauheedtextile"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.socialYouTube}
                onChange={(e) => updateField("socialYouTube", e.target.value)}
                placeholder="https://youtube.com/@tauheedtextile"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: FOOTER & COPYRIGHT */}
      {activeTab === "footer" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gold-600" />
              Footer Content, Bio & Newsletter
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Customize the footer brand statement, newsletter pitch, and copyright text.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Footer Brand Statement / Bio</label>
              <textarea
                rows={3}
                value={settings.footerAboutText}
                onChange={(e) => updateField("footerAboutText", e.target.value)}
                placeholder="Tauheed Textile celebrates the enduring heritage of Pakistani luxury fashion..."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-900">Newsletter Pitch Title</label>
                <input
                  type="text"
                  value={settings.newsletterTitle}
                  onChange={(e) => updateField("newsletterTitle", e.target.value)}
                  placeholder="Join the Exclusive Circle"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-900">Newsletter Subtitle</label>
                <input
                  type="text"
                  value={settings.newsletterSubtitle}
                  onChange={(e) => updateField("newsletterSubtitle", e.target.value)}
                  placeholder="Receive private previews of seasonal drops..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-brand-900">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={settings.footerCopyright}
                  onChange={(e) => updateField("footerCopyright", e.target.value)}
                  placeholder="Â© 2026 Tauheed Textile. All Rights Reserved. Handcrafted in Pakistan."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-sand-300 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: SHOPPABLE VIDEO REELS */}
      {activeTab === "videos" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-8">
          <div className="border-b border-sand-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-brand-800 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span>📍 Store Location:</span>
                <span className="text-gold-700 font-bold">Homepage Editorial Cinema Section — "Runway Watch &amp; Buy"</span>
              </span>
            </div>
            <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2 mt-1.5">
              <Video className="w-5 h-5 text-gold-600" />
              Shoppable Runway Watch & Buy Video Reels
            </h2>
            <p className="text-xs text-brand-600 mt-0.5">
              Add vertical runway videos that link directly to outfits so customers can buy in 1 click while watching without leaving the store.
            </p>
          </div>

          {/* Add Video Form */}
          <form onSubmit={handleAddVideo} className="p-6 rounded-2xl bg-sand-50 border border-sand-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-950">Add New Video Reel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-900">Reel Title</label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="e.g. Zehra Emerald Runway Walk"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-900">MP4 Video URL</label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-white font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-900">Linked Product to Purchase</label>
                <select
                  value={newVideoProductId}
                  onChange={(e) => setNewVideoProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-white font-serif"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isAddingVideo}
                className="px-5 py-2 rounded-xl bg-brand-950 text-sand-50 hover:bg-gold-500 hover:text-brand-950 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 font-serif"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingVideo ? "Adding Reel..." : "Add to Homepage"}</span>
              </button>
            </div>
          </form>

          {/* Existing Video Reels List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-950">Active Homepage Reels ({videos.length})</h3>
            {videos.length === 0 ? (
              <p className="text-xs text-brand-500 italic">No video reels added yet. Use the form above to add your first reel.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {videos.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border border-sand-200 bg-white shadow-sm flex flex-col justify-between space-y-3">
                    <div className="relative aspect-[9/14] rounded-xl overflow-hidden bg-black">
                      <UniversalVideoPlayer src={v.videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-950 truncate">{v.title}</h4>
                      <p className="text-[11px] text-brand-500 truncate mt-0.5">{v.product?.title || "No linked product"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(v.id)}
                      className="w-full py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Reel</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 11: LIVE VISUAL PREVIEW */}
      {activeTab === "preview" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-950 flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold-600" />
                Live Interactive Storefront Simulator
              </h2>
              <p className="text-xs text-brand-600 mt-0.5">
                Simulated real-time rendering of your customized announcement, hero banner, perks, and footer.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-sand-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewDevice === "desktop" ? "bg-white text-brand-950 shadow-sm" : "text-brand-600"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  previewDevice === "mobile" ? "bg-white text-brand-950 shadow-sm" : "text-brand-600"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>
          </div>

          <div className={`mx-auto transition-all duration-300 ${previewDevice === "mobile" ? "max-w-sm border-8 border-brand-950 rounded-[40px] shadow-2xl overflow-hidden" : "w-full rounded-2xl overflow-hidden border border-sand-300 shadow-lg"}`}>
            {/* Simulated Top Announcement */}
            {settings.announcementEnabled && (
              <div className="bg-brand-950 text-sand-300 text-[11px] py-2 px-3 text-center border-b border-sand-900 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse inline-block" />
                <span className="font-bold text-gold-400">{settings.announcementText}</span>
                <span className="text-sand-400 hidden sm:inline">| {settings.announcementSubtext}</span>
              </div>
            )}

            {/* Simulated Header */}
            <div className="bg-black text-sand-50 px-4 py-3 flex items-center justify-between border-b border-sand-900">
              <div className="flex items-center gap-2">
                <div className="w-6 h-8 bg-gold-500/30 rounded flex items-center justify-center text-[10px] text-gold-400 font-serif">TT</div>
                <span className="font-serif font-bold text-sm tracking-widest text-sand-50 select-none">Tᗩᑌᕼᗴᗴᗪ</span>
              </div>
              <span className="text-[10px] text-gold-400 font-mono">WhatsApp: {settings.contactWhatsApp}</span>
            </div>

            {/* Simulated Hero */}
            {settings.showHero && (
              <div className="relative bg-ink-black text-sand-100 p-6 sm:p-12 min-h-[320px] flex flex-col justify-center space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold uppercase tracking-wider w-fit border border-gold-500/40">
                  {settings.heroBadge}
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-sand-50 leading-tight">
                  {settings.heroTitle}
                </h2>
                <p className="text-xs text-sand-300 max-w-md line-clamp-3">
                  {settings.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-5 py-2.5 rounded-xl bg-gold-500 text-brand-950 font-bold text-xs uppercase tracking-wider font-serif">
                    {settings.heroPrimaryBtnText}
                  </span>
                  <span className="px-5 py-2.5 rounded-xl bg-sand-900 text-sand-200 font-bold text-xs uppercase tracking-wider border border-sand-700">
                    {settings.heroSecondaryBtnText}
                  </span>
                </div>
              </div>
            )}

            {/* Simulated Marquee */}
            {settings.marqueeEnabled && (
              <div className="bg-gold-500 text-brand-950 py-2 px-4 text-xs font-bold uppercase tracking-wider truncate shadow-inner">
                {settings.marqueeText}
              </div>
            )}

            {/* Simulated Trust Bar */}
            {settings.showTrustBar && (
              <div className="bg-brand-950 p-4 border-t border-sand-900 grid grid-cols-2 gap-3 text-xs text-sand-300">
                <div className="p-2 bg-sand-900/40 rounded-lg">
                  <span className="font-bold text-sand-50 block">{settings.trustPerk1Title}</span>
                  <span className="text-[10px] text-sand-400">{settings.trustPerk1Desc}</span>
                </div>
                <div className="p-2 bg-sand-900/40 rounded-lg">
                  <span className="font-bold text-sand-50 block">{settings.trustPerk2Title}</span>
                  <span className="text-[10px] text-sand-400">{settings.trustPerk2Desc}</span>
                </div>
              </div>
            )}

            {/* Simulated Footer */}
            <div className="bg-black text-sand-400 p-4 text-[10px] border-t border-sand-900 space-y-2">
              <p className="text-sand-300">{settings.footerAboutText}</p>
              <p className="text-sand-500 font-mono">{settings.footerCopyright}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
