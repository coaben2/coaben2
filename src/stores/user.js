import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const count = ref(0);
  const apiKey = ref(null);

  function increment() {
    count.value++;
  }

  return { count, increment };
});
