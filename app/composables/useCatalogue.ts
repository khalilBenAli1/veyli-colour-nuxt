import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from '#imports';
import { products } from '../../data/catalog';
import { parseFilters, filterProducts } from '../../domain/catalog';
import { useQueryUpdates } from './useQueryUpdates';
export function useCatalogue() {
  const route = useRoute();
  const hydratedQuery = ref<Record<string, unknown>>({});
  let mounted = false;
  onMounted(() => {
    mounted = true;
    hydratedQuery.value = route.query;
  });
  watch(
    () => route.query,
    (query) => {
      if (mounted) hydratedQuery.value = query;
    },
  );
  const filters = computed(() => parseFilters(hydratedQuery.value));
  const matching = computed(() => filterProducts(products, filters.value));
  const { change, reset } = useQueryUpdates();
  return { filters, matching, change, reset };
}
