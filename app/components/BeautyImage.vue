<script setup lang="ts">
import { useRuntimeConfig } from '#imports';
withDefaults(
  defineProps<{
    src: string;
    alt: string;
    priority?: boolean;
    sizes?: string;
    portrait?: boolean;
    landscape?: boolean;
  }>(),
  {
    priority: false,
    sizes: '(max-width: 700px) 100vw, 40vw',
    portrait: false,
    landscape: false,
  },
);
const base = useRuntimeConfig().app.baseURL;
const asset = (path: string) => base + path.replace(/^\//, '');
</script>
<template>
  <img
    :src="asset(src)"
    :srcset="
      asset(src.replace('.webp', '-640.webp')) +
      ' 640w, ' +
      asset(src) +
      ' 1200w'
    "
    :sizes="sizes"
    :alt="alt"
    width="1200"
    :height="portrait ? 1499 : landscape ? 800 : 1200"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    decoding="async"
  />
</template>
