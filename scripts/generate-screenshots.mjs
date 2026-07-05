import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'website', 'screenshots');
const mockups = ['onboarding', 'wizard', 'dashboard', 'checkin', 'learn', 'settings'];

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

for (const name of mockups) {
  const filePath = path.join(root, 'website', 'mockups', `${name}.html`);
  await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    type: 'png',
  });
  console.log(`Generated ${name}.png`);
}

await browser.close();
console.log('Done.');
