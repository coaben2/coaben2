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
            placeholder="Ex: Comment utiliser cette fonctionnalite ?"
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
            placeholder="Decrivez votre question en detail..."
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
            <span class="label-text font-semibold">Tags <span class="text-error">*</span></span>
            <span v-if="tagError" class="label-text-alt text-error">Veuillez selectionner au moins un tag</span>
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
          <button type="button" class="btn btn-ghost" @click="$emit('cancel')">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <span v-else>Poser la question</span>
          </button>
        </div>

        <div v-if="mailSyncInfo" class="alert alert-info mt-4">
          <span>{{ mailSyncInfo }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useFAQStore } from '@/stores/faqStore';
import { syncPendingFaqQuestions } from '@/lib/faqMailSync';

const emit = defineEmits(['submit', 'cancel']);

const faqStore = useFAQStore();
const loading = ref(false);
const mailSyncInfo = ref('');

const formData = ref({
  title: '',
  content: '',
  author: '',
  tags: []
});

const availableTags = computed(() => faqStore.tags);
const tagError = ref(false);

const isTagSelected = (tagId) => {
  return formData.value.tags.includes(tagId);
};

const toggleTag = (tagId) => {
  const index = formData.value.tags.indexOf(tagId);
  if (index > -1) {
    formData.value.tags.splice(index, 1);
  } else {
    formData.value.tags.push(tagId);
    tagError.value = false;
  }
};

const handleSubmit = async () => {
  if (!formData.value.title.trim() || !formData.value.content.trim()) {
    return;
  }

  if (formData.value.tags.length === 0) {
    tagError.value = true;
    return;
  }

  loading.value = true;
  try {
    const question = await faqStore.createQuestion({
      title: formData.value.title.trim(),
      content: formData.value.content.trim(),
      author: formData.value.author.trim() || undefined,
      tags: formData.value.tags
    });

    formData.value = {
      title: '',
      content: '',
      author: '',
      tags: []
    };

    emit('submit', question);

    const syncResult = await syncPendingFaqQuestions();
    if (syncResult.sent > 0 && syncResult.failed === 0) {
      mailSyncInfo.value = `${syncResult.sent} question(s) envoyee(s) par email.`;
    } else if (syncResult.failed > 0) {
      mailSyncInfo.value = 'Question enregistree localement. Envoi email en attente.';
    }
  } catch (error) {
    console.error('Erreur lors de la creation de la question:', error);
    mailSyncInfo.value = 'Question enregistree localement. Envoi email en attente.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const syncResult = await syncPendingFaqQuestions();
  if (syncResult.sent > 0) {
    mailSyncInfo.value = `${syncResult.sent} ancienne(s) question(s) locale(s) envoyee(s).`;
  }
});
</script>
