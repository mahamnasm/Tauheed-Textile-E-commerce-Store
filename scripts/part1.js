const fs = require('fs');
const path = require('path');

[
  'src', 'src/app', 'src/components', 'src/components/layout', 'src/components/shop', 
  'src/components/cart', 'src/components/admin', 'src/lib', 'src/context', 
  'public', 'public/assets', 'prisma', 'scripts'
].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('Directories verified.');
