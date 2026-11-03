<script setup lang="ts">
import type { CustomerDetails } from '../../../domain/customer';
defineProps<{ details: CustomerDetails }>();
const emit = defineEmits<{ edit: []; finish: [] }>();
</script>
<template>
  <div class="checkout-review">
    <dl class="review-details">
      <div>
        <dt>Your details</dt>
        <dd>
          {{ details.name }}<br />{{ details.email
          }}<button type="button" class="plain-button" @click="emit('edit')">
            Edit details
          </button>
        </dd>
      </div>
      <div>
        <dt>Destination</dt>
        <dd>{{ details.country }}</dd>
      </div>
      <div>
        <dt>Delivery</dt>
        <dd>Standard / included from €75<br />€5 below €75</dd>
      </div>
    </dl>
    <button type="button" class="button full" @click="emit('finish')">
      Complete demo order <BeautyIcon name="arrow" />
    </button>
  </div>
</template>
