const fs = require('fs');

const content = fs.readFileSync('src/data/medicines.js', 'utf-8');

// 10 company products to remove
const idsToRemove = [
  'aciclodiar-250-500',
  'bolnol-suspension',
  'bolnol-ac-tablet',
  'crotcef-dt-100',
  'crotcef-dt-200',
  'hepanol-plus-capsule',
  'lactidiar-suspension',
  'levofev-250-tablet',
  'omeshan',
  'oflidiar-oz-tablet'
];

// 10 new famous Indian medicines to add (reaching 45 total with placeholders)
const newMedicines = [
  {
    id: "sinarest-new-tablet",
    name: "Sinarest New Tablet",
    category: "Tablet",
    image: "/products/sinarest-new-tablet.jpg",
    shortDescription: "Tablet formulation with Paracetamol 500 mg, Phenylephrine 10 mg, Chlorpheniramine Maleate 2 mg, Caffeine 30 mg.",
    description: "Sinarest New Tablet is a combination cold and flu remedy. Each tablet contains Paracetamol 500 mg, Phenylephrine Hydrochloride 10 mg, Chlorpheniramine Maleate 2 mg, and Caffeine 30 mg. It provides relief from symptoms of common cold, flu, and allergic conditions including headache, body ache, nasal congestion, sneezing, and watery eyes.",
    benefits: [
      "Fast relief from cold and flu symptoms",
      "Reduces nasal congestion and sneezing",
      "Alleviates headache and body pain",
      "Caffeine helps combat drowsiness and fatigue"
    ],
    tags: ["tablet", "sinarest", "cold", "flu", "paracetamol", "phenylephrine", "chlorpheniramine", "caffeine", "otc"],
    price: 42,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "10 Tablets per strip",
      "Composition": "Paracetamol 500 mg, Phenylephrine HCl 10 mg, Chlorpheniramine Maleate 2 mg, Caffeine 30 mg",
      "Shelf Life": "3 years",
      "Indications": "Common cold, Flu, Nasal congestion, Sneezing, Headache, Body ache",
      "Usage Instructions": "Take 1 tablet every 4-6 hours as needed. Do not exceed 4 tablets in 24 hours.",
      "Precautions": "May cause drowsiness. Avoid driving or operating heavy machinery.",
      "Storage": "Store below 25°C in a dry place. Keep out of reach of children.",
      "Disclaimer": "Read the label carefully before use. This is an over-the-counter medicine."
    }
  },
  {
    id: "disprin-tablet",
    name: "Disprin Tablet",
    category: "Tablet",
    image: "/products/disprin-tablet.jpg",
    shortDescription: "Soluble tablet with Aspirin 350 mg for pain relief and fever reduction.",
    description: "Disprin Tablet contains Aspirin (Acetylsalicylic Acid) 350 mg. It is a soluble effervescent tablet used for the relief of mild to moderate pain including headache, toothache, and muscle pain. It also helps in reducing fever. Disprin dissolves quickly in water for faster absorption and action.",
    benefits: [
      "Quick pain relief from headache and toothache",
      "Effective fever reducer",
      "Fast-dissolving effervescent formula",
      "Widely trusted brand for over-the-counter pain relief"
    ],
    tags: ["tablet", "disprin", "aspirin", "pain", "headache", "fever", "effervescent", "otc"],
    price: 18,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "10 Tablets per strip",
      "Composition": "Aspirin (Acetylsalicylic Acid) 350 mg",
      "Shelf Life": "3 years",
      "Indications": "Headache, Toothache, Muscle pain, Fever, Body aches",
      "Usage Instructions": "Dissolve 1-2 tablets in half a glass of water. Take every 4-6 hours as needed.",
      "Precautions": "Not recommended for children under 12 years. Not for patients with bleeding disorders.",
      "Storage": "Store in a cool, dry place below 25°C.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "avil-25-tablet",
    name: "Avil 25 Tablet",
    category: "Tablet",
    image: "/products/avil-25-tablet.jpg",
    shortDescription: "Tablet formulation with Pheniramine Maleate 25 mg for allergy relief.",
    description: "Avil 25 Tablet contains Pheniramine Maleate 25 mg, an antihistamine. It is used for the symptomatic relief of allergic conditions such as hay fever, urticaria (hives), skin rashes, insect bites, and allergic rhinitis. It helps relieve itching, sneezing, runny nose, and watery eyes caused by allergies.",
    benefits: [
      "Effective relief from allergic reactions",
      "Reduces itching, sneezing, and runny nose",
      "Fast-acting antihistamine",
      "Useful for skin allergies and insect bites"
    ],
    tags: ["tablet", "avil", "allergy", "antihistamine", "pheniramine", "itching", "hives"],
    price: 22,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "15 Tablets per strip",
      "Composition": "Pheniramine Maleate 25 mg",
      "Shelf Life": "3 years",
      "Indications": "Allergic rhinitis, Urticaria, Skin allergies, Insect bites",
      "Usage Instructions": "Take 1 tablet 2-3 times daily as directed by the physician.",
      "Precautions": "May cause drowsiness. Avoid driving after taking this medicine.",
      "Storage": "Store in a cool, dry place below 25°C.",
      "Disclaimer": "This is a prescription medicine. Consult your doctor before use."
    }
  },
  {
    id: "eno-fruit-salt",
    name: "Eno Fruit Salt",
    category: "Sachet",
    image: "/products/eno-fruit-salt.jpg",
    shortDescription: "Antacid powder with Sodium Bicarbonate and Citric Acid for quick acidity relief.",
    description: "Eno Fruit Salt is a fast-acting antacid available as an effervescent powder. It contains Sodium Bicarbonate and Citric Acid. It provides quick relief from acidity, heartburn, acid indigestion, and sour stomach. Simply mix with water for instant fizz and fast action. Trusted by millions for over 100 years.",
    benefits: [
      "Provides relief from acidity in just 6 seconds",
      "Fast-acting effervescent formula",
      "Pleasant lemon flavour",
      "Trusted household antacid brand"
    ],
    tags: ["sachet", "eno", "antacid", "acidity", "heartburn", "sodium", "bicarbonate", "citric", "acid", "otc"],
    price: 10,
    specifications: {
      "Product Type": "Sachet",
      "Packing": "5g Sachet",
      "Composition": "Sodium Bicarbonate, Citric Acid Anhydrous, Sodium Carbonate",
      "Shelf Life": "3 years",
      "Indications": "Acidity, Heartburn, Acid indigestion, Sour stomach",
      "Usage Instructions": "Mix one sachet in half a glass of water and drink when the fizz settles.",
      "Precautions": "Consult a doctor if symptoms persist beyond 14 days.",
      "Storage": "Store in a cool, dry place. Protect from moisture.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "vicks-action-500-tablet",
    name: "Vicks Action 500 Advanced Tablet",
    category: "Tablet",
    image: "/products/vicks-action-500-tablet.jpg",
    shortDescription: "Tablet formulation with Paracetamol 500 mg, Phenylephrine 5 mg, Caffeine 25 mg for cold and flu.",
    description: "Vicks Action 500 Advanced Tablet is a multi-symptom cold and flu relief medicine. Each tablet contains Paracetamol 500 mg, Phenylephrine Hydrochloride 5 mg, and Caffeine 25 mg. It provides targeted relief from headache, body ache, fever, nasal congestion and sinus pressure associated with cold and flu.",
    benefits: [
      "Multi-symptom cold and flu relief",
      "Reduces fever and body ache effectively",
      "Clears nasal and sinus congestion",
      "Non-drowsy formula with caffeine"
    ],
    tags: ["tablet", "vicks", "action", "500", "cold", "flu", "paracetamol", "phenylephrine", "caffeine"],
    price: 55,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "10 Tablets per strip",
      "Composition": "Paracetamol 500 mg, Phenylephrine HCl 5 mg, Caffeine 25 mg",
      "Shelf Life": "3 years",
      "Indications": "Cold, Flu, Fever, Headache, Body ache, Nasal congestion",
      "Usage Instructions": "Adults: 1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.",
      "Precautions": "Do not use with other paracetamol-containing products.",
      "Storage": "Store below 25°C in a dry place.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "strepsils-lozenges",
    name: "Strepsils Original Lozenges",
    category: "Lozenges",
    image: "/products/strepsils-lozenges.jpg",
    shortDescription: "Lozenges with Dichlorobenzyl Alcohol 1.2 mg and Amylmetacresol 0.6 mg for sore throat relief.",
    description: "Strepsils Original Lozenges provide effective relief from sore throat and mouth infections. Each lozenge contains 2,4-Dichlorobenzyl Alcohol 1.2 mg and Amylmetacresol 0.6 mg, which are mild antiseptics that help kill bacteria causing sore throat. They soothe the throat and provide a warming sensation.",
    benefits: [
      "Effective relief from sore throat pain",
      "Dual antiseptic action fights throat infections",
      "Soothes irritated throat",
      "Convenient lozenge form"
    ],
    tags: ["lozenges", "strepsils", "sore", "throat", "antiseptic", "cough", "cold", "otc"],
    price: 45,
    specifications: {
      "Product Type": "Lozenges",
      "Packing": "8 Lozenges per pack",
      "Composition": "2,4-Dichlorobenzyl Alcohol 1.2 mg, Amylmetacresol 0.6 mg",
      "Shelf Life": "3 years",
      "Indications": "Sore throat, Mouth infections, Throat irritation",
      "Usage Instructions": "Dissolve 1 lozenge slowly in the mouth every 2-3 hours. Maximum 12 lozenges in 24 hours.",
      "Precautions": "Not recommended for children under 6 years without medical advice.",
      "Storage": "Store below 25°C. Protect from moisture and heat.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "imodium-capsule",
    name: "Imodium Capsule",
    category: "Capsule",
    image: "/products/imodium-capsule.jpg",
    shortDescription: "Capsule formulation with Loperamide Hydrochloride 2 mg for diarrhea relief.",
    description: "Imodium Capsule contains Loperamide Hydrochloride 2 mg, an anti-diarrheal medicine. It works by slowing down the movement of the gut, reducing the number of bowel movements and making the stool less watery. Imodium provides effective relief from acute and chronic diarrhea.",
    benefits: [
      "Fast relief from acute diarrhea",
      "Reduces frequency of bowel movements",
      "Makes stools less watery",
      "Well-established anti-diarrheal brand"
    ],
    tags: ["capsule", "imodium", "loperamide", "diarrhea", "anti-diarrheal", "stomach"],
    price: 32,
    specifications: {
      "Product Type": "Capsule",
      "Packing": "4 Capsules per strip",
      "Composition": "Loperamide Hydrochloride 2 mg",
      "Shelf Life": "3 years",
      "Indications": "Acute diarrhea, Chronic diarrhea, Traveller's diarrhea",
      "Usage Instructions": "Adults: 2 capsules initially, then 1 capsule after each loose stool. Maximum 8 capsules in 24 hours.",
      "Precautions": "Not recommended for children under 12 years. Consult doctor if diarrhea persists beyond 48 hours.",
      "Storage": "Store below 25°C in a dry place.",
      "Disclaimer": "This is a prescription medicine. Consult your doctor before use."
    }
  },
  {
    id: "dulcolax-tablet",
    name: "Dulcolax Tablet",
    category: "Tablet",
    image: "/products/dulcolax-tablet.jpg",
    shortDescription: "Tablet formulation with Bisacodyl 5 mg for relief from constipation.",
    description: "Dulcolax Tablet contains Bisacodyl 5 mg, a stimulant laxative. It works by stimulating the bowel muscles to cause a bowel movement. Dulcolax provides predictable, overnight relief from constipation. It is enteric-coated to ensure the active ingredient is released in the intestine for gentle yet effective action.",
    benefits: [
      "Predictable overnight relief from constipation",
      "Gentle stimulant laxative action",
      "Enteric-coated for targeted release",
      "Trusted brand for bowel regularity"
    ],
    tags: ["tablet", "dulcolax", "bisacodyl", "laxative", "constipation", "bowel"],
    price: 48,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "10 Tablets per strip",
      "Composition": "Bisacodyl 5 mg (enteric-coated)",
      "Shelf Life": "3 years",
      "Indications": "Constipation, Bowel preparation before medical procedures",
      "Usage Instructions": "Adults: 1-2 tablets at bedtime. Swallow whole with water, do not chew or crush.",
      "Precautions": "Do not use daily for more than 7 days without medical advice. Not for children under 10 years.",
      "Storage": "Store below 25°C in a dry place.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "saridon-tablet",
    name: "Saridon Tablet",
    category: "Tablet",
    image: "/products/saridon-tablet.jpg",
    shortDescription: "Tablet formulation with Paracetamol 250 mg, Propyphenazone 150 mg, Caffeine 50 mg for headache relief.",
    description: "Saridon Tablet is a triple-action headache relief formula. Each tablet contains Paracetamol 250 mg, Propyphenazone 150 mg, and Caffeine 50 mg. It provides fast and effective relief from headaches, including tension headaches and migraines. The combination of three active ingredients works synergistically for superior pain relief.",
    benefits: [
      "Triple-action formula for fast headache relief",
      "Works on tension headaches and migraines",
      "Caffeine enhances pain-relieving effect",
      "Trusted headache specialist brand"
    ],
    tags: ["tablet", "saridon", "headache", "paracetamol", "propyphenazone", "caffeine", "migraine", "pain"],
    price: 30,
    specifications: {
      "Product Type": "Tablet",
      "Packing": "10 Tablets per strip",
      "Composition": "Paracetamol 250 mg, Propyphenazone 150 mg, Caffeine 50 mg",
      "Shelf Life": "3 years",
      "Indications": "Headache, Tension headache, Migraine, Toothache, Body pain",
      "Usage Instructions": "Adults: 1-2 tablets with water as needed. Do not exceed 6 tablets in 24 hours.",
      "Precautions": "Not recommended for children under 12 years. Avoid with alcohol.",
      "Storage": "Store below 25°C in a dry place.",
      "Disclaimer": "Read the label carefully before use."
    }
  },
  {
    id: "dabur-honitus-madhuvaani",
    name: "Dabur Honitus Madhuvaani",
    category: "Syrup",
    image: "/products/dabur-honitus-madhuvaani.jpg",
    shortDescription: "Ayurvedic cough syrup with Honey, Tulsi, Mulethi and Banaphsha for cough and cold relief.",
    description: "Dabur Honitus Madhuvaani is an ayurvedic cough and cold remedy. It is formulated with natural ingredients including Honey, Tulsi (Holy Basil), Mulethi (Licorice), Banaphsha (Viola), and other time-tested herbs. It provides relief from cough, cold, sore throat, and chest congestion. Being non-drowsy, it can be taken during the day without affecting daily activities.",
    benefits: [
      "Natural ayurvedic formula for cough relief",
      "Soothes sore throat and chest congestion",
      "Non-drowsy and safe for daily use",
      "Contains honey and natural herbs"
    ],
    tags: ["syrup", "dabur", "honitus", "madhuvaani", "ayurvedic", "cough", "cold", "honey", "tulsi", "herbal"],
    price: 85,
    specifications: {
      "Product Type": "Syrup",
      "Packing": "150 ML Bottle",
      "Composition": "Honey, Tulsi, Mulethi, Banaphsha, and other herbal extracts",
      "Shelf Life": "3 years",
      "Indications": "Cough, Cold, Sore throat, Chest congestion",
      "Usage Instructions": "Adults: 2 teaspoons 3 times a day. Children: 1 teaspoon 3 times a day.",
      "Precautions": "Consult a physician if symptoms persist beyond 7 days.",
      "Storage": "Store in a cool, dry place. Keep the bottle tightly closed.",
      "Disclaimer": "This is an ayurvedic proprietary medicine."
    }
  }
];

// Parse the medicines array
const medicinesStart = content.indexOf('export const medicines = [');
const beforeMedicines = content.substring(0, medicinesStart);

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
    const idMatch = productStr.match(/"id":\s*"([^"]+)"/);
    if (idMatch) {
      products.push({ id: idMatch[1], content: productStr });
    }
    currentStart = -1;
  }
}

console.log('Total products before:', products.length);

// Remove the 10 company products
const filtered = products.filter(p => !idsToRemove.includes(p.id));
const removed = products.filter(p => idsToRemove.includes(p.id));

console.log('Removed ' + removed.length + ' company products:');
removed.forEach(p => console.log('  -', p.id));

// Check for missing removals
const removedIds = removed.map(p => p.id);
const notFound = idsToRemove.filter(id => !removedIds.includes(id));
if (notFound.length > 0) {
  console.log('WARNING - Not found:', notFound);
}

// Add the 10 new famous medicines
const newProductStrings = newMedicines.map(m => JSON.stringify(m, null, 4));

console.log('\nAdded ' + newMedicines.length + ' new famous medicines:');
newMedicines.forEach(m => console.log('  +', m.name));

// Create placeholder image files for new products
const crypto = require('crypto');
const path = require('path');

// We'll copy the existing placeholder for now (they still need real images)
// Actually, let's just create empty placeholder files so the onError fallback works
newMedicines.forEach(m => {
  const imgPath = path.join('public', m.image);
  if (!fs.existsSync(imgPath)) {
    // Don't create a file - let the onError handler show the letter placeholder
    console.log('  (no image file for ' + m.name + ' - will show letter fallback)');
  }
});

// Rebuild the file
const existingContent = filtered.map(p => p.content);
const allContent = [...existingContent, ...newProductStrings];
const newArrayContent = allContent.join(',\n  ');
const newFileContent = beforeMedicines + 'export const medicines = [\n  ' + newArrayContent + '\n];' + afterMedicines;

fs.writeFileSync('src/data/medicines.js', newFileContent, 'utf-8');

// Verify
const verifyContent = fs.readFileSync('src/data/medicines.js', 'utf-8');
const countRegex = /"id":\s*"/g;
let count = 0;
while (countRegex.exec(verifyContent)) count++;
// Subtract category IDs (15 categories)
console.log('\nFinal product count: ' + (count - 15));
console.log('File updated successfully!');
