import { products, type Product } from '../data/catalog';
export interface CatalogFilters {
  category: string;
  finish: string;
  family: string;
  search: string;
  maxPrice: number;
  sort: 'edit' | 'price-asc' | 'price-desc';
}
export const categories = ['Lips', 'Eyes', 'Complexion'] as const;
export const finishes = [...new Set(products.map((product) => product.finish))];
export const families = [
  ...new Set(
    products.flatMap((product) => product.shades.map((shade) => shade.family)),
  ),
];
export function parseFilters(query: Record<string, unknown>): CatalogFilters {
  const text = (key: string) =>
    typeof query[key] === 'string' ? String(query[key]) : '';
  const category = text('category');
  const finish = text('finish');
  const family = text('family');
  const cap = Number(text('price'));
  const sort = text('sort');
  return {
    category: categories.some((value) => value === category) ? category : '',
    finish: finishes.some((value) => value === finish) ? finish : '',
    family: families.some((value) => value === family) ? family : '',
    search: text('q').slice(0, 100),
    maxPrice:
      Number.isSafeInteger(cap) &&
      cap >= 0 &&
      cap <= 7000 &&
      text('price') !== ''
        ? cap
        : 7000,
    sort: sort === 'price-asc' || sort === 'price-desc' ? sort : 'edit',
  };
}
export function filterProducts(
  collection: readonly Product[],
  filters: CatalogFilters,
): Product[] {
  const list = collection.filter(
    (product) =>
      (!filters.category || product.category === filters.category) &&
      (!filters.finish || product.finish === filters.finish) &&
      (!filters.family ||
        product.shades.some((shade) => shade.family === filters.family)) &&
      product.priceCents <= filters.maxPrice &&
      (!filters.search ||
        [
          product.name,
          product.type,
          ...product.shades.map((shade) => shade.name),
        ]
          .join(' ')
          .toLowerCase()
          .includes(filters.search.toLowerCase())),
  );
  if (filters.sort === 'price-asc')
    list.sort((a, b) => a.priceCents - b.priceCents);
  if (filters.sort === 'price-desc')
    list.sort((a, b) => b.priceCents - a.priceCents);
  return list;
}
