async function test() {
  const r = await fetch('http://localhost:3000/product/zarmisha-noir-gold-kalidar-3-piece-997');
  const html = await r.text();
  console.log('Status:', r.status);
  console.log('Includes "Photos":', html.includes('Photos'));
  console.log('Includes "prod-nafasat.jpg":', html.includes('prod-nafasat.jpg'));
  console.log('Includes "prod-armani.jpg":', html.includes('prod-armani.jpg'));
  console.log('Includes "prod-shrenz.jpg":', html.includes('prod-shrenz.jpg'));
  console.log('Includes "prod-velvet.jpg":', html.includes('prod-velvet.jpg'));
  console.log('Includes "prod-alhassan.jpg":', html.includes('prod-alhassan.jpg'));
  console.log('Includes "hero-model.jpg":', html.includes('hero-model.jpg'));
}

test();
