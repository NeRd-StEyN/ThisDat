const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/data/medicines.js');
const newDataFile = path.join(__dirname, 'src/data/medicines-netmeds.json');

if (!fs.existsSync(newDataFile)) {
  console.log('No new data found.');
  process.exit(1);
}

const newData = JSON.parse(fs.readFileSync(newDataFile, 'utf-8'));
console.log(`Loaded ${newData.length} new medicines.`);

let fileContent = fs.readFileSync(targetFile, 'utf-8');

// The file ends with exactly this for the medicines array (assuming standard format)
// We just need to insert before the closing bracket of the medicines array.
// Let's find the end of the file or the end of the array.
const lastBracketIndex = fileContent.lastIndexOf(']');
if (lastBracketIndex === -1) {
  console.log('Could not find end of array.');
  process.exit(1);
}

// Convert new data to indented strings
let newString = '';
if (fileContent.substring(lastBracketIndex - 10, lastBracketIndex).includes('}')) {
   // there is an existing object before the bracket
   newString += ',\n';
}

newString += newData.map(obj => '  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ')).join(',\n');
newString += '\n';

const updatedContent = fileContent.substring(0, lastBracketIndex) + newString + fileContent.substring(lastBracketIndex);

fs.writeFileSync(targetFile, updatedContent, 'utf-8');
console.log(`Successfully appended ${newData.length} items to medicines.js`);
