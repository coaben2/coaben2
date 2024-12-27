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

    <!-- Affichage des monnaies -->
    <div v-if="walletData" class="wallet-container">
      <h3>Liste des monnaies du jeu</h3>
      <div class="currencies-grid">
        <div v-for="(currency, index) in walletData" :key="index" class="currency-item">
          <img
            v-if="currency.icon"
            :src="currency.icon"
            :alt="currency.name"
            class="currency-icon"
          />
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
}

.currencies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.currency-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  gap: 10px;
}

.currency-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.currency-info {
  display: flex;
  flex-direction: column;
}

.currency-name {
  font-weight: bold;
  color: #2c3e50;
}

.currency-amount {
  color: #666;
}

.api-progress-container {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
