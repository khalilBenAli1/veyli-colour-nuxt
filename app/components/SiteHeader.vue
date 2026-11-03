<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from '#imports';
import { useShopStore } from '../stores/shop';
import { useShopUi } from '../composables/useShopUi';
const shop = useShopStore();
const ui = useShopUi();
const menu = ref(false);
const route = useRoute();
watch(
  () => route.path,
  () => (menu.value = false),
);
</script>
<template>
  <header class="site-header shell">
    <NuxtLink class="wordmark" to="/" aria-label="Veyli Colour home"
      >veyli<span>COLOUR</span><i aria-hidden="true">●</i></NuxtLink
    >
    <nav class="desktop-nav" aria-label="Main">
      <NuxtLink to="/shop">Shop colour</NuxtLink
      ><NuxtLink to="/looks">Build your look</NuxtLink
      ><NuxtLink to="/about">Our point of view</NuxtLink>
    </nav>
    <div class="header-actions">
      <NuxtLink
        class="icon-button wish-link"
        to="/wishlist"
        :aria-label="'Saved shades, ' + shop.savedChoices.length"
        ><BeautyIcon name="heart" /><span v-if="shop.savedChoices.length">{{
          shop.savedChoices.length
        }}</span></NuxtLink
      ><button
        type="button"
        class="icon-button bag-link"
        :aria-label="'Open bag, ' + shop.totals.count + ' pieces'"
        :disabled="!shop.ready"
        @click="ui.openBag"
      >
        <BeautyIcon name="bag" /><span>{{ shop.totals.count }}</span></button
      ><button
        type="button"
        class="icon-button mobile-menu"
        aria-label="Open menu"
        :aria-expanded="menu"
        @click="menu = true"
      >
        <BeautyIcon name="menu" />
      </button>
    </div>
  </header>
  <BeautyDialog
    :open="menu"
    title="Make room for colour"
    drawer
    @close="menu = false"
    ><nav class="mobile-nav" aria-label="Mobile" @click="menu = false">
      <NuxtLink to="/shop">Shop colour</NuxtLink
      ><NuxtLink to="/looks">Build your look</NuxtLink
      ><NuxtLink to="/wishlist"
        >Saved shades ({{ shop.savedChoices.length }})</NuxtLink
      ><NuxtLink to="/about">Our point of view</NuxtLink>
    </nav>
    <p class="menu-signoff">Every shade. Every side of you.</p></BeautyDialog
  >
</template>
