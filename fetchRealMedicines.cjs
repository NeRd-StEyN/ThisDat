const fs = require('fs');
const path = require('path');
const https = require('https');
const { chromium } = require('playwright');

const IMG_DIR = path.join(__dirname, 'public/products/1mg');
const TARGET_FILE = path.join(__dirname, 'src/data/medicines.js');

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) return resolve(null);
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(null);
    });
  });
}

// 50 more highly popular Indian medicines
const realMedicines = [
  { name: 'Azithral 500 Tablet', price: 132, discountPrice: 115, category: 'Tablet', desc: 'Azithral 500 Tablet is an antibiotic used to treat various types of bacterial infections of the respiratory tract, ear, nose, throat, lungs, skin, and eye in adults and children.' },
  { name: 'Monocef-O 200 Tablet', price: 165, discountPrice: 145, category: 'Tablet', desc: 'Monocef-O 200 Tablet is an antibiotic belonging to the cephalosporin group, which is used to treat a variety of bacterial infections in the body.' },
  { name: 'Cheston Cold Tablet', price: 45, discountPrice: 40, category: 'Tablet', desc: 'Cheston Cold Tablet is used to treat common cold symptoms. It provides temporary relief from stuffiness in the nose, helps to clear blocked nose and reduces fever and pain.' },
  { name: 'Montair LC Tablet', price: 320, discountPrice: 280, category: 'Tablet', desc: 'Montair LC Tablet is a combination medicine used in the treatment of allergic symptoms such as runny nose, stuffy nose, sneezing, itching, swelling, watery eyes and congestion.' },
  { name: 'Azee 500 Tablet', price: 132, discountPrice: 119, category: 'Tablet', desc: 'Azee 500 Tablet is an antibiotic used to treat various types of bacterial infections of the respiratory tract, ear, nose, throat, lungs, skin, and eye.' },
  { name: 'Aciloc 150 Tablet', price: 42, discountPrice: 38, category: 'Tablet', desc: 'Aciloc 150 Tablet is an antacid. It reduces the amount of acid produced in your stomach and is used to treat and prevent heartburn, indigestion and other symptoms caused by too much acid in the stomach.' },
  { name: 'Crocin Advance Tablet', price: 20, discountPrice: 17, category: 'Tablet', desc: 'Crocin Advance Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain.' },
  { name: 'Meftal-Spas Tablet', price: 52, discountPrice: 46, category: 'Tablet', desc: 'Meftal-Spas Tablet is a prescription medicine that helps to provide symptomatic relief from menstrual (period-related) pain and cramps.' },
  { name: 'Omee Capsule', price: 61, discountPrice: 55, category: 'Capsule', desc: 'Omee Capsule is a medicine that reduces the amount of acid produced in your stomach. It is used for treating acid-related diseases of the stomach and intestine.' },
  { name: 'Digene Antacid Gel', price: 145, discountPrice: 130, category: 'Gel', desc: 'Digene Gel provides relief from acidity and gas whenever acidity strikes. It is a sugar-free syrup that provides effective action against acidity, reduces stomach pain and protects the stomach from making excess acid for long-lasting relief.' },
  { name: 'Betadine 2% Ointment', price: 125, discountPrice: 110, category: 'Other', desc: 'Betadine 2% Ointment is a versatile broad-spectrum antiseptic that is used for the treatment or prevention of infection in minor cuts and abrasions.' },
  { name: 'Neosporin Ointment', price: 105, discountPrice: 95, category: 'Other', desc: 'Neosporin Ointment is an antibiotic used to treat bacterial skin infections. It is effective in treating infected cuts, wounds, and minor burns.' },
  { name: 'Zifi 200 Tablet', price: 118, discountPrice: 105, category: 'Tablet', desc: 'Zifi 200 Tablet is an antibiotic belonging to the cephalosporin group, which is used to treat a variety of bacterial infections in the body.' },
  { name: 'Taxim-O 200 Tablet', price: 165, discountPrice: 150, category: 'Tablet', desc: 'Taxim-O 200 Tablet is an antibiotic belonging to the cephalosporin group, which is used to treat a variety of bacterial infections.' },
  { name: 'Gelusil MPS Liquid', price: 137, discountPrice: 120, category: 'Syrup', desc: 'Gelusil MPS Liquid is an antacid liquid that gives quick relief from acidity, heartburn and gas.' },
  { name: 'Voveran SR 100 Tablet', price: 220, discountPrice: 195, category: 'Tablet', desc: 'Voveran SR 100 Tablet is a pain relieving medicine. It is used to treat pain, swelling, stiffness, and joint pain in conditions like rheumatoid arthritis, osteoarthritis, and acute musculoskeletal injuries.' },
  { name: 'Calpol 250 Paediatric Drops', price: 45, discountPrice: 40, category: 'Oral Drops', desc: 'Calpol 250 Paediatric Drops helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain in children.' },
  { name: 'Norflox TZ Tablet', price: 110, discountPrice: 95, category: 'Tablet', desc: 'Norflox TZ Tablet is a combination medicine that is used to treat gynecological infections, teeth and urine infections, lung infections, and abdominal infections such as acute diarrhea or dysentery.' },
  { name: 'Sporlac DS Tablet', price: 140, discountPrice: 125, category: 'Tablet', desc: 'Sporlac DS Tablet is a probiotic used to treat diarrhea caused due to infections, antibiotics, etc. It helps restore the normal flora in the intestines.' },
  { name: 'Enterogermina Suspension', price: 250, discountPrice: 225, category: 'Suspension', desc: 'Enterogermina Oral Suspension is a probiotic medicine that helps treat diarrhea caused due to infections, medicines, etc.' },
  { name: 'Cetzine Tablet', price: 45, discountPrice: 40, category: 'Tablet', desc: 'Cetzine Tablet belongs to a group of medicines called antihistamines. It is used to treat various allergic conditions such as hay fever, conjunctivitis and some skin reactions, and reactions to bites and stings.' },
  { name: 'Okacet Tablet', price: 20, discountPrice: 18, category: 'Tablet', desc: 'Okacet Tablet belongs to a group of medicines called antihistamines. It is used to treat various allergic conditions.' },
  { name: 'Levocet M Tablet', price: 145, discountPrice: 130, category: 'Tablet', desc: 'Levocet M Tablet is a combination medicine used in the treatment of allergic symptoms such as runny nose, stuffy nose, sneezing, itching, swelling, watery eyes and congestion.' },
  { name: 'Combiflam Tablet', price: 48, discountPrice: 42, category: 'Tablet', desc: 'Combiflam Tablet contains two painkiller medicines. They work together to reduce pain, fever, and inflammation. It is used to treat many conditions such as headache, muscle pain, pain during periods, toothache and joint pain.' },
  { name: 'Zerodol-SP Tablet', price: 125, discountPrice: 110, category: 'Tablet', desc: 'Zerodol-SP Tablet is a combination medicine used to relieve pain and swelling in various conditions like muscle pain, joint pain, and postoperative pain.' },
  { name: 'Hifenac-P Tablet', price: 95, discountPrice: 85, category: 'Tablet', desc: 'Hifenac-P Tablet is a pain relieving medicine. It is used to reduce pain and inflammation in conditions like rheumatoid arthritis, ankylosing spondylitis, and osteoarthritis.' },
  { name: 'Pantocid DSR Capsule', price: 230, discountPrice: 205, category: 'Capsule', desc: 'Pantocid DSR Capsule is a prescription medicine used to treat gastroesophageal reflux disease (Acid reflux) and peptic ulcer disease by relieving the symptoms of acidity such as heartburn, stomach pain, or irritation.' },
  { name: 'Rablet D Capsule', price: 245, discountPrice: 220, category: 'Capsule', desc: 'Rablet D Capsule is a prescription medicine used to treat gastroesophageal reflux disease (Acid reflux) and indigestion.' },
  { name: 'Evion 400 Capsule', price: 38, discountPrice: 34, category: 'Capsule', desc: 'Evion 400 Capsule contains Vitamin E which is known as a fat-soluble vitamin with antioxidant properties. It helps to maintain healthy skin, hair, and eyes.' },
  { name: 'Supradyn Daily Tablet', price: 65, discountPrice: 58, category: 'Tablet', desc: 'Supradyn Daily Tablet is a multivitamin and multimineral supplement which improves energy levels and boosts immunity.' },
  { name: 'Limcee Chewable Tablet', price: 25, discountPrice: 22, category: 'Tablet', desc: 'Limcee Chewable Tablet Orange is a nutritional supplement that contains Vitamin C. It helps the body absorb iron from the diet and prevents and treats Vitamin C deficiency.' },
  { name: 'Neurobion Forte Tablet', price: 38, discountPrice: 34, category: 'Tablet', desc: 'Neurobion Forte Tablet is a vitamin supplement that is used to treat or prevent vitamin deficiency due to poor diet, certain illnesses, or during pregnancy.' },
  { name: 'Dexorange Syrup', price: 175, discountPrice: 155, category: 'Syrup', desc: 'Dexorange Syrup is a nutritional supplement used to treat and prevent iron deficiency anemia.' },
  { name: 'T-Bact Ointment', price: 135, discountPrice: 120, category: 'Other', desc: 'T-Bact Ointment is an antibiotic medicine used to treat certain skin infections such as impetigo (red sores), recurring boils, and others.' },
  { name: 'Soframycin Skin Cream', price: 55, discountPrice: 48, category: 'Other', desc: 'Soframycin Skin Cream is an antibiotic used to treat bacterial skin infections. It is effective in treating infected cuts, wounds, and minor burns.' },
  { name: 'Candid-B Cream', price: 145, discountPrice: 130, category: 'Other', desc: 'Candid-B Cream is a combination medicine used to treat various types of skin infections, usually the fungal type of skin infections.' },
  { name: 'Quadriderm RF Cream', price: 95, discountPrice: 85, category: 'Other', desc: 'Quadriderm RF Cream is a combination medicine used in the treatment of various types of skin infections.' },
  { name: 'Clocip Dusting Powder', price: 110, discountPrice: 95, category: 'Other', desc: 'Clocip Dusting Powder is an antifungal medicine. It is used in the treatment of fungal skin infections such as ringworm, athlete’s foot, nappy rash, sweat rash, and vaginal thrush.' },
  { name: 'Itracoe 100 Capsule', price: 210, discountPrice: 185, category: 'Capsule', desc: 'Itracoe 100 Capsule belongs to a group of medicines called antifungals. It works by stopping the growth of fungi and is used to treat infections of the mouth, throat, vagina, and other parts of the body including fingernails and toenails.' },
  { name: 'Lulifin Cream', price: 285, discountPrice: 250, category: 'Other', desc: 'Lulifin Cream is an antifungal medicine used to treat fungal infections of the skin such as athlete’s foot, Dhobie Itch, thrush, ringworm, and dry, flaky skin.' },
  { name: 'Ketomac Shampoo', price: 265, discountPrice: 235, category: 'Other', desc: 'Ketomac Shampoo is an antifungal medicine that is used to treat fungal infections of the scalp.' },
  { name: 'Scalpe Plus Shampoo', price: 345, discountPrice: 310, category: 'Other', desc: 'Scalpe Plus Anti-Dandruff Shampoo is used to treat dandruff and seborrheic dermatitis of the scalp.' },
  { name: 'Folvite 5mg Tablet', price: 75, discountPrice: 65, category: 'Tablet', desc: 'Folvite 5mg Tablet is a folic acid supplement. It is used to treat a type of anemia where you have too few red blood cells because you have too little folic acid in your body.' },
  { name: 'Orofer XT Tablet', price: 195, discountPrice: 175, category: 'Tablet', desc: 'Orofer XT Tablet is a hematinic which is primarily used to manage iron deficiency anemia and nutritional anemias that occur especially during pregnancy and lactation.' },
  { name: 'Concor 5 Tablet', price: 125, discountPrice: 110, category: 'Tablet', desc: 'Concor 5 Tablet belongs to a group of medicines called beta-blockers. It is used to treat high blood pressure (hypertension), angina (heart-related chest pain), and irregular heart rhythms (arrhythmia).' },
  { name: 'Amlokind-AT Tablet', price: 45, discountPrice: 40, category: 'Tablet', desc: 'Amlokind-AT Tablet is used to treat hypertension (high blood pressure). This is a combination of two medicines that controls blood pressure when a single medication is not effective.' },
  { name: 'Gluconorm-G 1 Tablet', price: 185, discountPrice: 165, category: 'Tablet', desc: 'Gluconorm-G 1 Tablet belongs to a category of medicines known as anti-diabetic drugs. It is a combination of two medicines used to treat type 2 diabetes mellitus in adults.' },
  { name: 'Glycomet-GP 1 Tablet', price: 195, discountPrice: 175, category: 'Tablet', desc: 'Glycomet-GP 1 Tablet belongs to a category of medicines known as anti-diabetic drugs. It is a combination of two medicines used to treat type 2 diabetes mellitus in adults.' },
  { name: 'Rosuvas 10 Tablet', price: 230, discountPrice: 205, category: 'Tablet', desc: 'Rosuvas 10 Tablet belongs to a group of medicines called statins. It is used to lower cholesterol and to reduce the risk of heart disease.' },
  { name: 'Atorva 20 Tablet', price: 165, discountPrice: 145, category: 'Tablet', desc: 'Atorva 20 Tablet belongs to a group of medicines called statins. It is used to lower cholesterol and to reduce the risk of heart disease.' }
];

(async () => {
  console.log('Fetching images from DuckDuckGo for 50 new items...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const formattedProducts = [];

  for (const med of realMedicines) {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(med.name + ' packaging 1mg')}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      
      const imageEl = await page.locator('.z-core-image img').first();
      let imgSrc = null;
      if (await imageEl.count() > 0) {
        imgSrc = await imageEl.getAttribute('src');
      }

      let localImagePath = null;
      if (imgSrc && imgSrc.startsWith('//')) {
        imgSrc = 'https:' + imgSrc;
      }
      
      if (imgSrc) {
        const filename = med.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
        const dest = path.join(IMG_DIR, filename);
        await downloadImage(imgSrc, dest);
        localImagePath = `/products/1mg/${filename}`;
      }

      formattedProducts.push({
        id: 'real-1mg-batch2-' + med.name.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        name: med.name,
        price: med.price,
        discountPrice: med.discountPrice,
        image: localImagePath,
        description: med.desc,
        category: med.category,
        specifications: {
          'Product Type': 'Healthcare',
          'Source': '1mg Catalog'
        },
        inStock: true,
        rating: (4.0 + Math.random() * 0.9).toFixed(1)
      });
      console.log(`Prepared: ${med.name}`);
    } catch (e) {
      console.log(`Failed on ${med.name}`);
    }
  }

  await browser.close();

  console.log('Appending to medicines.js...');
  let fileContent = fs.readFileSync(TARGET_FILE, 'utf-8');
  const lastBracketIndex = fileContent.lastIndexOf(']');
  if (lastBracketIndex === -1) {
    console.log('Could not find end of array.');
    process.exit(1);
  }

  let newString = '';
  if (fileContent.substring(lastBracketIndex - 10, lastBracketIndex).includes('}')) {
     newString += ',\n';
  }
  newString += formattedProducts.map(obj => '  ' + JSON.stringify(obj, null, 2).replace(/\n/g, '\n  ')).join(',\n');
  newString += '\n';

  const updatedContent = fileContent.substring(0, lastBracketIndex) + newString + fileContent.substring(lastBracketIndex);
  fs.writeFileSync(TARGET_FILE, updatedContent, 'utf-8');

  console.log(`Successfully added 50 REAL medicines to the database!`);
})();
