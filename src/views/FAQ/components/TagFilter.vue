<template>
  <div class="card bg-base-100 shadow-xl mb-6">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">
        <i class="fas fa-filter mr-2"></i>
        Filtrer par tags
      </h3>
      
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in availableTags"
          :key="tag.id"
          class="badge cursor-pointer transition-all text-sm"
          :class="isTagSelected(tag.id) ? 'badge-primary' : 'badge-outline'"
          :style="isTagSelected(tag.id) ? {} : { borderColor: tag.color, color: tag.color }"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </span>
      </div>
      
      <div v-if="selectedTags.length > 0" class="mt-4">
        <button
          class="btn btn-sm btn-ghost"
          @click="clearFilters"
        >
          <i class="fas fa-times mr-2"></i>
          Effacer les filtres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFAQStore } from '@/stores/faqStore';

const faqStore = useFAQStore();

const availableTags = computed(() => faqStore.tags);
const selectedTags = computed(() => faqStore.selectedTags);

const isTagSelected = (tagId) => {
  return selectedTags.value.includes(tagId);
};

const toggleTag = (tagId) => {
  const currentTags = [...selectedTags.value];
  const index = currentTags.indexOf(tagId);
  
  if (index > -1) {
    currentTags.splice(index, 1);
  } else {
    currentTags.push(tagId);
  }
  
  faqStore.filterByTags(currentTags);
};

const clearFilters = () => {
  faqStore.filterByTags([]);
};
</script>

