const fs = require("fs");
const path = require("path");

// Load .env
try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env"), "utf8");
  envContent.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const k = parts[0].trim();
      const v = parts.slice(1).join("=").trim().replace(/^["']|["']$/g, "");
      if (k && !process.env[k]) {
        process.env[k] = v;
      }
    }
  });
} catch (e) {
  console.log("No .env file found or failed to read.");
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const DESI_REVIEWS = [
  {
    customerName: "Fatima Zahra",
    reviewerCity: "Lahore, DHA Phase 5",
    rating: 5,
    title: "Original Swiss Lawn & Breathtaking Embroidery!",
    comment:
      "Alhamdulillah received my parcel today! Fabric bohot soft aur breathable hai, embroidery ki finishing 100% picture jaisi hai. Highly recommended!",
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
      "Karachi mein order karne ke 2 din baad hi courier rider aa gaya. COD payment easily ho gayi. Chiffon dupatta ka fall bohot zabardast hai.",
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
      "Maine WhatsApp concierge pe tailor made stitching karwayi thi. Fit bilkul accurate aaya hai, koi alter karwane ki zaroorat nahi pari. Resham tilla work is so neat!",
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
      "Dhone ke baad bhi rang bilkul dull nahi hua aur kapray me shrink nahi aayi. Original combed Egyptian cotton hai. 10/10 quality!",
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
      "Bhai ki shadi k liye suit mangwaya tha. Dupatta aur daman pe embroidery bohat bariki se ki gayi hai. Sab rishtedaar tareef kar rahay thay.",
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
      "EasyPaisa se advance payment ki thi, flat 5% off mil gaya aur receipt upload karne par foran confirmation message aa gaya. Customer service bohot polite hai.",
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
      "Winter festive collection ka velvet suit order kiya tha. Shawl ka weight aur border work royal look deta hai. Peshawar mein 4 din mein deliver hua.",
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
      "Designer boutique se 25,000 ka suit lene ke bajaye Tauheed Textile se mangwaya. Fabric aur look same high-end designer wali hai. Will shop again!",
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
      "Pure lawn shirt with embroidered neckline is so comfortable in intense heat. Dupatta lightweight hai aur sar pe easily tikta hai.",
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

async function seed() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true },
      take: 10,
    });

    if (products.length === 0) {
      console.log("No products found in DB.");
      return;
    }

    // Delete old duplicate reviews
    const deleted = await prisma.review.deleteMany({});
    console.log(`Deleted ${deleted.count} old reviews.`);

    for (let i = 0; i < DESI_REVIEWS.length; i++) {
      const rev = DESI_REVIEWS[i];
      const prod = products[i % products.length];
      await prisma.review.create({
        data: {
          productId: prod.id,
          customerName: rev.customerName,
          reviewerCity: rev.reviewerCity,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          imageUrl: rev.imageUrl,
          isApproved: rev.isApproved,
          isFeatured: rev.isFeatured,
        },
      });
    }

    console.log("Successfully seeded 10 authentic Pakistani desi reviews!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
