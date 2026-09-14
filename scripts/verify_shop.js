async function testShop() {
  try {
    const res = await fetch('http://localhost:3000/shop');
    console.log('HTTP Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    const brands = ['Nafasat', 'Armani', 'Trendz', 'Shrenz', 'Al-Hassan', 'DesignsNow', 'Tauheed Signature'];
    brands.forEach(b => {
      console.log(`Found "${b}":`, html.includes(b));
    });
  } catch (e) {
    console.error('Error fetching shop:', e.message);
  }
}

testShop();
