const fs = require('fs');
const content = fs.readFileSync('src/data/medicines.js', 'utf-8');
const regex = /"name":\s*"([^"]+)"/g;
let match;
const names = [];
while ((match = regex.exec(content)) !== null) {
  names.push(match[1]);
}
names.forEach((n, i) => console.log((i+1) + '. ' + n));
console.log('\nTotal:', names.length);
