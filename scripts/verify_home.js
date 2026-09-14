async function testHome() {
  try {
    const res = await fetch('http://localhost:3000/');
    console.log('Home Status:', res.status);
    const html = await res.text();
    console.log('Home HTML Length:', html.length);
    console.log('Has Noir styling (#0B0A09 or noir/luxury styling):', html.includes('#0B0A09') || html.includes('tauheed-noir') || html.includes('gold'));
    console.log('Has question marks like ?????? in text:', (html.match(/\?{3,}/g) || []).length);
  } catch (e) {
    console.error('Error fetching home:', e.message);
  }
}

testHome();
