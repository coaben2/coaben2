import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const STORAGE_KEY = 'faq_system';

const DEFAULT_TAGS = [
  { id: 1, name: 'Guerrier', color: '#FF6B6B' },
  { id: 2, name: 'Gardien', color: '#4ECDC4' },
  { id: 3, name: 'Revenant', color: '#95E1D3' },
  { id: 4, name: 'Voleur', color: '#F38181' },
  { id: 5, name: 'Rodeur', color: '#AAE3E2' },
  { id: 6, name: 'Ingenieur', color: '#FFD93D' },
  { id: 7, name: 'Necromant', color: '#6BCB77' },
  { id: 8, name: 'Envouteur', color: '#4D96FF' },
  { id: 9, name: 'Elementaliste', color: '#FF6B9D' },
  { id: 10, name: 'General', color: '#9B9B9B' },
  { id: 11, name: 'Technique', color: '#5C7AEA' },
  { id: 12, name: 'Bug', color: '#E74C3C' },
  { id: 13, name: 'Feature', color: '#2ECC71' },
  { id: 14, name: 'Aide', color: '#F39C12' },
  { id: 15, name: 'Autre', color: '#95A5A6' }
];

function nowIso() {
  return new Date().toISOString();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        tags: DEFAULT_TAGS,
        questions: [],
        answers: []
      };
    }

    const parsed = JSON.parse(raw);
    return {
      tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : DEFAULT_TAGS,
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      answers: Array.isArray(parsed.answers) ? parsed.answers : []
    };
  } catch {
    return {
      tags: DEFAULT_TAGS,
      questions: [],
      answers: []
    };
  }
}

function persistState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function nextId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
}

export const useFAQStore = defineStore('faq', () => {
  const questions = ref([]);
  const answers = ref([]);
  const tags = ref([]);
  const selectedTags = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);

  const hydrate = () => {
    const state = loadState();
    tags.value = state.tags;
    questions.value = state.questions;
    answers.value = state.answers;
  };

  const save = () => {
    persistState({
      tags: tags.value,
      questions: questions.value,
      answers: answers.value
    });
  };

  const fetchTags = async () => {
    if (tags.value.length === 0) {
      hydrate();
    }
    return tags.value;
  };

  // Kept for compatibility with existing view flow.
  const migrateFromLocalStorage = async () => {
    if (tags.value.length === 0) {
      hydrate();
    }
  };

  const fetchQuestions = async () => {
    loading.value = true;
    try {
      hydrate();
      questions.value = [...questions.value].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } finally {
      loading.value = false;
    }
  };

  const fetchQuestionById = async (id) => {
    if (questions.value.length === 0) {
      hydrate();
    }
    const question = questions.value.find((q) => Number(q.id) === Number(id));
    if (!question) throw new Error('Question introuvable');
    return question;
  };

  const createQuestion = async (questionData) => {
    if (tags.value.length === 0) {
      hydrate();
    }

    const timestamp = nowIso();
    const newQuestion = {
      id: nextId(questions.value),
      title: questionData.title,
      content: questionData.content,
      author: questionData.author || 'Anonyme',
      status: 'pending',
      tags: questionData.tags || [],
      created_at: timestamp,
      updated_at: timestamp
    };

    questions.value.unshift(newQuestion);
    save();
    return newQuestion;
  };

  const addAnswer = async (questionId, answerData) => {
    const timestamp = nowIso();
    const newAnswer = {
      id: nextId(answers.value),
      question_id: Number(questionId),
      content: answerData.content,
      author: answerData.author || 'Admin',
      created_at: timestamp,
      updated_at: timestamp
    };

    answers.value.push(newAnswer);

    const question = questions.value.find((q) => Number(q.id) === Number(questionId));
    if (question) {
      question.status = 'answered';
      question.updated_at = timestamp;
    }

    save();
    return newAnswer;
  };

  const updateAnswer = async (answerId, answerData) => {
    const answer = answers.value.find((a) => Number(a.id) === Number(answerId));
    if (!answer) throw new Error('Reponse introuvable');

    answer.content = answerData.content;
    answer.author = answerData.author || 'Admin';
    answer.updated_at = nowIso();
    save();

    return answer;
  };

  const deleteQuestion = async (questionId) => {
    questions.value = questions.value.filter((q) => Number(q.id) !== Number(questionId));
    answers.value = answers.value.filter((a) => Number(a.question_id) !== Number(questionId));
    save();
  };

  const deleteAnswer = async (answerId) => {
    const answer = answers.value.find((a) => Number(a.id) === Number(answerId));
    answers.value = answers.value.filter((a) => Number(a.id) !== Number(answerId));

    if (answer) {
      const remaining = answers.value.filter(
        (a) => Number(a.question_id) === Number(answer.question_id)
      );
      if (remaining.length === 0) {
        const question = questions.value.find(
          (q) => Number(q.id) === Number(answer.question_id)
        );
        if (question) {
          question.status = 'pending';
          question.updated_at = nowIso();
        }
      }
    }

    save();
  };

  const getAnswersByQuestionId = async (questionId) => {
    if (answers.value.length === 0 && questions.value.length === 0) {
      hydrate();
    }

    return answers.value
      .filter((a) => Number(a.question_id) === Number(questionId))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
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

  hydrate();

  return {
    questions,
    tags,
    selectedTags,
    searchQuery,
    loading,
    filteredQuestions,
    fetchTags,
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
    getTagByName,
    migrateFromLocalStorage
  };
});
