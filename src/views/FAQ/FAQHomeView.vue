<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">
        <i class="fas fa-question-circle mr-3"></i>
        Questions & Réponses
      </h1>
      <p class="text-gray-400">
        Posez vos questions ou consultez les questions existantes
      </p>
    </div>

    <div class="mb-6">
      <router-link to="/faq/ask" class="btn btn-primary btn-lg">
        <i class="fas fa-plus mr-2"></i>
        Poser une question
      </router-link>
    </div>

    <SearchBar />
    <TagFilter />

    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="filteredQuestions.length === 0" class="text-center py-12">
      <i class="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
      <p class="text-xl text-gray-400">
        {{ searchQuery || selectedTags.length > 0 
          ? 'Aucune question ne correspond à vos critères' 
          : 'Aucune question pour le moment' }}
      </p>
      <router-link v-if="!searchQuery && selectedTags.length === 0" to="/faq/ask" class="btn btn-primary mt-4">
        Être le premier à poser une question
      </router-link>
    </div>

    <div v-else>
      <div class="mb-4 text-sm text-gray-400">
        {{ filteredQuestions.length }} question{{ filteredQuestions.length > 1 ? 's' : '' }} trouvée{{ filteredQuestions.length > 1 ? 's' : '' }}
      </div>
      <QuestionCard
        v-for="question in filteredQuestions"
        :key="question.id"
        :question="question"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useFAQStore } from '@/stores/faqStore';
import QuestionCard from './components/QuestionCard.vue';
import TagFilter from './components/TagFilter.vue';
import SearchBar from './components/SearchBar.vue';

const faqStore = useFAQStore();
const loading = computed(() => faqStore.loading);
const filteredQuestions = computed(() => faqStore.filteredQuestions);
const searchQuery = computed(() => faqStore.searchQuery);
const selectedTags = computed(() => faqStore.selectedTags);

onMounted(() => {
  faqStore.fetchQuestions();
});
</script>

