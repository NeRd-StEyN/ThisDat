const fs = require('fs');

const badProducts = [
  "Pan 40 Tablet", "Calpol 500+ Tablet", "Allegra 120mg Tablet", "Thyronorm 50mcg Tablet", "Telma 40 Tablet",
  "Zincovit Tablet", "Mucaine Gel Mint", "Ascoril LS Syrup", "Cremaffin Plus Syrup", "Honitus Cough Syrup",
  "Monocef-O 200 Tablet", "Montair LC Tablet", "Aciloc 150 Tablet", "Meftal-Spas Tablet", "Digene Antacid Gel",
  "Neosporin Ointment", "Taxim-O 200 Tablet", "Voveran SR 100 Tablet", "Norflox TZ Tablet", "Enterogermina Suspension",
  "Okacet Tablet", "Combiflam Tablet", "Hifenac-P Tablet", "Rablet D Capsule", "Supradyn Daily Tablet",
  "Neurobion Forte Tablet", "T-Bact Ointment", "Candid-B Cream", "Clocip Dusting Powder", "Lulifin Cream",
  "Scalpe Plus Shampoo", "Orofer XT Tablet", "Amlokind-AT Tablet", "Glycomet-GP 1 Tablet", "Atorva 20 Tablet"
];

let content = fs.readFileSync('src/data/medicines.js', 'utf-8');

// The file format is `export const medicines = [ { ... }, { ... } ];`
// We need to parse it, filter it, and write it back
const regex = /(export const medicines = )(\[[\s\S]*\])(;?)/m;
const match = content.match(regex);

if (match) {
  const arr = eval(match[2]);
  const filtered = arr.filter(p => !badProducts.includes(p.name));
  
  // Convert back to string
  const newArrayStr = JSON.stringify(filtered, null, 2);
  const newContent = content.replace(regex, `$1${newArrayStr}$3`);
  
  fs.writeFileSync('src/data/medicines.js', newContent, 'utf-8');
  console.log(`Removed ${badProducts.length} placeholder products.`);
  console.log(`Catalog size reduced from ${arr.length} to ${filtered.length}.`);
} else {
  console.log('Could not parse medicines.js');
}
