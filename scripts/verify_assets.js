async function testAssets() {
  const images = [
    '/assets/hero-model.jpg',
    '/assets/reel-1.jpg',
    '/assets/reel-2.jpg',
    '/assets/prod-meher.jpg',
    '/assets/prod-bridal.jpg',
    '/assets/prod-velvet.jpg',
    '/assets/prod-bano.jpg',
    '/assets/prod-nafasat.jpg',
    '/assets/prod-armani.jpg',
    '/assets/prod-trendz.jpg',
    '/assets/prod-shrenz.jpg',
    '/assets/prod-alhassan.jpg',
    '/assets/prod-designsnow.jpg'
  ];

  console.log('Testing image asset endpoints:');
  for (const img of images) {
    try {
      const res = await fetch(`http://localhost:3000${img}`);
      console.log(`[${res.status}] ${img} (${res.headers.get('content-length')} bytes)`);
    } catch (e) {
      console.error(`[FAIL] ${img}:`, e.message);
    }
  }
}

testAssets();
