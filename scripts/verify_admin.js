async function testAdmin() {
  try {
    const res = await fetch('http://localhost:3000/admin/products');
    console.log('Admin Products Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    console.log('Contains "TT-ZAR-016":', html.includes('TT-ZAR-016'));
    console.log('Contains "6 images":', html.includes('6 images'));
    console.log('Contains "Add New Product":', html.includes('Add New Product'));
    console.log('Contains "Product Gallery":', html.includes('Product Gallery'));
    console.log('Contains "Add Another Image":', html.includes('Add Another Image'));
    console.log('Contains "Quick-Add From Luxury Model":', html.includes('Quick-Add From Luxury Model'));
  } catch (e) {
    console.error('Error in testAdmin:', e.message);
  }
}

testAdmin();
