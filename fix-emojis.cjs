const fs = require('fs');
let data = fs.readFileSync('src/data/medicines.js', 'utf8');
data = data.replace(/"💊"/g, '"Pill"')
           .replace(/"🧴"/g, '"Droplets"')
           .replace(/"🍬"/g, '"Candy"')
           .replace(/"🩸"/g, '"Droplet"')
           .replace(/"💉"/g, '"Syringe"')
           .replace(/"💧"/g, '"Droplets"')
           .replace(/"⚕️"/g, '"Stethoscope"')
           .replace(/"🧪"/g, '"FlaskConical"')
           .replace(/"🫙"/g, '"Beaker"');
fs.writeFileSync('src/data/medicines.js', data);
