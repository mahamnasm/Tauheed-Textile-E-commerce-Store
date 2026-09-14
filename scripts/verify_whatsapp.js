async function verifyWhatsApp() {
  const pages = [
    { url: 'http://localhost:3000/', name: 'Home' },
    { url: 'http://localhost:3000/shop', name: 'Shop' },
    { url: 'http://localhost:3000/product/nafasat-royal-navy-pure-chiffon-3-piece', name: 'Product Detail' },
    { url: 'http://localhost:3000/policies/return-exchange', name: 'Policies' }
  ];

  console.log('Verifying WhatsApp 0340 0262732 across pages:');
  for (const p of pages) {
    try {
      const res = await fetch(p.url);
      const html = await res.text();
      const hasNewNumber = html.includes('0340 0262732') || html.includes('923400262732') || html.includes('03400262732');
      const hasOldNumber = html.includes('0300-1234567') || html.includes('923001234567');
      console.log(`- ${p.name} [${res.status}]: New Number Present: ${hasNewNumber}, Old Number Present: ${hasOldNumber}`);
    } catch (e) {
      console.error(`- ${p.name}: Failed to fetch:`, e.message);
    }
  }
}

verifyWhatsApp();
