<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="!question" class="text-center py-12">
      <i class="fas fa-exclamation-triangle text-6xl text-warning mb-4"></i>
      <p class="text-xl text-gray-400 mb-4">Question introuvable</p>
      <router-link to="/faq" class="btn btn-primary">
        Retour à la liste
      </router-link>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link to="/faq" class="btn btn-ghost btn-sm mb-4">
          <i class="fas fa-arrow-left mr-2"></i>
          Retour à la liste
        </router-link>
      </div>

      <!-- Question -->
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <div class="flex justify-between items-start mb-4">
            <h1 class="card-title text-3xl">{{ question.title }}</h1>
            <div class="badge" :class="statusBadgeClass">
              {{ statusText }}
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tagId in question.tags || []"
              :key="tagId"
              class="badge badge-outline"
              :style="{ borderColor: getTagColor(tagId), color: getTagColor(tagId) }"
            >
              {{ getTagName(tagId) }}
            </span>
          </div>

          <div class="prose max-w-none mb-4">
            <p class="whitespace-pre-wrap">{{ question.content }}</p>
          </div>

          <div class="card-actions justify-between items-center mt-4 pt-4 border-t">
            <div class="text-sm text-gray-500">
              <i class="fas fa-user mr-1"></i>
              {{ question.author || 'Anonyme' }}
              <span class="ml-4">
                <i class="fas fa-clock mr-1"></i>
                {{ formatDate(question.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Réponses existantes -->
      <div v-if="answers.length > 0" class="mb-6">
        <h2 class="text-2xl font-bold mb-4">
          <i class="fas fa-reply mr-2"></i>
          Réponse{{ answers.length > 1 ? 's' : '' }} ({{ answers.length }})
        </h2>
        <div
          v-for="answer in answers"
          :key="answer.id"
          class="card bg-base-100 shadow-xl mb-4"
        >
          <div class="card-body">
            <div class="prose max-w-none mb-4">
              <p class="whitespace-pre-wrap">{{ answer.content }}</p>
            </div>
            <div class="card-actions justify-between items-center mt-4 pt-4 border-t">
              <div class="text-sm text-gray-500">
                <i class="fas fa-user mr-1"></i>
                {{ answer.author }}
                <span class="ml-4">
                  <i class="fas fa-clock mr-1"></i>
                  {{ formatDate(answer.created_at) }}
                </span>
              </div>
              <div v-if="isAdmin" class="flex gap-2">
                <button
                  class="btn btn-sm btn-ghost"
                  @click="editAnswer(answer)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-ghost text-error"
                  @click="deleteAnswer(answer.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de réponse (visible pour l'admin) -->
      <div v-if="isAdmin">
        <AnswerForm
          v-if="!editingAnswer"
          :question-id="question.id"
          @submit="handleAnswerSubmit"
        />
        <AnswerForm
          v-else
          :question-id="question.id"
          :existing-answer="editingAnswer"
          @submit="handleAnswerSubmit"
          @cancel="cancelEdit"
        />
      </div>

      <div v-else class="alert alert-info">
        <i class="fas fa-info-circle"></i>
        <span>Seul l'administrateur peut répondre aux questions.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFAQStore } from '@/stores/faqStore';
import AnswerForm from './components/AnswerForm.vue';

const route = useRoute();
const router = useRouter();
const faqStore = useFAQStore();

const question = ref(null);
const answers = ref([]);
const loading = ref(true);
const editingAnswer = ref(null);

// Pour l'instant, on considère que l'utilisateur est admin
// Vous pouvez ajouter une vérification d'authentification ici
const isAdmin = computed(() => true);

const statusText = computed(() => {
  if (!question.value) return '';
  switch (question.value.status) {
    case 'answered':
      return 'Répondu';
    case 'pending':
      return 'En attente';
    case 'archived':
      return 'Archivé';
    default:
      return 'En attente';
  }
});

const statusBadgeClass = computed(() => {
  if (!question.value) return '';
  switch (question.value.status) {
    case 'answered':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'archived':
      return 'badge-neutral';
    default:
      return 'badge-warning';
  }
});

const getTagName = (tagId) => {
  const tag = faqStore.getTagById(tagId);
  return tag ? tag.name : 'Inconnu';
};

const getTagColor = (tagId) => {
  const tag = faqStore.getTagById(tagId);
  return tag ? tag.color : '#9B9B9B';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadQuestion = () => {
  loading.value = true;
  const questionId = route.params.id;
  question.value = faqStore.fetchQuestionById(questionId);
  if (question.value) {
    answers.value = faqStore.getAnswersByQuestionId(questionId);
  }
  loading.value = false;
};

const handleAnswerSubmit = (answer) => {
  loadQuestion();
  editingAnswer.value = null;
};

const editAnswer = (answer) => {
  editingAnswer.value = answer;
};

const cancelEdit = () => {
  editingAnswer.value = null;
};

const deleteAnswer = (answerId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
    faqStore.deleteAnswer(answerId);
    loadQuestion();
  }
};

onMounted(() => {
  loadQuestion();
});
</script>

<style scoped>
.prose {
  color: inherit;
}
</style>

