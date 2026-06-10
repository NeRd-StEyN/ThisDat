const fs = require('fs');

let content = fs.readFileSync('src/data/medicines.js', 'utf-8');

// The field is either:
// "Source": "1mg Catalog",
// or similar. Let's use regex to remove the entire line containing "Source": "1mg Catalog"
// Be careful with commas
content = content.replace(/\s*"Source"\s*:\s*"1mg Catalog"\s*,?/g, '');

// If it left a trailing comma at the end of the specifications object, clean it up:
content = content.replace(/,\s*\}/g, '\n    }');

fs.writeFileSync('src/data/medicines.js', content, 'utf-8');
console.log('Successfully removed "Source": "1mg Catalog" from medicines.js');
