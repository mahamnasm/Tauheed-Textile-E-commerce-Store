async function testMultiImageCreation() {
  const payload = {
    title: "Zarmisha Noir Gold Kalidar 3-Piece",
    sku: "TT-ZAR-016",
    barcode: "896400016001",
    fabric: "Pure Organza & Raw Silk",
    workType: "Antique Gold Tilla & Zari Handwork",
    pieceCount: "3",
    basePrice: "18500",
    comparePrice: "21500",
    costPrice: "8900",
    initialStock: "35",
    description: "Inspired by royal Pakistani couture. Features multi-angle editorial photography with 6 detailed angles.",
    packageIncludes: "Flared Kalidar Gown 5m flare, Embroidered Organza Dupatta 2.5m, Dyed Raw Silk Trouser 2.5m",
    careInstructions: "Dry clean only. Store wrapped in unbleached cotton muslin cloth.",
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    isSale: false,
    // 6 images (> 5 images!)
    images: [
      "/assets/prod-alhassan.jpg",
      "/assets/prod-velvet.jpg",
      "/assets/prod-shrenz.jpg",
      "/assets/prod-nafasat.jpg",
      "/assets/prod-armani.jpg",
      "/assets/hero-model.jpg"
    ]
  };

  try {
    const res = await fetch("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Response Status:", res.status);
    console.log("Success:", data.success);
    if (data.product) {
      console.log("Created Product ID:", data.product.id);
      console.log("Created Product SKU:", data.product.sku);
      console.log("Created Product Images Count:", data.product.images?.length);
    } else {
      console.log("Error details:", data);
    }
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}

testMultiImageCreation();
