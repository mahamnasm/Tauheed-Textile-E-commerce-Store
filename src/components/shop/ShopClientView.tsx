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
    <div className="bg-[#F8F5F0] min-h-screen pb-10">
      {/* Top bar (sort/filter toggle) */}
      <div className="bg-white border-b border-[#E7E1D8] py-3 px-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#6B6259]">
            Home / Shop {activeCategoryObj ? `/ ${activeCategoryObj.name}` : ""}
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#171717] text-white rounded-full px-4 py-2 text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#171717]">Sort By:</span>
              <select
                value={currentSort || "newest"}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-[#E7E1D8] rounded-lg text-sm text-[#171717] bg-white px-3 py-2 focus:outline-none"
              >
                <option value="newest">New Arrivals</option>
                <option value="bestseller">Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            {activeCategoryObj ? activeCategoryObj.name : currentSearch ? `Search results for "${currentSearch}"` : "All Collections"}
          </h1>
          <p className="text-sm text-[#6B6259] mt-2 max-w-2xl">
            {activeCategoryObj?.description || "Browse our full spectrum of Pakistani luxury wear, unstitched lawn, festive chiffons, and tailored pret."}
          </p>
        </div>

        {/* AI Occasion & Mood Matcher Pills */}
        <div className="mb-8 p-4 bg-white border border-[#E7E1D8] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#171717] text-xs font-bold uppercase tracking-wider shrink-0">
            <Sparkles className="w-4 h-4 text-[#7A6652]" />
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
                className={`transition-all ${
                  currentSearch?.toLowerCase() === item.query
                    ? "bg-[#E7E1D8] text-[#171717] rounded-full px-3 py-1 text-xs"
                    : "text-[#6B6259] hover:text-[#171717] text-xs border border-transparent hover:border-[#E7E1D8] rounded-full px-3 py-1"
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentSearch && (
              <button
                onClick={() => handleOccasionClick("")}
                className="px-2.5 py-1 text-xs text-[#171717] underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border border-[#E7E1D8] rounded-xl p-5 shadow-sm sticky top-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-4">Categories</h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`text-left text-sm transition-all ${
                    !currentCategory
                      ? "text-[#7A6652] font-semibold"
                      : "text-[#6B6259] hover:text-[#171717]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`text-left text-sm transition-all ${
                      currentCategory === cat.slug
                        ? "text-[#7A6652] font-semibold"
                        : "text-[#6B6259] hover:text-[#171717]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {initialProducts.length === 0 ? (
              <div className="text-[#6B6259] text-center py-20 bg-white border border-[#E7E1D8] rounded-xl">
                <p className="font-serif text-xl font-bold text-[#171717]">No items found</p>
                <p className="mt-2 text-sm">Try clearing your filters or search terms.</p>
                <button
                  onClick={() => router.push("/shop")}
                  className="mt-4 px-6 py-2 bg-[#171717] text-white rounded-full text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
          </div>
        </div>
      </div>

      {/* Mobile Category Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E1D8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#171717]">Filter Categories</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#171717]" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={() => {
                    handleCategoryClick(null);
                    setMobileFilterOpen(false);
                  }}
                  className={`text-left text-sm ${
                    !currentCategory ? "text-[#7A6652] font-semibold" : "text-[#6B6259] hover:text-[#171717]"
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
                    className={`text-left text-sm ${
                      currentCategory === cat.slug ? "text-[#7A6652] font-semibold" : "text-[#6B6259] hover:text-[#171717]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#171717] text-white font-bold text-xs uppercase rounded-xl tracking-wider"
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
