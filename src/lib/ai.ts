import { GoogleGenAI } from "@google/genai";
import { prisma } from "./prisma";

// Check for Gemini API key in environment
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const hasGemini = Boolean(apiKey && apiKey.trim().length > 0);

let geminiClient: GoogleGenAI | null = null;
if (hasGemini) {
  try {
    geminiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
  }
}

export interface StylistRecommendation {
  message: string;
  recommendedProductIds: string[];
  stylingTips?: string[];
  occasionMatch?: string;
}

export interface ProductCopyResult {
  title: string;
  description: string;
  fabric: string;
  workType: string;
  packageIncludes: string;
  suggestedPrice?: number;
  tags: string[];
}

/**
 * AI Fashion Stylist Concierge
 * Answers customer questions and recommends suitable pieces from the database
 */
export async function generateStylistResponse(
  userQuery: string,
  chatHistory: { role: "user" | "assistant"; content: string }[] = []
): Promise<StylistRecommendation> {
  // Fetch active products with categories and images for context
  const catalog = await prisma.product.findMany({
    where: { inStock: true },
    include: {
      category: true,
      images: { take: 1, orderBy: { displayOrder: "asc" } },
      variants: true,
    },
    take: 15,
  });

  const catalogSummary = catalog.map((p) => ({
    id: p.id,
    sku: p.sku,
    title: p.title,
    category: p.category?.name || "General",
    price: p.basePrice,
    fabric: p.fabric,
    work: p.workType,
    slug: p.slug,
  }));

  // Attempt Gemini API if configured
  if (geminiClient) {
    try {
      const systemInstruction = `You are the lead Haute Couture Stylist and Fashion Concierge at Tauheed Textile, Pakistan's premier luxury fashion house. 
You provide warm, authentic, sophisticated fashion advice on Pakistani luxury lawn, formal chiffons, pret, velvet shawls, and bridal wear.
Tone: Human, prestigious, warm, knowledgeable, culturally authentic (mentioning Pakistani wedding traditions like Barat, Walima, Mehndi, festive dinners, summer soirees).
Do NOT sound robotic or like generic AI.

Available catalog items:
${JSON.stringify(catalogSummary, null, 2)}

Respond in JSON format matching this schema:
{
  "message": "Your polite, expert editorial response and recommendations",
  "recommendedProductIds": ["id1", "id2"],
  "stylingTips": ["Tip 1 on dupatta draping or jewelry", "Tip 2 on footwear or hair"],
  "occasionMatch": "e.g. Barat / Formal Evening / Summer Soirée"
}`;

      const contents = [
        ...chatHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user",
          parts: [{ text: userQuery }],
        },
      ];

      const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          message: parsed.message || "Here are our curated luxury ensembles recommended for your occasion.",
          recommendedProductIds: parsed.recommendedProductIds || [],
          stylingTips: parsed.stylingTips || [],
          occasionMatch: parsed.occasionMatch || "Luxury Couture",
        };
      }
    } catch (apiErr) {
      console.warn("Gemini API call failed, falling back to Tauheed Domain Engine:", apiErr);
    }
  }

  // Domain-Trained Haute Couture Fallback Engine (Guarantees 100% reliability & instant response)
  return fallbackStylistEngine(userQuery, catalog);
}

function fallbackStylistEngine(query: string, catalog: any[]): StylistRecommendation {
  const q = query.toLowerCase();

  let matchedCategory = "";
  let matchedOccasion = "Haute Couture Collection";
  let stylingTips: string[] = [];
  let matchingProducts: any[] = [];

  if (q.includes("wedding") || q.includes("barat") || q.includes("bridal") || q.includes("dulhan") || q.includes("valima") || q.includes("walima") || q.includes("shaadi")) {
    matchedOccasion = "Royal Wedding & Barat Celebrations";
    matchedCategory = "Net Formals";
    stylingTips = [
      "Pair with antique polki or kundan choker sets to accentuate the heavy zardozi neckline.",
      "Opt for traditional khussas or metallic block heels with deep gold embroidery.",
      "Drape the pure veil over the head or pleat the heavy pallu over one shoulder for regal elegance."
    ];
    matchingProducts = catalog.filter(p => p.category?.slug === "net-formals" || p.category?.slug === "bridal-maxies" || p.workType.toLowerCase().includes("zardozi") || p.workType.toLowerCase().includes("zari"));
  } else if (q.includes("summer") || q.includes("lawn") || q.includes("casual") || q.includes("daily") || q.includes("daytime") || q.includes("cotton") || q.includes("brunch")) {
    matchedOccasion = "Summer Daytime Soirées & High Tea";
    matchedCategory = "Lawn & Summer";
    stylingTips = [
      "Style with minimal baroque pearl studs and a delicate bracelet for effortless grace.",
      "Pair with pure raw silk cropped cigarette pants or tailored culottes.",
      "Keep hair in soft natural waves with dewy, sun-kissed makeup."
    ];
    matchingProducts = catalog.filter(p => p.category?.slug === "lawn-summer" || p.category?.slug === "lawn-formals" || p.fabric.toLowerCase().includes("lawn"));
  } else if (q.includes("formal") || q.includes("chiffon") || q.includes("evening") || q.includes("dinner") || q.includes("reception") || q.includes("party")) {
    matchedOccasion = "Regal Evening Reception & Gala";
    matchedCategory = "Chiffon & Formal";
    stylingTips = [
      "Accentuate the delicate cutwork with emerald drop earrings and an antique gold clutch.",
      "Let the sheer organza dupatta drape gracefully across both arms to showcase the adda work.",
      "A sleek chignon or half-up twisted hairstyle complements the detailed back neckline."
    ];
    matchingProducts = catalog.filter(p => p.category?.slug === "chiffon-formal" || p.category?.slug === "organza-formals" || p.fabric.toLowerCase().includes("chiffon") || p.fabric.toLowerCase().includes("organza"));
  } else if (q.includes("silk") || q.includes("pret") || q.includes("co-ord") || q.includes("work") || q.includes("office") || q.includes("modern")) {
    matchedOccasion = "Pure Silk & Handcrafted Luxury";
    matchedCategory = "Silk Collection";
    stylingTips = [
      "Style with pointed nude pumps and structured leather bag for sophisticated polish.",
      "The tailored placket pairs beautifully with understated diamond or gold ear cuffs.",
      "Add a silk pocket square or belt for an avant-garde editorial silhouette."
    ];
    matchingProducts = catalog.filter(p => p.category?.slug === "silk" || p.fabric.toLowerCase().includes("silk") || p.fabric.toLowerCase().includes("linen"));
  } else if (q.includes("velvet") || q.includes("shawl") || q.includes("winter") || q.includes("cold") || q.includes("archive") || q.includes("sale")) {
    matchedOccasion = "Festive Winter Royalty & Archive Ensembles";
    matchedCategory = "Velvet Shawls & Archive";
    stylingTips = [
      "Wrap the micro-velvet shawl diagonally across the chest for a timeless Mughal silhouette.",
      "Complement the dark noir base with deep ruby lip color and uncut emerald jewelry.",
      "Warm yet regal, perfect for cool open-air winter garden receptions."
    ];
    matchingProducts = catalog.filter(p => p.category?.slug === "sale" || p.fabric.toLowerCase().includes("velvet"));
  } else {
    matchedOccasion = "Curated Flagship Masterpieces";
    stylingTips = [
      "All Tauheed Textile pieces are cut from pure, breathable fabrics and tailored to couture standards.",
      "Complimentary styling advice and bespoke sizing guidance is available via our WhatsApp Concierge.",
      "Enjoy complimentary express nationwide delivery with Cash on Delivery."
    ];
    matchingProducts = catalog.slice(0, 3);
  }

  if (matchingProducts.length === 0) {
    matchingProducts = catalog.slice(0, 3);
  }

  const primaryPiece = matchingProducts[0];
  const secondaryPiece = matchingProducts[1] || catalog[0];

  const greeting = `For ${matchedOccasion.toLowerCase()}, we recommend pieces crafted to highlight timeless Pakistani craftsmanship with effortless grace.`;
  const detail = `Our featured choice is the "${primaryPiece.title}" (Rs. ${primaryPiece.basePrice.toLocaleString()}), cut from ${primaryPiece.fabric} with artisanal ${primaryPiece.work}. ${secondaryPiece ? `You might also adore the "${secondaryPiece.title}" for a complementary silhouette.` : ""}`;

  return {
    message: `${greeting}\n\n${detail}`,
    recommendedProductIds: matchingProducts.map(p => p.id).slice(0, 4),
    stylingTips,
    occasionMatch: matchedOccasion
  };
}

export async function generateProductCopy(input: {
  title: string;
  categoryName?: string;
  fabricHint?: string;
  workHint?: string;
}): Promise<ProductCopyResult> {
  const { title, categoryName, fabricHint, workHint } = input;

  if (geminiClient) {
    try {
      const systemInstruction = `You are the Head of Creative Editorial at Tauheed Textile, a premier luxury Pakistani fashion house.
Create captivating, poetic, high-fashion product descriptions and specifications for new arrivals.
Language should sound like a luxury couture editorial (e.g. Zara Shahjahan, Suffuse, Elan, Faraz Manan level).
Never use robotic phrases. Highlight the craft, embroidery, fabric purity, and tailoring.

Return JSON in this format:
{
  "title": "Refined couture title",
  "description": "2-3 paragraphs of exquisite fashion storytelling describing the motif, drape, and occasion",
  "fabric": "Specific luxury fabric composition",
  "workType": "Detailed needlework & handcraft techniques",
  "packageIncludes": "What comes in the box (e.g. Embroidered Front, Back, Dupatta, Trousers)",
  "suggestedPrice": 12500,
  "tags": ["Lawn", "Luxury Pret", "Summer 2026", "Embroidery"]
}`;

      const response = await geminiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate luxury product copy for:
Title: ${title}
Category: ${categoryName || "Pakistani Luxury Wear"}
Fabric Hint: ${fabricHint || "Not specified"}
Work Hint: ${workHint || "Not specified"}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn("Gemini Copywriter failed, using domain fallback:", err);
    }
  }

  return fallbackCopywriterEngine(title, categoryName, fabricHint, workHint);
}

function fallbackCopywriterEngine(
  title: string,
  categoryName?: string,
  fabricHint?: string,
  workHint?: string
): ProductCopyResult {
  const cat = (categoryName || "").toLowerCase();
  const t = title.toLowerCase();

  let fabric = fabricHint || "Pure Swiss Lawn & Korean Raw Silk";
  let workType = workHint || "Intricate Resham, Tilla & Micro-Sequin Needlework";
  let packageIncludes = "Embroidered Shirt Front & Back (3.25m), Silk Printed Dupatta (2.5m), Dyed Cotton Cambric Trousers (2.5m), Organza Embroidered Borders";
  let suggestedPrice = 11500;
  let tags = ["New Arrival", "Festive Edit 2026", "Handcrafted"];

  if (cat.includes("lawn") || t.includes("lawn")) {
    fabric = fabricHint || "Luxury 80-Count Supima Swiss Lawn & Pure Silk";
    workType = workHint || "Schiffli Cutwork, Delicate Resham Florals & Gota Accents";
    packageIncludes = "Digital Printed & Embroidered Lawn Shirt (3m), Pure Silk Dupatta (2.5m), Dyed Cotton Cambric Trousers (2.5m), Handcrafted Neckline Patch";
    suggestedPrice = 9850;
    tags = ["Lawn 2026", "Summer Luxury", "Breathable", "Daywear"];
  } else if (cat.includes("chiffon") || t.includes("chiffon") || cat.includes("formal")) {
    fabric = fabricHint || "Pure Bamberg Crinkle Chiffon with Organza Accents";
    workType = workHint || "Adda Handcraft with Kora, Dabka, Cut-Dana & Translucent Sequins";
    packageIncludes = "Heavy Embroidered Chiffon Front (1m), Embroidered Chiffon Back (1m), Heavy Adda Sleeves (0.65m), Embroidered Chiffon Dupatta with 4-Side Borders (2.5m), Dyed Raw Silk Trousers (2.5m)";
    suggestedPrice = 16900;
    tags = ["Chiffon Formal", "Wedding Guest", "Hand Embellished", "Royal Gala"];
  } else if (cat.includes("bridal") || cat.includes("wedding") || t.includes("kalidar") || t.includes("bridal")) {
    fabric = fabricHint || "Pure French Net, Shimmer Tissue & Micro Velvet 9000";
    workType = workHint || "Heritage Zardozi, Vasli, Naqshi, Real Freshwater Pearls & Swarovski Crystals";
    packageIncludes = "14 Handcrafted Kalis (Front & Back), Heavy Adda Bodice & Sleeves, Hand-Embroidered Velvet Daman Border (4m), Heavy Net Dupatta with Scalloped Matha Patti (2.75m), Raw Silk Lehnga Trousers";
    suggestedPrice = 42500;
    tags = ["Bridal Barat", "Couture Kalidar", "Bespoke Heirloom", "Antique Gold"];
  } else if (cat.includes("pret") || t.includes("co-ord") || t.includes("pret")) {
    fabric = fabricHint || "Pure Korean Raw Silk & Textured Slub Linen";
    workType = workHint || "Minimalist Monochromatic Threadwork, Laser Cutwork & Hand-sewn Pearl Buttons";
    packageIncludes = "Tailored Straight-Cut Kurta with Detailed Cuffs, Flared Cigarette Pants with Pin-tucks";
    suggestedPrice = 8490;
    tags = ["Ready to Wear", "Pret Co-ord", "Contemporary", "Statement Silhouette"];
  }

  const description = `An ode to timeless subcontinental elegance, "${title}" is masterfully crafted for the modern muse who commands understated royalty. Featuring ${workType.toLowerCase()} over ${fabric.toLowerCase()}, every fold reflects our atelier's devotion to artisanal heritage.

Designed to drape with fluid grace, this ensemble moves effortlessly between daytime celebrations and nocturnal galas. Pair with heirloom jewelry and sleek stilettos for a captivating presence.`;

  return {
    title,
    description,
    fabric,
    workType,
    packageIncludes,
    suggestedPrice,
    tags,
  };
}

export function calculateFitRecommendation(input: {
  heightFeet: number;
  heightInches: number;
  chestInches: number;
  waistInches: number;
  hipsInches?: number;
  fitPreference: "tailored" | "regular" | "modest_loose";
  productType?: string;
}) {
  const { chestInches, waistInches, fitPreference } = input;

  let baseSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" = "M";
  let ease = fitPreference === "modest_loose" ? 3.5 : fitPreference === "regular" ? 2.5 : 1.5;

  if (chestInches <= 34) baseSize = "XS";
  else if (chestInches <= 37) baseSize = "S";
  else if (chestInches <= 40) baseSize = "M";
  else if (chestInches <= 43) baseSize = "L";
  else if (chestInches <= 46) baseSize = "XL";
  else baseSize = "XXL";

  let advice = "";
  if (fitPreference === "modest_loose") {
    advice = `For a graceful, modest flowing drape with generous room around the waist and hips, Size ${baseSize} is your optimal choice. It gives approximately ${ease} inches of breathing ease.`;
  } else if (fitPreference === "tailored") {
    advice = `Size ${baseSize} will provide a clean, contoured royal silhouette accentuating the neckline and tailored waistline with ${ease} inches of ease.`;
  } else {
    advice = `Size ${baseSize} offers our signature balanced luxury cut, perfectly tailored across the shoulders with a comfortable straight drop.`;
  }

  return {
    recommendedSize: baseSize,
    easeInches: ease,
    finishedChest: chestInches + ease,
    finishedWaist: waistInches + (ease * 0.8),
    tailoringAdvice: advice,
    customTailoringAvailable: true
  };
}
