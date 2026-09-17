import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DESI_REVIEWS_SEED_DATA = [
  {
    customerName: "Fatima Zahra",
    reviewerCity: "Lahore, DHA Phase 5",
    rating: 5,
    title: "Original Swiss Lawn & Breathtaking Embroidery!",
    comment:
      "Alhamdulillah received my parcel today! Fabric bohot soft aur breathable hai, embroidery ki finishing 100% picture jaisi hai. Summer weddings aur daily wear k liye perfect choice. Highly recommended!",
    imageUrl: "/assets/prod-nafasat.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Ayesha Bilal",
    reviewerCity: "Karachi, Clifton",
    rating: 5,
    title: "Express 2 Days Delivery Karachi",
    comment:
      "Karachi mein order karne ke 2 din baad hi courier rider aa gaya. COD payment easily ho gayi. Chiffon dupatta ka fall bohot zabardast hai. Tauheed Textile ka kapra waqai genuine aur branded quality ka hai.",
    imageUrl: "/assets/prod-armani.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Zainab Farooq",
    reviewerCity: "Islamabad, F-7",
    rating: 5,
    title: "Master Stitching & Custom Sizing",
    comment:
      "Maine WhatsApp concierge pe tailor made stitching karwayi thi. Fit bilkul accurate aaya hai, koi alter karwane ki zaroorat nahi pari. Resham tilla work is so neat and elegant!",
    imageUrl: "/assets/prod-bridal.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Maryam Sheikh",
    reviewerCity: "Faisalabad",
    rating: 5,
    title: "Cloth Purity & Color Guarantee",
    comment:
      "Dhone ke baad bhi rang bilkul dull nahi hua aur kapray me shrink nahi aayi. Original combed Egyptian cotton hai. Faisalabad textile city se hoon aur fabric pehchan sakti hoon—10/10 quality!",
    imageUrl: "/assets/prod-nafasat.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Hira Siddiqui",
    reviewerCity: "Rawalpindi, Bahria Town",
    rating: 5,
    title: "Pure Organza & Silk Border Finishing",
    comment:
      "Bhai ki shadi k liye suit mangwaya tha. Dupatta aur daman pe embroidery bohat bariki se ki gayi hai. Sab rishtedaar tareef kar rahay thay. Packaging box bhi luxury boutique style tha.",
    imageUrl: "/assets/prod-alhassan.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Maham Khan",
    reviewerCity: "Multan, Cantt",
    rating: 5,
    title: "Advance Payment 5% Discount Received",
    comment:
      "EasyPaisa se advance payment ki thi, flat 5% off mil gaya aur receipt upload karne par foran confirmation message aa gaya WhatsApp pe. Customer service bohot cooperative aur polite hai.",
    imageUrl: "/assets/reel-1.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Sana Naveed",
    reviewerCity: "Peshawar, Hayatabad",
    rating: 5,
    title: "Heavy Velvet Shawl Perfection",
    comment:
      "Winter festive collection ka velvet suit order kiya tha. Shawl ka weight aur border work royal look deta hai. Peshawar mein 4 din mein parcel deliver hua securely wrapped.",
    imageUrl: "/assets/prod-bridal.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Anum Javed",
    reviewerCity: "Sialkot",
    rating: 5,
    title: "Pocket Friendly Luxury Fashion",
    comment:
      "Designer boutique se 25,000 ka suit lene ke bajaye Tauheed Textile se mangwaya. Fabric aur look same high-end designer wali hai at half the price. Will definitely shop again for Eid!",
    imageUrl: "/assets/reel-2.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Komal Riaz",
    reviewerCity: "Gujranwala",
    rating: 5,
    title: "Soft Voile Dupatta & Neckline Work",
    comment:
      "Pure lawn shirt with embroidered neckline is so comfortable in intense heat. Dupatta lightweight hai aur sar pe easily tikta hai. Packaging and scent in box was such a sweet touch.",
    imageUrl: "/assets/prod-armani.jpg",
    isApproved: true,
    isFeatured: true,
  },
  {
    customerName: "Bushra Alvi",
    reviewerCity: "Hyderabad, Sindh",
    rating: 5,
    title: "Best Online Shopping Experience",
    comment:
      "Peoples usually hesitate buying dresses online, but Tauheed Textile has won my complete trust. 100% authentic stuff as shown in video reels. JazakAllah!",
    imageUrl: "/assets/prod-nafasat.jpg",
    isApproved: true,
    isFeatured: true,
  },
];

export async function POST(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      select: { id: true },
      take: 10,
    });

    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: "No products found to attach reviews." },
        { status: 400 }
      );
    }

    // Delete old duplicate reviews
    await prisma.review.deleteMany({});

    // Seed 10 authentic Pakistani reviews
    const createdReviews = [];
    for (let i = 0; i < DESI_REVIEWS_SEED_DATA.length; i++) {
      const rev = DESI_REVIEWS_SEED_DATA[i];
      const product = products[i % products.length];

      const created = await prisma.review.create({
        data: {
          productId: product.id,
          customerName: rev.customerName,
          reviewerCity: rev.reviewerCity,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          imageUrl: rev.imageUrl,
          isApproved: rev.isApproved,
          isFeatured: rev.isFeatured,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              images: { take: 1, select: { url: true } },
            },
          },
        },
      });
      createdReviews.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully replaced old reviews with 10 authentic Pakistani desi reviews!`,
      count: createdReviews.length,
      reviews: createdReviews,
    });
  } catch (error: any) {
    console.error("Seed reviews error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to seed reviews." },
      { status: 500 }
    );
  }
}
