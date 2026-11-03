import { shadeImage } from '../data/catalog';
import {
  addItemsAtomically,
  cartLines,
  cartTotals,
  type CartItem,
} from './cart';
import {
  validateCustomer,
  type CustomerDetails,
  type CustomerErrors,
} from './customer';

export interface OrderLine {
  readonly key: string;
  readonly productId: string;
  readonly shadeId: string;
  readonly productName: string;
  readonly shadeName: string;
  readonly image: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
  readonly lineTotalCents: number;
}
export interface OrderSnapshot {
  readonly reference: string;
  readonly firstName: string;
  readonly country: string;
  readonly lines: readonly OrderLine[];
  readonly totals: Readonly<ReturnType<typeof cartTotals>>;
}
export type OrderResult =
  | { ok: true; order: OrderSnapshot }
  | { ok: false; error: string; customerErrors: CustomerErrors };

export function createOrderSnapshot(
  items: readonly CartItem[],
  customer: CustomerDetails,
  reference: string,
): OrderResult {
  const customerErrors = validateCustomer(customer);
  if (Object.keys(customerErrors).length) {
    return {
      ok: false,
      error: 'Check your details before continuing.',
      customerErrors,
    };
  }
  const checked = addItemsAtomically([], items);
  if (!checked.ok) {
    return { ok: false, error: checked.error, customerErrors: {} };
  }
  if (typeof reference !== 'string' || !reference.trim()) {
    return {
      ok: false,
      error: 'Your order reference could not be created. Please try again.',
      customerErrors: {},
    };
  }
  const lines = cartLines(checked.items).map((line) =>
    Object.freeze({
      key: line.key,
      productId: line.productId,
      shadeId: line.shadeId,
      productName: line.product.name,
      shadeName: line.shade.name,
      image: shadeImage(line.product, line.shade),
      quantity: line.quantity,
      unitPriceCents: line.unitPriceCents,
      lineTotalCents: line.lineTotalCents,
    }),
  );
  return {
    ok: true,
    order: Object.freeze({
      reference: reference.trim(),
      firstName: customer.name.trim().split(/\s+/)[0]!,
      country: customer.country.trim(),
      lines: Object.freeze(lines),
      totals: Object.freeze(cartTotals(checked.items)),
    }),
  };
}
