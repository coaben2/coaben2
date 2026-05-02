import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '../../utiles/supabase.ts';

let authSubscription;

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null);
  const loading = ref(false);
  const initialized = ref(false);

  const user = computed(() => session.value?.user ?? null);
  const isAuthenticated = computed(() => Boolean(user.value));

  const initAuth = async () => {
    if (!initialized.value) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }

      session.value = data.session;
      initialized.value = true;
    }

    if (!authSubscription) {
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        session.value = nextSession;
      });
      authSubscription = data.subscription;
    }

    return session.value;
  };

  const signIn = async (email, password) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }

      session.value = data.session;
      return data.user;
    } finally {
      loading.value = false;
    }
  };

  const signInWithGitHub = async (redirectTo) => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectTo ?? window.location.origin + '/login'
        }
      });
      if (error) {
        throw error;
      }
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      session.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    session,
    user,
    loading,
    isAuthenticated,
    initAuth,
    signIn,
    signInWithGitHub,
    signOut
  };
});