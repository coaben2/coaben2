<template>
  <div class="card bg-base-100 shadow-xl mb-4 hover:shadow-2xl transition-shadow">
    <div class="card-body">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h2 class="card-title text-xl">
            <router-link :to="`/faq/${question.id}`" class="hover:text-primary">
              {{ question.title }}
            </router-link>
          </h2>
          <p class="text-sm text-gray-400 mt-2 line-clamp-2">
            {{ question.content }}
          </p>
        </div>
        <div class="ml-4">
          <div class="badge" :class="statusBadgeClass">
            {{ statusText }}
          </div>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-2 mt-4">
        <span
          v-for="tagId in question.tags || []"
          :key="tagId"
          class="badge badge-outline"
          :style="{ borderColor: getTagColor(tagId), color: getTagColor(tagId) }"
        >
          {{ getTagName(tagId) }}
        </span>
      </div>
      
      <div class="card-actions justify-between items-center mt-4">
        <div class="text-sm text-gray-500">
          <i class="fas fa-user mr-1"></i>
          {{ question.author || 'Anonyme' }}
          <span class="ml-4">
            <i class="fas fa-clock mr-1"></i>
            {{ formatDate(question.created_at) }}
          </span>
        </div>
        <router-link :to="`/faq/${question.id}`" class="btn btn-sm btn-primary">
          Voir la question
          <i class="fas fa-arrow-right ml-2"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFAQStore } from '@/stores/faqStore';

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});

const faqStore = useFAQStore();

const statusText = computed(() => {
  switch (props.question.status) {
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
  switch (props.question.status) {
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
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (days === 1) {
    return 'Hier';
  } else if (days < 7) {
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

