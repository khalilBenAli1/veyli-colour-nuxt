<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useHead } from '#imports';
import { useCheckout } from '../composables/useCheckout';
import { useShopUi } from '../composables/useShopUi';
const { shop, details, errors, step, order, notice, hasItems, review, finish } =
  useCheckout();
const ui = useShopUi();
const heading = ref<HTMLHeadingElement | null>(null);
watch(step, async () => {
  await nextTick();
  heading.value?.focus();
});
useHead({ title: 'Your colour edit — Veyli Colour' });
</script>
<template>
  <section class="shell checkout-page">
    <ColourOrderConfirmation v-if="order" :order="order" /><template v-else
      ><div class="checkout-heading">
        <p class="eyebrow">A little colour, just for you</p>
        <h1>Your colour<br /><em>edit.</em></h1>
        <p v-if="hasItems" class="checkout-demo-note">
          Try this demo checkout with sample details. No order, payment or
          message is made.
        </p>
      </div>
      <p v-if="!shop.ready" class="quiet" role="status">
        A moment for your edit…
      </p>
      <div v-else-if="hasItems" class="checkout-layout">
        <div class="checkout-panel">
          <ol class="checkout-steps">
            <li :class="{ selected: step === 0 }">
              <button
                type="button"
                :aria-current="step === 0 ? 'step' : undefined"
                @click="step = 0"
              >
                01 / Your details
              </button>
            </li>
            <li :class="{ selected: step === 1 }">
              <span :aria-current="step === 1 ? 'step' : undefined"
                >02 / Your edit</span
              >
            </li>
          </ol>
          <h2 ref="heading" tabindex="-1">
            {{ step === 0 ? 'A few little details.' : 'One last look.' }}
          </h2>
          <CustomerDetailsForm
            v-if="step === 0"
            v-model="details"
            :errors="errors"
            @review="review"
            @clear-errors="errors = {}"
          /><CheckoutReview
            v-else
            :details="details"
            @edit="step = 0"
            @finish="finish"
          />
          <p v-if="notice" class="field-error" role="alert">{{ notice }}</p>
        </div>
        <EditSummary
          :lines="shop.lines"
          :totals="shop.totals"
          @edit="ui.openBag"
        />
      </div>
      <div v-else class="colour-empty">
        <BeautyIcon name="spark" />
        <h2>A little room<br />for <em>your next mood.</em></h2>
        <p>Your bag is ready for a colour story.</p>
        <NuxtLink class="button" to="/shop"
          >Find your colour <BeautyIcon name="arrow"
        /></NuxtLink></div
    ></template>
  </section>
</template>
