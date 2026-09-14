async function testLayoutAndVideo() {
  try {
    // 1. Check /admin/layout page
    const resLayout = await fetch("http://localhost:3000/admin/layout");
    console.log("Admin Layout Page Status:", resLayout.status);
    const htmlLayout = await resLayout.text();
    console.log("Contains 'Website Layout & Media Customizer':", htmlLayout.includes("Website Layout & Media Customizer"));
    console.log("Contains 'Homepage Section Toggles':", htmlLayout.includes("Homepage Section Toggles"));
    console.log("Contains 'Hero Banner & Announcement':", htmlLayout.includes("Hero Banner & Announcement"));
    console.log("Contains 'Product Videos & Shoppable Reels':", htmlLayout.includes("Product Videos & Shoppable Reels"));

    // 2. Test GET /api/admin/layout
    const resApi = await fetch("http://localhost:3000/api/admin/layout");
    console.log("GET /api/admin/layout Status:", resApi.status);
    const dataApi = await resApi.json();
    console.log("Settings loaded:", Boolean(dataApi.settings));
    console.log("Hero Title:", dataApi.settings?.heroTitle);
    console.log("Total Products in list:", dataApi.products?.length);

    // 3. Attach a video to TT-ZAR-016
    const zarProd = dataApi.products.find(p => p.sku === 'TT-ZAR-016');
    if (zarProd) {
      const updateRes = await fetch("http://localhost:3000/api/admin/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updateProductVideo: {
            productId: zarProd.id,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          },
          newVideo: {
            title: "Zarmisha Runway Walk",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            productId: zarProd.id,
            displayOrder: 0
          }
        })
      });
      const updateData = await updateRes.json();
      console.log("POST /api/admin/layout Status:", updateRes.status, "Success:", updateData.success);
    }

    // 4. Check PDP for TT-ZAR-016 has Watch Runway Reel button & video
    const pdpRes = await fetch("http://localhost:3000/product/zarmisha-noir-gold-kalidar-3-piece-997");
    console.log("PDP Status:", pdpRes.status);
    const pdpHtml = await pdpRes.text();
    console.log("Contains 'Watch Runway Reel':", pdpHtml.includes("Watch Runway Reel"));
    console.log("Contains 'Photo Gallery (6)':", pdpHtml.includes("Photo Gallery (6)"));
  } catch (err) {
    console.error("Verification failed:", err.message);
  }
}

testLayoutAndVideo();
