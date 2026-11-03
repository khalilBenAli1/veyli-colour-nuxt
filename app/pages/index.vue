<script setup lang="ts">
import { useHead } from '#imports';
useHead({ title: 'Veyli Colour — Every shade. Every side.' });
</script>
<template>
  <section class="colour-wall shell">
    <div class="wall-heading">
      <div>
        <p class="eyebrow"><span class="tiny-dot" />Colour without a script</p>
        <h1>Every shade.<br /><span>Every side.</span></h1>
      </div>
      <p class="wall-intro">
        A little play.<br />A whole lot of you.<NuxtLink
          to="/shop"
          class="button"
          >Find your colour <BeautyIcon name="arrow"
        /></NuxtLink>
      </p>
    </div>
    <div class="wall-collage">
      <NuxtLink
        to="/shop"
        class="wall-face wall-face-main"
        aria-label="Explore the colour collection"
        ><BeautyImage
          src="/images/campaign-deep-skin.webp"
          alt="Original beauty portrait with berry lip colour and expressive copper-plum eyes"
          portrait
          priority
          sizes="(max-width: 700px) 65vw, 40vw"
        /><span class="image-chip">Your face. Your canvas.</span></NuxtLink
      >
      <div class="wall-note">
        <BeautyIcon name="spark" />
        <p>Not one<br />kind of<br /><em>beautiful.</em></p>
        <NuxtLink to="/looks" class="text-link"
          >Make your own story <BeautyIcon name="arrow"
        /></NuxtLink>
      </div>
      <NuxtLink
        class="wall-face wall-face-small"
        to="/looks"
        aria-label="Explore colour stories"
        ><BeautyImage
          src="/images/campaign-freckled-skin.webp"
          alt="Original freckled beauty portrait with graphic plum eyes and a rose lip"
          portrait
          priority
          sizes="(max-width: 700px) 35vw, 25vw"
      /></NuxtLink>
      <div class="wall-pigments">
        <BeautyImage
          src="/images/campaign-pigments.webp"
          alt="Berry, coral, plum and gold pigments in an expressive composition"
          landscape
          sizes="60vw"
        />
      </div>
      <NuxtLink class="wall-product" to="/products/satin-stroke"
        ><BeautyImage
          src="/images/satin-stroke-pack.webp"
          alt="Satin Stroke's closed silver case with a burgundy ring"
          sizes="220px" /><span>Satin Stroke <BeautyIcon name="arrow" /></span
      ></NuxtLink>
    </div>
    <div class="wall-caption">
      <span>COLOUR IS A FEELING. START WITH YOURS.</span
      ><NuxtLink to="/shop" class="text-link"
        >Explore the collection <BeautyIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
  <section class="section shell foundation-collection">
    <p class="eyebrow">Meet your colour wardrobe</p>
    <h2>Good to play<br />with <em>possibility.</em></h2>
    <div class="category-links">
      <NuxtLink to="/shop?category=Lips"
        >Lips <BeautyIcon name="arrow" /></NuxtLink
      ><NuxtLink to="/shop?category=Eyes"
        >Eyes <BeautyIcon name="arrow" /></NuxtLink
      ><NuxtLink to="/shop?category=Complexion"
        >Complexion <BeautyIcon name="arrow"
      /></NuxtLink>
    </div>
  </section>
</template>
