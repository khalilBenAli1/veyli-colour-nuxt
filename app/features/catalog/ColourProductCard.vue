<script setup lang="ts">
import { computed } from 'vue';
import { money, shadeImage, type Product } from '../../../data/catalog';
import { useShopStore } from '../../stores/shop';
const props = defineProps<{
  product: Product;
  preferredFamily?: string;
  shadeId?: string;
  priority?: boolean;
}>();
const emit = defineEmits<{ saveChange: [] }>();
const shop = useShopStore();
const shade = computed(
  () =>
    props.product.shades.find((shade) => shade.id === props.shadeId) ??
    props.product.shades.find(
      (shade) =>
        props.preferredFamily && shade.family === props.preferredFamily,
    ) ??
    props.product.shades.find((shade) => shade.stock > 0) ??
    props.product.shades[0],
);
const saved = computed(() =>
  shop.savedChoices.some(
    (choice) =>
      choice.productId === props.product.id &&
      choice.shadeId === shade.value?.id,
  ),
);
const href = computed(() => ({
  path: '/products/' + props.product.id,
  query: { shade: shade.value?.id },
}));
const toggle = () => {
  if (shade.value) {
    shop.toggleWish(props.product.id, shade.value.id);
    emit('saveChange');
  }
};
</script>
<template>
  <article v-if="shade" class="colour-product-card">
    <div
      class="colour-product-picture"
      :class="'category-' + product.category.toLowerCase()"
    >
      <NuxtLink :to="href" tabindex="-1" aria-hidden="true"
        ><BeautyImage
          :src="shadeImage(product, shade)"
          :alt="
            product.name +
            (shade.image ? ' in ' + shade.name : ' closed packaging')
          "
          :priority="priority"
          sizes="(max-width:600px) 50vw,25vw" /></NuxtLink
      ><button
        type="button"
        class="icon-button save-shade"
        :class="{ 'is-saved': saved }"
        :disabled="!shop.ready"
        :aria-label="
          (saved ? 'Unsave ' : 'Save ') + product.name + ' in ' + shade.name
        "
        :aria-pressed="saved"
        @click="toggle"
      >
        <BeautyIcon name="heart" /></button
      ><span v-if="!shade.stock" class="stock-badge">Shade unavailable</span>
    </div>
    <p class="product-type">{{ product.type }} · {{ product.finish }}</p>
    <div class="product-card-meta">
      <NuxtLink :to="href"
        ><h3>{{ product.name }}</h3></NuxtLink
      ><span class="product-card-price">{{ money(product.priceCents) }}</span>
    </div>
    <p class="card-shade">
      <span :style="{ background: shade.hex }" aria-hidden="true" />{{
        shade.name
      }}<span class="shade-count">{{ product.shades.length }} shades</span>
    </p>
  </article>
</template>
