<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { provideShopUi } from './composables/useShopUi';
const bagOpen = ref(false);
provideShopUi({
  openBag: () => {
    bagOpen.value = true;
  },
});
const skip = () => document.getElementById('main')?.focus();
const app = useNuxtApp();
if (import.meta.client)
  app.hook('page:finish', () => {
    document.getElementById('main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
</script>
<template>
  <NuxtRouteAnnouncer /><a class="skip-link" href="#main" @click.prevent="skip"
    >Skip to content</a
  ><SiteHeader />
  <main id="main" tabindex="-1"><NuxtPage /></main>
  <SiteFooter /><ColourBag :open="bagOpen" @close="bagOpen = false" />
</template>
