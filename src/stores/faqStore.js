import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';

export const useFAQStore = defineStore('faq', () => {
  const questions = ref([]);
  const tags = ref([]);
  const selectedTags = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);

  // Normalise les données Supabase : transforme question_tags en tableau d'IDs
  const normalizeQuestion = (q) => ({
    ...q,
    tags: (q.question_tags || []).map(qt => qt.tag_id)
  });

  // Charger tous les tags
  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    if (error) throw error;
    tags.value = data || [];
  };

  // Migration unique depuis localStorage vers Supabase
  const migrateFromLocalStorage = async () => {
    const STORAGE_KEY = 'faq_system';
    const MIGRATION_DONE_KEY = 'faq_migrated_to_supabase';

    if (localStorage.getItem(MIGRATION_DONE_KEY)) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATION_DONE_KEY, '1');
      return;
    }

    let localData;
    try {
      localData = JSON.parse(raw);
    } catch {
      localStorage.setItem(MIGRATION_DONE_KEY, '1');
      return;
    }

    const localQuestions = localData.questions || [];
    const localAnswers = localData.answers || [];
    if (localQuestions.length === 0) {
      localStorage.setItem(MIGRATION_DONE_KEY, '1');
      return;
    }

    // S'assurer que les tags sont chargés
    if (tags.value.length === 0) await fetchTags();

    // Ancien mapping : les tags avaient des IDs 1-15 fixes, on mappe par position
    // On reconstruit un map oldId -> newId par ordre d'insertion (les noms sont identiques)
    const OLD_TAGS = [
      'Guerrier', 'Gardien', 'Revenant', 'Voleur', 'Rodeur', 'Ingénieur',
      'Nécromant', 'Envouteur', 'Elementaliste', 'Général', 'Technique',
      'Bug', 'Feature', 'Aide', 'Autre'
    ];
    const oldIdToNewId = {};
    OLD_TAGS.forEach((name, i) => {
      const oldId = i + 1;
      const newTag = tags.value.find(t => t.name === name);
      if (newTag) oldIdToNewId[oldId] = newTag.id;
    });

    for (const q of localQuestions) {
      try {
        const { data: inserted, error } = await supabase
          .from('questions')
          .insert({
            title: q.title,
            content: q.content,
            author: q.author || 'Anonyme',
            status: q.status || 'pending',
            created_at: q.created_at,
            updated_at: q.updated_at
          })
          .select()
          .single();
        if (error) continue;

        const tagIds = (q.tags || [])
          .map(oldId => oldIdToNewId[oldId])
          .filter(Boolean);

        if (tagIds.length > 0) {
          await supabase.from('question_tags').insert(
            tagIds.map(tagId => ({ question_id: inserted.id, tag_id: tagId }))
          );
        }

        // Migrer les réponses liées
        const linkedAnswers = localAnswers.filter(a => a.question_id === q.id);
        for (const a of linkedAnswers) {
          await supabase.from('answers').insert({
            question_id: inserted.id,
            content: a.content,
            author: a.author || 'Admin',
            created_at: a.created_at,
            updated_at: a.updated_at
          });
        }
      } catch {
        // continue avec les autres questions
      }
    }

    localStorage.setItem(MIGRATION_DONE_KEY, '1');
  };

  // Charger toutes les questions
  const fetchQuestions = async () => {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, question_tags(tag_id)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      questions.value = (data || []).map(normalizeQuestion);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
    } finally {
      loading.value = false;
    }
  };

  // Charger une question par ID
  const fetchQuestionById = async (id) => {
    const { data, error } = await supabase
      .from('questions')
      .select('*, question_tags(tag_id)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return normalizeQuestion(data);
  };

  // Créer une question avec ses tags
  const createQuestion = async (questionData) => {
    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        title: questionData.title,
        content: questionData.content,
        author: questionData.author || 'Anonyme',
        status: 'pending'
      })
      .select()
      .single();
    if (error) throw error;

    if (questionData.tags && questionData.tags.length > 0) {
      const tagInserts = questionData.tags.map(tagId => ({
        question_id: question.id,
        tag_id: tagId
      }));
      const { error: tagError } = await supabase
        .from('question_tags')
        .insert(tagInserts);
      if (tagError) throw tagError;
    }

    const newQuestion = { ...question, tags: questionData.tags || [] };
    questions.value.unshift(newQuestion);
    return newQuestion;
  };

  // Ajouter une réponse
  const addAnswer = async (questionId, answerData) => {
    const { data: answer, error } = await supabase
      .from('answers')
      .insert({
        question_id: Number(questionId),
        content: answerData.content,
        author: answerData.author || 'Admin'
      })
      .select()
      .single();
    if (error) throw error;

    await supabase
      .from('questions')
      .update({ status: 'answered' })
      .eq('id', Number(questionId));

    const q = questions.value.find(q => q.id === Number(questionId));
    if (q) q.status = 'answered';

    return answer;
  };

  // Modifier une réponse
  const updateAnswer = async (answerId, answerData) => {
    const { data: answer, error } = await supabase
      .from('answers')
      .update({
        content: answerData.content,
        author: answerData.author
      })
      .eq('id', Number(answerId))
      .select()
      .single();
    if (error) throw error;
    return answer;
  };

  // Supprimer une question
  const deleteQuestion = async (questionId) => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', Number(questionId));
    if (error) throw error;
    questions.value = questions.value.filter(q => q.id !== Number(questionId));
  };

  // Supprimer une réponse
  const deleteAnswer = async (answerId) => {
    const { data: answer } = await supabase
      .from('answers')
      .select('question_id')
      .eq('id', Number(answerId))
      .single();

    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', Number(answerId));
    if (error) throw error;

    if (answer) {
      const { data: remaining } = await supabase
        .from('answers')
        .select('id')
        .eq('question_id', answer.question_id);
      if (!remaining || remaining.length === 0) {
        await supabase
          .from('questions')
          .update({ status: 'pending' })
          .eq('id', answer.question_id);
        const q = questions.value.find(q => q.id === answer.question_id);
        if (q) q.status = 'pending';
      }
    }
  };

  // Récupérer les réponses d'une question
  const getAnswersByQuestionId = async (questionId) => {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', Number(questionId))
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
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
      result = result.filter(q =>
        selectedTags.value.some(tagId => (q.tags || []).includes(tagId))
      );
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(q =>
        q.title.toLowerCase().includes(query) ||
        q.content.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const getTagById = (tagId) => tags.value.find(t => t.id === tagId);
  const getTagByName = (name) => tags.value.find(t => t.name === name);

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

