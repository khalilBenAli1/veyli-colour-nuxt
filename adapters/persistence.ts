import { getShade } from '../data/catalog';
import {
  cartKey,
  isRecord,
  readCartItem,
  readProductChoice,
  type ProductChoice,
  type CartItem,
} from '../domain/cart';
export const STORAGE_KEY = 'veyli-colour:shop:v1';
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface ShopSnapshot {
  readonly version: 1;
  readonly cart: readonly CartItem[];
  readonly wishlist: readonly ProductChoice[];
}
export const emptySnapshot = (): ShopSnapshot => ({
  version: 1,
  cart: [],
  wishlist: [],
});
export function validateSnapshot(value: unknown): ShopSnapshot {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    Object.keys(value).some(
      (key) => !['version', 'cart', 'wishlist'].includes(key),
    ) ||
    !Array.isArray(value.cart) ||
    !Array.isArray(value.wishlist) ||
    value.cart.length > 64 ||
    value.wishlist.length > 30
  )
    return emptySnapshot();
  const cart = new Map<string, CartItem>();
  for (const raw of value.cart) {
    const item = readCartItem(raw);
    if (!item) continue;
    const key = cartKey(item);
    const stock = getShade(item.productId, item.shadeId)?.stock ?? 0;
    cart.set(key, {
      ...item,
      quantity: Math.min(stock, (cart.get(key)?.quantity ?? 0) + item.quantity),
    });
  }
  const wishlist = new Map<string, ProductChoice>();
  for (const raw of value.wishlist) {
    const choice = readProductChoice(raw);
    if (choice) wishlist.set(cartKey(choice), choice);
  }
  return {
    version: 1,
    cart: [...cart.values()],
    wishlist: [...wishlist.values()],
  };
}
export function loadSnapshot(storage: StoragePort | null): ShopSnapshot {
  if (!storage) return emptySnapshot();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw && raw.length <= 16384
      ? validateSnapshot(JSON.parse(raw))
      : emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}
export function saveSnapshot(
  storage: StoragePort | null,
  snapshot: ShopSnapshot,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(validateSnapshot(snapshot)));
    return true;
  } catch {
    return false;
  }
}
export function removeSnapshot(storage: StoragePort | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
