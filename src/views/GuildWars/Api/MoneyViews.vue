<template>
  <div>
    <h3>Liste des monnaies du jeu</h3>
    <ul>
      <li v-for="(currency, index) in walletData" :key="index">
        {{ currency.name }}: {{ currency.amount }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

export default {
  name: 'MoneyViews',
  setup() {
    const walletData = ref(null);
    const loading = ref(true);
    const userStore = useUserStore();

    onMounted(async () => {
      walletData.value = await userStore.getWallet();
      loading.value = false;
    });

    return {
      walletData,
      loading,
    };
  },
};
</script>
