const fs = require('fs');
const path = require('path');

const mappings = [
  { name: "Zerodol-SP Tablet", file: "Zerodol-SP Tablet.jpg" },
  { name: "Pantocid DSR Capsule", file: "Pantocid DSR Capsule.avif" },
  { name: "Evion 400 Capsule", file: "Evion 400 Capsule.webp" },
  { name: "Limcee Chewable Tablet", file: "Limcee Chewable Tablet.jpg" },
  { name: "Dexorange Syrup", file: "Dexorange Syrup.webp" },
  { name: "Soframycin Skin Cream", file: "Soframycin Skin Cream.jpg" },
  { name: "Quadriderm RF Cream", file: "Quadriderm RF Cream.avif" },
  { name: "Itracoe 100 Capsule", file: "Itracoe 100 Capsule.avif" },
  { name: "Ketomac Shampoo", file: "Ketomac Shampoo.png" },
  { name: "Folvite 5mg Tablet", file: "Folvite 5mg Tablet.avif" },
  { name: "Concor 5 Tablet", file: "Concor 5 Tablet.jpg" },
  { name: "Gluconorm-G 1 Tablet", file: "Gluconorm-G 1 Tablet.webp" },
  { name: "Rosuvas 10 Tablet", file: "Rosuvas 10 Tablet.webp" },
  { name: "Sinarest New Tablet", file: "Sinarest New Tablet.jpg" },
  { name: "Disprin Tablet", file: "Disprin Tablet.webp" },
  { name: "Avil 25 Tablet", file: "Avil 25 Tablet.jpg" },
  { name: "Eno Fruit Salt", file: "Eno Fruit Salt.webp" },
  { name: "Vicks Action 500 Advanced Tablet", file: "Vicks Action 500 Advanced Tablet.avif" },
  { name: "Strepsils Original Lozenges", file: "Strepsils Original Lozenges.jpg" },
  { name: "Imodium Capsule", file: "Imodium Capsule.webp" },
  { name: "Dulcolax Tablet", file: "Dulcolax Tablet.jpg" },
  { name: "Saridon Tablet", file: "Saridon Tablet.avif" },
  { name: "Dabur Honitus Madhuvaani", file: "Dabur Honitus Madhuvaani Syrup.webp" }
];

let content = fs.readFileSync('src/data/medicines.js', 'utf-8');

mappings.forEach(map => {
  const screenshotPath = `/products/${map.file}`;
  
  // Use regex to find and replace the image field for this specific product
  const regex = new RegExp(`("name":\\s*"${map.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"image":\\s*")[^"]+(")`);
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1${screenshotPath}$2`);
    console.log(`Mapped ${map.name} -> ${screenshotPath}`);
  } else {
    console.log(`Could not find product to map: ${map.name}`);
  }
});

fs.writeFileSync('src/data/medicines.js', content, 'utf-8');
console.log('\nMapping of the remaining 23 products complete.');
