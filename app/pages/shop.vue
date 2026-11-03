<script setup lang="ts">
import { useHead } from '#imports';
import { useCatalogue } from '../composables/useCatalogue';
const { filters, matching, change, reset } = useCatalogue();
useHead({ title: 'Shop colour — Veyli Colour' });
</script>
<template>
  <section class="shell catalogue-page">
    <div class="catalogue-heading">
      <div>
        <p class="eyebrow">Your colour wardrobe</p>
        <h1>A shade for<br /><em>every side.</em></h1>
      </div>
      <p>
        Lips. Eyes. A little complexion colour.<br />Make your own kind of
        statement.
      </p>
    </div>
    <ColourFilterPanel
      :filters="filters"
      :count="matching.length"
      @change="change"
      @reset="reset"
    />
    <div v-if="matching.length" class="colour-product-grid">
      <ColourProductCard
        v-for="product in matching"
        :key="product.id"
        :product="product"
        :preferred-family="filters.family"
      />
    </div>
    <div v-else class="colour-empty">
      <BeautyIcon name="spark" />
      <h2>Another shade<br />of <em>possibility.</em></h2>
      <p>Try a different colour, finish or price.</p>
      <button type="button" class="button" @click="reset">
        Explore all colour <BeautyIcon name="arrow" />
      </button>
    </div>
  </section>
</template>
