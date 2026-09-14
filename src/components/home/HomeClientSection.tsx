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
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-sand-900 pb-4 mb-8 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400">Handcrafted Couture</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mt-0.5">
            Signature Ensembles
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-brand-900/90 rounded-2xl border border-sand-900">
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "featured"
                ? "bg-gold-500 text-ink-black shadow-lg"
                : "text-sand-400 hover:text-sand-100"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "new"
                ? "bg-gold-500 text-ink-black shadow-lg"
                : "text-sand-400 hover:text-sand-100"
            }`}
          >
            New In
          </button>
          <button
            onClick={() => setActiveTab("bestseller")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "bestseller"
                ? "bg-gold-500 text-ink-black shadow-lg"
                : "text-sand-400 hover:text-sand-100"
            }`}
          >
            Bestsellers
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
