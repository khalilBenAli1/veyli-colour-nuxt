import AxeBuilder from '@axe-core/playwright';
import {
  test,
  expect,
  openRoute,
  bag,
  expectNoOverflow,
  applyDoubleText,
  tabTo,
} from './fixtures';
import { products } from '../data/catalog';
import { STORAGE_KEY } from '../adapters/persistence';

test('rapid category/search/finish/family changes compose in the URL and survive reload/reset', async ({
  page,
}) => {
  await openRoute(page, 'shop/');
  await page.getByRole('button', { name: 'Lips', exact: true }).click();
  await expect(page).toHaveURL(/category=Lips/);
  const finish = await page.getByLabel(/^Finish/).elementHandle();
  const family = await page.getByLabel(/^Shade family/).elementHandle();
  await page
    .getByRole('searchbox', { name: 'Search products and shades' })
    .evaluate(
      (input, controls) => {
        if (
          !(input instanceof HTMLInputElement) ||
          !(controls.finish instanceof HTMLSelectElement) ||
          !(controls.family instanceof HTMLSelectElement)
        )
          throw new Error('Catalogue controls missing.');
        input.value = 'stain';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        controls.finish.value = 'Matte';
        controls.finish.dispatchEvent(new Event('change', { bubbles: true }));
        controls.family.value = 'Coral';
        controls.family.dispatchEvent(new Event('change', { bubbles: true }));
      },
      { finish, family },
    );
  await expect(page).toHaveURL(/q=stain/);
  await expect(page).toHaveURL(/finish=Matte/);
  await expect(page).toHaveURL(/family=Coral/);
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: 'Velvet Stain', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /^Open bag,/ })).toBeEnabled();
  await expect(
    page.getByRole('searchbox', { name: 'Search products and shades' }),
  ).toHaveValue('stain');
  await expect(page.getByLabel(/^Finish/)).toHaveValue('Matte');
  await expect(page.getByLabel(/^Shade family/)).toHaveValue('Coral');
  await page
    .getByRole('searchbox', { name: 'Search products and shades' })
    .fill('no such colour');
  await expect(
    page.getByRole('heading', { name: /Another shade of possibility/ }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Explore all colour', exact: true })
    .click();
  await expect(page.getByRole('article')).toHaveCount(10);
  await page
    .getByRole('combobox', { name: 'Sort products', exact: true })
    .selectOption('price-asc');
  await expect(page).toHaveURL(/sort=price-asc/);
  const titles = await page
    .getByRole('article')
    .getByRole('heading', { level: 3 })
    .allTextContents();
  expect(titles[0]).toBe('Line Theory');
});

test('named Satin shades switch the matching photo and variant-aware wishlist survives reload, including unavailable colour', async ({
  page,
}) => {
  await openRoute(page, 'products/satin-stroke/?shade=rose');
  await expect(
    page.getByRole('radio', { name: 'Rose', exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole('img', { name: 'Rose / Satin Stroke', exact: true }),
  ).toHaveAttribute('src', /satin-stroke-rose[.]webp$/);
  await page
    .getByRole('button', { name: 'Save this shade', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Saved in Rose', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('radio', { name: /Brick/ }).check();
  await expect(
    page.getByRole('img', { name: 'Brick / Satin Stroke', exact: true }),
  ).toHaveAttribute('src', /satin-stroke-brick[.]webp$/);
  await expect(
    page.getByRole('button', { name: 'Shade unavailable', exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('button', { name: 'Save this shade', exact: true })
    .click();
  await page
    .getByRole('link', { name: 'Saved shades, 2', exact: true })
    .click();
  await expect(page.getByRole('article')).toHaveCount(2);
  await page.reload();
  await expect(page.getByRole('article')).toHaveCount(2);
  const roseCard = page.getByRole('article').filter({
    has: page.getByRole('button', {
      name: 'Unsave Satin Stroke in Rose',
      exact: true,
    }),
  });
  const brickCard = page.getByRole('article').filter({
    has: page.getByRole('button', {
      name: 'Unsave Satin Stroke in Brick',
      exact: true,
    }),
  });
  await expect(roseCard.locator('img')).toBeVisible();
  await expect(roseCard.locator('img')).toHaveAttribute(
    'src',
    /satin-stroke-rose[.]webp$/,
  );
  await expect(brickCard.locator('img')).toBeVisible();
  await expect(brickCard.locator('img')).toHaveAttribute(
    'src',
    /satin-stroke-brick[.]webp$/,
  );
  await page
    .getByRole('button', { name: 'Unsave Satin Stroke in Rose', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: /Colour crushes/ }),
  ).toBeFocused();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(
    page.getByRole('button', {
      name: 'Unsave Satin Stroke in Brick',
      exact: true,
    }),
  ).toBeVisible();
});

test('bag merges identical shades, preserves different shades, bounds quantities and resets only its own storage', async ({
  page,
}) => {
  await openRoute(page, 'products/satin-stroke/');
  await page.evaluate(() =>
    localStorage.setItem('another-demo:sentinel', 'keep'),
  );
  const add = page.getByRole('button', { name: 'Add to bag', exact: true });
  await add.click();
  await expect(bag(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await add.click();
  await expect(
    bag(page).getByLabel('Quantity of Satin Stroke Berry'),
  ).toHaveText('2');
  await page.keyboard.press('Escape');
  await page.getByRole('radio', { name: 'Rose', exact: true }).check();
  await add.click();
  await expect(bag(page).getByRole('article')).toHaveCount(2);
  await page.reload();
  await page
    .getByRole('button', { name: 'Open bag, 3 pieces', exact: true })
    .click();
  await expect(bag(page).getByRole('article')).toHaveCount(2);
  const increase = bag(page).getByRole('button', {
    name: 'Increase Satin Stroke Berry',
    exact: true,
  });
  await increase.click();
  await increase.click();
  await expect(increase).toBeDisabled();
  await expect(
    bag(page).getByLabel('Quantity of Satin Stroke Berry'),
  ).toHaveText('4');
  await expect(bag(page).getByText('€160', { exact: true })).toHaveCount(2);
  await bag(page)
    .getByRole('button', { name: 'Remove Satin Stroke Rose', exact: true })
    .click();
  await expect(bag(page).getByRole('article')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await page
    .getByRole('button', { name: 'Reset bag + saved shades', exact: true })
    .click();
  await page
    .getByRole('dialog', { name: 'A fresh colour canvas?', exact: true })
    .getByRole('button', { name: 'Clear my edit', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Open bag, 0 pieces', exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate(() => localStorage.getItem('another-demo:sentinel')),
  ).toBe('keep');
  expect(
    await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY),
  ).toBeNull();
});

test('a reduced colour story recomputes its total and adds the remaining compatible pieces', async ({
  page,
}) => {
  await openRoute(page, 'looks/?story=rose');
  await expect(page.getByText('€130', { exact: true })).toBeVisible();
  await page
    .getByRole('button', { name: 'Remove Eyes from look', exact: true })
    .click();
  await expect(page.getByText('€68', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Choose eyes', { exact: true })).toHaveValue('');
  await page
    .getByRole('button', { name: 'Add look to bag', exact: true })
    .click();
  await expect(bag(page).getByRole('article')).toHaveCount(2);
  await expect(bag(page).getByText('€73', { exact: true })).toBeVisible();
  await expect(
    bag(page).getByRole('heading', { name: 'Satin Stroke', exact: true }),
  ).toBeVisible();
  await expect(
    bag(page).getByRole('heading', { name: 'Soft Signal', exact: true }),
  ).toBeVisible();
});

test('a stock conflict rejects the whole look without partially adding its other pieces', async ({
  page,
}) => {
  await openRoute(page, 'products/fourfold-eyes/?shade=plum-story');
  await page
    .getByRole('button', {
      name: 'Increase Fourfold Eyes Plum Story',
      exact: true,
    })
    .click();
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await expect(
    bag(page).getByLabel('Quantity of Fourfold Eyes Plum Story'),
  ).toHaveText('2');
  await page.keyboard.press('Escape');
  await openRoute(page, 'looks/?story=rose');
  await page
    .getByRole('button', { name: 'Add look to bag', exact: true })
    .click();
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: /reached its available quantity/ }),
  ).toBeVisible();
  await expect(bag(page)).not.toBeVisible();
  await page
    .getByRole('button', { name: 'Open bag, 2 pieces', exact: true })
    .click();
  await expect(bag(page).getByRole('article')).toHaveCount(1);
  await expect(
    bag(page).getByRole('heading', { name: 'Fourfold Eyes', exact: true }),
  ).toBeVisible();
  await expect(
    bag(page).getByText('Your total', { exact: true }).locator('..'),
  ).toContainText('€124');
});

test('mobile menu and product gallery retain keyboard focus through Escape and rapid reopen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openRoute(page, 'products/satin-stroke/');
  const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
  const menu = page.getByRole('dialog', {
    name: 'Make room for colour',
    exact: true,
  });
  for (let index = 0; index < 3; index++) {
    await trigger.focus();
    await trigger.press('Enter');
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await trigger.press('Enter');
  await menu
    .getByRole('link', { name: 'Our point of view', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: /Colour has no one way/ }),
  ).toBeVisible();
  await openRoute(page, 'products/satin-stroke/');
  const photo = page.getByRole('button', {
    name: 'Enlarge Satin Stroke photograph',
    exact: true,
  });
  await photo.focus();
  await photo.press('Enter');
  const gallery = page.getByRole('dialog', {
    name: 'Satin Stroke · closer look',
    exact: true,
  });
  await expect(gallery).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(photo).toBeFocused();
  await tabTo(page, page.getByRole('radio', { name: 'Berry', exact: true }));
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('radio', { name: 'Rose', exact: true }),
  ).toBeChecked();
});

test('all products have static HTML, real font faces and a deliberate404', async ({
  page,
  request,
}) => {
  for (const product of products) {
    const response = await request.get('products/' + product.id + '/');
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('<h1>' + product.name + '</h1>');
  }
  await openRoute(page, '');
  expect(
    await page.evaluate(
      () =>
        document.fonts.check('700 16px Syne') &&
        document.fonts.check('400 16px Figtree'),
    ),
  ).toBe(true);
  const response = await page.goto('not-a-colour/');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: /A little off palette/ }),
  ).toBeVisible();
});
for (const width of [320, 390, 768, 1440])
  test(
    'cold catalogue/product/look/wishlist layouts reflow at' + width + 'px',
    async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        '',
        'shop/?category=Lips&finish=Satin',
        'products/satin-stroke/?shade=rose',
        'looks/?story=warm',
        'wishlist/',
      ]) {
        await openRoute(page, route);
        await expectNoOverflow(page);
      }
    },
  );
test('stable home/catalogue/product/look routes have no automated WCAG findings', async ({
  page,
}) => {
  for (const route of [
    '',
    'shop/',
    'products/satin-stroke/?shade=rose',
    'looks/',
  ]) {
    await openRoute(page, route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});

test('product names wrap and critical product text scaling is exactly2x and idempotent', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openRoute(page, 'products/satin-stroke/');
  await page.getByRole('heading', { level: 1 }).evaluate((element) => {
    element.textContent = 'Colour'.repeat(17);
  });
  await expectNoOverflow(page);
  const selector =
    '#main h1,#main .product-description,#main .shade-picker legend,#main .shade-options label,#main .purchase-actions button,#main .product-title-price>span';
  await applyDoubleText(page, selector);
  await applyDoubleText(page, selector);
  await expectNoOverflow(page);
  await expect(
    page.getByRole('button', { name: 'Add to bag', exact: true }),
  ).toBeVisible();
});
