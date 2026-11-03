<script setup lang="ts">
import { money, shadeImage } from '../../../data/catalog';
import type { CartLine, cartTotals } from '../../../domain/cart';
defineProps<{
  lines: readonly CartLine[];
  totals: ReturnType<typeof cartTotals>;
}>();
const emit = defineEmits<{ edit: [] }>();
</script>
<template>
  <aside class="edit-summary">
    <p class="eyebrow">The colour you chose</p>
    <h2>Your edit</h2>
    <article v-for="line in lines" :key="line.key" class="summary-line">
      <BeautyImage
        :src="shadeImage(line.product, line.shade)"
        :alt="line.product.name + ' / ' + line.shade.name"
        sizes="100px"
      />
      <div>
        <h3>{{ line.product.name }}</h3>
        <p>{{ line.shade.name }} × {{ line.quantity }}</p>
        <strong>{{ money(line.lineTotalCents) }}</strong>
      </div>
    </article>
    <dl class="summary-totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ money(totals.subtotalCents) }}</dd>
      </div>
      <div>
        <dt>Delivery</dt>
        <dd>
          {{ totals.deliveryCents ? money(totals.deliveryCents) : 'Included' }}
        </dd>
      </div>
      <div class="summary-total">
        <dt>Your total</dt>
        <dd>{{ money(totals.totalCents) }}</dd>
      </div>
    </dl>
    <button type="button" class="plain-button" @click="emit('edit')">
      Edit your bag
    </button>
  </aside>
</template>
