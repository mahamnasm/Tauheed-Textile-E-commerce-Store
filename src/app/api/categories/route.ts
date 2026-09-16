import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all categories and subcategories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Create category or subcategory
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, slug, description, image, categoryId } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (type === "subcategory") {
      if (!categoryId) {
        return NextResponse.json(
          { success: false, error: "Parent category ID is required for subcategory" },
          { status: 400 }
        );
      }

      const sub = await prisma.subcategory.create({
        data: {
          name: name.trim(),
          slug: generatedSlug,
          categoryId,
        },
      });

      return NextResponse.json({ success: true, subcategory: sub });
    }

    // Category create
    const cat = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        description: description || null,
        image: image || "/assets/banners/banner-lawn.jpg",
      },
    });

    return NextResponse.json({ success: true, category: cat });
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create" },
      { status: 500 }
    );
  }
}

// PATCH: Update category or subcategory
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, name, slug, description, image } = body;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "ID and name are required" },
        { status: 400 }
      );
    }

    if (type === "subcategory") {
      const updatedSub = await prisma.subcategory.update({
        where: { id },
        data: {
          name: name.trim(),
          ...(slug ? { slug } : {}),
        },
      });
      return NextResponse.json({ success: true, subcategory: updatedSub });
    }

    const updatedCat = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(slug ? { slug } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(image ? { image } : {}),
      },
    });

    return NextResponse.json({ success: true, category: updatedCat });
  } catch (error: any) {
    console.error("PATCH /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE: Remove category or subcategory
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "category" or "subcategory"

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (type === "subcategory") {
      await prisma.subcategory.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Subcategory deleted" });
    }

    // Category delete (will cascade delete subcategories if foreign key cascade is configured, or check)
    await prisma.subcategory.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete" },
      { status: 500 }
    );
  }
}
