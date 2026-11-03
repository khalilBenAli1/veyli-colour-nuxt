<script setup lang="ts">
import { products, money } from '../../data/catalog';
import { useHead } from '#imports';
useHead({ title: 'Shop colour — Veyli Colour' });
</script>
<template>
  <section class="shell page-section">
    <p class="eyebrow">The colour wardrobe</p>
    <h1>Find your<br /><em>kind of colour.</em></h1>
    <div class="foundation-list">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="'/products/' + product.id"
        ><span>{{ product.name }}</span
        ><span>{{ product.category }} / {{ product.finish }}</span
        ><span>{{ money(product.priceCents) }} <BeautyIcon name="arrow" /></span
      ></NuxtLink>
    </div>
  </section>
</template>
