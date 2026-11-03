<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { shadeImage, type Product, type Shade } from '../../../data/catalog';
const props = defineProps<{ product: Product; shade: Shade }>();
const pack = ref(false);
const open = ref(false);
const activeImage = computed(() =>
  pack.value ? props.product.image : shadeImage(props.product, props.shade),
);
const caption = computed(() =>
  !pack.value && props.shade.image
    ? props.shade.name + ' / ' + props.product.name
    : 'Closed packaging / ' + props.product.name,
);
watch(
  () => props.shade.id,
  () => {
    pack.value = false;
  },
);
</script>
<template>
  <div class="colour-gallery">
    <button
      type="button"
      class="colour-main-photo"
      :aria-label="'Enlarge ' + product.name + ' photograph'"
      @click="open = true"
    >
      <BeautyImage
        :src="activeImage"
        :alt="caption"
        priority
        sizes="(max-width:700px) 100vw,55vw"
      /><span class="photo-enlarge"><BeautyIcon name="plus" />Closer look</span>
    </button>
    <div class="gallery-caption">
      <span>{{ caption }}</span>
      <div v-if="shade.image" class="photo-choices">
        <button
          type="button"
          :aria-pressed="!pack"
          :class="{ selected: !pack }"
          @click="pack = false"
        >
          Shade view</button
        ><button
          type="button"
          :aria-pressed="pack"
          :class="{ selected: pack }"
          @click="pack = true"
        >
          Closed case
        </button>
      </div>
    </div>
  </div>
  <BeautyDialog
    :open="open"
    :title="product.name + ' · closer look'"
    @close="open = false"
    ><div class="colour-lightbox">
      <BeautyImage :src="activeImage" :alt="caption" priority sizes="90vw" />
      <p>{{ caption }}</p>
    </div></BeautyDialog
  >
</template>
