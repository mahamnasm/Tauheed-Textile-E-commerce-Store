import { prisma } from "@/lib/prisma";

export interface SiteLayoutSettings {
  announcementText: string;
  announcementEnabled: boolean;
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
  showHero: boolean;
  showCategories: boolean;
  showTrending: boolean;
  showLookbook: boolean;
  showVideos: boolean;
  showReviews: boolean;
  showHeritage: boolean;
  heritageTitle: string;
  heritageSubtitle: string;
  contactWhatsApp: string;
  contactEmail: string;
  contactAddress: string;
}

export const DEFAULT_SITE_SETTINGS: SiteLayoutSettings = {
  announcementText: "Complimentary Nationwide Delivery On Orders Over Rs. 4,999 • Direct WhatsApp Concierge: 0340 0262732",
  announcementEnabled: true,
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
  showHero: true,
  showCategories: true,
  showTrending: true,
  showLookbook: true,
  showVideos: true,
  showReviews: true,
  showHeritage: true,
  heritageTitle: "Tauheed Textile — Where Heritage Meets Modern Grace",
  heritageSubtitle: "Every thread is an ode to centuries of subcontinental needlecraft, woven into breathable Swiss lawns and regal chiffons. Exquisite quality, verified nationwide delivery, and dedicated customer care.",
  contactWhatsApp: "0340 0262732",
  contactEmail: "care@tauheedtextile.com",
  contactAddress: "Tauheed Textile Flagship Studio, M.M. Alam Road, Gulberg III, Lahore, Pakistan"
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
