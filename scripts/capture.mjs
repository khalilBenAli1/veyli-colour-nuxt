import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.DEMO_URL || 'http://127.0.0.1:4204/veyli-colour-nuxt/';
const browser = await chromium.launch();
const results = [];
await mkdir('docs/screenshots', { recursive: true });
const cases = [
  ['home-desktop', 1440, 1000, ''],
  ['home-mobile', 390, 844, ''],
  ['shop-desktop', 1440, 1000, 'shop/'],
  ['shop-mobile', 390, 844, 'shop/'],
  ['product-desktop', 1440, 1000, 'products/satin-stroke/?shade=rose'],
  ['product-mobile', 390, 844, 'products/satin-stroke/?shade=rose'],
  ['look-desktop', 1440, 1000, 'looks/?story=rose'],
  ['look-mobile', 390, 844, 'looks/?story=rose'],
  ['bag-mobile', 390, 844, 'products/satin-stroke/?shade=rose', 'bag'],
  [
    'wishlist-mobile',
    390,
    844,
    'products/satin-stroke/?shade=rose',
    'wishlist',
  ],
  [
    'checkout-desktop',
    1440,
    1000,
    'products/satin-stroke/?shade=rose',
    'checkout',
  ],
  [
    'checkout-mobile',
    390,
    844,
    'products/satin-stroke/?shade=rose',
    'checkout',
  ],
];
for (const [name, width, height, path, action] of cases) {
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
  await page.goto(base + path);
  await expect(page.getByRole('button', { name: /^Open bag,/ })).toBeEnabled();
  if (action === 'wishlist') {
    await page
      .getByRole('button', { name: 'Save this shade', exact: true })
      .click();
    await page
      .getByRole('link', { name: 'Saved shades, 1', exact: true })
      .click();
    await page
      .getByRole('heading', { level: 1, name: /Colour crushes/ })
      .waitFor();
  }
  if (action === 'bag' || action === 'checkout') {
    await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
    const bag = page.getByRole('dialog', {
      name: 'Your colour edit',
      exact: true,
    });
    await bag.waitFor();
    if (action === 'checkout') {
      await bag
        .getByRole('link', { name: 'Continue to checkout', exact: true })
        .click();
      await page
        .getByRole('heading', { name: 'A few little details.', exact: true })
        .waitFor();
    }
  }
  await page.getByRole('heading', { level: 1 }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.images]
      .filter((image) => {
        const box = image.getBoundingClientRect();
        return (
          box.width > 0 &&
          box.top < document.documentElement.clientHeight &&
          box.bottom > 0
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
    url: page.url(),
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
