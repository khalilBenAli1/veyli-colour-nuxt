<script setup lang="ts">
import { clearError } from '#app';
defineProps<{ error: { statusCode?: number } }>();
</script>
<template>
  <section class="error-page shell">
    <p class="eyebrow">VEYLI COLOUR / {{ error.statusCode || 404 }}</p>
    <h1>A little<br /><em>off palette.</em></h1>
    <p>This page is yet to find its colour.</p>
    <a
      href="/veyli-colour-nuxt/"
      class="button"
      @click.prevent="clearError({ redirect: '/' })"
      >Back to Veyli <BeautyIcon name="arrow"
    /></a>
  </section>
</template>
