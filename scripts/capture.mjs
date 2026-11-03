import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
const results = [];
await mkdir('docs/screenshots', { recursive: true });
for (const [name, width, height, route] of [
  ['home-desktop', 1440, 1000, ''],
  ['home-mobile', 390, 844, ''],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  const hydrationWarnings = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
    if (/hydration/i.test(message.text()) && /mismatch/i.test(message.text()))
      hydrationWarnings.push(message.text());
  });
  const base =
    process.env.DEMO_URL || 'http://127.0.0.1:4204/veyli-colour-nuxt/';
  await page.goto(base + route);
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images]
      .filter((image) => {
        const rect = image.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.top < document.documentElement.clientHeight &&
          rect.bottom > 0
        );
      })
      .every((image) => image.complete && image.naturalWidth > 0),
  );
  await page.screenshot({
    path: 'docs/screenshots/' + name + '.jpg',
    type: 'jpeg',
    quality: 88,
  });
  results.push({
    name,
    width,
    height,
    sourceBaseURL: base,
    errors,
    hydrationWarnings,
    overflow: await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  });
  await context.close();
}
await browser.close();
await writeFile(
  'docs/screenshots/capture-report.json',
  JSON.stringify(results, null, 2) + '\n',
);
console.log(results);
