import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'faq_system';
const TAGS_STORAGE_KEY = 'faq_tags';

// Tags prédéfinis avec les classes Guild Wars 2
const DEFAULT_TAGS = [
  { id: 1, name: 'Guerrier', color: '#FF6B6B' },
  { id: 2, name: 'Gardien', color: '#4ECDC4' },
  { id: 3, name: 'Revenant', color: '#95E1D3' },
  { id: 4, name: 'Voleur', color: '#F38181' },
  { id: 5, name: 'Rodeur', color: '#AAE3E2' },
  { id: 6, name: 'Ingénieur', color: '#FFD93D' },
  { id: 7, name: 'Nécromant', color: '#6BCB77' },
  { id: 8, name: 'Envouteur', color: '#4D96FF' },
  { id: 9, name: 'Elementaliste', color: '#FF6B9D' },
  { id: 10, name: 'Général', color: '#9B9B9B' },
  { id: 11, name: 'Technique', color: '#5C7AEA' },
  { id: 12, name: 'Bug', color: '#E74C3C' },
  { id: 13, name: 'Feature', color: '#2ECC71' },
  { id: 14, name: 'Aide', color: '#F39C12' },
  { id: 15, name: 'Autre', color: '#95A5A6' }
];

export const useFAQStore = defineStore('faq', () => {
  const questions = ref([]);
  const answers = ref([]);
  const tags = ref([]);
  const selectedTags = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);

  // Initialisation des tags
  const initializeTags = () => {
    const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
    if (storedTags) {
      tags.value = JSON.parse(storedTags);
    } else {
      tags.value = DEFAULT_TAGS;
      saveTags();
    }
  };

  // Sauvegarde des tags
  const saveTags = () => {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags.value));
  };

  // Chargement des données depuis localStorage
  const loadData = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        questions.value = data.questions || [];
        answers.value = data.answers || [];
      }
      initializeTags();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      questions.value = [];
      answers.value = [];
      initializeTags();
    }
  };

  // Sauvegarde des données dans localStorage
  const saveData = () => {
    try {
      const data = {
        questions: questions.value,
        answers: answers.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  };

  // Récupérer toutes les questions (triées par date décroissante)
  const fetchQuestions = () => {
    loadData();
    return questions.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  // Récupérer une question par ID
  const fetchQuestionById = (id) => {
    loadData();
    return questions.value.find(q => q.id === parseInt(id));
  };

  // Créer une nouvelle question
  const createQuestion = (questionData) => {
    loadData();
    const newQuestion = {
      id: Date.now(), // ID basé sur le timestamp
      title: questionData.title,
      content: questionData.content,
      author: questionData.author || 'Anonyme',
      status: 'pending',
      tags: questionData.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    questions.value.push(newQuestion);
    saveData();
    return newQuestion;
  };

  // Ajouter une réponse
  const addAnswer = (questionId, answerData) => {
    loadData();
    const newAnswer = {
      id: Date.now(),
      question_id: parseInt(questionId),
      content: answerData.content,
      author: answerData.author || 'Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    answers.value.push(newAnswer);
    
    // Mettre à jour le statut de la question
    const question = questions.value.find(q => q.id === parseInt(questionId));
    if (question) {
      question.status = 'answered';
      question.updated_at = new Date().toISOString();
    }
    
    saveData();
    return newAnswer;
  };

  // Modifier une réponse
  const updateAnswer = (answerId, answerData) => {
    loadData();
    const answer = answers.value.find(a => a.id === parseInt(answerId));
    if (answer) {
      answer.content = answerData.content;
      answer.updated_at = new Date().toISOString();
      saveData();
    }
    return answer;
  };

  // Supprimer une question
  const deleteQuestion = (questionId) => {
    loadData();
    questions.value = questions.value.filter(q => q.id !== parseInt(questionId));
    answers.value = answers.value.filter(a => a.question_id !== parseInt(questionId));
    saveData();
  };

  // Supprimer une réponse
  const deleteAnswer = (answerId) => {
    loadData();
    const answer = answers.value.find(a => a.id === parseInt(answerId));
    if (answer) {
      answers.value = answers.value.filter(a => a.id !== parseInt(answerId));
      // Vérifier si la question a encore des réponses
      const questionAnswers = answers.value.filter(a => a.question_id === answer.question_id);
      const question = questions.value.find(q => q.id === answer.question_id);
      if (question && questionAnswers.length === 0) {
        question.status = 'pending';
        question.updated_at = new Date().toISOString();
      }
      saveData();
    }
  };

  // Récupérer les réponses d'une question
  const getAnswersByQuestionId = (questionId) => {
    loadData();
    return answers.value
      .filter(a => a.question_id === parseInt(questionId))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  // Filtrer par tags
  const filterByTags = (tagIds) => {
    selectedTags.value = tagIds;
  };

  // Rechercher dans les questions
  const searchQuestions = (query) => {
    searchQuery.value = query;
  };

  // Questions filtrées et recherchées (computed)
  const filteredQuestions = computed(() => {
    let result = [...questions.value];

    // Filtrage par tags
    if (selectedTags.value.length > 0) {
      result = result.filter(question => {
        const questionTagIds = question.tags || [];
        return selectedTags.value.some(tagId => questionTagIds.includes(tagId));
      });
    }

    // Recherche par texte
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(question => {
        return question.title.toLowerCase().includes(query) ||
               question.content.toLowerCase().includes(query);
      });
    }

    // Tri par date (plus récent en premier)
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  });

  // Récupérer un tag par ID
  const getTagById = (tagId) => {
    return tags.value.find(t => t.id === tagId);
  };

  // Récupérer un tag par nom
  const getTagByName = (name) => {
    return tags.value.find(t => t.name === name);
  };

  // Initialiser le store
  initializeTags();
  loadData();

  return {
    questions,
    answers,
    tags,
    selectedTags,
    searchQuery,
    loading,
    filteredQuestions,
    fetchQuestions,
    fetchQuestionById,
    createQuestion,
    addAnswer,
    updateAnswer,
    deleteQuestion,
    deleteAnswer,
    getAnswersByQuestionId,
    filterByTags,
    searchQuestions,
    getTagById,
    getTagByName
  };
});

