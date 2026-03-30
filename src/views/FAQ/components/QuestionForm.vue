<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title mb-4">Poser une question</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Titre de la question *</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="Ex: Comment utiliser cette fonctionnalité ?"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Contenu de la question *</span>
          </label>
          <textarea
            v-model="formData.content"
            class="textarea textarea-bordered h-32"
            placeholder="Décrivez votre question en détail..."
            required
          ></textarea>
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Auteur (optionnel)</span>
          </label>
          <input
            v-model="formData.author"
            type="text"
            placeholder="Votre nom ou pseudonyme"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Tags</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in availableTags"
              :key="tag.id"
              class="badge cursor-pointer transition-all"
              :class="isTagSelected(tag.id) ? 'badge-primary' : 'badge-outline'"
              :style="isTagSelected(tag.id) ? {} : { borderColor: tag.color, color: tag.color }"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <button
            type="button"
            class="btn btn-ghost"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <span v-else>Poser la question</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFAQStore } from '@/stores/faqStore';

const emit = defineEmits(['submit', 'cancel']);

const faqStore = useFAQStore();
const loading = ref(false);

const formData = ref({
  title: '',
  content: '',
  author: '',
  tags: []
});

const availableTags = computed(() => faqStore.tags);

const isTagSelected = (tagId) => {
  return formData.value.tags.includes(tagId);
};

const toggleTag = (tagId) => {
  const index = formData.value.tags.indexOf(tagId);
  if (index > -1) {
    formData.value.tags.splice(index, 1);
  } else {
    formData.value.tags.push(tagId);
  }
};

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    return;
  }

  loading.value = true;
  try {
    const question = faqStore.createQuestion({
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      author: formData.value.author.trim() || undefined,
      tags: formData.value.tags
    });

    // Réinitialiser le formulaire
    formData.value = {
      title: '',
      content: '',
      author: '',
      tags: []
    };

    emit('submit', question);
  } catch (error) {
    console.error('Erreur lors de la création de la question:', error);
  } finally {
    loading.value = false;
  }
};
</script>

