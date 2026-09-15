"use client";

import React, { useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";

interface HomeClientSectionProps {
  featuredProducts: any[];
  newArrivals: any[];
  bestSellers: any[];
}

export default function HomeClientSection({
  featuredProducts,
  newArrivals,
  bestSellers,
}: HomeClientSectionProps) {
  const [activeTab, setActiveTab] = useState<"featured" | "new" | "bestseller">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  const getProducts = () => {
    switch (activeTab) {
      case "new":
        return newArrivals;
      case "bestseller":
        return bestSellers;
      default:
        return featuredProducts;
    }
  };

  const products = getProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#E7E1D8] pb-4 mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#7A6652]">Our Collection</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mt-0.5">
            Signature Ensembles
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#F0EBE3] rounded-full border border-[#E7E1D8]">
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === "featured"
                ? "bg-white text-[#171717] shadow-sm"
                : "text-[#6B6259] hover:text-[#171717]"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === "new"
                ? "bg-white text-[#171717] shadow-sm"
                : "text-[#6B6259] hover:text-[#171717]"
            }`}
          >
            New In
          </button>
          <button
            onClick={() => setActiveTab("bestseller")}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              activeTab === "bestseller"
                ? "bg-white text-[#171717] shadow-sm"
                : "text-[#6B6259] hover:text-[#171717]"
            }`}
          >
            Bestsellers
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((prod) => (
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

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
