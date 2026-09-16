import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RotateCcw, Star, Play, ShoppingBag, Film, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import HomeClientSection from "@/components/home/HomeClientSection";
import HeroBannerSlider from "@/components/home/HeroBannerSlider";
import RunwayReelsSection from "@/components/home/RunwayReelsSection";
import HomeCategoriesSection from "@/components/home/HomeCategoriesSection";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallbackProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let settings: any = { showCategories: true, showTrending: true, showVideos: true, showReviews: true };
  let categories: any[] = [
    { id: "1", name: "Lawn & Summer", slug: "lawn-summer", image: "/assets/cat-lawn-summer.jpg" },
    { id: "2", name: "Chiffon & Formal", slug: "chiffon-formal", image: "/assets/cat-chiffon-formal.jpg" },
    { id: "3", name: "Silk", slug: "silk", image: "/assets/cat-pret-readytowear.jpg" },
    { id: "4", name: "Net Formals", slug: "net-formals", image: "/assets/cat-wedding-luxury.jpg" },
    { id: "5", name: "Organza Formals", slug: "organza-formals", image: "/assets/cat-chiffon-formal.jpg" },
    { id: "6", name: "Bridal Maxies", slug: "bridal-maxies", image: "/assets/cat-wedding-luxury.jpg" },
    { id: "7", name: "Saries", slug: "saries", image: "/assets/cat-chiffon-formal.jpg" },
    { id: "8", name: "Lawn Formals", slug: "lawn-formals", image: "/assets/cat-lawn-summer.jpg" },
    { id: "9", name: "Winter Collection", slug: "winter-collection", image: "/assets/cat-lawn-summer.jpg" },
  ];
  let featuredProducts: any[] = [];
  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let videos: any[] = [];
  let reviews: any[] = [];

  try {
    const [fetchedSettings, fetchedCats, featProds, newProds, bestProds, fetchedVideos, fetchedReviews] = await Promise.all([
      getSiteSettings(),
      prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
        take: 12,
      }),
      prisma.product.findMany({
        where: { isFeatured: true },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isNewArrival: true },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isBestSeller: true },
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
        take: 4,
      }),
      prisma.watchBuyVideo.findMany({
        where: { isActive: true },
        include: {
          product: {
            include: {
              images: { take: 1, select: { url: true } },
            },
          },
        },
        orderBy: { displayOrder: "asc" },
        take: 4,
      }),
      prisma.review.findMany({
        where: { isApproved: true, isFeatured: true },
        include: { product: true },
        take: 3,
      }),
    ]);

    if (fetchedSettings) settings = fetchedSettings;
    if (fetchedCats && fetchedCats.length > 0) categories = fetchedCats;
    if (featProds && featProds.length > 0) featuredProducts = featProds;
    if (newProds && newProds.length > 0) newArrivals = newProds;
    if (bestProds && bestProds.length > 0) bestSellers = bestProds;
    if (fetchedVideos) videos = fetchedVideos;
    if (fetchedReviews) reviews = fetchedReviews;
  } catch (dbError) {
    console.warn("Database cold start / connection retry:", dbError);
  }

  // Graceful fallback: Storefront will ALWAYS display products even during database cold-start
  if (!categories || categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = FALLBACK_PRODUCTS.filter((p) => p.isFeatured);
  }
  if (!newArrivals || newArrivals.length === 0) {
    newArrivals = FALLBACK_PRODUCTS.filter((p) => p.isNewArrival);
  }
  if (!bestSellers || bestSellers.length === 0) {
    bestSellers = FALLBACK_PRODUCTS.filter((p) => p.isBestSeller);
  }

  return (
    <div className="bg-[#F8F5F0] space-y-16 pb-24">
      {/* 1. AUTO-MOVING 4-BANNER HERO (LIMELIGHT STYLE) */}
      <HeroBannerSlider settings={settings} />

      {/* 2. CURATED CATEGORIES (HORIZONTAL SCROLLABLE LEFT TO RIGHT) */}
      {settings.showCategories && (
        <HomeCategoriesSection
          categories={categories.length > 0 ? categories : FALLBACK_CATEGORIES}
          title={settings.categoriesTitle}
          subtitle={settings.categoriesSubtitle}
        />
      )}

      {/* 3. NEW ARRIVALS / TABS */}
      {settings.showTrending !== false && (
        <HomeClientSection 
          featuredProducts={featuredProducts} 
          newArrivals={newArrivals} 
          bestSellers={bestSellers} 
        />
      )}

      {/* 4. RUNWAY WATCH & BUY (HORIZONTAL SCROLLABLE) */}
      {settings.showVideos && videos.length > 0 && (
        <RunwayReelsSection videos={videos} title={settings.videosTitle} />
      )}

      {/* 5. WHY SHOP WITH US (TRUST PERKS) */}
      <section className="bg-[#F0EBE3] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 text-[#7A6652] mb-3" />
              <h4 className="font-semibold text-sm text-[#171717]">COD &amp; 5% Off Advance</h4>
              <p className="text-xs text-[#6B6259] mt-1">Bank Transfer &amp; EasyPaisa</p>
            </div>
            <div className="flex flex-col items-center">
              <Package className="w-8 h-8 text-[#7A6652] mb-3" />
              <h4 className="font-semibold text-sm text-[#171717]">Nationwide Delivery</h4>
              <p className="text-xs text-[#6B6259] mt-1">5–7 Working Days</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-8 h-8 text-[#7A6652] mb-3" />
              <h4 className="font-semibold text-sm text-[#171717]">7-Day Exchange</h4>
              <p className="text-xs text-[#6B6259] mt-1">Hassle-Free Exchange</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-[#7A6652] mb-3" />
              <h4 className="font-semibold text-sm text-[#171717]">Authentic Fabric</h4>
              <p className="text-xs text-[#6B6259] mt-1">100% Premium Quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      {settings.showReviews && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6652] block mb-2">
              Customer Voices
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
              {settings.reviewsTitle || "Loved by Women Across Pakistan"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-[#E7E1D8] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {rev.imageUrl && (
                    <div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden border border-[#E7E1D8]">
                      <Image
                        src={rev.imageUrl}
                        alt="Customer Review Photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h4 className="font-serif font-semibold text-[#171717]">{rev.title || "Exquisite Quality"}</h4>
                  <p className="text-sm text-[#6B6259] italic mt-2">"{rev.comment}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E7E1D8] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#171717] text-sm">{rev.customerName}</p>
                    {rev.reviewerCity && (
                      <span className="text-[11px] text-[#9B8C7E]">{rev.reviewerCity}</span>
                    )}
                  </div>
                  <span className="text-xs bg-[#F0EBE3] text-[#7A6652] px-2 py-0.5 rounded">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
