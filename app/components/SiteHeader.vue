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
      <NuxtLink class="icon-button" to="/wishlist" aria-label="Your wishlist"
        ><BeautyIcon name="heart" /></NuxtLink
      ><NuxtLink
        class="icon-button bag-link"
        to="/checkout"
        aria-label="Your bag"
        ><BeautyIcon name="bag" /><span>0</span></NuxtLink
      >
    </div>
  </header>
</template>
