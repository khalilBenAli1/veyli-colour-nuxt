<script setup lang="ts">
import { useHead } from '#imports';
useHead({ title: 'Build your look — Veyli Colour' });
</script>
<template>
  <section class="shell look-page">
    <div class="look-heading">
      <p class="eyebrow">Build your look</p>
      <h1>A colour story.<br /><em>Chosen by you.</em></h1>
      <p>
        Start with a mood. Choose lips, eyes and a complexion accent.<br />Keep
        what you love, leave out what you don’t.
      </p>
    </div>
    <ColourStoryBuilder />
  </section>
</template>
