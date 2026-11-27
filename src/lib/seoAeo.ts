export interface ProductSeoInput {
  title: string;
  fabric?: string | null;
  categoryName?: string | null;
  subcategoryName?: string | null;
  pieceCount?: number | string | null;
  basePrice?: number | string | null;
}

export interface ProductSeoOutput {
  metaTitle: string;
  metaDesc: string;
  searchTags: string;
  description: string;
}

/**
 * Generates Google SEO & Answer Engine Optimization (AEO) metadata
 * from a product's title, fabric, category, and piece count.
 */
export function generateProductSeoAeo(input: ProductSeoInput): ProductSeoOutput {
  const cleanTitle = (input.title || "").trim();
  const cleanFabric = (input.fabric || "Luxury Pakistani Fabric").trim();
  const cleanCategory = (input.categoryName || "Pakistani Fashion").trim();
  const cleanSubcategory = (input.subcategoryName || "").trim();
  const pieces = Number(input.pieceCount) || 3;
  const priceNum = Number(input.basePrice) || 0;

  if (!cleanTitle) {
    return {
      metaTitle: "",
      metaDesc: "",
      searchTags: "",
      description: "",
    };
  }

  // Google SEO Title (~55-65 chars): Title | Category | Tauheed Textile
  const rawTitle = `${cleanTitle} | ${cleanCategory} | Tauheed Textile`;
  const metaTitle =
    rawTitle.length <= 65
      ? rawTitle
      : `${cleanTitle.slice(0, 48).trim()} | Tauheed Textile`;

  // Google SEO & AEO Snippet (~145-160 chars)
  const pricePhrase = priceNum > 0 ? ` Rs. ${priceNum.toLocaleString()}.` : "";
  const subPhrase = cleanSubcategory ? `${cleanSubcategory} ` : "";
  const rawDesc = `Buy ${cleanTitle} (${pieces}-Piece ${cleanFabric}) in ${subPhrase}${cleanCategory} at Tauheed Textile.${pricePhrase} Unstitched & custom stitched with nationwide COD in Pakistan.`;
  const metaDesc =
    rawDesc.length <= 160
      ? rawDesc
      : `${rawDesc.slice(0, 157).trim()}...`;

  // Search Keywords / AEO Discovery Tags
  const tagParts = [
    cleanTitle.toLowerCase(),
    cleanFabric.toLowerCase(),
    cleanCategory.toLowerCase(),
    cleanSubcategory.toLowerCase(),
    `${pieces} piece`,
    "pakistani suit",
    "unstitched",
    "cash on delivery pakistan",
    "tauheed textile",
  ].filter(Boolean);

  const searchTags = Array.from(new Set(tagParts)).join(", ");

  // Product Narrative Description
  const description = `${cleanTitle} by Tauheed Textile — crafted in ${cleanFabric} as a ${pieces}-Piece ${cleanCategory} ensemble. Available in unstitched fabric with nationwide Cash on Delivery across Pakistan.`;

  return {
    metaTitle,
    metaDesc,
    searchTags,
    description,
  };
}
