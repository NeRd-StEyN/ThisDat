const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_FILE = path.join(__dirname, 'src/data/medicines-netmeds.json');
const IMG_DIR = path.join(__dirname, 'public/products/1mg'); // user wants them in this folder structure

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

(async () => {
  console.log('Starting Netmeds Scraper...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  await page.goto('https://www.netmeds.com/non-prescriptions/fitness/vitamins-and-supplements', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  
  const productLinks = await page.locator('.category_desc a').all();
  console.log(`Found ${productLinks.length} products on page.`);
  
  const linksToScrape = productLinks.slice(0, 50);
  const hrefs = [];
  for (const link of linksToScrape) {
    hrefs.push(await link.getAttribute('href'));
  }
  
  const uniqueHrefs = [...new Set(hrefs)].filter(h => h && h.includes('/non-prescriptions/'));
  console.log(`Unique products to scrape: ${uniqueHrefs.length}`);
  
  const products = [];
  
  for (const href of uniqueHrefs) {
    const fullUrl = href.startsWith('http') ? href : `https://www.netmeds.com${href}`;
    console.log(`Scraping: ${fullUrl}`);
    const pPage = await context.newPage();
    try {
      await pPage.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pPage.waitForTimeout(1000);
      
      const name = await pPage.locator('h1.black-txt').innerText().catch(() => 'Unknown Product');
      const finalPriceStr = await pPage.locator('.final-price').first().innerText().catch(() => '0');
      const mrpStr = await pPage.locator('.price').first().innerText().catch(() => finalPriceStr);
      const imgUrl = await pPage.locator('.product-image img').first().getAttribute('src').catch(() => null);
      
      let price = parseFloat(finalPriceStr.replace(/[^0-9.]/g, '')) || 0;
      let mrp = parseFloat(mrpStr.replace(/[^0-9.]/g, '')) || price;
      
      if (price === 0) continue;
      
      let localImagePath = null;
      if (imgUrl) {
        const filename = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
        const dest = path.join(IMG_DIR, filename);
        await downloadImage(imgUrl, dest);
        localImagePath = `/products/1mg/${filename}`;
      }
      
      products.push({
        id: href.split('/').pop(),
        name,
        price: mrp,
        discountPrice: price,
        image: localImagePath,
        description: `High quality supplement from Netmeds. Get the best health benefits with ${name}.`,
        category: 'Tablet',
        specifications: { 'Product Type': 'Supplement' },
        inStock: true
      });
      console.log(`Scraped ${name}`);
    } catch(e) {
      console.log(`Error scraping ${href}`);
    }
    await pPage.close();
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  console.log(`Done! Scraped ${products.length} items to ${OUTPUT_FILE}`);
  await browser.close();
})();
