<script setup lang="ts">
defineProps<{
  name:
    'arrow' | 'bag' | 'heart' | 'close' | 'menu' | 'plus' | 'minus' | 'spark';
}>();
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'arrow'" d="M3 12h18m-6-6 6 6-6 6" />
    <template v-else-if="name === 'bag'">
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M8 7V6a4 4 0 0 1 8 0v1" />
    </template>
    <path
      v-else-if="name === 'heart'"
      d="M12 21 3.4 12.5A5.7 5.7 0 0 1 12 5a5.7 5.7 0 0 1 8.6 7.5Z"
    />
    <path v-else-if="name === 'close'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'menu'" d="M4 8h16M4 16h16" />
    <path v-else-if="name === 'plus'" d="M4 12h16M12 4v16" />
    <path v-else-if="name === 'minus'" d="M4 12h16" />
    <path
      v-else
      d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"
    />
  </svg>
</template>
