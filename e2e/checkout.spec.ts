import type { Locator, Page } from '@playwright/test';
import {
  test,
  expect,
  openRoute,
  bag,
  tabTo,
  expectNoOverflow,
  applyDoubleText,
} from './fixtures';

const storageKey = 'veyli-colour:shop:v1';
const consentName = /^I understand this is a demo order/;
const enlargedText =
  '#main h1,#main h2,#main h3,#main p,#main label,#main input,#main select,#main button,#main dd,#main dt,#main output,#main strong';

async function activate(control: Locator, touch: boolean) {
  if (touch) await control.tap();
  else await control.click();
}

async function beginCheckout(page: Page, touch: boolean, saveShade = false) {
  await openRoute(page, 'products/satin-stroke');
  const rose = page.getByRole('radio', { name: 'Rose', exact: true });
  if (touch) await rose.tap();
  else await rose.check();
  await expect(page).toHaveURL(/shade=rose/);
  if (saveShade) {
    await activate(
      page.getByRole('button', { name: 'Save this shade' }),
      touch,
    );
    await expect(
      page.getByRole('button', { name: 'Saved in Rose' }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await activate(
    page.getByRole('button', { name: 'Add to bag', exact: true }),
    touch,
  );
  await expect(bag(page)).toBeVisible();
  await activate(
    bag(page).getByRole('link', { name: 'Continue to checkout' }),
    touch,
  );
  await expect(page.getByLabel('Your name', { exact: true })).toBeVisible();
  await expect(bag(page)).not.toBeVisible();
}

async function enterDetails(
  page: Page,
  name: string,
  email: string,
  touch: boolean,
) {
  await page.getByLabel('Your name', { exact: true }).fill(name);
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page.getByLabel('Destination', { exact: true }).selectOption('France');
  const consent = page.getByRole('checkbox', { name: consentName });
  if (!(await consent.isChecked())) {
    if (touch) await consent.tap();
    else await consent.check();
  }
}

async function expectCriticalContentFits(page: Page) {
  await expectNoOverflow(page);
  const violations = await page
    .locator(
      '#main h1,#main h2,#main h3,#main p,#main dd,#main dt,#main .button,#main input,#main select,.summary-line strong,.order-ticket-line strong,.order-total strong',
    )
    .evaluateAll((elements) => {
      const viewport = document.documentElement.clientWidth;
      return elements.flatMap((element) => {
        if (
          !(element instanceof HTMLElement) ||
          !element.getClientRects().length
        )
          return [];
        const box = element.getBoundingClientRect();
        const clipped =
          !element.matches('input,select') &&
          element.clientWidth > 0 &&
          element.scrollWidth > element.clientWidth + 1;
        return box.left < -1 || box.right > viewport + 1 || clipped
          ? [
              {
                tag: element.tagName,
                text: element.textContent?.trim().slice(0, 80),
                left: box.left,
                right: box.right,
                viewport,
                scroll: element.scrollWidth,
                client: element.clientWidth,
              },
            ]
          : [];
      });
    });
  expect(violations).toEqual([]);
}

test('validates details, confirms the selected shade and preserves the order after a full reset', async ({
  page,
  isMobile,
}) => {
  const mutations: string[] = [];
  const requestedUrls: string[] = [];
  page.on('request', (request) => {
    requestedUrls.push(request.url());
    if (!['GET', 'HEAD'].includes(request.method()))
      mutations.push(request.url());
  });
  await page.addInitScript(() =>
    localStorage.setItem('other-demo:sentinel', 'keep'),
  );
  await beginCheckout(page, isMobile, true);
  const submit = page.getByRole('button', { name: 'Review my edit' });
  await activate(submit, isMobile);
  await expect(page.getByLabel('Your name', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.getByLabel('Your name', { exact: true })).toBeFocused();
  await enterDetails(page, 'Renée D’Arcy', 'alex@example.com', isMobile);
  for (const email of ['alex<smith>@example.com', 'alex,smith@example.com']) {
    await page.getByLabel('Email address', { exact: true }).fill(email);
    await activate(submit, isMobile);
    await expect(
      page.getByLabel('Email address', { exact: true }),
    ).toHaveAttribute('aria-invalid', 'true');
    await expect(
      page.getByLabel('Email address', { exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole('heading', { name: 'One last look.' }),
    ).toHaveCount(0);
  }
  const email = "renee.o'connor+colour@example.com";
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await activate(submit, isMobile);
  await expect(
    page.getByRole('heading', { name: 'One last look.' }),
  ).toBeFocused();
  await expect(page.locator('.review-details')).toContainText('Renée D’Arcy');
  await expect(page.locator('.review-details')).toContainText(email);
  await activate(
    page.getByRole('button', { name: 'Complete demo order' }),
    isMobile,
  );
  const confirmed = page.getByRole('heading', {
    level: 1,
    name: /That.s your/,
  });
  await expect(confirmed).toBeFocused();
  await expect(page.locator('.colour-order')).toContainText(
    'Thank you, Renée.',
  );
  await expect(page.locator('.order-ticket')).toContainText('Rose × 1');
  await expect(page.locator('.order-total')).toContainText('€37');
  await expect(page.locator('.order-ticket img')).toHaveAttribute(
    'src',
    /satin-stroke-rose\.webp$/,
  );
  await expect(
    page.getByRole('button', { name: /^Open bag, 0/ }),
  ).toBeEnabled();
  await expect(page.locator('.colour-order')).not.toContainText(email);
  const persisted = await page.evaluate(
    (key) => localStorage.getItem(key),
    storageKey,
  );
  expect(persisted).not.toContain(email);
  expect(persisted).not.toContain('Renée');
  const storedValues = await page.evaluate(() =>
    [localStorage, sessionStorage].flatMap((storage) =>
      Object.keys(storage).map((key) => storage.getItem(key) ?? ''),
    ),
  );
  for (const value of storedValues) {
    expect(value).not.toContain(email);
    expect(value).not.toContain('Renée');
  }
  for (const url of requestedUrls) {
    expect(url).not.toContain(email);
    expect(url).not.toContain(encodeURIComponent(email));
    expect(url).not.toContain(encodeURIComponent('Renée D’Arcy'));
  }
  const ticket = await page.locator('.order-ticket').innerText();
  await activate(
    page.getByRole('button', { name: 'Reset bag + saved shades' }),
    isMobile,
  );
  const reset = page.getByRole('dialog', {
    name: 'A fresh colour canvas?',
    exact: true,
  });
  await expect(reset).toBeVisible();
  await activate(
    reset.getByRole('button', { name: 'Clear my edit' }),
    isMobile,
  );
  await expect(reset).not.toBeVisible();
  expect(await page.locator('.order-ticket').innerText()).toBe(ticket);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem('other-demo:sentinel')),
  ).toBe('keep');
  expect(mutations).toEqual([]);
  await expectCriticalContentFits(page);
});

test('supports keyboard review, editing and confirmation with restored details', async ({
  page,
  isMobile,
}) => {
  await beginCheckout(page, isMobile);
  await activate(
    page.getByRole('button', { name: 'Use sample details' }),
    isMobile,
  );
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue(
    'Alex Morgan',
  );
  const consent = page.getByRole('checkbox', { name: consentName });
  await expect(consent).not.toBeChecked();
  await tabTo(page, consent);
  await page.keyboard.press('Space');
  await tabTo(page, page.getByRole('button', { name: 'Review my edit' }));
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'One last look.' }),
  ).toBeFocused();
  const edit = page.getByRole('button', { name: 'Edit details', exact: true });
  await tabTo(page, edit);
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'A few little details.' }),
  ).toBeFocused();
  await expect(page.getByLabel('Your name', { exact: true })).toHaveValue(
    'Alex Morgan',
  );
  await expect(page.getByLabel('Email address', { exact: true })).toHaveValue(
    'alex+colour@example.com',
  );
  await expect(consent).toBeChecked();
  await tabTo(page, page.getByRole('button', { name: 'Review my edit' }));
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: 'One last look.' }),
  ).toBeFocused();
  await tabTo(page, page.getByRole('button', { name: 'Complete demo order' }));
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { level: 1, name: /That.s your/ }),
  ).toBeFocused();
  await expect(page.locator('.colour-order')).toContainText('Thank you, Alex.');
  await expectCriticalContentFits(page);
});

for (const width of [390, 768, 1440]) {
  test(`fits long details and exact idempotent 200% text through checkout at ${width}px`, async ({
    page,
    isMobile,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await beginCheckout(page, isMobile);
    const name = 'N'.repeat(100);
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(53)}.invalid`;
    expect(email).toHaveLength(254);
    await enterDetails(page, name, email, isMobile);
    await expect(page.getByLabel('Your name', { exact: true })).toHaveValue(
      name,
    );
    await expect(page.getByLabel('Email address', { exact: true })).toHaveValue(
      email,
    );
    await applyDoubleText(page, enlargedText);
    await applyDoubleText(page, enlargedText);
    await expectCriticalContentFits(page);
    await activate(
      page.getByRole('button', { name: 'Review my edit' }),
      isMobile,
    );
    await expect(
      page.getByRole('heading', { name: 'One last look.' }),
    ).toBeVisible();
    await expect(page.locator('.review-details')).toContainText(name);
    await expect(page.locator('.review-details')).toContainText(email);
    await applyDoubleText(page, enlargedText);
    await applyDoubleText(page, enlargedText);
    await expectCriticalContentFits(page);
    await activate(
      page.getByRole('button', { name: 'Complete demo order' }),
      isMobile,
    );
    await expect(
      page.getByRole('heading', { level: 1, name: /That.s your/ }),
    ).toBeVisible();
    await expect(page.locator('.thank-you')).toContainText(name);
    await applyDoubleText(page, enlargedText);
    await applyDoubleText(page, enlargedText);
    await expectCriticalContentFits(page);
    await expect(page.locator('.order-total')).toContainText('€37');
  });
}
