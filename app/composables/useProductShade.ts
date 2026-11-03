import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from '#imports';
import type { Product } from '../../data/catalog';
import { useShopStore } from '../stores/shop';
import { useShopUi } from './useShopUi';
import { useQueryUpdates } from './useQueryUpdates';
export function useProductShade(product: Product) {
  const route = useRoute();
  const shop = useShopStore();
  const ui = useShopUi();
  const queries = useQueryUpdates();
  const initial =
    product.shades.find((shade) => shade.stock > 0) ?? product.shades[0];
  if (!initial) throw new Error('Product must have a shade.');
  const selectedId = ref(initial.id);
  const quantity = ref(1);
  const error = ref('');
  let mounted = false;
  const selected = computed(
    () =>
      product.shades.find((shade) => shade.id === selectedId.value) ?? initial,
  );
  const inBag = computed(
    () =>
      shop.items.find(
        (item) =>
          item.productId === product.id && item.shadeId === selected.value.id,
      )?.quantity ?? 0,
  );
  const remaining = computed(() =>
    Math.max(0, selected.value.stock - inBag.value),
  );
  const saved = computed(() =>
    shop.savedChoices.some(
      (choice) =>
        choice.productId === product.id && choice.shadeId === selected.value.id,
    ),
  );
  function applyQuery() {
    const id = route.query.shade;
    if (
      typeof id === 'string' &&
      product.shades.some((shade) => shade.id === id) &&
      id !== selectedId.value
    ) {
      selectedId.value = id;
      quantity.value = 1;
      error.value = '';
    }
  }
  onMounted(() => {
    mounted = true;
    applyQuery();
  });
  watch(
    () => route.query.shade,
    () => {
      if (mounted) applyQuery();
    },
  );
  function choose(id: string) {
    if (!product.shades.some((shade) => shade.id === id)) return;
    selectedId.value = id;
    quantity.value = 1;
    error.value = '';
    return queries.change('shade', id);
  }
  function add() {
    error.value = shop.add([
      {
        productId: product.id,
        shadeId: selected.value.id,
        quantity: quantity.value,
      },
    ]);
    if (!error.value) ui.openBag();
  }
  function setQuantity(value: number) {
    if (
      Number.isSafeInteger(value) &&
      value >= 1 &&
      value <= Math.max(1, remaining.value)
    )
      quantity.value = value;
  }
  function save() {
    shop.toggleWish(product.id, selected.value.id);
  }
  return {
    shop,
    selected,
    quantity,
    error,
    remaining,
    saved,
    choose,
    add,
    save,
    setQuantity,
  };
}
