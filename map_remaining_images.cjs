const fs = require('fs');
const path = require('path');

const dir = 'public/products';
const files = fs.readdirSync(dir);

// Get all screenshots and sort them chronologically
const screenshots = files
  .filter(f => f.startsWith('Screenshot '))
  .sort((a, b) => a.localeCompare(b));

// We previously mapped the first 22. So the remaining 23 should be from index 22 to the end.
if (screenshots.length < 45) {
  console.log(`Expected at least 45 screenshots, found ${screenshots.length}`);
  process.exit(1);
}

const remainingScreenshots = screenshots.slice(22, 45); // take the next 23

// The last 23 names from the missing images list (indices 22 to 44)
const missingNames = [
  "Dolo 650 Tablet", "Shelcal 500 Tablet", "Augmentin 625 Duo Tablet", "Volini Pain Relief Gel", "Ecosprin 75 Tablet",
  "Electral Powder (ORs)", "Benadryl Cough Syrup", "Sorbiline Syrup", "Becosules Capsules", "Liv.52 DS Tablet",
  "Azithral 500 Tablet", "Cheston Cold Tablet", "Azee 500 Tablet", "Crocin Advance Tablet", "Omee Capsule",
  "Betadine 2% Ointment", "Zifi 200 Tablet", "Gelusil MPS Liquid", "Calpol 250 Paediatric Drops", "Sporlac DS Tablet",
  "Cetzine Tablet", "Levocet M Tablet",
  "Zerodol-SP Tablet", "Pantocid DSR Capsule", "Evion 400 Capsule", "Limcee Chewable Tablet", "Dexorange Syrup",
  "Soframycin Skin Cream", "Quadriderm RF Cream", "Itracoe 100 Capsule", "Ketomac Shampoo", "Folvite 5mg Tablet",
  "Concor 5 Tablet", "Gluconorm-G 1 Tablet", "Rosuvas 10 Tablet", "Sinarest New Tablet", "Disprin Tablet",
  "Avil 25 Tablet", "Eno Fruit Salt", "Vicks Action 500 Advanced Tablet", "Strepsils Original Lozenges", "Imodium Capsule",
  "Dulcolax Tablet", "Saridon Tablet", "Dabur Honitus Madhuvaani"
];

const remainingNames = missingNames.slice(22); // get the last 23 names

let content = fs.readFileSync('src/data/medicines.js', 'utf-8');

remainingNames.forEach((name, i) => {
  const screenshotPath = `/products/${remainingScreenshots[i]}`;
  
  // Use regex to find and replace the image field for this specific product
  const regex = new RegExp(`("name":\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[\\s\\S]*?"image":\\s*")[^"]+(")`);
  
  if (regex.test(content)) {
    content = content.replace(regex, `$1${screenshotPath}$2`);
    console.log(`Mapped ${name} -> ${screenshotPath}`);
  } else {
    console.log(`Could not find product to map: ${name}`);
  }
});

fs.writeFileSync('src/data/medicines.js', content, 'utf-8');
console.log('\nMapping of the remaining 23 products complete.');
