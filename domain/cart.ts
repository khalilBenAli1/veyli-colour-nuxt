import {
  getProduct,
  getShade,
  type Product,
  type Shade,
} from '../data/catalog';
export interface ProductChoice {
  readonly productId: string;
  readonly shadeId: string;
}
export interface CartItem extends ProductChoice {
  readonly quantity: number;
}
export interface CartLine extends CartItem {
  readonly key: string;
  readonly product: Product;
  readonly shade: Shade;
  readonly unitPriceCents: number;
  readonly lineTotalCents: number;
}
export type CartResult =
  { ok: true; items: CartItem[] } | { ok: false; error: string };
export const cartKey = (item: Pick<CartItem, 'productId' | 'shadeId'>) =>
  item.productId + ':' + item.shadeId;
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function readProductChoice(value: unknown): ProductChoice | null {
  if (
    !isRecord(value) ||
    Object.keys(value).some((key) => !['productId', 'shadeId'].includes(key)) ||
    typeof value.productId !== 'string' ||
    typeof value.shadeId !== 'string' ||
    !getShade(value.productId, value.shadeId)
  )
    return null;
  return { productId: value.productId, shadeId: value.shadeId };
}
export function readCartItem(value: unknown): CartItem | null {
  if (
    !isRecord(value) ||
    Object.keys(value).some(
      (key) => !['productId', 'shadeId', 'quantity'].includes(key),
    ) ||
    typeof value.productId !== 'string' ||
    typeof value.shadeId !== 'string' ||
    typeof value.quantity !== 'number' ||
    !Number.isSafeInteger(value.quantity) ||
    value.quantity < 1
  )
    return null;
  const shade = getShade(value.productId, value.shadeId);
  if (!shade || !shade.stock) return null;
  return {
    productId: value.productId,
    shadeId: value.shadeId,
    quantity: value.quantity,
  };
}
export function cartLines(items: readonly CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const product = getProduct(item.productId);
    const shade = getShade(item.productId, item.shadeId);
    return product && shade
      ? [
          {
            ...item,
            key: cartKey(item),
            product,
            shade,
            unitPriceCents: product.priceCents,
            lineTotalCents: product.priceCents * item.quantity,
          },
        ]
      : [];
  });
}
export function cartTotals(items: readonly CartItem[]) {
  const subtotalCents = cartLines(items).reduce(
    (sum, line) => sum + line.lineTotalCents,
    0,
  );
  const deliveryCents = subtotalCents === 0 || subtotalCents >= 7500 ? 0 : 500;
  return {
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
export function addItemsAtomically(
  current: readonly CartItem[],
  additions: unknown,
): CartResult {
  if (!Array.isArray(additions) || !additions.length || additions.length > 64)
    return { ok: false, error: 'Choose a product and an available shade.' };
  const combined = new Map<string, CartItem>();
  for (const raw of [...current, ...additions]) {
    const item = readCartItem(raw);
    if (!item)
      return { ok: false, error: 'Choose a product and an available shade.' };
    const key = cartKey(item);
    const quantity = (combined.get(key)?.quantity ?? 0) + item.quantity;
    const shade = getShade(item.productId, item.shadeId);
    if (!shade || quantity > shade.stock)
      return {
        ok: false,
        error:
          'That shade has reached its available quantity. Adjust your bag and try again.',
      };
    combined.set(key, { ...item, quantity });
  }
  return { ok: true, items: [...combined.values()] };
}
export function setQuantity(
  current: readonly CartItem[],
  key: string,
  quantity: number,
): CartResult {
  const item = current.find((line) => cartKey(line) === key);
  const shade = item && getShade(item.productId, item.shadeId);
  if (
    !item ||
    !shade ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > shade.stock
  )
    return {
      ok: false,
      error: 'Choose a quantity within the available stock.',
    };
  return {
    ok: true,
    items: current.map((line) =>
      cartKey(line) === key ? { ...line, quantity } : { ...line },
    ),
  };
}
