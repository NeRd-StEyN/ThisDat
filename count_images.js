const fs = require('fs');
const content = fs.readFileSync('src/data/medicines.js', 'utf-8');
const regex = /"image":\s*"([^"]+)"/g;
let match;
let unique = 0;
let placeholder = 0;

while ((match = regex.exec(content)) !== null) {
  const img = match[1];
  if (img === '/products/placeholder.jpg' || img.includes('placeholder') || img.includes('default') || img === '') {
    placeholder++;
  } else {
    unique++;
  }
}
console.log(`Unique images: ${unique}, Placeholder images: ${placeholder}, Total matched: ${unique + placeholder}`);
