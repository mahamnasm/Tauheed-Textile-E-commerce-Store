import { z } from "zod";
import { NextResponse } from "next/server";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantDetails: z.string().optional().default(""),
  price: z.number().nonnegative("Price must be non-negative"),
  costPrice: z.number().optional().default(0),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  total: z.number().nonnegative(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  guestPhone: z.string().min(10, "Valid phone number is required"),
  guestEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City name is required"),
  province: z.string().optional().default("Punjab"),
  postalCode: z.string().optional(),
  landmark: z.string().optional(),
  subtotal: z.number().nonnegative(),
  shippingFee: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA"]).default("COD"),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
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

/**
 * Validates request body using Zod schema. Returns parsed data or error NextResponse.
 */
export async function validateRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; errorResponse: null } | { data: null; errorResponse: NextResponse }> {
  try {
    const json = await req.json();
    const parsed = schema.parse(json);
    return { data: parsed, errorResponse: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        data: null,
        errorResponse: NextResponse.json(
          { error: "Validation Error", details: err.errors },
          { status: 400 }
        ),
      };
    }
    return {
      data: null,
      errorResponse: NextResponse.json(
        { error: "Invalid JSON body payload" },
        { status: 400 }
      ),
    };
  }
}
