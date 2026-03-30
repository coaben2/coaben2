<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="mb-6">
      <router-link to="/faq" class="btn btn-ghost btn-sm mb-4">
        <i class="fas fa-arrow-left mr-2"></i>
        Retour à la liste
      </router-link>
      <h1 class="text-4xl font-bold">
        <i class="fas fa-question-circle mr-3"></i>
        Poser une question
      </h1>
    </div>

    <QuestionForm @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import QuestionForm from './components/QuestionForm.vue';

const router = useRouter();

const handleSubmit = (question) => {
  router.push({
    path: '/faq',
    query: { success: 'true' }
  });
};

const handleCancel = () => {
  router.push('/faq');
};
</script>

