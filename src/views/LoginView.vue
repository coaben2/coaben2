<template>
  <section class="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <h1 class="card-title text-3xl">Connexion administrateur</h1>

        <p v-if="isAuthenticated" class="text-sm text-success">
          Session active sur {{ userEmail }}
        </p>

        <p v-else class="text-sm text-base-content/70">
          Connectez-vous avec le compte Supabase autorise a gerer les reponses FAQ.
        </p>

        <div v-if="!isAuthenticated" class="flex flex-col gap-4">
          <p v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</p>

          <button class="btn btn-neutral gap-2" :disabled="authStore.loading" @click="handleGitHub">
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Se connecter avec GitHub
          </button>
        </div>

        <div v-else class="flex flex-col gap-4">
          <router-link class="btn btn-primary" to="/faq">
            Aller a la FAQ
          </router-link>
          <button class="btn btn-ghost" :disabled="authStore.loading" @click="handleLogout">
            Se deconnecter
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const errorMessage = ref('');

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userEmail = computed(() => authStore.user?.email ?? '');

const handleGitHub = async () => {
  errorMessage.value = '';
  try {
    await authStore.signInWithGitHub();
  } catch (error) {
    errorMessage.value = error.message || 'Connexion impossible.';
  }
};

const handleLogout = async () => {
  errorMessage.value = '';

  try {
    await authStore.signOut();
  } catch (error) {
    errorMessage.value = error.message || 'Deconnexion impossible.';
  }
};
</script>