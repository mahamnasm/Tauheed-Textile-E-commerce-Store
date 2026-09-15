import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, ShieldCheck, RotateCcw, Star, Play, ShoppingBag, Film, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import HomeClientSection from "@/components/home/HomeClientSection";
import HeroBannerSlider from "@/components/home/HeroBannerSlider";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let settings: any = { showCategories: true, showTrending: true, showVideos: true, showReviews: true };
  let categories: any[] = [
    { id: "1", name: "Lawn & Summer", slug: "lawn-summer", image: "/assets/cat-lawn-summer.jpg" },
    { id: "2", name: "Chiffon & Formal", slug: "chiffon-formal", image: "/assets/cat-chiffon-formal.jpg" },
    { id: "3", name: "Pret / Ready to Wear", slug: "pret-ready-to-wear", image: "/assets/cat-pret-readytowear.jpg" },
    { id: "4", name: "Wedding & Luxury Pret", slug: "wedding-luxury-pret", image: "/assets/cat-wedding-luxury.jpg" },
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
        take: 6,
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
    if (featProds) featuredProducts = featProds;
    if (newProds) newArrivals = newProds;
    if (bestProds) bestSellers = bestProds;
    if (fetchedVideos) videos = fetchedVideos;
    if (fetchedReviews) reviews = fetchedReviews;
  } catch (dbError) {
    console.warn("Database cold start / connection retry:", dbError);
  }

  return (
    <div className="bg-[#F8F5F0] space-y-16 pb-24">
      {/* 1. AUTO-MOVING 4-BANNER HERO (LIMELIGHT STYLE) */}
      <HeroBannerSlider />

      {/* 2. SHOP BY CATEGORY */}
      {settings.showCategories && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6652] block mb-2">
                Shop by Category
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
                {settings.categoriesTitle || "Curated Collections"}
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-[#171717] underline hover:text-[#7A6652] transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => {
              const fallbackImages: Record<string, string> = {
                "lawn-summer": "/assets/cat-lawn-summer.jpg",
                "chiffon-formal": "/assets/cat-chiffon-formal.jpg",
                "pret-ready-to-wear": "/assets/cat-pret-readytowear.jpg",
                "wedding-luxury-pret": "/assets/cat-wedding-luxury.jpg",
                "unstitched": "/assets/cat-unstitched.jpg",
                "sale": "/assets/banners/banner-sale.jpg",
              };
              const catImg = (cat.image && !cat.image.endsWith(".png"))
                ? cat.image
                : (fallbackImages[cat.slug] || "/assets/cat-lawn-summer.jpg");

              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#EDE8E1] block shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={catImg}
                    alt={cat.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 inset-x-2 text-center">
                    <h3 className="font-serif font-bold text-white text-sm sm:text-base tracking-wide drop-shadow">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. NEW ARRIVALS / TABS */}
      {settings.showTrending !== false && (
        <HomeClientSection 
          featuredProducts={featuredProducts} 
          newArrivals={newArrivals} 
          bestSellers={bestSellers} 
        />
      )}

      {/* 4. SHOP BY PRICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6652] block mb-2">
            Quick Shop
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
            Shop by Budget
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/shop?maxPrice=1999" className="bg-white border border-[#E7E1D8] rounded-xl p-6 text-center hover:border-[#7A6652] hover:shadow-md transition-all">
            <h3 className="font-serif text-xl font-bold text-[#171717]">Under Rs. 1,999</h3>
            <p className="text-xs text-[#6B6259] mt-1">Everyday essentials</p>
          </Link>
          <Link href="/shop?maxPrice=2999" className="bg-white border border-[#E7E1D8] rounded-xl p-6 text-center hover:border-[#7A6652] hover:shadow-md transition-all">
            <h3 className="font-serif text-xl font-bold text-[#171717]">Under Rs. 2,999</h3>
            <p className="text-xs text-[#6B6259] mt-1">Casual & daily wear</p>
          </Link>
          <Link href="/shop?maxPrice=4999" className="bg-white border border-[#E7E1D8] rounded-xl p-6 text-center hover:border-[#7A6652] hover:shadow-md transition-all">
            <h3 className="font-serif text-xl font-bold text-[#171717]">Under Rs. 4,999</h3>
            <p className="text-xs text-[#6B6259] mt-1">Festive collections</p>
          </Link>
          <Link href="/shop?maxPrice=7999" className="bg-white border border-[#E7E1D8] rounded-xl p-6 text-center hover:border-[#7A6652] hover:shadow-md transition-all">
            <h3 className="font-serif text-xl font-bold text-[#171717]">Under Rs. 7,999</h3>
            <p className="text-xs text-[#6B6259] mt-1">Premium & wedding</p>
          </Link>
        </div>
      </section>

      {/* 5. RUNWAY WATCH & BUY */}
      {settings.showVideos && videos.length > 0 && (
        <section className="bg-[#171717] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6652] flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Film className="w-4 h-4" /> Runway Watch & Buy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                {settings.videosTitle || "Watch. Fall in Love. Shop."}
              </h2>
              <p className="text-sm text-[#E7E1D8]">
                Watch our runway reels and shop the look instantly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.map((v) => (
                <div key={v.id} className="relative rounded-2xl overflow-hidden bg-[#2A2A2A] group">
                  <div className="relative aspect-[9/16] w-full">
                    <video
                      src={v.videoUrl}
                      controls
                      playsInline
                      poster={v.product?.images?.[0]?.url || "/assets/reel-1.jpg"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Play className="w-3 h-3 fill-white" /> Runway Reel
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#222222] border-t border-[#333] flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-white truncate">{v.title}</h4>
                      {v.product && (
                        <p className="text-white/70 text-xs mt-1">
                          Rs. {v.product.basePrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {v.product && (
                      <Link
                        href={`/product/${v.product.slug}`}
                        className="block text-center w-full bg-white text-[#171717] hover:bg-[#F8F5F0] font-bold rounded-full px-4 py-2 text-xs transition-colors"
                      >
                        Shop Look
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY SHOP WITH US */}
      <section className="bg-[#F0EBE3] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-8 h-8 text-[#7A6652] mb-3" />
                <h4 className="font-semibold text-sm text-[#171717]">Cash on Delivery</h4>
                <p className="text-xs text-[#6B6259] mt-1">Pay when it arrives</p>
              </div>
              <div className="flex flex-col items-center">
                <Package className="w-8 h-8 text-[#7A6652] mb-3" />
                <h4 className="font-semibold text-sm text-[#171717]">Nationwide Delivery</h4>
                <p className="text-xs text-[#6B6259] mt-1">All cities, 2-5 days</p>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-8 h-8 text-[#7A6652] mb-3" />
                <h4 className="font-semibold text-sm text-[#171717]">Easy Exchange</h4>
                <p className="text-xs text-[#6B6259] mt-1">7-day hassle-free</p>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-8 h-8 text-[#7A6652] mb-3" />
                <h4 className="font-semibold text-sm text-[#171717]">Quality Fabric</h4>
                <p className="text-xs text-[#6B6259] mt-1">Pure &amp; authentic</p>
              </div>
            </div>
          </div>
        </section>



      {/* 7. CUSTOMER REVIEWS */}
      {settings.showReviews && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6652] block mb-2">
              Customer Voices
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
              {settings.reviewsTitle || "Loved by Thousands"}
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
                  <h4 className="font-serif font-semibold text-[#171717]">{rev.title}</h4>
                  <p className="text-sm text-[#6B6259] italic mt-2">"{rev.comment}"</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E7E1D8] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#171717] text-sm">{rev.customerName}</p>
                  </div>
                  <span className="text-xs bg-[#F0EBE3] text-[#7A6652] px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. BRAND HERITAGE */}
      {settings.showHeritage && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0EBE3] rounded-3xl py-12 px-6 lg:px-12 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#7A6652] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              {settings.heritageBadge || "Our Story"}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717] mb-4">
              {settings.heritageTitle || "Crafting Elegance Since 1994"}
            </h3>
            <p className="text-[#6B6259] text-sm sm:text-base max-w-2xl mx-auto mb-10">
              {settings.heritageSubtitle || "We blend timeless craftsmanship with modern designs to bring you the finest fabrics for your everyday wardrobe."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
              <div className="bg-white border border-[#E7E1D8] rounded-xl p-5">
                <h4 className="font-semibold text-[#171717] text-sm mb-2">{settings.heritageHighlight1Title || "Premium Fabrics"}</h4>
                <p className="text-xs text-[#6B6259]">{settings.heritageHighlight1Text || "Sourced from the best to ensure quality and comfort."}</p>
              </div>
              <div className="bg-white border border-[#E7E1D8] rounded-xl p-5">
                <h4 className="font-semibold text-[#171717] text-sm mb-2">{settings.heritageHighlight2Title || "Expert Tailoring"}</h4>
                <p className="text-xs text-[#6B6259]">{settings.heritageHighlight2Text || "Stitched to perfection for a flawless fit."}</p>
              </div>
              <div className="bg-white border border-[#E7E1D8] rounded-xl p-5">
                <h4 className="font-semibold text-[#171717] text-sm mb-2">{settings.heritageHighlight3Title || "Nationwide Love"}</h4>
                <p className="text-xs text-[#6B6259]">{settings.heritageHighlight3Text || "Trusted by thousands of women across Pakistan."}</p>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-block bg-[#171717] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-black transition-colors"
            >
              Explore All Collections
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
