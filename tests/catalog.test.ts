import { describe, it, expect } from 'vitest';
import { products } from '../data/catalog';
import { parseFilters, filterProducts } from '../domain/catalog';
describe('canonical beauty catalogue', () => {
  it('bounds external filters and preserves known categories/finishes/families', () => {
    expect(
      parseFilters({
        category: ['Lips'],
        finish: 'Unknown',
        family: 'Unknown',
        price: 'Infinity',
        q: 'a'.repeat(120),
        sort: 'wrong',
      }),
    ).toEqual({
      category: '',
      finish: '',
      family: '',
      maxPrice: 7000,
      search: 'a'.repeat(100),
      sort: 'edit',
    });
  });
  it('combines filters and sorts without mutating fixtures, including unavailable matching shades', () => {
    const ids = products.map((product) => product.id);
    expect(
      filterProducts(
        products,
        parseFilters({
          category: 'Lips',
          finish: 'Matte',
          price: '2800',
          sort: 'price-desc',
        }),
      ).map((product) => product.id),
    ).toEqual(['velvet-stain', 'line-theory']);
    expect(
      filterProducts(products, parseFilters({ family: 'Red' })).map(
        (product) => product.id,
      ),
    ).toEqual(['satin-stroke']);
    expect(
      filterProducts(products, parseFilters({ q: 'no such piece' })),
    ).toEqual([]);
    expect(products.map((product) => product.id)).toEqual(ids);
  });
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
