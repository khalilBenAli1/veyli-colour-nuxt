<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useHead } from '#imports';
import { useShopStore } from '../stores/shop';
import { getProduct } from '../../data/catalog';
const shop = useShopStore();
const heading = ref<HTMLHeadingElement | null>(null);
const saved = computed(() =>
  shop.savedChoices.flatMap((choice) => {
    const product = getProduct(choice.productId);
    return product ? [{ ...choice, product }] : [];
  }),
);
const changed = async () => {
  await nextTick();
  heading.value?.focus({ preventScroll: true });
};
useHead({ title: 'Saved shades — Veyli Colour' });
</script>
<template>
  <section class="shell wishlist-page">
    <p class="eyebrow">Your saved shades</p>
    <h1 ref="heading" tabindex="-1">Colour<br /><em>crushes.</em></h1>
    <p class="wishlist-intro">The shades you want to come back to.</p>
    <p v-if="!shop.ready" role="status" class="quiet">
      Finding your saved colour…
    </p>
    <div v-else-if="saved.length" class="colour-product-grid">
      <ColourProductCard
        v-for="choice in saved"
        :key="choice.productId + ':' + choice.shadeId"
        :product="choice.product"
        :shade-id="choice.shadeId"
        @save-change="changed"
      />
    </div>
    <div v-else class="colour-empty">
      <BeautyIcon name="heart" />
      <h2>A little room<br />for a <em>favourite.</em></h2>
      <p>Tap a heart on a shade you love. Find that exact colour here.</p>
      <NuxtLink class="button" to="/shop"
        >Find your colour <BeautyIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
</template>
