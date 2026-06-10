const fs = require('fs');
const path = require('path');

// 1. Get chronological list of screenshots
const dir = 'public/products';
const files = fs.readdirSync(dir);
const screenshots = files
  .filter(f => f.startsWith('Screenshot '))
  .sort((a, b) => a.localeCompare(b));

if (screenshots.length !== 22) {
  console.log(`Expected 22 screenshots, found ${screenshots.length}`);
  process.exit(1);
}

// 2. The first 22 names from the missing images list
const first22Names = [
  "Dolo 650 Tablet",
  "Shelcal 500 Tablet",
  "Augmentin 625 Duo Tablet",
  "Volini Pain Relief Gel",
  "Ecosprin 75 Tablet",
  "Electral Powder (ORs)",
  "Benadryl Cough Syrup",
  "Sorbiline Syrup",
  "Becosules Capsules",
  "Liv.52 DS Tablet",
  "Azithral 500 Tablet",
  "Cheston Cold Tablet",
  "Azee 500 Tablet",
  "Crocin Advance Tablet",
  "Omee Capsule",
  "Betadine 2% Ointment",
  "Zifi 200 Tablet",
  "Gelusil MPS Liquid",
  "Calpol 250 Paediatric Drops",
  "Sporlac DS Tablet",
  "Cetzine Tablet",
  "Levocet M Tablet"
];

// 3. Update medicines.js
let content = fs.readFileSync('src/data/medicines.js', 'utf-8');

first22Names.forEach((name, i) => {
  const screenshotPath = `/products/${screenshots[i]}`;
  
  // Create a regex to match the product by name and its image property
  // Since we only need to update the image field for this specific name
  // We can search for: "name": "Dolo 650 Tablet" ... "image": "..."
  const regex = new RegExp(`("name":\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"image":\\s*")[^"]+(")`);
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1${screenshotPath}$2`);
    console.log(`Mapped ${name} -> ${screenshotPath}`);
  } else {
    console.log(`Could not find product to map: ${name}`);
  }
});

fs.writeFileSync('src/data/medicines.js', content, 'utf-8');
console.log('\nMapping complete.');
