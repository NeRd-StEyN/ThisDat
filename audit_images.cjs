const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const productsDir = path.join('public', 'products');
const files = fs.readdirSync(productsDir);

// Hash each file
const hashMap = {};
files.forEach(file => {
  const filePath = path.join(productsDir, file);
  const stat = fs.statSync(filePath);
  if (!stat.isFile()) return;
  
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  
  if (!hashMap[hash]) hashMap[hash] = [];
  hashMap[hash].push({ file, size: stat.size });
});

// Find groups of identical files
console.log('=== IDENTICAL IMAGE FILES (same content, different names) ===\n');
let totalDuplicates = 0;
Object.entries(hashMap)
  .filter(([hash, files]) => files.length > 1)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([hash, files]) => {
    totalDuplicates += files.length;
    console.log('Hash: ' + hash + ' (size: ' + files[0].size + ' bytes) - ' + files.length + ' files:');
    files.forEach(f => console.log('  - ' + f.file));
    console.log('');
  });

// Now match these back to product names
const content = fs.readFileSync('src/data/medicines.js', 'utf-8');
const productRegex = /"id":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]+)"/g;
let match;
const products = [];
while ((match = productRegex.exec(content)) !== null) {
  products.push({ id: match[1], name: match[2], category: match[3], image: match[4] });
}

console.log('\n=== PRODUCTS WITH DUPLICATE/DEFAULT IMAGES ===\n');
Object.entries(hashMap)
  .filter(([hash, files]) => files.length > 1)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([hash, fileGroup]) => {
    const fileNames = fileGroup.map(f => f.file);
    const matchingProducts = products.filter(p => {
      const imgFile = p.image.split('/').pop();
      return fileNames.includes(imgFile);
    });
    
    if (matchingProducts.length > 0) {
      console.log('--- Group (hash: ' + hash.substring(0,8) + '..., ' + matchingProducts.length + ' products) ---');
      matchingProducts.forEach(p => {
        console.log('  ' + p.name + ' [' + p.category + '] -> ' + p.image);
      });
      console.log('');
    }
  });

console.log('\n=== SUMMARY ===');
console.log('Total image files: ' + files.length);
console.log('Total unique images (by content): ' + Object.keys(hashMap).length);
console.log('Total duplicate image files: ' + totalDuplicates);
console.log('Total truly unique files: ' + Object.values(hashMap).filter(v => v.length === 1).length);
