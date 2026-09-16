"use client";

import React, { useState, useMemo } from "react";
import {
  Compass,
  ShoppingBag,
  Tag,
  FileText,
  ExternalLink,
  Sparkles,
  Layers,
  Edit3,
  CheckCircle2,
} from "lucide-react";

export interface DestinationProduct {
  id: string;
  title: string;
  slug?: string;
  sku?: string;
  basePrice?: number;
}

export interface DestinationSubcategory {
  id: string;
  name: string;
  slug: string;
}

export interface DestinationCategory {
  id: string;
  name: string;
  slug: string;
  subcategories?: DestinationSubcategory[];
}

export interface DestinationLinkSelectorProps {
  value: string;
  onChange: (val: string) => void;
  products?: DestinationProduct[];
  categories?: DestinationCategory[];
  label?: string;
  helperText?: string;
}

const STATIC_STORE_PAGES = [
  { value: "/shop", label: "All Products & Collections", group: "Store Pages" },
  { value: "/shop?isNewArrival=true", label: "New In 2026 / New Arrivals", group: "Store Pages" },
  { value: "/shop?isBestSeller=true", label: "Best Sellers Collection", group: "Store Pages" },
  { value: "/shop?category=sale", label: "Festive Sale & Special Discounts", group: "Store Pages" },
  { value: "/shop?isPreOrder=true", label: "Pre-Order Luxury Catalog", group: "Store Pages" },
];

const STATIC_POLICY_PAGES = [
  { value: "/track-order", label: "Order Tracking Portal", group: "Help & Policies" },
  { value: "/policies/shipping", label: "Nationwide Shipping & Delivery Policy", group: "Help & Policies" },
  { value: "/policies/returns", label: "7-Day Return & Exchange Policy", group: "Help & Policies" },
  { value: "/policies/size-guide", label: "Size Chart & Fit Guide", group: "Help & Policies" },
  { value: "/policies/faq", label: "Frequently Asked Questions (FAQ)", group: "Help & Policies" },
];

const FALLBACK_CATEGORIES = [
  { name: "Lawn & Summer '26", slug: "lawn-summer" },
  { name: "Lawn Formals", slug: "lawn-formals" },
  { name: "Luxury Chiffon & Formals", slug: "chiffon-formal" },
  { name: "Pure Silk Collection", slug: "silk" },
  { name: "Net Formals", slug: "net-formals" },
  { name: "Organza Formals", slug: "organza-formals" },
  { name: "Bridal Maxies & Barat", slug: "bridal-maxies" },
  { name: "Designer Saries", slug: "saries" },
  { name: "Winter Collection", slug: "winter-collection" },
  { name: "Ready to Wear / Pret", slug: "pret-ready-to-wear" },
  { name: "Unstitched Collection", slug: "unstitched" },
  { name: "Sale & Clearance", slug: "sale" },
];

const FALLBACK_SUBCATEGORIES = [
  { catSlug: "lawn-summer", subSlug: "lawn-3-piece", label: "Lawn & Summer › 3-Piece Stitched" },
  { catSlug: "lawn-summer", subSlug: "lawn-2-piece", label: "Lawn & Summer › 2-Piece Stitched" },
  { catSlug: "lawn-summer", subSlug: "lawn-printed", label: "Lawn & Summer › Printed Lawn" },
  { catSlug: "lawn-summer", subSlug: "lawn-jacquard", label: "Lawn & Summer › Jacquard Lawn" },
  { catSlug: "chiffon-formal", subSlug: "chiffon-maxies", label: "Chiffon & Formal › Festive Maxies" },
  { catSlug: "chiffon-formal", subSlug: "chiffon-embroidered", label: "Chiffon & Formal › Embroidered Chiffon" },
  { catSlug: "silk", subSlug: "silk-raw-silk", label: "Silk › Raw Silk Ensembles" },
  { catSlug: "silk", subSlug: "silk-3-piece", label: "Silk › Pure Silk 3-Piece" },
  { catSlug: "bridal-maxies", subSlug: "bridal-royal-barat", label: "Bridal Maxies › Royal Barat Maxies" },
  { catSlug: "bridal-maxies", subSlug: "bridal-walima-gowns", label: "Bridal Maxies › Walima Gowns" },
  { catSlug: "winter-collection", subSlug: "winter-velvet-ensembles", label: "Winter › Velvet Ensembles" },
  { catSlug: "winter-collection", subSlug: "winter-pashmina-shawls", label: "Winter › Pashmina Shawls" },
  { catSlug: "pret-ready-to-wear", subSlug: "pret-2-piece", label: "Pret › 2-Piece Pret" },
  { catSlug: "pret-ready-to-wear", subSlug: "pret-3-piece", label: "Pret › 3-Piece Pret" },
  { catSlug: "sale", subSlug: "sale-flat-50", label: "Sale › Flat 50% Off" },
  { catSlug: "sale", subSlug: "sale-flat-30", label: "Sale › Flat 30% Off" },
];

export default function DestinationLinkSelector({
  value,
  onChange,
  products = [],
  categories = [],
  label = "Destination Landing Page",
  helperText,
}: DestinationLinkSelectorProps) {
  // Compute flat list of all known preset options
  const presetMap = useMemo(() => {
    const map = new Map<string, { label: string; type: string }>();

    STATIC_STORE_PAGES.forEach((item) => {
      map.set(item.value, { label: item.label, type: "Store Page" });
    });

    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        const catUrl = `/shop?category=${cat.slug}`;
        map.set(catUrl, { label: cat.name, type: "Main Category" });

        if (cat.subcategories && cat.subcategories.length > 0) {
          cat.subcategories.forEach((sub) => {
            const subUrl = `/shop?category=${cat.slug}&subcategory=${sub.slug}`;
            map.set(subUrl, { label: `${cat.name} › ${sub.name}`, type: "Subcategory" });
          });
        }
      });
    } else {
      FALLBACK_CATEGORIES.forEach((cat) => {
        map.set(`/shop?category=${cat.slug}`, { label: cat.name, type: "Main Category" });
      });
      FALLBACK_SUBCATEGORIES.forEach((sub) => {
        map.set(`/shop?category=${sub.catSlug}&subcategory=${sub.subSlug}`, {
          label: sub.label,
          type: "Subcategory",
        });
      });
    }

    products.forEach((p) => {
      const url = `/product/${p.slug || p.id}`;
      const priceText = p.basePrice ? ` (Rs. ${Number(p.basePrice).toLocaleString()})` : "";
      map.set(url, { label: `${p.title}${priceText}`, type: "Product Page" });
    });

    STATIC_POLICY_PAGES.forEach((item) => {
      map.set(item.value, { label: item.label, type: "Policy / Help" });
    });

    return map;
  }, [categories, products]);

  // Is the current value in our predefined presets?
  const isPreset = presetMap.has(value);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(!isPreset && Boolean(value));

  const currentSelection = isCustomMode ? "__custom__" : value;
  const activePreset = presetMap.get(value);

  const handleSelectChange = (newVal: string) => {
    if (newVal === "__custom__") {
      setIsCustomMode(true);
      // Keep existing value so admin can edit it
    } else {
      setIsCustomMode(false);
      onChange(newVal);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-brand-900 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-gold-600" />
          <span>{label}</span>
        </label>
        {isCustomMode && (
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              onChange("/shop");
            }}
            className="text-[10px] font-semibold text-brand-600 hover:text-brand-900 underline"
          >
            Switch to Preset Menu
          </button>
        )}
      </div>

      {/* Main Choice Dropdown */}
      <div className="relative">
        <select
          value={currentSelection}
          onChange={(e) => handleSelectChange(e.target.value)}
          className="w-full px-3 py-2.5 text-xs rounded-xl border border-sand-300 bg-white text-brand-950 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 cursor-pointer"
        >
          <option value="" disabled>
            -- Click to choose landing page --
          </option>

          {/* STORE PAGES */}
          <optgroup label="🌟 Core Store Pages">
            {STATIC_STORE_PAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </optgroup>

          {/* MAIN CATEGORIES */}
          <optgroup label="👗 Main Categories (All Products in Category)">
            {categories && categories.length > 0
              ? categories.map((cat) => (
                  <option key={cat.id || cat.slug} value={`/shop?category=${cat.slug}`}>
                    {cat.name}
                  </option>
                ))
              : FALLBACK_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={`/shop?category=${cat.slug}`}>
                    {cat.name}
                  </option>
                ))}
          </optgroup>

          {/* SUBCATEGORIES */}
          <optgroup label="🏷️ Subcategories">
            {categories && categories.length > 0
              ? categories.flatMap((cat) =>
                  (cat.subcategories || []).map((sub) => (
                    <option
                      key={sub.id || sub.slug}
                      value={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                    >
                      {cat.name} › {sub.name}
                    </option>
                  ))
                )
              : FALLBACK_SUBCATEGORIES.map((sub) => (
                  <option
                    key={sub.subSlug}
                    value={`/shop?category=${sub.catSlug}&subcategory=${sub.subSlug}`}
                  >
                    {sub.label}
                  </option>
                ))}
          </optgroup>

          {/* CATALOG PRODUCTS */}
          {products && products.length > 0 && (
            <optgroup label="🛍️ Specific Products (Direct Product Page)">
              {products.map((p) => {
                const url = `/product/${p.slug || p.id}`;
                const priceText = p.basePrice
                  ? ` — Rs. ${Number(p.basePrice).toLocaleString()}`
                  : "";
                return (
                  <option key={p.id} value={url}>
                    {p.title}
                    {priceText}
                  </option>
                );
              })}
            </optgroup>
          )}

          {/* POLICY PAGES */}
          <optgroup label="📄 Help & Policies">
            {STATIC_POLICY_PAGES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </optgroup>

          {/* CUSTOM MANUAL LINK */}
          <optgroup label="✏️ Manual / External Link">
            <option value="__custom__">Custom URL (Type or paste link manually)</option>
          </optgroup>
        </select>
      </div>

      {/* If Custom Mode: show text input */}
      {isCustomMode && (
        <div className="pt-1.5 space-y-1 animate-fadeInUp">
          <div className="flex items-center gap-1.5 text-[10px] text-brand-600 font-medium">
            <Edit3 className="w-3 h-3" />
            <span>Type any custom URL or external link:</span>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /shop?category=sale or https://wa.me/923400262732"
            className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 font-mono bg-sand-50/50 text-brand-950 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
          />
        </div>
      )}

      {/* Visual Destination Pill / Status Card */}
      {value ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-sand-100/70 border border-sand-200 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs border border-sand-200">
              {activePreset?.type === "Product Page" ? (
                <ShoppingBag className="w-3.5 h-3.5 text-gold-700" />
              ) : activePreset?.type === "Main Category" ? (
                <Layers className="w-3.5 h-3.5 text-brand-700" />
              ) : activePreset?.type === "Subcategory" ? (
                <Tag className="w-3.5 h-3.5 text-brand-600" />
              ) : activePreset?.type === "Policy / Help" ? (
                <FileText className="w-3.5 h-3.5 text-blue-600" />
              ) : isCustomMode ? (
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500">
                  {activePreset?.type || "Custom Link"}
                </span>
                <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Active
                </span>
              </div>
              <p className="text-[11px] font-semibold text-brand-950 truncate max-w-[280px] sm:max-w-md">
                {activePreset?.label || value}
              </p>
              <p className="text-[10px] text-brand-400 font-mono truncate max-w-[280px] sm:max-w-md">
                {value}
              </p>
            </div>
          </div>

          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            title="Open landing page in new tab to test"
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-brand-800 bg-white hover:bg-sand-200 rounded-lg border border-sand-200 shadow-xs transition-all hover:scale-105"
          >
            <span>Test</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      ) : (
        <p className="text-[10px] text-brand-400 italic">No destination set yet.</p>
      )}

      {helperText && <p className="text-[10px] text-brand-500 mt-1">{helperText}</p>}
    </div>
  );
}
