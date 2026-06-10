const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/medicines.js', 'utf-8');
const regex = /"image":\s*"([^"]+)"/g;
let match;
const referenced = [];

while ((match = regex.exec(content)) !== null) {
  referenced.push(match[1]);
}

console.log('Total items in medicines data:', referenced.length);

const files = fs.readdirSync('public/products');
console.log('Total image files in public/products:', files.length);

let existsOnDisk = 0;
let missingOnDisk = 0;
const missingList = [];

referenced.forEach(imgPath => {
  const fullPath = path.join('public', imgPath);
  if (fs.existsSync(fullPath)) {
    existsOnDisk++;
  } else {
    missingOnDisk++;
    missingList.push(imgPath);
  }
});

console.log('\n--- Results ---');
console.log('Items with image that EXISTS on disk (correct images):', existsOnDisk);
console.log('Items with image MISSING from disk (will show fallback/default):', missingOnDisk);

if (missingList.length > 0) {
  console.log('\nMissing images:');
  missingList.forEach(m => console.log('  ', m));
}
