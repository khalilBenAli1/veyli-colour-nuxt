<script setup lang="ts">
import { ref } from 'vue';
import { useShopStore } from '../stores/shop';
const shop = useShopStore();
const resetOpen = ref(false);
const notice = ref('');
const reset = () => {
  shop.reset();
  resetOpen.value = false;
  notice.value = 'Your bag and saved shades are clear.';
};
</script>
<template>
  <footer class="site-footer">
    <div class="shell footer-main">
      <div>
        <NuxtLink class="wordmark" to="/"
          >veyli<span>COLOUR</span><i aria-hidden="true">●</i></NuxtLink
        >
        <p>Every shade.<br />Every side of you.</p>
      </div>
      <nav aria-label="Footer">
        <NuxtLink to="/shop">Find your colour</NuxtLink
        ><NuxtLink to="/looks">Make a colour story</NuxtLink
        ><NuxtLink to="/about">Our point of view</NuxtLink
        ><button
          type="button"
          class="footer-reset"
          :disabled="!shop.ready"
          @click="resetOpen = true"
        >
          Reset bag + saved shades</button
        ><span role="status" class="footer-notice">{{ notice }}</span>
      </nav>
      <p class="footer-note">
        An original beauty demo.<br />Fictional products. No real orders.<br />©2026
        Veyli Colour
      </p>
    </div>
  </footer>
  <BeautyDialog
    :open="resetOpen"
    title="A fresh colour canvas?"
    @close="resetOpen = false"
    ><p class="reset-copy">Clear your bag and saved shades on this device?</p>
    <div class="dialog-actions">
      <button type="button" class="button secondary" @click="resetOpen = false">
        Keep my choices</button
      ><button type="button" class="button" @click="reset">
        Clear my edit
      </button>
    </div></BeautyDialog
  >
</template>
