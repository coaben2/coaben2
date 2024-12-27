<template>
  <div>
    <!-- Barre de progression API -->
    <div class="api-progress-container" v-if="user.currentApiCall">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(user.apiProgress / 8) * 100}%` }"></div>
      </div>
      <p class="progress-text">{{ user.currentApiCall }}</p>
    </div>

    <!-- Indicateur de chargement -->
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Liste des monnaies -->
    <div v-if="walletData" class="wallet-container">
      <h3>Liste des monnaies du jeu</h3>
      <div class="currencies-list">
        <div v-for="(currency, index) in walletData" :key="index" class="currency-item">
          <div class="currency-info">
            <span class="currency-name">{{ currency.name }}</span>
            <span class="currency-amount">{{ currency.amount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement des monnaies...');

const fetchWalletData = async () => {
  try {
    const walletData = await user.getMoney(user.apiKey);
    return walletData;
  } catch (error) {
    console.error('Erreur lors de la récupération des monnaies:', error);
    return null;
  }
};

const { isLoading, data: walletData } = useQuery({
  queryKey: ['wallet'],
  queryFn: fetchWalletData,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
});
</script>

<style scoped>
.wallet-container {
  padding: 20px;
  max-width: 600px;
}

.currencies-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.currency-item {
  display: flex;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.currency-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.currency-name {
  font-weight: bold;
  color: #2c3e50;
}

.currency-amount {
  color: #666;
  font-family: monospace;
  font-size: 1.1em;
}
</style>
