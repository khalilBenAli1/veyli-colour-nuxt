<script setup lang="ts">
import { useRoute, useHead, createError, definePageMeta } from '#imports';
import { getProduct, products } from '../../../data/catalog';
import { useProductShade } from '../../composables/useProductShade';
definePageMeta({ key: (route) => route.path });
const product = getProduct(String(useRoute().params.id));
if (!product)
  throw createError({
    statusCode: 404,
    statusMessage: 'This colour is yet to be found',
  });
const selection = useProductShade(product);
useHead({
  title: product.name + ' — Veyli Colour',
  meta: [{ name: 'description', content: product.description }],
});
</script>
<template>
  <section class="shell colour-product-page">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <NuxtLink to="/shop">Shop colour</NuxtLink><span>/</span
      ><span>{{ product.name }}</span>
    </nav>
    <div class="colour-product-layout">
      <ColourGallery
        :product="product"
        :shade="selection.selected.value"
      /><ColourPurchase :product="product" :selection="selection" />
    </div>
  </section>
  <section class="section shell">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Good colour company</p>
        <h2>A little more<br /><em>to play with.</em></h2>
      </div>
      <NuxtLink class="text-link" to="/shop"
        >Explore all colour <BeautyIcon name="arrow"
      /></NuxtLink>
    </div>
    <div class="colour-product-grid">
      <ColourProductCard
        v-for="other in products
          .filter((other) => other.id !== product.id)
          .slice(0, 4)"
        :key="other.id"
        :product="other"
      />
    </div>
  </section>
</template>
