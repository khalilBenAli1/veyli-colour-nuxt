import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from '#imports';
import { storyKeys, type StoryKey } from '../../data/catalog';
import {
  createLook,
  changeLookChoice,
  lookLines,
  lookOptions,
  lookTotal,
  type LookSlot,
} from '../../domain/looks';
import { useShopStore } from '../stores/shop';
import { useShopUi } from './useShopUi';
import { useQueryUpdates } from './useQueryUpdates';
export function useLookBuilder() {
  const shop = useShopStore();
  const ui = useShopUi();
  const route = useRoute();
  const query = useQueryUpdates();
  const draft = ref(createLook('rose'));
  const error = ref('');
  let mounted = false;
  const lines = computed(() => lookLines(draft.value));
  const total = computed(() => lookTotal(draft.value));
  const count = computed(() => lines.value.length);
  function syncQuery() {
    const story = route.query.story;
    if (
      typeof story === 'string' &&
      storyKeys.some((key) => key === story) &&
      story !== draft.value.story
    ) {
      const key = storyKeys.find((key) => key === story);
      if (key) draft.value = createLook(key);
      error.value = '';
    }
  }
  onMounted(() => {
    mounted = true;
    syncQuery();
  });
  watch(
    () => route.query.story,
    () => {
      if (mounted) syncQuery();
    },
  );
  function chooseStory(story: StoryKey) {
    draft.value = createLook(story);
    error.value = '';
    return query.change('story', story);
  }
  function choose(slot: LookSlot, key: string) {
    draft.value = changeLookChoice(draft.value, slot, key);
    error.value = '';
  }
  function add() {
    error.value = shop.addLook(draft.value);
    if (!error.value) ui.openBag();
  }
  const options = (slot: LookSlot) => lookOptions(draft.value.story, slot);
  return {
    shop,
    draft,
    error,
    lines,
    total,
    count,
    chooseStory,
    choose,
    options,
    add,
  };
}
