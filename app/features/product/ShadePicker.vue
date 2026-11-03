<script setup lang="ts">
import type { Shade } from '../../../data/catalog';
defineProps<{ shades: readonly Shade[]; modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>
<template>
  <fieldset class="shade-picker">
    <legend>
      Shade /
      <strong>{{
        shades.find((shade) => shade.id === modelValue)?.name
      }}</strong>
    </legend>
    <div class="shade-options">
      <label
        v-for="shade in shades"
        :key="shade.id"
        :class="{
          selected: shade.id === modelValue,
          unavailable: !shade.stock,
        }"
        ><input
          type="radio"
          name="product-shade"
          :checked="shade.id === modelValue"
          :value="shade.id"
          @change="emit('update:modelValue', shade.id)"
        /><span
          class="shade-dot"
          :style="{ background: shade.hex }"
          aria-hidden="true"
        /><span
          >{{ shade.name }}<small v-if="!shade.stock">Unavailable</small></span
        ></label
      >
    </div>
    <p class="swatch-note">
      Illustrative swatches. Colour can look different with light and
      application.
    </p>
  </fieldset>
</template>
