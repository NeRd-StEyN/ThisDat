const fs = require('fs');

const content = fs.readFileSync('src/data/medicines.js', 'utf-8');

// These 21 are niche company-specific brands whose images can't be found on Google
const idsToRemove = [
  'barkhat',
  'crofzone-sb-injection',
  'diarcal-tablet',
  'gilant-tablet',
  'i-moxy',
  'isshagra-zing-plus',
  'isshagra-100-tablet',
  'losamax',
  'nevocarn-injection',
  'nispazolex',
  'prigishan-tablet',
  'remizone-injection',
  'rostishan-herbal-syrup',
  'serishaan-tablet',
  'travrelax-lozenges',
  'vragglist-plus-suspension',
  'vragglist-suspension',
  'vragglist-tablet',
  'vragripp-p-syrup',
  'vraggripp-plus-sachet',
  'yelmicard-20-tablet'
];

// Parse the medicines array from the JS file
// Find the start of the medicines array
const medicinesStart = content.indexOf('export const medicines = [');
const beforeMedicines = content.substring(0, medicinesStart);

// Extract the medicines array content
let bracketCount = 0;
let arrayStart = content.indexOf('[', medicinesStart);
let arrayEnd = -1;
for (let i = arrayStart; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') bracketCount--;
  if (bracketCount === 0) {
    arrayEnd = i;
    break;
  }
}

const afterMedicines = content.substring(arrayEnd + 1);

// Parse individual product objects
const arrayContent = content.substring(arrayStart + 1, arrayEnd);

// Split into individual product entries
const products = [];
let depth = 0;
let currentStart = -1;

for (let i = 0; i < arrayContent.length; i++) {
  if (arrayContent[i] === '{' && depth === 0) {
    currentStart = i;
  }
  if (arrayContent[i] === '{') depth++;
  if (arrayContent[i] === '}') depth--;
  if (arrayContent[i] === '}' && depth === 0 && currentStart !== -1) {
    const productStr = arrayContent.substring(currentStart, i + 1);
    // Extract the id
    const idMatch = productStr.match(/"id":\s*"([^"]+)"/);
    if (idMatch) {
      products.push({ id: idMatch[1], content: productStr });
    }
    currentStart = -1;
  }
}

console.log('Total products before:', products.length);

// Filter out the products to remove
const filtered = products.filter(p => !idsToRemove.includes(p.id));
const removed = products.filter(p => idsToRemove.includes(p.id));

console.log('Products removed:', removed.length);
console.log('Removed:');
removed.forEach(p => console.log('  -', p.id));

// Check if any IDs to remove were not found
const removedIds = removed.map(p => p.id);
const notFound = idsToRemove.filter(id => !removedIds.includes(id));
if (notFound.length > 0) {
  console.log('\nWARNING - IDs not found in data:');
  notFound.forEach(id => console.log('  -', id));
}

console.log('\nProducts remaining:', filtered.length);

// Rebuild the file
const newArrayContent = filtered.map(p => p.content).join(',\n  ');
const newContent = beforeMedicines + 'export const medicines = [\n  ' + newArrayContent + '\n];' + afterMedicines;

fs.writeFileSync('src/data/medicines.js', newContent, 'utf-8');
console.log('\nFile updated successfully!');
