<script setup lang="ts">
import { useRoute, useHead, createError, definePageMeta } from '#imports';
import { getProduct, money } from '../../../data/catalog';
definePageMeta({ key: (route) => route.path });
const product = getProduct(String(useRoute().params.id));
if (!product)
  throw createError({
    statusCode: 404,
    statusMessage: 'This colour is yet to be found',
  });
useHead({ title: product.name + ' — Veyli Colour' });
</script>
<template>
  <section class="shell page-section">
    <NuxtLink class="text-link" to="/shop">← The collection</NuxtLink>
    <p class="eyebrow">{{ product.type }} / {{ product.finish }}</p>
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <p>{{ money(product.priceCents) }}</p>
    <ul>
      <li v-for="shade in product.shades" :key="shade.id">
        {{ shade.name }} / {{ shade.family
        }}{{ shade.stock ? '' : ' / Unavailable' }}
      </li>
    </ul>
  </section>
</template>
