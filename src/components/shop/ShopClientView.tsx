"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

interface ShopClientViewProps {
  initialProducts: any[];
  categories: any[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export default function ShopClientView({
  initialProducts,
  categories,
  currentCategory,
  currentSearch,
  currentSort,
}: ShopClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSortChange = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortVal) {
      params.set("sort", sortVal);
    } else {
      params.delete("sort");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleOccasionClick = (keyword: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (keyword) {
      params.set("search", keyword);
    } else {
      params.delete("search");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div>
      {/* Header Banner */}
      <div className="mb-6 pb-6 border-b border-sand-200">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
          {activeCategoryObj ? activeCategoryObj.name : currentSearch ? `Search results for "${currentSearch}"` : "All Collections"}
        </h1>
        <p className="text-xs sm:text-sm text-brand-600 mt-2 max-w-2xl">
          {activeCategoryObj?.description || "Browse our full spectrum of Pakistani luxury wear, unstitched lawn, festive chiffons, and tailored pret."}
        </p>
      </div>

      {/* AI Occasion & Mood Matcher Pills */}
      <div className="mb-8 p-3.5 bg-brand-950/90 border border-sand-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 text-gold-400 font-bold shrink-0">
          <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
          <span>AI Occasion Curator:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap w-full sm:w-auto scrollbar-none">
          {[
            { label: "👑 Wedding Barat Gala", query: "wedding" },
            { label: "☀️ Summer Lawn & Daywear", query: "lawn" },
            { label: "✨ Royal Chiffon & Adda", query: "chiffon" },
            { label: "🍸 Contemporary Chic Pret", query: "pret" },
            { label: "❄️ Festive Velvet Shawls", query: "velvet" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleOccasionClick(item.query)}
              className={`px-3 py-1 rounded-full border transition-all text-[11px] font-medium ${
                currentSearch?.toLowerCase() === item.query
                  ? "bg-gold-600 text-brand-950 border-gold-500 font-bold shadow-sm"
                  : "bg-brand-900/90 hover:bg-gold-500/20 border-sand-800 text-sand-300 hover:text-gold-300"
              }`}
            >
              {item.label}
            </button>
          ))}
          {currentSearch && (
            <button
              onClick={() => handleOccasionClick("")}
              className="px-2.5 py-1 text-[11px] text-rose-400 hover:text-rose-300 font-bold underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !currentCategory
                ? "bg-brand-900 text-sand-50"
                : "bg-sand-100 text-brand-800 hover:bg-sand-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentCategory === cat.slug
                  ? "bg-brand-900 text-sand-50"
                  : "bg-sand-100 text-brand-800 hover:bg-sand-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-sand-100 rounded-lg text-xs font-bold text-brand-900"
        >
          <Filter className="w-4 h-4 text-gold-600" />
          <span>Filters</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-brand-600 font-medium">Sort By:</span>
          <select
            value={currentSort || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-xs bg-sand-50 border border-sand-300 rounded-lg px-3 py-2 text-brand-900 focus:outline-none focus:ring-1 focus:ring-gold-500"
          >
            <option value="newest">New Arrivals</option>
            <option value="bestseller">Bestsellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {initialProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-sand-200 p-8">
          <p className="font-serif text-xl font-bold text-brand-900">No items found matching your criteria</p>
          <p className="text-xs text-brand-600 mt-2">Try clearing your filters or search terms.</p>
          <button
            onClick={() => router.push("/shop")}
            className="mt-4 px-6 py-2.5 bg-brand-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {initialProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              slug={prod.slug}
              title={prod.title}
              fabric={prod.fabric}
              basePrice={prod.basePrice}
              comparePrice={prod.comparePrice}
              salePrice={prod.salePrice}
              images={prod.images}
              isNewArrival={prod.isNewArrival}
              isBestSeller={prod.isBestSeller}
              isSale={prod.isSale}
              isPreOrder={prod.isPreOrder}
              variants={prod.variants}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Mobile Category Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-sand-50 h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                <h3 className="font-serif font-bold text-lg text-brand-900">Filter Categories</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-brand-700" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    handleCategoryClick(null);
                    setMobileFilterOpen(false);
                  }}
                  className={`p-3 rounded-xl text-left text-xs font-semibold ${
                    !currentCategory ? "bg-brand-900 text-sand-50" : "bg-white text-brand-900 border border-sand-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryClick(cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-semibold ${
                      currentCategory === cat.slug ? "bg-brand-900 text-sand-50" : "bg-white text-brand-900 border border-sand-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-gold-600 text-white font-bold text-xs uppercase rounded-xl tracking-wider"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
