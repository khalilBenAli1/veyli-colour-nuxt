<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { money } from '../../../data/catalog';
import { useShopStore } from '../../stores/shop';
defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const shop = useShopStore();
const notice = ref('');
const heading = ref<HTMLDivElement | null>(null);
function quantity(key: string, value: number) {
  notice.value = shop.update(key, value);
}
async function remove(key: string) {
  shop.remove(key);
  notice.value = 'Shade removed from your bag.';
  await nextTick();
  heading.value?.focus({ preventScroll: true });
}
</script>
<template>
  <BeautyDialog
    :open="open"
    title="Your colour edit"
    drawer
    @close="emit('close')"
    ><div ref="heading" tabindex="-1" class="bag-content">
      <p class="bag-count">
        {{ shop.totals.count }}
        {{ shop.totals.count === 1 ? 'piece' : 'pieces' }} / all your own
      </p>
      <template v-if="shop.lines.length"
        ><div class="bag-lines">
          <ColourBagLine
            v-for="line in shop.lines"
            :key="line.key"
            :line="line"
            @close="emit('close')"
            @quantity="quantity"
            @remove="remove"
          />
        </div>
        <div class="bag-totals">
          <div>
            <span>Subtotal</span
            ><strong>{{ money(shop.totals.subtotalCents) }}</strong>
          </div>
          <div>
            <span>Delivery</span
            ><span>{{
              shop.totals.deliveryCents
                ? money(shop.totals.deliveryCents)
                : 'Included'
            }}</span>
          </div>
          <div class="bag-total">
            <span>Your total</span
            ><strong>{{ money(shop.totals.totalCents) }}</strong>
          </div>
          <p>Delivery is included from €75, or €5 below.</p>
          <NuxtLink class="button full" to="/checkout" @click="emit('close')"
            >Continue to checkout <BeautyIcon name="arrow" /></NuxtLink
          ><button type="button" class="plain-button" @click="emit('close')">
            Keep playing with colour
          </button>
        </div></template
      >
      <div v-else class="bag-empty">
        <BeautyIcon name="spark" />
        <h3>A little room<br />for your next mood.</h3>
        <p>Find a shade to make your own.</p>
        <NuxtLink class="button full" to="/shop" @click="emit('close')"
          >Explore colour <BeautyIcon name="arrow"
        /></NuxtLink>
      </div>
      <p role="status" class="bag-notice">{{ notice }}</p>
    </div></BeautyDialog
  >
</template>
