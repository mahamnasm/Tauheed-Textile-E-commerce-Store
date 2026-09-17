import { z } from "zod";
import { NextResponse } from "next/server";
import { firstZodMessage, zodFieldErrors } from "./http";

// Pakistani mobile phone pattern: 03001234567, +923001234567, 923001234567
const phoneRegex = /^(\+92|92|0)?3[0-9]{9}$/;

const optionalPkPhone = z
  .string()
  .trim()
  .max(16)
  .optional()
  .refine((val) => !val || phoneRegex.test(val.replace(/[\s-]/g, "")), {
    message: "Enter a valid Pakistani mobile number",
  });

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(100),
  variantDetails: z.string().max(200).optional().default(""),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  stitchedType: z.string().max(50).optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(50, "Quantity cannot exceed 50 per item"),
  total: z.number().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Name is too long").trim(),
  customerPhone: optionalPkPhone,
  guestPhone: optionalPkPhone,
  customerEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  guestEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  shippingAddress: z.string().min(5, "Delivery address must be at least 5 characters").max(300, "Address is too long").trim().optional(),
  address: z.string().min(5, "Delivery address must be at least 5 characters").max(300, "Address is too long").trim().optional(),
  city: z.string().min(2, "City name is required").max(60, "City name is too long").trim(),
  province: z.string().max(50).optional().default("Punjab"),
  postalCode: z.string().max(10).optional().or(z.literal("")),
  nearestLandmark: z.string().max(150).optional().or(z.literal("")),
  landmark: z.string().max(150).optional().or(z.literal("")),
  subtotal: z.number().nonnegative().optional(),
  shippingFee: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative().optional(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA"]).default("COD"),
  couponCode: z.string().max(30).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one dress"),
  notes: z.string().max(500).optional().or(z.literal("")),
  bankTransferDetails: z
    .object({
        proofImage: z.string().max(500).regex(/^(\/uploads\/|https:\/\/)/, "Invalid receipt path").optional(),
      referenceNumber: z.string().max(100).optional(),
      bankName: z.string().max(100).optional(),
    })
    .optional(),
}).refine((data) => Boolean(data.customerPhone || data.guestPhone), {
  message: "Valid phone number is required",
  path: ["customerPhone"],
}).refine((data) => Boolean(data.shippingAddress || data.address), {
  message: "Delivery address is required",
  path: ["shippingAddress"],
});

export const createProductSchema = z.object({
  title: z.string().min(2, "Product title is required").max(180).trim(),
  sku: z.string().min(2, "SKU is required").max(60).trim(),
  fabric: z.string().min(2, "Fabric is required").max(80).trim(),
  workType: z.string().max(80).optional(),
  description: z.string().max(8000).optional(),
  pieceCount: z.union([z.number(), z.string()]).optional(),
  basePrice: z.union([z.number().positive(), z.string().min(1)]),
  comparePrice: z.union([z.number(), z.string()]).optional().nullable(),
  costPrice: z.union([z.number(), z.string()]).optional(),
  categoryId: z.string().max(80).optional().nullable(),
  collectionId: z.string().max(80).optional().nullable(),
  barcode: z.string().max(80).optional().nullable(),
  videoUrl: z.string().max(500).optional().nullable(),
  imageUrl: z.string().max(500).optional(),
  images: z.array(z.string().max(500)).max(24).optional(),
  initialStock: z.union([z.number(), z.string()]).optional(),
  weight: z.union([z.number(), z.string()]).optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isSale: z.boolean().optional(),
  isPreOrder: z.boolean().optional(),
  preOrderDate: z.string().max(40).optional().nullable(),
  packageIncludes: z.string().max(500).optional(),
  careInstructions: z.string().max(500).optional(),
});

export const createReviewSchema = z.object({
  productId: z.string().min(1).max(80),
  customerName: z.string().min(2).max(80).trim(),
  reviewerCity: z.string().max(80).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(120).optional(),
  comment: z.string().min(8).max(2000).trim(),
  imageUrl: z.string().max(400000).optional(),
});

export const categoryMutationSchema = z.object({
  type: z.enum(["category", "subcategory"]).optional(),
  id: z.string().max(80).optional(),
  name: z.string().min(2).max(80).trim(),
  slug: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  image: z.string().max(500).optional(),
  categoryId: z.string().max(80).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  turnstileToken: z.string().optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  turnstileToken: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  phone: z.string().optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(60).trim(),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  pin: z.string().min(4, "Security PIN is required").max(10).trim(),
  rememberMe: z.boolean().optional().default(false),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(4, "Order number is required").max(50).trim(),
  phone: z.string().min(10, "Registered phone number is required").max(20).trim(),
});

export const verifyCouponSchema = z.object({
  code: z.string().min(2, "Coupon code is required").max(30).trim(),
  subtotal: z.number().nonnegative("Order subtotal must be non-negative"),
});

/**
 * Validates request JSON against Zod schema and returns typed data or sanitized error
 */
export async function validateRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; errorResponse: NextResponse }> {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return {
        success: false,
        errorResponse: NextResponse.json(
          {
            error: firstZodMessage(parsed.error),
            validationErrors: zodFieldErrors(parsed.error),
          },
          { status: 400 }
        ),
      };
    }
    return { success: true, data: parsed.data };
  } catch {
    return {
      success: false,
      errorResponse: NextResponse.json(
        { error: "Invalid JSON request payload" },
        { status: 400 }
      ),
    };
  }
}
