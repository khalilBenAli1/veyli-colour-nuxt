import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCheckout } from '../app/composables/useCheckout';
import { STORAGE_KEY, type StoragePort } from '../adapters/persistence';
beforeEach(() => setActivePinia(createPinia()));
describe('local checkout orchestration', () => {
  it('keeps invalid details in the form and does not create an empty order', () => {
    const flow = useCheckout();
    flow.finish();
    expect(flow.order.value).toBeNull();
    flow.shop.add([
      { productId: 'satin-stroke', shadeId: 'rose', quantity: 1 },
    ]);
    flow.review();
    expect(flow.step.value).toBe(0);
    expect(Object.keys(flow.errors.value)).toHaveLength(4);
  });
  it('clears contact memory and preserves the frozen confirmation after bag/wishlist reset', () => {
    const data = new Map<string, string>();
    const port: StoragePort = {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => {
        data.set(key, value);
      },
      removeItem: (key) => {
        data.delete(key);
      },
    };
    data.set('another-demo', 'sentinel');
    const flow = useCheckout();
    flow.shop.hydrate(port);
    flow.shop.toggleWish('satin-stroke', 'rose');
    flow.shop.add([
      { productId: 'satin-stroke', shadeId: 'rose', quantity: 1 },
    ]);
    flow.details.value = {
      name: 'Alex Morgan',
      email: 'alex+colour@example.com',
      country: 'France',
      consent: true,
    };
    flow.review();
    expect(flow.step.value).toBe(1);
    flow.finish();
    expect(flow.order.value?.totals.totalCents).toBe(3700);
    expect(flow.details.value.email).toBe('');
    expect(data.get(STORAGE_KEY)).not.toContain('email');
    expect(data.get(STORAGE_KEY)).not.toContain('Alex');
    flow.shop.reset();
    expect(flow.order.value?.lines[0]?.shadeName).toBe('Rose');
    expect(flow.order.value?.totals.totalCents).toBe(3700);
    expect(data.get('another-demo')).toBe('sentinel');
  });
});
