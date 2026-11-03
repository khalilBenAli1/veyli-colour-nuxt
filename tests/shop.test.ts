import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { addItemsAtomically, cartTotals, setQuantity } from '../domain/cart';
import {
  createLook,
  changeLookChoice,
  lookOptions,
  lookTotal,
  addLookAtomically,
} from '../domain/looks';
import {
  STORAGE_KEY,
  loadSnapshot,
  saveSnapshot,
  validateSnapshot,
  type StoragePort,
} from '../adapters/persistence';
import { useShopStore } from '../app/stores/shop';
const berry = { productId: 'satin-stroke', shadeId: 'berry', quantity: 1 };
const port = () => {
  const data = new Map<string, string>();
  const storage: StoragePort = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
  return { data, storage };
};
beforeEach(() => setActivePinia(createPinia()));
describe('variant-aware shopping rules', () => {
  it('merges identical variants and preserves a different shade without mutating the input', () => {
    const base = [berry];
    const result = addItemsAtomically(base, [
      berry,
      { ...berry, shadeId: 'rose' },
    ]);
    expect(result).toEqual({
      ok: true,
      items: [
        { ...berry, quantity: 2 },
        { ...berry, shadeId: 'rose' },
      ],
    });
    expect(base).toEqual([berry]);
  });
  it('rejects any invalid/unavailable/forged addition atomically', () => {
    for (const invalid of [
      { ...berry, quantity: 0 },
      { ...berry, quantity: 1.5 },
      { ...berry, quantity: 5 },
      { ...berry, shadeId: 'brick' },
      { ...berry, shadeId: 'guava' },
      { ...berry, productId: 'unknown' },
      { ...berry, priceCents: 1 },
    ])
      expect(addItemsAtomically([], [berry, invalid]).ok).toBe(false);
    expect(setQuantity([berry], 'satin-stroke:berry', 5).ok).toBe(false);
  });
  it('derives integer cents and delivery from source prices', () => {
    expect(cartTotals([berry])).toEqual({
      subtotalCents: 3200,
      deliveryCents: 500,
      totalCents: 3700,
      count: 1,
    });
    expect(cartTotals([{ ...berry, quantity: 3 }])).toEqual({
      subtotalCents: 9600,
      deliveryCents: 0,
      totalCents: 9600,
      count: 3,
    });
    expect(cartTotals([]).totalCents).toBe(0);
  });
});
describe('colour stories', () => {
  it('composes compatible lips/eyes/accent choices without tint or skin matching', () => {
    for (const story of ['rose', 'warm', 'plum', 'neutral'] as const) {
      const look = createLook(story);
      expect(addLookAtomically([], look).ok).toBe(true);
      expect(
        lookOptions(story, 'accent').some(
          (option) => option.productId === 'sheer-canvas',
        ),
      ).toBe(false);
    }
    expect(lookTotal(createLook('rose'))).toBe(13000);
  });
  it('keeps a reduced nonempty story purchasable and rejects empty/incompatible or over-stock bundles atomically', () => {
    const look = createLook('rose');
    const removed = changeLookChoice(look, 'eyes', '');
    expect(lookTotal(removed)).toBe(6800);
    expect(addLookAtomically([], removed)).toEqual({
      ok: true,
      items: [
        { productId: 'satin-stroke', shadeId: 'rose', quantity: 1 },
        { productId: 'soft-signal', shadeId: 'guava', quantity: 1 },
      ],
    });
    expect(addLookAtomically([], { story: 'rose', choices: {} }).ok).toBe(
      false,
    );
    const incompatible = {
      ...look,
      choices: {
        ...look.choices,
        lips: { productId: 'satin-stroke', shadeId: 'brick' },
      },
    };
    expect(addLookAtomically([], incompatible).ok).toBe(false);
    const cart = [
      { productId: 'fourfold-eyes', shadeId: 'plum-story', quantity: 2 },
    ];
    expect(addLookAtomically(cart, look).ok).toBe(false);
    expect(cart).toHaveLength(1);
  });
});
describe('versioned isolated persistence', () => {
  it('validates known records, rejects extra fields and uses current stock', () => {
    const snapshot = validateSnapshot({
      version: 1,
      cart: [
        { ...berry, quantity: 99 },
        { ...berry, shadeId: 'rose', unitPriceCents: 1 },
        { ...berry, shadeId: 'brick' },
        { ...berry, shadeId: 'guava' },
      ],
      wishlist: [
        { productId: 'satin-stroke', shadeId: 'rose' },
        { productId: 'satin-stroke', shadeId: 'brick' },
        { productId: 'satin-stroke', shadeId: 'rose' },
        { productId: 'satin-stroke', shadeId: 'guava' },
        { productId: 'satin-stroke', shadeId: 'berry', displayName: 'forged' },
      ],
    });
    expect(snapshot.cart).toEqual([{ ...berry, quantity: 4 }]);
    expect(snapshot.wishlist).toEqual([
      { productId: 'satin-stroke', shadeId: 'rose' },
      { productId: 'satin-stroke', shadeId: 'brick' },
    ]);
    expect(
      validateSnapshot({
        version: 1,
        cart: [berry],
        wishlist: [],
        email: 'never-save@example.com',
      }).cart,
    ).toEqual([]);
  });
  it('recovers from unknown, malformed, oversized and blocked storage', () => {
    const { data, storage } = port();
    for (const raw of [
      '{oops',
      JSON.stringify({ version: 2, cart: [berry], wishlist: [] }),
      'x'.repeat(16385),
    ]) {
      data.set(STORAGE_KEY, raw);
      expect(loadSnapshot(storage).cart).toEqual([]);
    }
    const blocked = {
      getItem: () => {
        throw Error('blocked');
      },
      setItem: () => {
        throw Error('blocked');
      },
      removeItem: () => {
        throw Error('blocked');
      },
    };
    expect(loadSnapshot(blocked).cart).toEqual([]);
    expect(
      saveSnapshot(blocked, { version: 1, cart: [berry], wishlist: [] }),
    ).toBe(false);
  });
  it('persists bag/wishlist and resets only its own key', () => {
    const { data, storage } = port();
    data.set('other-demo:sentinel', 'keep');
    const first = useShopStore();
    first.hydrate(storage);
    expect(first.add([berry])).toBe('');
    first.toggleWish('satin-stroke', 'rose');
    first.toggleWish('satin-stroke', 'berry');
    const second = useShopStore(createPinia());
    second.hydrate(storage);
    expect(second.totals.count).toBe(1);
    expect(second.savedChoices).toEqual([
      { productId: 'satin-stroke', shadeId: 'rose' },
      { productId: 'satin-stroke', shadeId: 'berry' },
    ]);
    second.reset();
    expect(data.get('other-demo:sentinel')).toBe('keep');
    expect(data.has(STORAGE_KEY)).toBe(false);
  });
  it('keeps SSR/application store instances independent', () => {
    const first = useShopStore(createPinia());
    const second = useShopStore(createPinia());
    first.add([berry]);
    first.toggleWish('satin-stroke', 'rose');
    expect(second.totals.count).toBe(0);
    expect(second.savedChoices).toEqual([]);
  });
});
