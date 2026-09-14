export type UserRole =
  | 'SUPER_ADMIN'
  | 'STORE_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'ORDER_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'MARKETING_MANAGER'
  | 'ACCOUNTANT'
  | 'WAREHOUSE_STAFF'
  | 'CUSTOMER';

export interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  fabric: string;
  workType: string;
  pieceCount: number;
  packageIncludes?: string;
  careInstructions?: string;
  sizeChartJson?: string;
  basePrice: number;
  salePrice?: number | null;
  costPrice: number;
  comparePrice?: number | null;
  inStock: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isSale: boolean;
  isPreOrder: boolean;
  preOrderDate?: string | null;
  videoUrl?: string | null;
  categoryId?: string | null;
  category?: { name: string; slug: string };
  collectionId?: string | null;
  collection?: { name: string; slug: string };
  images: { id: string; url: string; alt?: string; displayOrder: number }[];
  variants: {
    id: string;
    size: string;
    color: string;
    stitchedType: string;
    sku: string;
    priceAdjustment: number;
    stockQuantity: number;
  }[];
  reviews?: { id: string; customerName: string; rating: number; comment: string; createdAt: string }[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
  stitchedType: string;
  quantity: number;
  maxStock: number;
}
