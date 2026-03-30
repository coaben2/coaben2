<template>
  <div class="form-control w-full mb-6">
    <div class="input-group">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une question..."
        class="input input-bordered w-full"
        @input="handleSearch"
      />
      <button class="btn btn-square" @click="clearSearch">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useFAQStore } from '@/stores/faqStore';

const faqStore = useFAQStore();
const searchQuery = ref(faqStore.searchQuery);

watch(() => faqStore.searchQuery, (newValue) => {
  searchQuery.value = newValue;
});

const handleSearch = () => {
  faqStore.searchQuestions(searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  faqStore.searchQuestions('');
};
</script>

