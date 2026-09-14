const fs = require('fs');
const path = require('path');
const filePath = process.argv[2];
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, 'utf8');
  console.log('Successfully piped and wrote ' + filePath + ' (' + data.length + ' bytes)');
});
