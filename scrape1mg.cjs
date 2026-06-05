const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_FILE = path.join(__dirname, 'src/data/medicines-1mg.json');
const IMG_DIR = path.join(__dirname, 'public/products/1mg');

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      resolve(null);
      return;
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve(null);
    });
  });
}

(async () => {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  console.log('Navigating to 1mg...');
  
  // We will search for a generic term like "vitamin" or go to a category
  await page.goto('https://www.1mg.com/categories/fitness-supplements/vitamins-minerals-9', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  console.log('Loaded category page. Waiting for products...');
  
  // Try to dismiss location popup if it exists
  try {
    const closeBtn = await page.locator('.UpdateCityModal__cancel-btn___2jWwS, .style__close-icon___3FflV');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
    }
  } catch(e) {}
  
  await page.waitForTimeout(5000);
  
  const products = [];
  
  // Select product links
  const productLinks = await page.locator('a[href^="/otc/"]').all();
  console.log(`Found ${productLinks.length} products on this page.`);
  
  // Get first 15 links as a test (we can paginate or search more later, but let's try 15 first to see if it works)
  const linksToScrape = productLinks.slice(0, 15);
  const hrefs = [];
  for (const link of linksToScrape) {
    hrefs.push(await link.getAttribute('href'));
  }
  
  // De-duplicate hrefs
  const uniqueHrefs = [...new Set(hrefs)];
  console.log(`Unique products to scrape: ${uniqueHrefs.length}`);
  
  for (const href of uniqueHrefs) {
    const pPage = await context.newPage();
    const fullUrl = `https://www.1mg.com${href}`;
    console.log(`Scraping: ${fullUrl}`);
    
    try {
      await pPage.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pPage.waitForTimeout(2000);
      
      const name = await pPage.locator('h1').innerText().catch(() => 'Unknown Product');
      const priceText = await pPage.locator('.PriceDetails__discount-div___3-1Qx .PriceDetails__discount-price___25KkO, .PriceBoxPlanOption__offer-price-cp___2QPU_').first().innerText().catch(() => '0');
      const mrpText = await pPage.locator('.PriceDetails__stike-word___10bK9').first().innerText().catch(() => priceText);
      const imageSrc = await pPage.locator('.ProductImage__image___1X1xN').first().getAttribute('src').catch(() => null);
      const desc = await pPage.locator('.ProductDescription__description-content___A_qCZ').first().innerText().catch(() => 'No description available');
      
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      const mrp = parseFloat(mrpText.replace(/[^0-9.]/g, '')) || price;
      
      let localImagePath = null;
      if (imageSrc) {
        const ext = path.extname(new URL(imageSrc).pathname) || '.jpg';
        const filename = name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ext;
        const dest = path.join(IMG_DIR, filename);
        await downloadImage(imageSrc, dest);
        localImagePath = `/products/1mg/${filename}`;
      }
      
      products.push({
        id: href.split('/').pop(),
        name,
        price: mrp,
        discountPrice: price,
        image: localImagePath,
        description: desc.substring(0, 500) + (desc.length > 500 ? '...' : ''),
        category: 'Tablet',
        specifications: {
          'Product Type': 'Supplement',
          'Usage Instructions': 'As directed by physician'
        },
        inStock: true
      });
      
      console.log(`Successfully scraped: ${name} (Price: ${price})`);
    } catch (e) {
      console.log(`Failed to scrape ${fullUrl}: ${e.message}`);
    }
    await pPage.close();
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  console.log(`Done! Saved ${products.length} products to ${OUTPUT_FILE}`);
  
  await browser.close();
})();
