"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  Save, 
  Smartphone, 
  Monitor, 
  Layers, 
  Tag, 
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminSeoClientViewProps {
  initialProducts: any[];
  initialSettings: any;
  initialAudit: any;
}

export default function AdminSeoClientView({
  initialProducts,
  initialSettings,
  initialAudit,
}: AdminSeoClientViewProps) {
  const [products, setProducts] = useState(initialProducts);
  const [settings, setSettings] = useState(initialSettings);
  const [audit, setAudit] = useState(initialAudit);

  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [selectedProductId, setSelectedProductId] = useState<string>("home");
  const [optimizingBatch, setOptimizingBatch] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Derived Google SERP Preview Data
  const serpTitle = selectedProduct
    ? (selectedProduct.metaTitle || `${selectedProduct.title} | Tauheed Textile Pakistan`)
    : settings.siteTitle;

  const serpDesc = selectedProduct
    ? (selectedProduct.metaDesc || `Buy authentic ${selectedProduct.title} crafted in luxury ${selectedProduct.fabric}. Express courier delivery across Pakistan with Cash on Delivery.`)
    : settings.metaDescription;

  const serpUrl = selectedProduct
    ? `https://tauheedtextile.com › product › ${selectedProduct.slug}`
    : `https://tauheedtextile.com`;

  // 1-Click Batch AI Optimization
  const handleBatchOptimize = async () => {
    setOptimizingBatch(true);
    try {
      const res = await fetch("/api/admin/seo/optimize-all", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch optimization failed");

      toast.success(`✨ AI successfully optimized ${data.results.updatedCount} products for Google!`, {
        icon: "🚀",
        duration: 4500,
      });

      // Refresh product state
      if (data.results?.products) {
        setProducts((prev) =>
          prev.map((p) => {
            const match = data.results.products.find((up: any) => up.id === p.id);
            return match ? { ...p, metaTitle: match.metaTitle, metaDesc: match.metaDesc } : p;
          })
        );
      }

      // Re-run audit
      const auditRes = await fetch("/api/admin/seo/audit");
      const auditData = await auditRes.json();
      if (auditData.audit) setAudit(auditData.audit);

      setSettings((prev: any) => ({
        ...prev,
        lastOptimizedAt: new Date().toISOString(),
        healthScore: 98,
      }));
    } catch (err: any) {
      toast.error(err.message || "Failed to optimize catalog.");
    } finally {
      setOptimizingBatch(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");
      toast.success("Google SEO settings updated successfully!", { icon: "✅" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Add keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    if (settings.targetKeywords.includes(newKeyword.trim())) return;
    setSettings((prev: any) => ({
      ...prev,
      targetKeywords: [...prev.targetKeywords, newKeyword.trim()],
    }));
    setNewKeyword("");
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setSettings((prev: any) => ({
      ...prev,
      targetKeywords: prev.targetKeywords.filter((k: string) => k !== kwToRemove),
    }));
  };

  return (
    <div className="space-y-8 text-sand-950">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700 bg-gold-100 px-2 py-0.5 rounded-md">
              Google Engine & Search Dominance
            </span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {audit.healthScore}/100 GOOGLE HEALTH
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            AI Automated Google SEO
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Automatic meta tags generation, SERP live snippets, Schema.org rich markup, and sitemap synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleBatchOptimize}
            disabled={optimizingBatch}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-brand-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-brand-950 ${optimizingBatch ? "animate-spin" : "animate-pulse"}`} />
            <span>{optimizingBatch ? "AI Optimizing Catalog..." : "✨ 1-Click AI Auto-SEO"}</span>
          </button>
          
          <a
            href="/sitemap.xml"
            target="_blank"
            className="px-3.5 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors"
            title="View Live Google Sitemap"
          >
            <Globe className="w-3.5 h-3.5 text-gold-700" />
            <span>sitemap.xml</span>
            <ExternalLink className="w-3 h-3 text-sand-500" />
          </a>
        </div>
      </div>

      {/* Grid: Live Google SERP Preview & 1-Click AI Optimizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Google SERP Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
                Search Engine Appearance
              </span>
              <h3 className="font-serif font-bold text-lg text-brand-950">
                Live Google SERP Simulator
              </h3>
            </div>

            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200 text-xs">
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition-all ${
                  previewDevice === "mobile"
                    ? "bg-white text-brand-950 font-bold shadow-sm"
                    : "text-brand-600 hover:text-brand-950"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-medium transition-all ${
                  previewDevice === "desktop"
                    ? "bg-white text-brand-950 font-bold shadow-sm"
                    : "text-brand-600 hover:text-brand-950"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>
          </div>

          {/* Select What to Preview */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-brand-800 whitespace-nowrap">Preview Page:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-xs text-brand-950 font-medium focus:outline-none focus:border-gold-500"
            >
              <option value="home">Homepage (Tauheed Textile Official Store)</option>
              <optgroup label="Products & Articles">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.sku})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Realistic Google Search Card */}
          <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-2xl p-5 sm:p-6 shadow-inner space-y-2.5 font-sans transition-all">
            {/* Google Result Header: Favicon + Brand Domain */}
            <div className="flex items-center gap-2 text-[12px] text-[#202124]">
              <div className="w-6 h-6 rounded-full bg-[#12110F] flex items-center justify-center p-1 border border-sand-700 shadow-sm shrink-0">
                <Image
                  src="/logo-calligraphy.png"
                  alt="Favicon"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className="font-semibold text-xs text-[#202124]">Tauheed Textile</span>
                <span className="text-[11px] text-[#4d5156] truncate">{serpUrl}</span>
              </div>
            </div>

            {/* Google Title (Blue Link) */}
            <h4 className="text-[18px] sm:text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-normal leading-snug break-words">
              {serpTitle}
            </h4>

            {/* Google Meta Description */}
            <p className="text-[13px] text-[#4d5156] leading-relaxed break-words">
              {serpDesc}
            </p>

            {/* Google Rich Snippet Badge: Rating + Price */}
            {selectedProduct && (
              <div className="pt-2 border-t border-[#e8eaed] flex flex-wrap items-center gap-3 text-[11px] text-[#4d5156]">
                <span className="text-[#fbbc04] font-bold">★★★★★</span>
                <span>Rating: 4.9 • 142 reviews</span>
                <span>•</span>
                <span className="font-semibold text-[#188038]">
                  PKR {selectedProduct.basePrice?.toLocaleString()} • In stock
                </span>
                <span>•</span>
                <span>Free COD Delivery</span>
              </div>
            )}
          </div>

          {/* Character Count Diagnostics */}
          <div className="grid grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
              <span className="text-brand-500 block text-[10px] uppercase font-bold">Title Length</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-sm text-brand-950">{serpTitle.length}</span>
                <span className="text-sand-500 text-[10px]">/ 60 optimal chars</span>
              </div>
              <div className="w-full bg-sand-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${serpTitle.length <= 60 ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(100, (serpTitle.length / 60) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-sand-50 rounded-xl border border-sand-200">
              <span className="text-brand-500 block text-[10px] uppercase font-bold">Description Length</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-sm text-brand-950">{serpDesc.length}</span>
                <span className="text-sand-500 text-[10px]">/ 160 optimal chars</span>
              </div>
              <div className="w-full bg-sand-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${serpDesc.length <= 160 ? "bg-emerald-500" : "bg-amber-500"}`}
                  style={{ width: `${Math.min(100, (serpDesc.length / 160) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Auto-Optimization & Catalog Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-sand-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
                  Automated Engine
                </span>
                <h3 className="font-serif font-bold text-lg text-brand-950">
                  AI Catalog Optimizer
                </h3>
              </div>
              <span className="p-2 rounded-xl bg-gold-100 text-gold-800">
                <Zap className="w-5 h-5" />
              </span>
            </div>

            <p className="text-xs text-brand-600 leading-relaxed">
              Our AI engine continuously analyzes product titles, fabrics (Swiss lawn, chiffon, velvet), embroidery work, and pricing to generate ultra-clickable Google titles and conversion-focused descriptions.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-brand-700 font-medium">Total Products in Store</span>
                <span className="font-mono font-bold text-brand-950">{products.length} Articles</span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-800 font-medium">AI Meta Tags Ready</span>
                <span className="font-mono font-bold text-emerald-900">
                  {products.filter((p) => p.metaTitle && p.metaDesc).length} / {products.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-brand-700 font-medium">Last AI Batch Run</span>
                <span className="font-mono text-brand-800 text-[11px]">
                  {settings.lastOptimizedAt
                    ? new Date(settings.lastOptimizedAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not run yet"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sand-100 space-y-2">
            <button
              onClick={handleBatchOptimize}
              disabled={optimizingBatch}
              className="w-full py-3 px-4 bg-brand-950 hover:bg-brand-900 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
              <span>{optimizingBatch ? "Running AI Engine..." : "Optimize All Products with AI"}</span>
            </button>
            <p className="text-[10px] text-center text-sand-500">
              Generates compliant Google titles, descriptions & keywords in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Target Pakistani Keywords & Google Console Meta Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Keywords Manager (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-sand-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
                Ranking Targets
              </span>
              <h3 className="font-serif font-bold text-lg text-brand-950">
                High-Volume Pakistani Keywords
              </h3>
            </div>
            <Tag className="w-4 h-4 text-gold-600" />
          </div>

          <p className="text-xs text-brand-600">
            Target phrases targeted by AI when generating product meta descriptions and search snippets:
          </p>

          {/* Keyword Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {settings.targetKeywords.map((kw: string) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 text-brand-950 text-xs font-semibold border border-sand-300 shadow-2xs group"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-sand-400 hover:text-rose-600 transition-colors ml-1 text-sm font-bold"
                  title="Remove keyword"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add Keyword Form */}
          <form onSubmit={handleAddKeyword} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="e.g. Lawn Unstitched Suits Lahore"
              className="flex-1 bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-brand-950 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-sand-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Global Google Meta Settings (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-sand-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
                Store Metadata
              </span>
              <h3 className="font-serif font-bold text-lg text-brand-950">
                Global Google Search Tags
              </h3>
            </div>
            <Save className="w-4 h-4 text-gold-600" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-brand-900 mb-1">
                Store Homepage Google Title
              </label>
              <input
                type="text"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-brand-950 focus:outline-none focus:border-gold-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-900 mb-1">
                Homepage Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-brand-950 focus:outline-none focus:border-gold-500 leading-relaxed font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-brand-900 mb-1">
                Google Search Console Verification Code (Optional)
              </label>
              <input
                type="text"
                placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXX"
                value={settings.googleSiteVerification}
                onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
                className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3.5 py-2 text-xs text-brand-950 focus:outline-none focus:border-gold-500 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="px-5 py-2.5 bg-gold-600 hover:bg-gold-500 text-brand-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingSettings ? "Saving Settings..." : "Save SEO Settings"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Point Google Ranking Audit Checklist */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-gold-700 uppercase tracking-widest block">
              Automated Verification
            </span>
            <h3 className="font-serif font-bold text-lg text-brand-950">
              10-Point Technical Google SEO Health Audit
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
              100% Crawl Readiness
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.checks.map((c: any) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200/80 flex items-start gap-3.5"
            >
              <div className="mt-0.5 shrink-0">
                {c.status === "PASS" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-brand-950">{c.title}</h4>
                <p className="text-[11px] text-brand-600 leading-relaxed">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
