import { describe, expect, it } from 'vitest';
import { createPinia } from 'pinia';
import {
  createCustomer,
  customerCountries,
  validateCustomer,
  type CustomerDetails,
} from '../domain/customer';
import { createOrderSnapshot } from '../domain/order';
import type { CartItem } from '../domain/cart';
import { useShopStore } from '../app/stores/shop';

const customer = (): CustomerDetails => ({
  name: '  Renée D’Arcy  ',
  email: "renee.o'connor+colour@example.com",
  country: 'France',
  consent: true,
});
const berry: CartItem = {
  productId: 'satin-stroke',
  shadeId: 'berry',
  quantity: 1,
};

describe('customer details', () => {
  it('creates independent empty forms and requires every field', () => {
    const first = createCustomer();
    first.name = 'Changed';
    expect(createCustomer()).toEqual({
      name: '',
      email: '',
      country: '',
      consent: false,
    });
    expect(Object.keys(validateCustomer(createCustomer())).sort()).toEqual([
      'consent',
      'country',
      'email',
      'name',
    ]);
    expect(customerCountries).toContain(customer().country);
  });

  it('accepts international names, trimmed details and supported unquoted email punctuation', () => {
    for (const name of [
      'Renée D’Arcy',
      'Søren Ångström',
      '王小明',
      'أمل حداد',
      'Jean-Luc O’Neill',
      'X'.repeat(100),
    ]) {
      expect(validateCustomer({ ...customer(), name })).toEqual({});
    }
    for (const email of [
      'alex.smith+colour@example.com',
      "o'connor@example.com",
      'A-Z_09!#$%&*+/=?^`{|}~@example.co.uk',
      ' alex@example.com ',
    ]) {
      expect(validateCustomer({ ...customer(), email })).toEqual({});
    }
    for (const country of customerCountries) {
      expect(validateCustomer({ ...customer(), country })).toEqual({});
    }
  });

  it('accepts a full-length address while limiting raw input and the local part', () => {
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(61)}`;
    expect(email).toHaveLength(254);
    expect(validateCustomer({ ...customer(), email })).toEqual({});
    expect(
      validateCustomer({ ...customer(), email: ` ${email}` }),
    ).toHaveProperty('email');
    expect(
      validateCustomer({
        ...customer(),
        email: `${'a'.repeat(65)}@example.com`,
      }),
    ).toHaveProperty('email');
  });

  it.each([
    'alex<smith>@example.com',
    'alex,smith@example.com',
    '"alex smith"@example.com',
    '.alex@example.com',
    'alex.@example.com',
    'alex..smith@example.com',
    'alex smith@example.com',
    'alex@@example.com',
    'alex@example',
    'alex@-example.com',
    'alex@example-.com',
    'alex@example..com',
    'alex@exam_ple.com',
    `alex@${'x'.repeat(64)}.com`,
    'alex@example.com\nignored',
  ])('rejects unsupported email format %s', (email) => {
    expect(validateCustomer({ ...customer(), email })).toHaveProperty('email');
  });

  it('rejects malformed local field values without throwing', () => {
    for (const [field, value] of [
      ['name', ' '],
      ['name', 'X'],
      ['name', 'X'.repeat(101)],
      ['name', null],
      ['email', null],
      ['email', 2],
      ['country', 'Unknown'],
      ['country', null],
      ['consent', false],
      ['consent', 'true'],
    ] as const) {
      expect(
        validateCustomer({ ...customer(), [field]: value } as CustomerDetails),
      ).toHaveProperty(field);
    }
    for (const value of [null, [], {}, 'details']) {
      expect(
        Object.keys(validateCustomer(value as unknown as CustomerDetails)),
      ).toHaveLength(4);
    }
  });
});

describe('local order confirmation', () => {
  it('copies the selected shade, canonical prices and exact standard-delivery totals', () => {
    const result = createOrderSnapshot([berry], customer(), 'VC-SAMPLE-01');
    expect(result.ok).toBe(true);
    if (!result.ok) throw Error(result.error);
    expect(result.order).toEqual({
      reference: 'VC-SAMPLE-01',
      firstName: 'Renée',
      country: 'France',
      lines: [
        {
          key: 'satin-stroke:berry',
          productId: 'satin-stroke',
          shadeId: 'berry',
          productName: 'Satin Stroke',
          shadeName: 'Berry',
          image: '/images/satin-stroke-berry.webp',
          quantity: 1,
          unitPriceCents: 3200,
          lineTotalCents: 3200,
        },
      ],
      totals: {
        subtotalCents: 3200,
        deliveryCents: 500,
        totalCents: 3700,
        count: 1,
      },
    });
    expect(JSON.stringify(result.order)).not.toContain(customer().email);
    expect(result.order).not.toHaveProperty('consent');
  });

  it('merges identical shades and preserves other shades before calculating free delivery', () => {
    const result = createOrderSnapshot(
      [berry, berry, { ...berry, shadeId: 'rose' }],
      customer(),
      'VC-SAMPLE-02',
    );
    expect(result.ok).toBe(true);
    if (!result.ok) throw Error(result.error);
    expect(
      result.order.lines.map((line) => [line.shadeId, line.quantity]),
    ).toEqual([
      ['berry', 2],
      ['rose', 1],
    ]);
    expect(result.order.totals).toEqual({
      subtotalCents: 9600,
      deliveryCents: 0,
      totalCents: 9600,
      count: 3,
    });
  });

  it('rejects an empty or partly invalid bag instead of silently dropping records', () => {
    const invalidItems = [
      { ...berry, productId: 'unknown' },
      { ...berry, shadeId: 'unknown' },
      { ...berry, shadeId: 'brick' },
      { ...berry, quantity: 0 },
      { ...berry, quantity: -1 },
      { ...berry, quantity: 1.5 },
      { ...berry, quantity: 5 },
      { ...berry, quantity: Number.MAX_SAFE_INTEGER },
      { ...berry, quantity: NaN },
      { ...berry, unitPriceCents: 1 },
      null,
    ];
    for (const items of [
      [],
      null,
      ...invalidItems.map((invalid) => [berry, invalid]),
      [{ ...berry, quantity: 4 }, berry],
      Array.from({ length: 65 }, () => berry),
    ]) {
      const result = createOrderSnapshot(
        items as readonly CartItem[],
        customer(),
        'VC-INVALID',
      );
      expect(result.ok).toBe(false);
      expect(result).not.toHaveProperty('order');
    }
  });

  it('returns customer errors and refuses an unavailable reference', () => {
    const result = createOrderSnapshot(
      [berry],
      createCustomer(),
      'VC-SAMPLE-03',
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw Error('Expected customer validation');
    expect(Object.keys(result.customerErrors)).toHaveLength(4);
    expect(createOrderSnapshot([berry], customer(), '').ok).toBe(false);
  });

  it('remains unchanged after source fields, input records and the shared bag reset', () => {
    const details = customer();
    const items = [{ ...berry }];
    const result = createOrderSnapshot(items, details, 'VC-SAMPLE-04');
    expect(result.ok).toBe(true);
    if (!result.ok) throw Error(result.error);
    items[0]!.quantity = 4;
    items.length = 0;
    details.name = 'Changed Person';
    details.country = 'Italy';
    const shop = useShopStore(createPinia());
    shop.add([berry]);
    const sharedResult = createOrderSnapshot(
      shop.items,
      customer(),
      'VC-SAMPLE-05',
    );
    expect(sharedResult.ok).toBe(true);
    shop.reset();
    if (!sharedResult.ok) throw Error(sharedResult.error);
    expect(result.order.firstName).toBe('Renée');
    expect(result.order.country).toBe('France');
    expect(result.order.lines[0]!.quantity).toBe(1);
    expect(result.order.totals.totalCents).toBe(3700);
    expect(sharedResult.order.lines[0]!.quantity).toBe(1);
    expect(sharedResult.order.totals.totalCents).toBe(3700);
    expect(shop.totals.count).toBe(0);
    expect(Object.isFrozen(result.order)).toBe(true);
    expect(Object.isFrozen(result.order.lines)).toBe(true);
    expect(Object.isFrozen(result.order.lines[0])).toBe(true);
    expect(Object.isFrozen(result.order.totals)).toBe(true);
  });
});
