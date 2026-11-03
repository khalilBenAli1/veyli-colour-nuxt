import { describe, it, expect } from 'vitest';
import { products } from '../data/catalog';
describe('canonical beauty catalogue', () => {
  it('has unique product/shade identities and integer prices/inventory', () => {
    expect(products).toHaveLength(10);
    expect(new Set(products.map((p) => p.id)).size).toBe(10);
    for (const p of products) {
      expect(Number.isSafeInteger(p.priceCents) && p.priceCents > 0).toBe(true);
      expect(new Set(p.shades.map((s) => s.id)).size).toBe(p.shades.length);
      for (const s of p.shades)
        expect(Number.isSafeInteger(s.stock) && s.stock >= 0).toBe(true);
    }
  });
});
