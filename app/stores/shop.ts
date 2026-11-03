import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  addItemsAtomically,
  cartKey,
  cartLines,
  cartTotals,
  setQuantity,
  readProductChoice,
  type ProductChoice,
  type CartItem,
} from '../../domain/cart';
import { addLookAtomically, type LookDraft } from '../../domain/looks';
import {
  loadSnapshot,
  saveSnapshot,
  removeSnapshot,
  type StoragePort,
} from '../../adapters/persistence';
export const useShopStore = defineStore('veyli-shop', () => {
  const cart = ref<CartItem[]>([]);
  const saved = ref<ProductChoice[]>([]);
  const ready = ref(false);
  let storage: StoragePort | null = null;
  const items = computed<readonly CartItem[]>(() => cart.value);
  const savedChoices = computed<readonly ProductChoice[]>(() => saved.value);
  const lines = computed(() => cartLines(cart.value));
  const totals = computed(() => cartTotals(cart.value));
  const persist = () => {
    if (ready.value)
      saveSnapshot(storage, {
        version: 1,
        cart: cart.value,
        wishlist: saved.value,
      });
  };
  function hydrate(port: StoragePort | null) {
    if (ready.value) return;
    storage = port;
    const snapshot = loadSnapshot(port);
    cart.value = [...snapshot.cart];
    saved.value = [...snapshot.wishlist];
    ready.value = true;
  }
  function add(additions: unknown) {
    const result = addItemsAtomically(cart.value, additions);
    if (!result.ok) return result.error;
    cart.value = result.items;
    persist();
    return '';
  }
  function addLook(draft: LookDraft) {
    const result = addLookAtomically(cart.value, draft);
    if (!result.ok) return result.error;
    cart.value = result.items;
    persist();
    return '';
  }
  function update(key: string, quantity: number) {
    const result = setQuantity(cart.value, key, quantity);
    if (!result.ok) return result.error;
    cart.value = result.items;
    persist();
    return '';
  }
  function remove(key: string) {
    cart.value = cart.value.filter((item) => cartKey(item) !== key);
    persist();
  }
  function toggleWish(productId: string, shadeId: string) {
    const choice = readProductChoice({ productId, shadeId });
    if (!choice) return false;
    const key = cartKey(choice);
    saved.value = saved.value.some((value) => cartKey(value) === key)
      ? saved.value.filter((value) => cartKey(value) !== key)
      : [...saved.value, choice];
    persist();
    return true;
  }
  function clearCart() {
    cart.value = [];
    persist();
  }
  function reset() {
    cart.value = [];
    saved.value = [];
    removeSnapshot(storage);
  }
  return {
    items,
    savedChoices,
    lines,
    totals,
    ready,
    hydrate,
    add,
    addLook,
    update,
    remove,
    toggleWish,
    clearCart,
    reset,
  };
});
