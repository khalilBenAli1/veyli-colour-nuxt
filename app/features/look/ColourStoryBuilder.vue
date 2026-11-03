<script setup lang="ts">
import { computed } from 'vue';
import { money, shadeImage, storyKeys } from '../../../data/catalog';
import { stories, lookSlots, type LookSlot } from '../../../domain/looks';
import { useLookBuilder } from '../../composables/useLookBuilder';
const {
  shop,
  draft,
  error,
  lines,
  total,
  count,
  chooseStory,
  choose,
  options,
  add,
} = useLookBuilder();
const labels: Record<LookSlot, string> = {
  lips: 'Lips',
  eyes: 'Eyes',
  accent: 'Complexion accent',
};
const value = (event: Event) => (event.target as HTMLSelectElement).value;
const cards = computed(() =>
  lookSlots.map((slot, index) => {
    const choice = draft.value.choices[slot];
    const key = choice ? choice.productId + ':' + choice.shadeId : '';
    const list = options(slot);
    return {
      slot,
      index,
      label: labels[slot],
      key,
      options: list,
      choice: list.find((option) => option.key === key) ?? null,
    };
  }),
);
</script>
<template>
  <div class="colour-story-builder">
    <div class="story-picker" aria-label="Colour stories">
      <button
        v-for="story in storyKeys"
        :key="story"
        type="button"
        :class="{ selected: draft.story === story }"
        :aria-pressed="draft.story === story"
        @click="chooseStory(story)"
      >
        <span
          :style="{ background: stories[story].color }"
          aria-hidden="true"
        />{{ stories[story].name }}
      </button>
    </div>
    <p class="story-description">{{ stories[draft.story].description }}</p>
    <div class="look-layout">
      <div class="story-slots">
        <article v-for="card in cards" :key="card.slot" class="story-slot">
          <div class="slot-heading">
            <span class="step-bubble">0{{ card.index + 1 }}</span>
            <h2>{{ card.label }}</h2>
            <button
              v-if="card.key"
              type="button"
              class="plain-button"
              :aria-label="'Remove ' + card.label + ' from look'"
              @click="choose(card.slot, '')"
            >
              Remove
            </button>
          </div>
          <div class="slot-choice">
            <div class="slot-picture">
              <BeautyImage
                v-if="card.choice"
                :src="shadeImage(card.choice.product, card.choice.shade)"
                :alt="card.choice.product.name + ' / ' + card.choice.shade.name"
                sizes="180px"
              /><BeautyIcon v-else name="plus" />
            </div>
            <div class="slot-fields">
              <label :for="'look-' + card.slot"
                >Choose {{ card.label.toLowerCase() }}</label
              ><select
                :id="'look-' + card.slot"
                :value="card.key"
                @change="choose(card.slot, value($event))"
              >
                <option value="">Leave this part out</option>
                <option
                  v-for="option in card.options"
                  :key="option.key"
                  :value="option.key"
                  :disabled="!option.shade.stock"
                >
                  {{ option.product.name }} / {{ option.shade.name
                  }}{{ option.shade.stock ? '' : ' — Unavailable' }}
                </option></select
              ><template v-if="card.choice"
                ><p>
                  {{ card.choice.product.type }} /
                  {{ card.choice.product.finish }}
                </p>
                <div class="slot-shade">
                  <span
                    :style="{ background: card.choice.shade.hex }"
                    aria-hidden="true"
                  />{{ card.choice.shade.name
                  }}<strong>{{ money(card.choice.product.priceCents) }}</strong>
                </div></template
              >
              <p v-else class="quiet">
                Keep it simple, or choose another piece.
              </p>
            </div>
          </div>
        </article>
      </div>
      <aside class="look-summary">
        <p class="eyebrow">Your colour story</p>
        <h2>{{ stories[draft.story].name }}</h2>
        <div class="story-colour-dots" aria-hidden="true">
          <span
            v-for="line in lines"
            :key="line.key"
            :style="{ background: line.shade.hex }"
          />
        </div>
        <p role="status">
          {{ count }} {{ count === 1 ? 'piece' : 'pieces' }}, chosen by you
        </p>
        <div class="look-price">
          <span>Story subtotal</span><strong>{{ money(total) }}</strong>
        </div>
        <button
          type="button"
          class="button full"
          :disabled="!shop.ready || !count"
          @click="add"
        >
          Add {{ count === 1 ? 'piece' : 'look' }} to bag
          <BeautyIcon name="bag" />
        </button>
        <p v-if="error" class="field-error" role="alert">{{ error }}</p>
        <p class="quiet">Edit any part. Leave a piece out. Make it your own.</p>
        <NuxtLink class="text-link" to="/shop"
          >Explore every shade <BeautyIcon name="arrow"
        /></NuxtLink>
      </aside>
    </div>
  </div>
</template>
