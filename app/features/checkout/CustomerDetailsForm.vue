<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import {
  customerCountries,
  type CustomerDetails,
  type CustomerErrors,
} from '../../../domain/customer';
const details = defineModel<CustomerDetails>({ required: true });
const props = defineProps<{ errors: CustomerErrors }>();
const emit = defineEmits<{ review: []; clearErrors: [] }>();
const form = ref<HTMLFormElement | null>(null);
watch(
  () => props.errors,
  async () => {
    await nextTick();
    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  },
);
</script>
<template>
  <form
    ref="form"
    class="customer-details-form"
    novalidate
    @submit.prevent="emit('review')"
  >
    <button
      type="button"
      class="plain-button use-sample"
      @click="
        details = {
          name: 'Alex Morgan',
          email: 'alex+colour@example.com',
          country: 'France',
          consent: false,
        };
        emit('clearErrors');
      "
    >
      Use sample details <BeautyIcon name="spark" /></button
    ><label
      ><span id="vc-name-label">Your name</span
      ><input
        v-model="details.name"
        aria-labelledby="vc-name-label"
        autocomplete="off"
        maxlength="100"
        :aria-invalid="!!errors.name"
        :aria-describedby="errors.name ? 'vc-name-error' : undefined"
      /><span v-if="errors.name" id="vc-name-error" class="field-error">{{
        errors.name
      }}</span></label
    ><label
      ><span id="vc-email-label">Email address</span
      ><input
        v-model="details.email"
        type="email"
        aria-labelledby="vc-email-label"
        autocomplete="off"
        maxlength="254"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'vc-email-error' : undefined"
      /><span v-if="errors.email" id="vc-email-error" class="field-error">{{
        errors.email
      }}</span></label
    ><label
      ><span id="vc-country-label">Destination</span
      ><select
        v-model="details.country"
        aria-labelledby="vc-country-label"
        :aria-invalid="!!errors.country"
        :aria-describedby="errors.country ? 'vc-country-error' : undefined"
      >
        <option value="">Choose a destination</option>
        <option v-for="country in customerCountries" :key="country">
          {{ country }}
        </option></select
      ><span v-if="errors.country" id="vc-country-error" class="field-error">{{
        errors.country
      }}</span></label
    ><label class="consent-check"
      ><input
        v-model="details.consent"
        type="checkbox"
        :aria-invalid="!!errors.consent"
        :aria-describedby="errors.consent ? 'vc-consent-error' : undefined"
      /><span
        >I understand this is a demo order. No purchase or payment will be
        made.</span
      ></label
    >
    <p v-if="errors.consent" id="vc-consent-error" class="field-error">
      {{ errors.consent }}
    </p>
    <button type="submit" class="button full">
      Review my edit <BeautyIcon name="arrow" />
    </button>
  </form>
</template>
