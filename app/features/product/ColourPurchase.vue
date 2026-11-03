<script setup lang="ts">
import { useProductShade } from '../../composables/useProductShade';
import { money, type Product } from '../../../data/catalog';
defineProps<{
  product: Product;
  selection: ReturnType<typeof useProductShade>;
}>();
</script>
<template>
  <div class="colour-product-info">
    <p class="eyebrow">{{ product.type }} / {{ product.finish }}</p>
    <div class="product-title-price">
      <h1>{{ product.name }}</h1>
      <span>{{ money(product.priceCents) }}</span>
    </div>
    <p class="product-description">{{ product.description }}</p>
    <ShadePicker
      :shades="product.shades"
      :model-value="selection.selected.value.id"
      @update:model-value="selection.choose"
    />
    <p class="shade-availability" role="status">
      {{
        !selection.selected.value.stock
          ? 'This shade is currently unavailable.'
          : selection.remaining.value
            ? 'Ready for your colour story.'
            : 'All available pieces of this shade are in your bag.'
      }}
    </p>
    <div class="purchase-actions">
      <QuantityPicker
        :model-value="selection.quantity.value"
        :max="selection.remaining.value"
        :label="product.name + ' ' + selection.selected.value.name"
        @update:model-value="selection.setQuantity"
      /><button
        type="button"
        class="button add-to-bag"
        :disabled="!selection.shop.ready || !selection.remaining.value"
        @click="selection.add"
      >
        {{ selection.selected.value.stock ? 'Add to bag' : 'Shade unavailable'
        }}<BeautyIcon name="bag" />
      </button>
    </div>
    <button
      type="button"
      class="save-product plain-button"
      :disabled="!selection.shop.ready"
      :aria-pressed="selection.saved.value"
      @click="selection.save"
    >
      <BeautyIcon name="heart" />{{
        selection.saved.value
          ? 'Saved in ' + selection.selected.value.name
          : 'Save this shade'
      }}
    </button>
    <p v-if="selection.error.value" class="field-error" role="alert">
      {{ selection.error.value }}
    </p>
    <div class="product-facts">
      <div>
        <span>Finish</span><strong>{{ product.finish }}</strong>
      </div>
      <div>
        <span>Colour family</span
        ><strong>{{ selection.selected.value.family }}</strong>
      </div>
      <div><span>Delivery</span><strong>Included from €75</strong></div>
    </div>
    <NuxtLink v-if="product.id !== 'sheer-canvas'" class="text-link" to="/looks"
      >Make it part of a look <BeautyIcon name="arrow"
    /></NuxtLink>
  </div>
</template>
