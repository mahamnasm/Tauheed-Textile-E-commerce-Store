import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Star,
  Play,
  ShoppingBag,
  Film
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import HomeClientSection from "@/components/home/HomeClientSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [settings, categories, featuredProducts, newArrivals, bestSellers, videos, reviews] = await Promise.all([
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

  // Parse hero stats (e.g. "100%|Pure Swiss Fabrics")
  const parseStat = (statStr: string, defaultVal: string, defaultLabel: string) => {
    if (!statStr) return { value: defaultVal, label: defaultLabel };
    const parts = statStr.split("|");
    return {
      value: parts[0]?.trim() || defaultVal,
      label: parts[1]?.trim() || defaultLabel,
    };
  };

  const stat1 = parseStat(settings.heroStats1, "100%", "Pure Swiss & Egyptian Fabrics");
  const stat2 = parseStat(settings.heroStats2, "COD", "Available across Pakistan");
  const stat3 = parseStat(settings.heroStats3, "2-4 Days", "Express Courier Delivery");

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-ink-black text-sand-100">
      {/* 1. HERO SHOWCASE (ADMIN CONTROLLED) */}
      {settings.showHero && (
        <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center bg-black overflow-hidden border-b border-sand-900/60">
          {/* Background Media */}
          <div className="absolute inset-0 z-0">
            {settings.heroMediaType === "VIDEO" ? (
              <video
                src={settings.heroMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter brightness-75"
              />
            ) : (
              <Image
                src={settings.heroMediaUrl || "/assets/hero-model.jpg"}
                alt="Tauheed Textile Haute Couture Model"
                fill
                priority
                className="object-cover object-top lg:object-center filter brightness-85 transition-transform duration-10000 hover:scale-105"
              />
            )}
            {/* Gradients Overlay for Luxury Noir Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink-black via-ink-black/80 to-transparent lg:w-3/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-transparent to-black/40" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 backdrop-blur-md text-xs font-semibold uppercase tracking-widest animate-fadeIn">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                {settings.heroBadge || "Festive Edit 2026 • Live Now"}
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-50 leading-[1.12] tracking-tight drop-shadow-lg">
                {settings.heroTitle || "Elegance Woven with Pure Heritage"}
              </h1>

              <p className="text-sand-200 text-sm sm:text-base leading-relaxed max-w-xl font-sans drop-shadow">
                {settings.heroSubtitle || "Discover authentic luxury lawn, royal embroidered chiffons, and impeccably tailored pret. Crafted with devotion in Pakistan, delivered with care to your doorstep."}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={settings.heroPrimaryBtnLink || "/shop?category=lawn-summer"}
                  className="px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-ink-black text-xs font-bold uppercase tracking-widest shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 font-serif"
                >
                  {settings.heroPrimaryBtnText || "Shop Summer Lawn"} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={settings.heroSecondaryBtnLink || "/shop?category=wedding-luxury-pret"}
                  className="px-8 py-4 rounded-xl bg-sand-900/60 hover:bg-sand-900 text-sand-100 border border-sand-700/60 backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all duration-300"
                >
                  {settings.heroSecondaryBtnText || "Wedding Royale"}
                </Link>
              </div>

              {/* Dynamic Hero Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sand-800/80 text-sand-300 text-xs">
                <div>
                  <p className="font-serif font-bold text-gold-400 text-lg sm:text-xl">{stat1.value}</p>
                  <p className="text-[11px] text-sand-400">{stat1.label}</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-gold-400 text-lg sm:text-xl">{stat2.value}</p>
                  <p className="text-[11px] text-sand-400">{stat2.label}</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-gold-400 text-lg sm:text-xl">{stat3.value}</p>
                  <p className="text-[11px] text-sand-400">{stat3.label}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FESTIVE SLIDING MARQUEE TICKER (ADMIN CONTROLLED) */}
      {settings.marqueeEnabled && (
        <div className="w-full bg-gold-500 text-ink-black py-3 overflow-hidden whitespace-nowrap border-y border-gold-400 font-bold text-xs uppercase tracking-widest shadow-lg">
          <Link href={settings.marqueeLink || "/shop"} className="hover:opacity-90 transition-opacity flex items-center gap-6 px-4">
            <span className="shrink-0">{settings.marqueeText}</span>
            <span className="text-brand-950 font-black">•</span>
            <span className="shrink-0 hidden md:inline">{settings.marqueeText}</span>
          </Link>
        </div>
      )}

      {/* 2. CURATED CATEGORIES SHOWCASE (ADMIN CONTROLLED) */}
      {settings.showCategories && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-2 mb-8 border-b border-sand-900 pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-gold-400">Explore by Category</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mt-1">
                {settings.categoriesTitle || "Curated Collections"}
              </h2>
              {settings.categoriesSubtitle && (
                <p className="text-xs text-sand-400 mt-1 max-w-xl">
                  {settings.categoriesSubtitle}
                </p>
              )}
            </div>
            <Link 
              href="/shop" 
              className="text-xs font-bold text-gold-400 hover:text-gold-300 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              View All Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-brand-900/80 border border-sand-900 hover:border-gold-500/50 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-[4/5] w-full bg-brand-950 overflow-hidden">
                  <Image
                    src={cat.image || (idx % 2 === 0 ? "/assets/reel-2.jpg" : "/assets/reel-1.jpg")}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/90 via-ink-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-3 inset-x-3 text-center">
                    <h3 className="font-serif font-bold text-xs sm:text-sm text-sand-50 group-hover:text-gold-300 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE PRODUCT FEED (ADMIN CONTROLLED) */}
      {settings.showTrending && (
        <HomeClientSection 
          featuredProducts={featuredProducts} 
          newArrivals={newArrivals} 
          bestSellers={bestSellers} 
        />
      )}

      {/* 4. SHOPPABLE VIDEO REELS / RUNWAY (ADMIN CONTROLLED) */}
      {settings.showVideos && videos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-2 mb-8 border-b border-sand-900 pb-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-gold-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> Models in Motion
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mt-1">
                {settings.videosTitle || "Shoppable Runway Reels"}
              </h2>
            </div>
            <p className="text-xs text-sand-400">
              Watch authentic video walkthroughs and shop the ensemble with one tap
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((v) => (
              <div
                key={v.id}
                className="group relative bg-brand-900 rounded-3xl overflow-hidden border border-sand-900 shadow-xl hover:border-gold-500/50 flex flex-col justify-between transition-all"
              >
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                  <video
                    src={v.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    poster={v.product?.images?.[0]?.url || "/assets/reel-1.jpg"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-ink-black/80 text-gold-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-sand-800 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Runway Reel
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-brand-950 border-t border-sand-900 flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-xs text-sand-50 truncate max-w-[170px]">{v.title}</h4>
                    <span className="text-gold-400 text-xs font-mono font-bold">
                      Rs. {v.product?.basePrice?.toLocaleString()}
                    </span>
                  </div>
                  {v.product && (
                    <Link
                      href={`/product/${v.product.slug}`}
                      className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-ink-black rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 shadow font-serif"
                    >
                      Shop Look
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EDITORIAL CAMPAIGN & LOOKBOOK (ADMIN CONTROLLED) */}
      {settings.showLookbook && (
        <section className="bg-brand-950/80 py-16 border-y border-sand-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-gold-400">Haute Couture Looks</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mt-1">
                {settings.lookbookTitle || "Campaign Lookbook & Spotlight"}
              </h2>
              <p className="text-xs sm:text-sm text-sand-400 mt-2">
                Experience the grace, drape, and needlework precision of our collections styled on our high-fashion muse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Editorial Look 1 */}
              <div className="bg-brand-900 rounded-3xl overflow-hidden shadow-2xl border border-sand-900 hover:border-gold-500/40 flex flex-col group transition-all">
                <div className="relative aspect-[9/14] sm:aspect-[9/13] w-full bg-brand-950 overflow-hidden">
                  <Image
                    src="/assets/reel-1.jpg"
                    alt="Zehra Emerald Chiffon Look"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-ink-black/80 backdrop-blur text-gold-400 text-xs font-bold uppercase tracking-wider shadow border border-sand-800">
                      Festive Edit
                    </span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between bg-brand-950 border-t border-sand-900">
                  <div>
                    <h4 className="font-serif font-bold text-base text-sand-50">Zehra Emerald Cutwork Chiffon</h4>
                    <p className="text-xs text-sand-400 mt-0.5">Micro-sequins & Handcrafted Organza Dupatta</p>
                  </div>
                  <Link
                    href="/product/zehra-pure-chiffon-embroidered-suit"
                    className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-ink-black rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow font-serif"
                  >
                    Shop Look
                  </Link>
                </div>
              </div>

              {/* Editorial Look 2 */}
              <div className="bg-brand-900 rounded-3xl overflow-hidden shadow-2xl border border-sand-900 hover:border-gold-500/40 flex flex-col group transition-all">
                <div className="relative aspect-[9/14] sm:aspect-[9/13] w-full bg-brand-950 overflow-hidden">
                  <Image
                    src="/assets/reel-2.jpg"
                    alt="Gul-e-Noor Luxury Lawn Look"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-ink-black text-xs font-bold uppercase tracking-wider shadow">
                      Summer Voile
                    </span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between bg-brand-950 border-t border-sand-900">
                  <div>
                    <h4 className="font-serif font-bold text-base text-sand-50">Gul-e-Noor Luxury Lawn 3-Piece</h4>
                    <p className="text-xs text-sand-400 mt-0.5">Kashmiri Floral & Handwoven Pure Silk</p>
                  </div>
                  <Link
                    href="/product/gul-e-noor-luxury-lawn-3-piece"
                    className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-ink-black rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow font-serif"
                  >
                    Shop Look
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. VERIFIED CUSTOMER REVIEWS (ADMIN CONTROLLED) */}
      {settings.showReviews && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-400">Trusted by Women Nationwide</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 mt-1">
              {settings.reviewsTitle || "Words of Grace & Appreciation"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-brand-900 p-6 rounded-2xl border border-sand-900 shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-sand-50">{rev.title}</h4>
                  <p className="text-xs text-sand-300 leading-relaxed italic">"{rev.comment}"</p>
                </div>
                <div className="pt-3 border-t border-sand-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sand-100">{rev.customerName}</span>
                    <span className="text-sand-400 block text-[11px]">{rev.product?.title}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sand-950 text-[10px] font-semibold text-gold-400 border border-sand-800">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. BRAND HERITAGE & CRAFTSMANSHIP BANNER (ADMIN CONTROLLED) */}
      {settings.showHeritage && (
        <section className="bg-brand-950 text-sand-100 py-16 px-4 text-center border-t border-sand-900">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-widest border border-gold-500/30">
              {settings.heritageBadge || "Crafting Luxury Since 1994"}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-50">
              {settings.heritageTitle || "Tauheed Textile — Where Heritage Meets Modern Grace"}
            </h3>
            <p className="text-sand-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
              {settings.heritageSubtitle || "Every thread is an ode to centuries of subcontinental needlecraft, woven into breathable Swiss lawns and regal chiffons. Exquisite quality, verified nationwide delivery, and dedicated customer care."}
            </p>

            {/* 3 Heritage Pillars */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-brand-900/60 border border-sand-900 space-y-2">
                <h4 className="font-serif font-bold text-sand-50 text-sm">
                  {settings.heritageHighlight1Title || "100% Pure Natural Fibers"}
                </h4>
                <p className="text-xs text-sand-400 leading-relaxed">
                  {settings.heritageHighlight1Text || "Finest combed cotton lawn, mulberry silks, and ethereal organzas tested for extreme durability in summer heat."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-900/60 border border-sand-900 space-y-2">
                <h4 className="font-serif font-bold text-sand-50 text-sm">
                  {settings.heritageHighlight2Title || "Artisanal Needlework"}
                </h4>
                <p className="text-xs text-sand-400 leading-relaxed">
                  {settings.heritageHighlight2Text || "Hand-rendered tilla, sequins, marori, and fine resham embroidery created by master craftsmen in Punjab."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-brand-900/60 border border-sand-900 space-y-2">
                <h4 className="font-serif font-bold text-sand-50 text-sm">
                  {settings.heritageHighlight3Title || "Impeccable Tailoring"}
                </h4>
                <p className="text-xs text-sand-400 leading-relaxed">
                  {settings.heritageHighlight3Text || "Ready-to-wear perfection featuring structured silhouettes, luxury inner linings, and handcrafted tassels."}
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-ink-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-xl font-serif"
              >
                Explore All Collections
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
