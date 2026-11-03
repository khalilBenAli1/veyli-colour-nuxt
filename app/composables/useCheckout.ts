import { computed, ref } from 'vue';
import {
  createCustomer,
  validateCustomer,
  type CustomerErrors,
} from '../../domain/customer';
import { createOrderSnapshot, type OrderSnapshot } from '../../domain/order';
import { useShopStore } from '../stores/shop';
export function useCheckout() {
  const shop = useShopStore();
  const details = ref(createCustomer());
  const errors = ref<CustomerErrors>({});
  const step = ref(0);
  const order = ref<OrderSnapshot | null>(null);
  const notice = ref('');
  const hasItems = computed(() => shop.items.length > 0);
  function review() {
    errors.value = validateCustomer(details.value);
    notice.value = '';
    if (!Object.keys(errors.value).length && hasItems.value) step.value = 1;
  }
  function finish() {
    const result = createOrderSnapshot(
      shop.items,
      details.value,
      'VC-' + crypto.randomUUID().slice(0, 6).toUpperCase(),
    );
    if (!result.ok) {
      errors.value = result.customerErrors;
      notice.value = result.error;
      if (Object.keys(result.customerErrors).length) step.value = 0;
      return;
    }
    order.value = result.order;
    shop.clearCart();
    details.value = createCustomer();
    notice.value = '';
  }
  return {
    shop,
    details,
    errors,
    step,
    order,
    notice,
    hasItems,
    review,
    finish,
  };
}
