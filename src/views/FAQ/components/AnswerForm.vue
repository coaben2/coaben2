<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h3 class="card-title mb-4">
        <i class="fas fa-reply mr-2"></i>
        Répondre à la question
      </h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Votre réponse *</span>
          </label>
          <textarea
            v-model="formData.content"
            class="textarea textarea-bordered h-40"
            placeholder="Écrivez votre réponse ici..."
            required
          ></textarea>
        </div>

        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text font-semibold">Auteur</span>
          </label>
          <input
            v-model="formData.author"
            type="text"
            placeholder="Votre nom (par défaut: Admin)"
            class="input input-bordered w-full"
          />
        </div>

        <div class="card-actions justify-end mt-4">
          <button
            v-if="existingAnswer"
            type="button"
            class="btn btn-ghost"
            @click="$emit('cancel')"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading || !formData.content.trim()"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <span v-else>
              <i class="fas fa-check mr-2"></i>
              {{ existingAnswer ? 'Modifier la réponse' : 'Publier la réponse' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useFAQStore } from '@/stores/faqStore';

const props = defineProps({
  questionId: {
    type: [Number, String],
    required: true
  },
  existingAnswer: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit', 'cancel']);

const faqStore = useFAQStore();
const loading = ref(false);

const formData = ref({
  content: '',
  author: 'Admin'
});

// Si on modifie une réponse existante, pré-remplir le formulaire
watch(() => props.existingAnswer, (answer) => {
  if (answer) {
    formData.value.content = answer.content;
    formData.value.author = answer.author || 'Admin';
  } else {
    formData.value.content = '';
    formData.value.author = 'Admin';
  }
}, { immediate: true });

const handleSubmit = async () => {
  if (!formData.value.content.trim()) {
    return;
  }

  loading.value = true;
  try {
    if (props.existingAnswer) {
      // Modifier une réponse existante
      const updatedAnswer = faqStore.updateAnswer(props.existingAnswer.id, {
        content: formData.value.content.trim(),
        author: formData.value.author.trim() || 'Admin'
      });
      emit('submit', updatedAnswer);
    } else {
      // Créer une nouvelle réponse
      const newAnswer = faqStore.addAnswer(props.questionId, {
        content: formData.value.content.trim(),
        author: formData.value.author.trim() || 'Admin'
      });
      emit('submit', newAnswer);
    }

    // Réinitialiser le formulaire
    formData.value = {
      content: '',
      author: 'Admin'
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la réponse:', error);
  } finally {
    loading.value = false;
  }
};
</script>

