import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '../../utiles/supabase.ts';

const STORAGE_KEY = 'faq_system';
const MIGRATION_KEY = 'faq_supabase_migrated';

function loadLegacyState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        questions: [],
        answers: []
      };
    }

    const parsed = JSON.parse(raw);
    return {
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      answers: Array.isArray(parsed.answers) ? parsed.answers : []
    };
  } catch {
    return {
      questions: [],
      answers: []
    };
  }
}

function withQuestionTags(question, links) {
  return {
    ...question,
    tags: links
      .filter((link) => Number(link.question_id) === Number(question.id))
      .map((link) => Number(link.tag_id))
  };
}

async function fetchQuestionTagLinks(questionId) {
  let query = supabase.from('question_tags').select('question_id, tag_id');

  if (questionId !== undefined && questionId !== null) {
    query = query.eq('question_id', questionId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export const useFAQStore = defineStore('faq', () => {
  const questions = ref([]);
  const tags = ref([]);
  const selectedTags = ref([]);
  const searchQuery = ref('');
  const loading = ref(false);

  const fetchTags = async () => {
    const { data, error } = await supabase.from('tags').select('*').order('id', { ascending: true });

    if (error) {
      throw error;
    }

    tags.value = data ?? [];
    return tags.value;
  };

  const migrateFromLocalStorage = async () => {
    if (localStorage.getItem(MIGRATION_KEY) === 'true') {
      return;
    }

    const legacyState = loadLegacyState();
    if (legacyState.questions.length === 0) {
      localStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    if (tags.value.length === 0) {
      await fetchTags();
    }

    for (const legacyQuestion of legacyState.questions) {
      const createdQuestion = await createQuestion({
        title: legacyQuestion.title,
        content: legacyQuestion.content,
        author: legacyQuestion.author,
        tags: legacyQuestion.tags ?? []
      });

      const legacyAnswers = legacyState.answers.filter(
        (answer) => Number(answer.question_id) === Number(legacyQuestion.id)
      );

      for (const legacyAnswer of legacyAnswers) {
        try {
          await addAnswer(createdQuestion.id, {
            content: legacyAnswer.content,
            author: legacyAnswer.author
          });
        } catch {
          break;
        }
      }
    }

    localStorage.setItem(MIGRATION_KEY, 'true');
  };

  const fetchQuestions = async () => {
    loading.value = true;
    try {
      const [{ data: questionRows, error: questionsError }, questionTagLinks] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false }),
        fetchQuestionTagLinks()
      ]);

      if (questionsError) {
        throw questionsError;
      }

      questions.value = (questionRows ?? []).map((question) => withQuestionTags(question, questionTagLinks));
    } finally {
      loading.value = false;
    }
  };

  const fetchQuestionById = async (id) => {
    const [{ data: question, error }, questionTagLinks] = await Promise.all([
      supabase.from('questions').select('*').eq('id', id).single(),
      fetchQuestionTagLinks(id)
    ]);

    if (error) {
      throw error;
    }

    return withQuestionTags(question, questionTagLinks);
  };

  const createQuestion = async (questionData) => {
    const { data: insertedQuestion, error } = await supabase
      .from('questions')
      .insert({
        title: questionData.title,
        content: questionData.content,
        author: questionData.author || 'Anonyme',
        status: 'pending'
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const normalizedTags = (questionData.tags ?? []).map((tagId) => Number(tagId));
    if (normalizedTags.length > 0) {
      const { error: tagError } = await supabase.from('question_tags').insert(
        normalizedTags.map((tagId) => ({
          question_id: insertedQuestion.id,
          tag_id: tagId
        }))
      );

      if (tagError) {
        throw tagError;
      }
    }

    const newQuestion = {
      ...insertedQuestion,
      tags: normalizedTags
    };

    questions.value.unshift(newQuestion);
    return newQuestion;
  };

  const addAnswer = async (questionId, answerData) => {
    const { data: newAnswer, error } = await supabase
      .from('answers')
      .insert({
        question_id: Number(questionId),
        content: answerData.content,
        author: answerData.author || 'Admin'
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const { error: questionError } = await supabase
      .from('questions')
      .update({ status: 'answered' })
      .eq('id', Number(questionId));

    if (questionError) {
      throw questionError;
    }

    const question = questions.value.find((q) => Number(q.id) === Number(questionId));
    if (question) {
      question.status = 'answered';
    }

    return newAnswer;
  };

  const updateAnswer = async (answerId, answerData) => {
    const { data: answer, error } = await supabase
      .from('answers')
      .update({
        content: answerData.content,
        author: answerData.author || 'Admin'
      })
      .eq('id', Number(answerId))
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return answer;
  };

  const deleteQuestion = async (questionId) => {
    const { error } = await supabase.from('questions').delete().eq('id', Number(questionId));

    if (error) {
      throw error;
    }

    questions.value = questions.value.filter((q) => Number(q.id) !== Number(questionId));
  };

  const deleteAnswer = async (answerId) => {
    const { data: answer, error } = await supabase
      .from('answers')
      .delete()
      .eq('id', Number(answerId))
      .select('id, question_id')
      .single();

    if (error) {
      throw error;
    }

    if (answer) {
      const { data: remaining, error: remainingError } = await supabase
        .from('answers')
        .select('id')
        .eq('question_id', Number(answer.question_id));

      if (remainingError) {
        throw remainingError;
      }

      if (remaining.length === 0) {
        const { error: questionError } = await supabase
          .from('questions')
          .update({ status: 'pending' })
          .eq('id', Number(answer.question_id));

        if (questionError) {
          throw questionError;
        }

        const question = questions.value.find(
          (q) => Number(q.id) === Number(answer.question_id)
        );
        if (question) {
          question.status = 'pending';
        }
      }
    }
  };

  const getAnswersByQuestionId = async (questionId) => {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('question_id', Number(questionId))
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
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
