<script setup lang="ts">
const skip = () => document.getElementById('main')?.focus();
</script>
<template>
  <NuxtRouteAnnouncer /><a class="skip-link" href="#main" @click.prevent="skip"
    >Skip to content</a
  ><SiteHeader />
  <main id="main" tabindex="-1"><NuxtPage /></main>
  <SiteFooter />
</template>
