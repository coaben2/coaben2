<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">
        <i class="fas fa-question-circle mr-3"></i>
        Questions & Réponses
      </h1>
      <p class="text-gray-400">
        Consultez les questions existantes
      </p>
    </div>

    <div class="alert alert-info mb-6">
      <i class="fas fa-envelope mr-2"></i>
      <div>
        <p class="font-semibold mb-2">Vous avez une question ?</p>
        <p class="mb-3">Envoyez votre question par email à :</p>
        <a href="mailto:coaben2@gmail.com?subject=Question%20FAQ" class="btn btn-sm btn-primary gap-2">
          <i class="fas fa-envelope"></i>
          coaben2@gmail.com
        </a>
      </div>
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
onMounted(async () => {
  await faqStore.fetchTags();
  faqStore.fetchQuestions();
});
</script>

