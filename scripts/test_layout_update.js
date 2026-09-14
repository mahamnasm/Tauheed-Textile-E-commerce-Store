async function testLayoutUpdate() {
  try {
    // Update hero title to a custom headline
    const res = await fetch("http://localhost:3000/api/admin/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: {
          heroTitle: "Elegance Woven with Pure Heritage",
          heroBadge: "Festive Edit 2026 • Live Now"
        }
      })
    });

    const data = await res.json();
    console.log("Update Success:", data.success);

    // Fetch homepage and verify the new title appears
    const homeRes = await fetch("http://localhost:3000/");
    const homeHtml = await homeRes.text();
    console.log("Homepage status:", homeRes.status);
    console.log("Contains updated headline:", homeHtml.includes("Imperial Pakistani Haute Couture 2026"));
    console.log("Contains updated badge:", homeHtml.includes("Exclusive Designer Showcase • Autumn Edition"));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testLayoutUpdate();
