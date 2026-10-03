// Captures screenshots of the web UI for documentation.
// Usage: APP_URL=https://localhost:3000 bun scripts/screenshots.ts
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.APP_URL ?? "https://localhost:3000";
const outDir = "docs/screenshots";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
    ignoreHTTPSErrors: true, // self-signed cert
    viewport: { width: 480, height: 860 }, // phone-ish: that's the target device
});
const page = await context.newPage();
page.on("console", (msg) => console.log(`[browser:${msg.type()}]`, msg.text()));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/01-initial-state.png`, fullPage: true });
console.log("saved 01-initial-state.png");

// open the manual position dialog
await page.getByRole("button", { name: "Manual Position" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/02-manual-position-modal.png`, fullPage: true });
console.log("saved 02-manual-position-modal.png");

// stage a position manually (no BLE hardware needed)
await page.getByLabel(/Latitude/).fill("52.5200000");
await page.getByLabel(/Longitude/).fill("13.4050000");
await page.getByLabel(/Altitude/).fill("34.5");
await page.getByRole("button", { name: "Load Position" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/03-staged-position.png`, fullPage: true });
console.log("saved 03-staged-position.png");

// append it to the GIS upload list, then open the type selector
await page.getByRole("button", { name: "Append Staged Position" }).click();
await page.getByRole("button", { name: "Append Staged Position" }).click();
await page.getByPlaceholder("Name").fill("demo-survey");
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/04-gis-upload.png`, fullPage: true });
console.log("saved 04-gis-upload.png");

await browser.close();
console.log("done -> " + outDir);
