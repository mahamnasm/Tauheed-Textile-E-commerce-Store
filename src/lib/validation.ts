import { z } from "zod";
import { NextResponse } from "next/server";

// Pakistani mobile phone pattern: accepts 03001234567, +923001234567, or 10-13 digits
const phoneRegex = /^(\+92|92|0)?3[0-9]{9}$/;

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(100),
  variantDetails: z.string().max(200).optional().default(""),
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  stitchedType: z.string().max(50).optional(),
  price: z.number().nonnegative().optional(),
  costPrice: z.number().optional().default(0),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(50, "Quantity cannot exceed 50 per item"),
  total: z.number().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters").max(100, "Name is too long").trim(),
  customerPhone: z.string().min(10, "Valid phone number required").max(15, "Phone number is too long").trim().optional(),
  guestPhone: z.string().min(10, "Valid phone number required").max(15, "Phone number is too long").trim().optional(),
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
      proofImage: z.string().max(500).optional(),
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
  title: z.string().min(2, "Product title is required"),
  slug: z.string().min(2, "Product slug is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description is required"),
  fabric: z.string().min(2, "Fabric is required"),
  workType: z.string().min(2, "Work type is required"),
  basePrice: z.number().positive("Base price must be positive"),
  salePrice: z.number().optional().nullable(),
  costPrice: z.number().nonnegative().default(0),
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
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
  phone: z.string().min(7, "Registered phone number is required").max(20).trim(),
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
      const firstError = parsed.error.errors[0]?.message || "Invalid input data";
      return {
        success: false,
        errorResponse: NextResponse.json(
          {
            error: firstError,
            validationErrors: parsed.error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
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
