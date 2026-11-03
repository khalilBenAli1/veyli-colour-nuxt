<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { money } from '../../../data/catalog';
import type { OrderSnapshot } from '../../../domain/order';
defineProps<{ order: OrderSnapshot }>();
const heading = ref<HTMLHeadingElement | null>(null);
onMounted(() => heading.value?.focus());
</script>
<template>
  <div class="colour-order">
    <div class="confirmation-spark"><BeautyIcon name="spark" /></div>
    <p class="eyebrow">All the colour. All you.</p>
    <h1 ref="heading" tabindex="-1">That’s your<br /><em>colour story.</em></h1>
    <p class="thank-you">
      Thank you, {{ order.firstName }}. Your Veyli edit is complete.
    </p>
    <div class="order-ticket">
      <p class="eyebrow">Demo reference / {{ order.reference }}</p>
      <article
        v-for="line in order.lines"
        :key="line.key"
        class="order-ticket-line"
      >
        <BeautyImage
          :src="line.image"
          :alt="line.productName + ' / ' + line.shadeName"
          sizes="80px"
        />
        <div>
          <h2>{{ line.productName }}</h2>
          <p>{{ line.shadeName }} × {{ line.quantity }}</p>
        </div>
        <strong>{{ money(line.lineTotalCents) }}</strong>
      </article>
      <div class="order-total">
        <span>Demo total</span
        ><strong>{{ money(order.totals.totalCents) }}</strong>
      </div>
      <p class="order-outcome">
        This was a demo. Nothing was purchased or charged, no email was sent,
        and your contact details were not saved.
      </p>
    </div>
    <NuxtLink class="button" to="/shop"
      >Keep playing with colour <BeautyIcon name="arrow"
    /></NuxtLink>
  </div>
</template>
