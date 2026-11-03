<script setup lang="ts">
import { money, shadeImage } from '../../../data/catalog';
import type { CartLine } from '../../../domain/cart';
defineProps<{ line: CartLine }>();
const emit = defineEmits<{
  close: [];
  remove: [key: string];
  quantity: [key: string, value: number];
}>();
</script>
<template>
  <article class="bag-line">
    <NuxtLink
      :to="{
        path: '/products/' + line.productId,
        query: { shade: line.shadeId },
      }"
      tabindex="-1"
      aria-hidden="true"
      @click="emit('close')"
      ><BeautyImage
        :src="shadeImage(line.product, line.shade)"
        :alt="
          line.product.name +
          (line.shade.image ? ' in ' + line.shade.name : ' closed packaging')
        "
        sizes="115px"
    /></NuxtLink>
    <div class="bag-line-body">
      <NuxtLink
        :to="{
          path: '/products/' + line.productId,
          query: { shade: line.shadeId },
        }"
        @click="emit('close')"
        ><h3>{{ line.product.name }}</h3></NuxtLink
      >
      <p>
        {{ line.shade.name }}
        <span
          class="line-shade-dot"
          :style="{ background: line.shade.hex }"
          aria-hidden="true"
        />
      </p>
      <strong>{{ money(line.lineTotalCents) }}</strong
      ><QuantityPicker
        :model-value="line.quantity"
        :max="line.shade.stock"
        :label="line.product.name + ' ' + line.shade.name"
        @update:model-value="emit('quantity', line.key, $event)"
      /><button
        type="button"
        class="plain-button remove-line"
        :aria-label="'Remove ' + line.product.name + ' ' + line.shade.name"
        @click="emit('remove', line.key)"
      >
        Remove
      </button>
    </div>
  </article>
</template>
