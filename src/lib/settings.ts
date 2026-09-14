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
}

export const DEFAULT_SITE_SETTINGS: SiteLayoutSettings = {
  // 1. Announcement Ribbon
  announcementText: "Festive Luxury Collection 2026 Live Now",
  announcementSubtext: "Free nationwide courier delivery on orders above Rs. 4,999",
  announcementEnabled: true,
  announcementLink: "/shop?category=sale",
  announcementTheme: "midnight",
  freeShippingThreshold: 4999,

  // 2. Festive Marquee Ticker
  marqueeEnabled: true,
  marqueeText: "⚡ EID LUXURY LAWN DROP NOW LIVE • CASH ON DELIVERY NATIONWIDE • EXCLUSIVE SWISS VOILE & REGAL EMBROIDERY • EXPRESS 2-4 DAY COURIER DISPATCH",
  marqueeLink: "/shop",

  // 3. Hero Showcase
  showHero: true,
  heroBadge: "Festive Edit 2026 — Live Now",
  heroTitle: "Elegance Woven with Pure Heritage",
  heroSubtitle: "Discover authentic luxury lawn, royal embroidered chiffons, and impeccably tailored pret. Crafted with devotion in Pakistan, delivered with care to your doorstep.",
  heroPrimaryBtnText: "Shop Summer Lawn",
  heroPrimaryBtnLink: "/shop?category=lawn-summer",
  heroSecondaryBtnText: "Wedding Royale",
  heroSecondaryBtnLink: "/shop?category=wedding-luxury-pret",
  heroMediaType: "IMAGE",
  heroMediaUrl: "/assets/hero-model.jpg",
  heroStats1: "100%|Pure Swiss & Egyptian Fabrics",
  heroStats2: "COD|Available across Pakistan",
  heroStats3: "2-4 Days|Express Courier Delivery",

  // 4. Section Controls & Headings
  showCategories: true,
  categoriesTitle: "Curated Luxury Collections",
  categoriesSubtitle: "From effortless daily lawn to breathtaking bridal kalidars, discover bespoke silhouettes woven with Pakistani elegance.",
  showTrending: true,
  trendingTitle: "Trending & New Arrivals",
  trendingSubtitle: "The season's most sought-after silhouettes, crafted in limited boutique batches.",
  showLookbook: true,
  lookbookTitle: "The Couture Editorial",
  showVideos: true,
  videosTitle: "Runway Watch & Buy",
  showReviews: true,
  reviewsTitle: "Voices of Elegance",
  showHeritage: true,

  // 5. Brand Heritage & Story
  heritageBadge: "Crafting Luxury Since 1994",
  heritageTitle: "Tauheed Textile — Where Heritage Meets Modern Grace",
  heritageSubtitle: "Every thread is an ode to centuries of subcontinental needlecraft, woven into breathable Swiss lawns and regal chiffons. Exquisite quality, verified nationwide delivery, and dedicated customer care.",
  heritageHighlight1Title: "100% Pure Natural Fibers",
  heritageHighlight1Text: "Finest combed cotton lawn, mulberry silks, and ethereal organzas tested for extreme durability in summer heat.",
  heritageHighlight2Title: "Artisanal Subcontinental Needlework",
  heritageHighlight2Text: "Hand-rendered tilla, sequins, marori, and fine resham embroidery created by master craftsmen in Punjab.",
  heritageHighlight3Title: "Impeccable Pret Tailoring",
  heritageHighlight3Text: "Ready-to-wear perfection featuring structured silhouettes, luxury inner linings, and handcrafted tassels.",

  // 6. Pakistan Trust Bar
  showTrustBar: true,
  trustPerk1Title: "Nationwide Delivery",
  trustPerk1Desc: "TCS, Trax & Leopards to 250+ cities in Pakistan",
  trustPerk2Title: "Cash On Delivery",
  trustPerk2Desc: "Pay cash upon parcel receipt or direct Bank Transfer",
  trustPerk3Title: "7-Day Return Policy",
  trustPerk3Desc: "Customer-first replacement or exchange policy",
  trustPerk4Title: "100% Authentic Fabric",
  trustPerk4Desc: "Pure Swiss lawn, genuine chiffon and master tailoring",

  // 7. Contact, Concierge & Physical Studio
  contactWhatsApp: "0340 0262732",
  whatsappMessage: "Assalam-o-Alaikum Tauheed Textile, I would like assistance with my order.",
  contactPhone: "0340 0262732",
  contactEmail: "care@tauheedtextile.com",
  contactAddress: "Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan",
  operatingHours: "Monday - Saturday: 10:00 AM - 9:00 PM PKT",

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
