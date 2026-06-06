import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const productsDir = './public/products';
const medicinesFile = './src/data/medicines.js';

async function updateImages() {
    console.log('Reading medicines.js...');
    const medicinesData = fs.readFileSync(medicinesFile, 'utf-8');
    
    const regex = /"name":\s*"([^"]+)",[^}]*"image":\s*"([^"]+)"/g;
    let match;
    const medicines = [];
    while ((match = regex.exec(medicinesData)) !== null) {
        medicines.push({ name: match[1], imagePath: match[2] });
    }

    console.log('Finding default images...');
    const defaultImages = [];
    const files = fs.readdirSync(productsDir);
    for (const file of files) {
        const filePath = path.join(productsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.size === 52784) {
            defaultImages.push('/products/' + file);
        }
    }
    
    const toUpdate = medicines.filter(m => defaultImages.includes(m.imagePath));
    console.log(`Medicines to update: ${toUpdate.length}`);

    if (toUpdate.length === 0) return;

    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (let i = 0; i < toUpdate.length; i++) {
        const item = toUpdate[i];
        const fileName = path.basename(item.imagePath);
        const localPath = path.join(productsDir, fileName);
        
        console.log(`[${i+1}/${toUpdate.length}] Searching for: ${item.name}`);
        
        try {
            // Bing Image search
            await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(item.name + ' medicine')}`);
            await page.waitForSelector('img.mimg', { timeout: 10000 });
            
            const src = await page.evaluate(() => {
                const img = document.querySelector('img.mimg');
                return img ? (img.src || img.getAttribute('data-src')) : null;
            });

            if (src && src.startsWith('http')) {
                console.log(`Found image URL: ${src}`);
                const response = await page.request.get(src);
                const buffer = await response.body();
                fs.writeFileSync(localPath, buffer);
                console.log(`Saved ${localPath}`);
            } else {
                console.log('No image found.');
            }
        } catch (e) {
            console.error(`Error with ${item.name}:`, e.message);
        }
        
        await new Promise(r => setTimeout(r, 1000));
    }

    await browser.close();
    console.log('Done.');
}

updateImages().catch(console.error);
