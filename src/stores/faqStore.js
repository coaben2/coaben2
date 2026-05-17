import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import faqData from '../data/faqData.json';

// URL de votre API backend - à configurer
const API_BASE_URL = import.meta.env.VITE_FAQ_API_URL || 'http://localhost:3000/api';
const USE_API = import.meta.env.VITE_USE_FAQ_API === 'true';

export const useFAQStore = defineStore('faq', () => {
  const questions = ref([]);
  const tags = ref([]);
  const selectedTags = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref(null);

  const fetchTagsFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) throw new Error('Erreur API');
      return await response.json();
    } catch (err) {
      console.warn('Erreur API tags, utilisation fallback JSON:', err);
      return null;
    }
  };

  const fetchQuestionsFromAPI = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) throw new Error('Erreur API');
      return await response.json();
    } catch (err) {
      console.warn('Erreur API questions, utilisation fallback JSON:', err);
      return null;
    }
  };

  const fetchTags = async () => {
    try {
      let data = null;

      // Essayer l'API si activée
      if (USE_API) {
        data = await fetchTagsFromAPI();
      }

      // Fallback sur JSON local
      if (!data) {
        data = faqData.tags || [];
      }

      tags.value = data;
      return tags.value;
    } catch (err) {
      error.value = 'Erreur lors du chargement des tags';
      console.error(err);
      tags.value = faqData.tags || [];
      return tags.value;
    }
  };

  const fetchQuestions = async () => {
    loading.value = true;
    error.value = null;
    try {
      let data = null;

      // Essayer l'API si activée
      if (USE_API) {
        data = await fetchQuestionsFromAPI();
      }

      // Fallback sur JSON local
      if (!data) {
        data = faqData.questions || [];
      }

      questions.value = data;
    } catch (err) {
      error.value = 'Erreur lors du chargement des questions';
      console.error(err);
      questions.value = faqData.questions || [];
    } finally {
      loading.value = false;
    }
  };

  const fetchQuestionById = async (id) => {
    return questions.value.find((q) => Number(q.id) === Number(id));
  };

  const getAnswersByQuestionId = async (questionId) => {
    const question = await fetchQuestionById(questionId);
    return question?.answers || [];
  };

  const filterByTags = (tagIds) => {
    selectedTags.value = tagIds;
  };

  const searchQuestions = (query) => {
    searchQuery.value = query;
  };

  const filteredQuestions = computed(() => {
    let result = [...questions.value];

    if (selectedTags.value.length > 0) {
      result = result.filter((q) =>
        selectedTags.value.some((tagId) => (q.tags || []).includes(tagId))
      );
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((q) =>
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const getTagById = (tagId) => tags.value.find((t) => Number(t.id) === Number(tagId));
  const getTagByName = (name) => tags.value.find((t) => t.name === name);

  return {
    questions,
    tags,
    selectedTags,
    searchQuery,
    loading,
    error,
    filteredQuestions,
    fetchTags,
    fetchQuestions,
    fetchQuestionById,
    getAnswersByQuestionId,
    filterByTags,
    searchQuestions,
    getTagById,
    getTagByName
  };
});
