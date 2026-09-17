"use client";

import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Filter, SlidersHorizontal, X, Sparkles, ChevronLeft, ChevronRight, Check } from "lucide-react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

interface ShopClientViewProps {
  initialProducts: any[];
  categories: any[];
  currentCategory?: string;
  currentSubcategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export default function ShopClientView({
  initialProducts,
  categories,
  currentCategory,
  currentSubcategory,
  currentSearch,
  currentSort,
}: ShopClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const subcategoriesScrollRef = useRef<HTMLDivElement>(null);

  const scrollSubcategories = (direction: "left" | "right") => {
    if (subcategoriesScrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      subcategoriesScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
      params.delete("subcategory"); // Reset subcategory when switching category
    } else {
      params.delete("category");
      params.delete("subcategory");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSubcategoryClick = (subSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (subSlug) {
      params.set("subcategory", subSlug);
    } else {
      params.delete("subcategory");
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
  const activeSubcategoryObj = activeCategoryObj?.subcategories?.find(
    (s: any) => s.slug === currentSubcategory
  );

  return (
    <div className="bg-[#F8F5F0] min-h-screen pb-10">
      {/* Top bar (sort/filter toggle) */}
      <div className="bg-white border-b border-[#E7E1D8] py-3 px-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#6B6259]">
            Home / Shop {activeCategoryObj ? `/ ${activeCategoryObj.name}` : ""} {activeSubcategoryObj ? `/ ${activeSubcategoryObj.name}` : ""}
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
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
              {activeCategoryObj ? activeCategoryObj.name : currentSearch ? `Search results for "${currentSearch}"` : "All Collections"}
            </h1>
            {activeSubcategoryObj && (
              <span className="font-serif text-xl sm:text-2xl text-[#7A6652] font-semibold">
                — {activeSubcategoryObj.name}
              </span>
            )}
          </div>
          <p className="text-sm text-[#6B6259] mt-2 max-w-2xl">
            {activeCategoryObj?.description || "Browse our full spectrum of Pakistani luxury wear, unstitched lawn, festive chiffons, and tailored pret."}
          </p>
        </div>

        {/* SUB CATEGORIES - SMALL SQUARE BUTTONS */}
        {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 ? (
          <div className="mb-8 bg-white border border-[#E7E1D8] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#171717]">
                  {activeCategoryObj.name} Subcategories
                </span>
                <span className="text-[10px] bg-[#F0EBE3] text-[#7A6652] font-bold px-2 py-0.5 rounded-full">
                  {activeCategoryObj.subcategories.length + 1} styles
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSubcategories("left")}
                  className="w-7 h-7 rounded-full bg-[#F8F5F0] hover:bg-[#E7E1D8] text-[#171717] flex items-center justify-center transition-colors border border-[#E7E1D8]"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSubcategories("right")}
                  className="w-7 h-7 rounded-full bg-[#F8F5F0] hover:bg-[#E7E1D8] text-[#171717] flex items-center justify-center transition-colors border border-[#E7E1D8]"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal scrollable row of square buttons */}
            <div
              ref={subcategoriesScrollRef}
              className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth"
            >
              {/* "All" Square Button */}
              <button
                type="button"
                onClick={() => handleSubcategoryClick(null)}
                className="flex flex-col items-center gap-2 shrink-0 group text-center focus:outline-none"
              >
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 ${
                    !currentSubcategory
                      ? "ring-2 ring-[#7A6652] ring-offset-2 ring-offset-white border-[#7A6652] shadow-md scale-105"
                      : "border-[#E7E1D8] bg-[#F8F5F0] group-hover:border-[#7A6652]/60 group-hover:shadow-sm"
                  }`}
                >
                  {activeCategoryObj.image ? (
                    <Image
                      src={activeCategoryObj.image}
                      alt={`All ${activeCategoryObj.name}`}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E7E1D8] text-[#7A6652] font-bold text-xs">
                      ALL
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      ALL
                    </span>
                  </div>
                  {!currentSubcategory && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#7A6652] text-white rounded-full flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 max-w-[70px] sm:max-w-[85px] transition-colors ${
                    !currentSubcategory ? "text-[#7A6652] font-bold" : "text-[#6B6259] group-hover:text-[#171717]"
                  }`}
                >
                  All {activeCategoryObj.name.split(" ")[0]}
                </span>
              </button>

              {/* Subcategories Square Buttons */}
              {activeCategoryObj.subcategories.map((sub: any) => {
                const isActive = currentSubcategory === sub.slug;
                const imgSrc = sub.image || activeCategoryObj.image || "/assets/subcategories/sub-lawn-3pc.jpg";
                return (
                  <button
                    key={sub.id || sub.slug}
                    type="button"
                    onClick={() => handleSubcategoryClick(isActive ? null : sub.slug)}
                    className="flex flex-col items-center gap-2 shrink-0 group text-center focus:outline-none"
                  >
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 ${
                        isActive
                          ? "ring-2 ring-[#7A6652] ring-offset-2 ring-offset-white border-[#7A6652] shadow-md scale-105"
                          : "border-[#E7E1D8] bg-[#F8F5F0] group-hover:border-[#7A6652]/60 group-hover:shadow-sm"
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={sub.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                      {isActive && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#7A6652] text-white rounded-full flex items-center justify-center shadow">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 max-w-[70px] sm:max-w-[85px] transition-colors ${
                        isActive ? "text-[#7A6652] font-bold" : "text-[#6B6259] group-hover:text-[#171717]"
                      }`}
                    >
                      {sub.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : !currentCategory ? (
          /* When in All Collections, show the 10 Main Categories as Square Buttons */
          <div className="mb-8 bg-white border border-[#E7E1D8] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#171717]">
                Shop Collections By Category
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSubcategories("left")}
                  className="w-7 h-7 rounded-full bg-[#F8F5F0] hover:bg-[#E7E1D8] text-[#171717] flex items-center justify-center transition-colors border border-[#E7E1D8]"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSubcategories("right")}
                  className="w-7 h-7 rounded-full bg-[#F8F5F0] hover:bg-[#E7E1D8] text-[#171717] flex items-center justify-center transition-colors border border-[#E7E1D8]"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={subcategoriesScrollRef}
              className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth"
            >
              {categories.map((cat: any) => {
                const imgSrc = cat.image || "/assets/subcategories/sub-lawn-3pc.jpg";
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="flex flex-col items-center gap-2 shrink-0 group text-center focus:outline-none"
                  >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-[#E7E1D8] bg-[#F8F5F0] group-hover:border-[#7A6652]/60 group-hover:shadow-sm transition-all duration-300">
                      <Image
                        src={imgSrc}
                        alt={cat.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#6B6259] group-hover:text-[#171717] leading-tight line-clamp-2 max-w-[70px] sm:max-w-[85px] transition-colors">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

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
                  className={`text-left text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all py-2 px-3 rounded-xl ${
                    !currentCategory
                      ? "bg-[#171717] text-white shadow-xs"
                      : "text-[#171717] hover:bg-[#F0EBE3] border border-[#E7E1D8]"
                  }`}
                >
                  <span className="font-extrabold tracking-wider">ALL (All Dresses)</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    !currentCategory ? "bg-white text-[#171717]" : "bg-[#E7E1D8] text-[#7A6652]"
                  }`}>
                    ALL
                  </span>
                </button>
                {categories.map((cat) => {
                  const isCatActive = currentCategory === cat.slug;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`text-left text-sm transition-all w-full flex items-center justify-between ${
                          isCatActive
                            ? "text-[#7A6652] font-semibold"
                            : "text-[#6B6259] hover:text-[#171717]"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && isCatActive && (
                          <span className="text-[10px] text-[#7A6652] bg-[#F0EBE3] px-1.5 py-0.5 rounded font-bold">
                            {cat.subcategories.length}
                          </span>
                        )}
                      </button>

                      {/* Subcategories in sidebar if active */}
                      {isCatActive && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-3 py-1 space-y-1.5 border-l-2 border-[#E7E1D8] ml-1">
                          <button
                            onClick={() => handleSubcategoryClick(null)}
                            className={`text-left text-xs transition-all block w-full ${
                              !currentSubcategory
                                ? "text-[#7A6652] font-bold"
                                : "text-[#8E857B] hover:text-[#171717]"
                            }`}
                          >
                            • All {cat.name.split(" ")[0]}
                          </button>
                          {cat.subcategories.map((sub: any) => (
                            <button
                              key={sub.id || sub.slug}
                              onClick={() => handleSubcategoryClick(currentSubcategory === sub.slug ? null : sub.slug)}
                              className={`text-left text-xs transition-all block w-full truncate ${
                                currentSubcategory === sub.slug
                                  ? "text-[#7A6652] font-bold"
                                  : "text-[#8E857B] hover:text-[#171717]"
                              }`}
                            >
                              • {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                  className={`text-left text-xs font-bold uppercase tracking-wider flex items-center justify-between py-2 px-3 rounded-xl ${
                    !currentCategory
                      ? "bg-[#171717] text-white shadow-xs"
                      : "text-[#171717] hover:bg-[#F0EBE3] border border-[#E7E1D8]"
                  }`}
                >
                  <span>ALL (All Dresses)</span>
                  <span className="text-[10px] bg-[#E7E1D8] text-[#171717] px-2 py-0.5 rounded font-bold">ALL</span>
                </button>
                {categories.map((cat) => {
                  const isCatActive = currentCategory === cat.slug;
                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleCategoryClick(cat.slug);
                        }}
                        className={`text-left text-sm w-full flex items-center justify-between py-1 ${
                          isCatActive ? "text-[#7A6652] font-semibold" : "text-[#6B6259] hover:text-[#171717]"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && isCatActive && (
                          <span className="text-[10px] text-[#7A6652] bg-[#F0EBE3] px-1.5 py-0.5 rounded font-bold">
                            {cat.subcategories.length}
                          </span>
                        )}
                      </button>

                      {/* Mobile subcategories */}
                      {isCatActive && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-3 py-1 space-y-2 border-l-2 border-[#E7E1D8] ml-1">
                          <button
                            onClick={() => {
                              handleSubcategoryClick(null);
                              setMobileFilterOpen(false);
                            }}
                            className={`text-left text-xs block w-full py-0.5 ${
                              !currentSubcategory ? "text-[#7A6652] font-bold" : "text-[#8E857B]"
                            }`}
                          >
                            • All {cat.name.split(" ")[0]}
                          </button>
                          {cat.subcategories.map((sub: any) => (
                            <button
                              key={sub.id || sub.slug}
                              onClick={() => {
                                handleSubcategoryClick(currentSubcategory === sub.slug ? null : sub.slug);
                                setMobileFilterOpen(false);
                              }}
                              className={`text-left text-xs block w-full py-0.5 truncate ${
                                currentSubcategory === sub.slug ? "text-[#7A6652] font-bold" : "text-[#8E857B]"
                              }`}
                            >
                              • {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
