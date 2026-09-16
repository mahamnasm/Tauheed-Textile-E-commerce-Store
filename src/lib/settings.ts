import { prisma } from "@/lib/prisma";

export interface SiteLayoutSettings {
  // 1. Announcement Ribbon
  announcementText: string;
  announcementSubtext: string;
  announcementEnabled: boolean;
  announcementLink: string;
  announcementTheme: "midnight" | "gold" | "emerald" | "maroon";
  freeShippingThreshold: number;

  // 2. Festive Marquee Ticker
  marqueeEnabled: boolean;
  marqueeText: string;
  marqueeLink: string;

  // 3. Hero Showcase
  showHero: boolean;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnLink: string;
  heroSecondaryBtnText: string;
  heroSecondaryBtnLink: string;
  heroMediaType: "IMAGE" | "VIDEO";
  heroMediaUrl: string;
  heroStats1: string;
  heroStats2: string;
  heroStats3: string;

  // 4. Section Controls & Headings
  showCategories: boolean;
  categoriesTitle: string;
  categoriesSubtitle: string;
  showTrending: boolean;
  trendingTitle: string;
  trendingSubtitle: string;
  showLookbook: boolean;
  lookbookTitle: string;
  showVideos: boolean;
  videosTitle: string;
  showReviews: boolean;
  reviewsTitle: string;
  showHeritage: boolean;

  // 5. Brand Heritage & Story
  heritageBadge: string;
  heritageTitle: string;
  heritageSubtitle: string;
  heritageHighlight1Title: string;
  heritageHighlight1Text: string;
  heritageHighlight2Title: string;
  heritageHighlight2Text: string;
  heritageHighlight3Title: string;
  heritageHighlight3Text: string;

  // 6. Pakistan Trust Bar (Guarantees)
  showTrustBar: boolean;
  trustPerk1Title: string;
  trustPerk1Desc: string;
  trustPerk2Title: string;
  trustPerk2Desc: string;
  trustPerk3Title: string;
  trustPerk3Desc: string;
  trustPerk4Title: string;
  trustPerk4Desc: string;

  // 7. Contact, Concierge & Physical Studio
  contactWhatsApp: string;
  whatsappMessage: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  operatingHours: string;

  // 8. Social Media Channels
  socialInstagram: string;
  socialFacebook: string;
  socialTikTok: string;
  socialYouTube: string;

  // 9. Footer & Copyright
  footerAboutText: string;
  footerCopyright: string;
  newsletterTitle: string;
  newsletterSubtitle: string;

  // 10. Limelight 4 Moving Banners
  banner1Image: string;
  banner1Tag: string;
  banner1SaleBadge: string;
  banner1Title: string;
  banner1Subtitle: string;
  banner1BtnText: string;
  banner1Link: string;

  banner2Image: string;
  banner2Tag: string;
  banner2Title: string;
  banner2Subtitle: string;
  banner2BtnText: string;
  banner2Link: string;

  banner3Image: string;
  banner3Tag: string;
  banner3Title: string;
  banner3Subtitle: string;
  banner3BtnText: string;
  banner3Link: string;

  banner4Image: string;
  banner4Tag: string;
  banner4Title: string;
  banner4Subtitle: string;
  banner4BtnText: string;
  banner4Link: string;
}

export const DEFAULT_SITE_SETTINGS: SiteLayoutSettings = {
  // 1. Announcement Ribbon
  announcementText: "Free Delivery Over Rs. 10,000",
  announcementSubtext: "Flat 5% Off on Advance Payment Orders",
  announcementEnabled: true,
  announcementLink: "/shop?category=sale",
  announcementTheme: "midnight",
  freeShippingThreshold: 10000,

  // 2. Festive Marquee Ticker
  marqueeEnabled: true,
  marqueeText: "⚡ FREE DELIVERY OVER RS. 10,000 • FLAT 5% OFF ON ADVANCE PAYMENT ORDERS • 7-DAY EXCHANGE ONLY • KARACHI 1-2 DAYS • NATIONWIDE 4-7 DAYS",
  marqueeLink: "/shop",

  // 3. Hero Showcase
  showHero: true,
  heroBadge: "Festive Edit 2026 — Live Now",
  heroTitle: "Premium Quality at Best Price",
  heroSubtitle: "Discover authentic luxury lawn, royal embroidered chiffons, and bespoke unstitched designer wear. Crafted with devotion in Pakistan, delivered with care to your doorstep.",
  heroPrimaryBtnText: "Shop Summer Lawn",
  heroPrimaryBtnLink: "/shop?category=lawn-summer",
  heroSecondaryBtnText: "Silk Collection",
  heroSecondaryBtnLink: "/shop?category=silk",
  heroMediaType: "IMAGE",
  heroMediaUrl: "/assets/hero-model.jpg",
  heroStats1: "100%|Pure Swiss & Egyptian Fabrics",
  heroStats2: "COD|Available across Pakistan",
  heroStats3: "1-2 Days|Express Karachi Dispatch",

  // 4. Section Controls & Headings
  showCategories: true,
  categoriesTitle: "Curated Designer Collections",
  categoriesSubtitle: "From effortless daily lawn to breathtaking bridal maxies and saries, discover unstitched luxury woven with Pakistani elegance.",
  showTrending: true,
  trendingTitle: "Trending & New Arrivals",
  trendingSubtitle: "The season's most sought-after silhouettes, crafted in limited boutique batches.",
  showLookbook: true,
  lookbookTitle: "The Couture Editorial",
  showVideos: true,
  videosTitle: "Runway Watch & Buy",
  showReviews: true,
  reviewsTitle: "Customer Voices & Reviews",
  showHeritage: false,

  // 5. Brand Heritage & Story
  heritageBadge: "Designer Couture",
  heritageTitle: "Tauheed Textile — Premium Quality at Best Price",
  heritageSubtitle: "Every thread is an ode to subcontinental needlecraft, woven into breathable Swiss lawns and regal chiffons. Pure unstitched perfection with optional custom stitching via WhatsApp.",
  heritageHighlight1Title: "100% Pure Natural Fibers",
  heritageHighlight1Text: "Finest combed cotton lawn, mulberry silks, and ethereal organzas tested for extreme durability in summer heat.",
  heritageHighlight2Title: "Artisanal Subcontinental Needlework",
  heritageHighlight2Text: "Hand-rendered tilla, sequins, marori, and fine resham embroidery created by master craftsmen.",
  heritageHighlight3Title: "Custom Stitching via WhatsApp",
  heritageHighlight3Text: "Order unstitched or request bespoke made-to-measure tailoring directly via our WhatsApp concierge.",

  // 6. Pakistan Trust Bar
  showTrustBar: true,
  trustPerk1Title: "Nationwide Delivery",
  trustPerk1Desc: "Karachi 1-2 days • Major cities 4-5 days • Regional 5-7 days",
  trustPerk2Title: "Cash On Delivery & Advance Pay",
  trustPerk2Desc: "Pay COD or save 5% on Advance Bank Transfer / Wallet",
  trustPerk3Title: "7-Day Exchange Policy",
  trustPerk3Desc: "Hassle-free 7-day exchange (No returns accepted)",
  trustPerk4Title: "100% Authentic Fabric",
  trustPerk4Desc: "Pure Swiss lawn, genuine chiffon and luxury unstitched",

  // 7. Contact, Concierge & Physical Studio
  contactWhatsApp: "0340 0262732",
  whatsappMessage: "Assalam-o-Alaikum Tauheed Textile, I would like assistance with my order.",
  contactPhone: "0340 0262732",
  contactEmail: "care@tauheedtextile.com",
  contactAddress: "Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan",
  operatingHours: "Monday - Saturday: 1:00 PM - 9:00 PM PKT",

  // 8. Social Media Channels
  socialInstagram: "https://instagram.com/tauheedtextile",
  socialFacebook: "https://facebook.com/tauheedtextile",
  socialTikTok: "https://tiktok.com/@tauheedtextile",
  socialYouTube: "https://youtube.com/@tauheedtextile",

  // 9. Footer & Copyright
  footerAboutText: "Tauheed Textile celebrates the enduring heritage of Pakistani luxury fashion. Crafting breath-taking lawn, royal formal chiffons, bespoke bridal wear, and effortless pret with unrivaled attention to fabric purity and needlework artistry.",
  footerCopyright: "© 2026 Tauheed Textile. All Rights Reserved. Handcrafted in Pakistan.",
  newsletterTitle: "Join the Tauheed Haute Circle",
  newsletterSubtitle: "Receive private previews of limited edition seasonal drops, runway access, and private boutique sales.",

  // 10. Limelight 4 Moving Banners
  banner1Image: "/assets/banners/banner-sale.jpg",
  banner1Tag: "FESTIVE SALE",
  banner1SaleBadge: "SPECIAL DISCOUNT",
  banner1Title: "UP TO 50% OFF",
  banner1Subtitle: "Exclusive seasonal markdowns on luxury stitched & unstitched",
  banner1BtnText: "SHOP SALE",
  banner1Link: "/shop?category=sale",

  banner2Image: "/assets/banners/banner-lawn.jpg",
  banner2Tag: "NEW ARRIVALS 2026",
  banner2Title: "SUMMER LAWN '26",
  banner2Subtitle: "Breathable pure Egyptian cotton lawn with handcrafted dupattas",
  banner2BtnText: "EXPLORE LAWN",
  banner2Link: "/shop?category=lawn-summer",

  banner3Image: "/assets/banners/banner-chiffon.jpg",
  banner3Tag: "LUXURY FORMALS",
  banner3Title: "ROYAL CHIFFON EDIT",
  banner3Subtitle: "Hand-embellished tilla, sequins and master-tailored silhouettes",
  banner3BtnText: "SHOP FORMALS",
  banner3Link: "/shop?category=chiffon-formal",

  banner4Image: "/assets/banners/banner-festive.jpg",
  banner4Tag: "SIGNATURE COUTURE",
  banner4Title: "EVERYDAY ELEGANCE",
  banner4Subtitle: "Timeless ivory & antique gold ensembles for weddings and soirees",
  banner4BtnText: "SHOP COLLECTION",
  banner4Link: "/shop?category=silk",
};

export async function getSiteSettings(): Promise<SiteLayoutSettings> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "site_layout" },
    });

    if (!record || !record.value) {
      return DEFAULT_SITE_SETTINGS;
    }

    const parsed = JSON.parse(record.value);
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch (err) {
    console.error("Error loading site settings:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteLayoutSettings>): Promise<SiteLayoutSettings> {
  const current = await getSiteSettings();
  const merged = { ...current, ...settings };

  await prisma.setting.upsert({
    where: { key: "site_layout" },
    update: {
      value: JSON.stringify(merged),
    },
    create: {
      key: "site_layout",
      value: JSON.stringify(merged),
      description: "Customized storefront layout, hero, and contact settings managed from Admin",
    },
  });

  return merged;
}
