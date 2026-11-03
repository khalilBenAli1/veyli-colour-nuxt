<script setup lang="ts">
const quantity = defineModel<number>({ required: true });
defineProps<{ max: number; label: string }>();
</script>
<template>
  <div class="quantity-picker">
    <button
      type="button"
      :aria-label="'Decrease ' + label"
      :disabled="quantity <= 1"
      @click="quantity--"
    >
      −</button
    ><output :aria-label="'Quantity of ' + label">{{ quantity }}</output
    ><button
      type="button"
      :aria-label="'Increase ' + label"
      :disabled="quantity >= max"
      @click="quantity++"
    >
      +
    </button>
  </div>
</template>
