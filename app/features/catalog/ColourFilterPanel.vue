<script setup lang="ts">
import { money } from '../../../data/catalog';
import {
  categories,
  finishes,
  families,
  type CatalogFilters,
} from '../../../domain/catalog';
defineProps<{ filters: CatalogFilters; count: number }>();
const emit = defineEmits<{ change: [key: string, value: string]; reset: [] }>();
const value = (event: Event) => (event.target as HTMLInputElement).value;
</script>
<template>
  <div class="catalogue-filters">
    <div class="filter-top">
      <div class="category-pills" aria-label="Categories">
        <button
          type="button"
          :class="{ selected: !filters.category }"
          :aria-pressed="!filters.category"
          @click="emit('change', 'category', '')"
        >
          All colour</button
        ><button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="{ selected: filters.category === category }"
          :aria-pressed="filters.category === category"
          @click="emit('change', 'category', category)"
        >
          {{ category }}
        </button>
      </div>
      <label class="search-control"
        ><span class="sr-only">Search products and shades</span
        ><input
          type="search"
          placeholder="Find a colour, a finish, a feeling…"
          maxlength="100"
          :value="filters.search"
          @input="emit('change', 'q', value($event))"
      /></label>
    </div>
    <div class="filter-bottom">
      <label
        >Finish<select
          :value="filters.finish"
          @change="emit('change', 'finish', value($event))"
        >
          <option value="">Every finish</option>
          <option v-for="finish in finishes" :key="finish">{{ finish }}</option>
        </select></label
      ><label
        >Shade family<select
          :value="filters.family"
          @change="emit('change', 'family', value($event))"
        >
          <option value="">Every colour</option>
          <option v-for="family in families" :key="family">{{ family }}</option>
        </select></label
      ><label class="price-control"
        >Up to {{ money(filters.maxPrice)
        }}<input
          aria-label="Maximum price"
          :aria-valuetext="money(filters.maxPrice)"
          type="range"
          min="0"
          max="7000"
          step="100"
          :value="filters.maxPrice"
          @input="emit('change', 'price', value($event))" /></label
      ><button type="button" class="plain-button" @click="emit('reset')">
        Reset filters</button
      ><label
        >Sort<select
          aria-label="Sort products"
          :value="filters.sort"
          @change="emit('change', 'sort', value($event))"
        >
          <option value="edit">The Veyli edit</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select></label
      >
    </div>
    <p class="catalogue-count" role="status">
      {{ count }} {{ count === 1 ? 'piece' : 'pieces' }} to make your own
    </p>
  </div>
</template>
