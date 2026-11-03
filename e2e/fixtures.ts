import {
  test as base,
  expect,
  type Page,
  type Locator,
} from '@playwright/test';
export { expect };
interface Diagnostics {
  pageErrors: string[];
  hydrationWarnings: string[];
}
export const test = base.extend<{ diagnostics: Diagnostics }>({
  diagnostics: [
    async ({ page }, use) => {
      const diagnostics: Diagnostics = {
        pageErrors: [],
        hydrationWarnings: [],
      };
      page.on('pageerror', (error) =>
        diagnostics.pageErrors.push(error.message),
      );
      page.on('console', (message) => {
        if (
          /hydration/i.test(message.text()) &&
          /mismatch/i.test(message.text())
        )
          diagnostics.hydrationWarnings.push(message.text());
      });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await use(diagnostics);
      expect(diagnostics.pageErrors).toEqual([]);
      expect(diagnostics.hydrationWarnings).toEqual([]);
    },
    { auto: true },
  ],
});
export async function openRoute(page: Page, path = '') {
  await page.goto(path.replace(/^\//, '') || './');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /^Open bag,/ })).toBeEnabled();
  await page.evaluate(() => document.fonts.ready);
}
export const bag = (page: Page) =>
  page.getByRole('dialog', { name: 'Your colour edit', exact: true });
export async function tabTo(page: Page, target: Locator) {
  const key =
    process.platform === 'darwin' &&
    page.context().browser()?.browserType().name() === 'webkit'
      ? 'Alt+Tab'
      : 'Tab';
  for (let index = 0; index < 120; index++) {
    if (await target.evaluate((element) => element === document.activeElement))
      return;
    await page.keyboard.press(key);
  }
  throw new Error('Target was not reachable by keyboard.');
}
export async function expectNoOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
}
export async function applyDoubleText(
  page: Page,
  selector = '#main h1,#main h2,#main h3,#main p,#main label,#main input,#main select,#main button,#main dd,#main dt,#main output',
) {
  const ratios = await page.locator(selector).evaluateAll((elements) => {
    const snapshot = elements.flatMap((element) => {
      if (!(element instanceof HTMLElement)) return [];
      const original = element.dataset.veyliOriginalFont
        ? Number(element.dataset.veyliOriginalFont)
        : Number.parseFloat(getComputedStyle(element).fontSize);
      element.dataset.veyliOriginalFont = String(original);
      return [{ element, original }];
    });
    for (const item of snapshot)
      item.element.style.fontSize = String(item.original * 2) + 'px';
    return snapshot.map((item) => ({
      original: item.original,
      actual: Number.parseFloat(getComputedStyle(item.element).fontSize),
    }));
  });
  expect(ratios.length).toBeGreaterThan(0);
  for (const ratio of ratios)
    expect(ratio.actual / ratio.original).toBeCloseTo(2, 2);
  return ratios;
}
