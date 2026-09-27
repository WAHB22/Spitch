// Renders scripts/og.html to public/og.png (1200x630). Run after changing the design:
//   npm i -D playwright && npx playwright install chromium && node scripts/make-og.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";

const html = fileURLToPath(new URL("./og.html", import.meta.url));
const out = fileURLToPath(new URL("../public/og.png", import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${html}`);
await page.evaluate(() => document.fonts.ready);
await page.locator(".card").screenshot({ path: out });
await browser.close();
console.log("wrote", out);
