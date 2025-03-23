<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement des monnaies...');

const fetchCurrencies = async () => {
  try {
    const currencies = await user.getCurrencies();
    return currencies;
  } catch (error) {
    console.error('Erreur lors de la récupération des monnaies:', error);
    return null;
  }
};

const { isLoading, data: currenciesData } = useQuery({
  queryKey: ['currencies'],
  queryFn: fetchCurrencies,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
});
const formatCurrency = (value, currencyId) => {
  if (currencyId === 1) { // Si c'est de l'or (Coin)
    const copper = value % 100;
    const silver = Math.floor(value / 100) % 100;
    const gold = Math.floor(value / 10000);
    
    return {
      gold,
      silver,
      copper
    };
  }
  return value.toLocaleString();
};
</script>

<template>
  <div>
    <!-- Indicateur de chargement -->
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Affichage des monnaies -->
    <div v-if="currenciesData" class="currencies-container">
      <h3>Monnaies</h3>
      <div class="currencies-grid">
        <div v-for="currency in currenciesData" 
             :key="currency.id" 
             class="currency-item">
          <img :src="currency.icon" 
               :alt="currency.name" 
               class="currency-icon" />
          <div class="currency-info">
            <span class="currency-name">{{ currency.name }}</span>
            <span class="currency-value" v-if="currency.id === 1">
              <span v-if="formatCurrency(currency.value, currency.id).gold > 0" class="gold">
                {{ formatCurrency(currency.value, currency.id).gold }}
                <img src="https://render.guildwars2.com/file/090A980A96D39FD36FBB004903644C6DBEFB1FFB/156904.png" class="coin-icon" alt="gold" />
              </span>
              <span v-if="formatCurrency(currency.value, currency.id).silver > 0" class="silver">
                {{ formatCurrency(currency.value, currency.id).silver }}
                <img src="https://render.guildwars2.com/file/E5A2197D78ECE4AE0349C8B3710D033D22DB0DA6/156907.png" class="coin-icon" alt="silver" />
              </span>
              <span class="copper">
                {{ formatCurrency(currency.value, currency.id).copper }}
                <img src="https://render.guildwars2.com/file/6CF8F96A3299CFC75D5CC90617C3C70331A1EF0E/156902.png" class="coin-icon" alt="copper" />
              </span>
            </span>
            <span class="currency-value" v-else>{{ formatCurrency(currency.value, currency.id) }}</span>
            <span class="currency-description">{{ currency.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.currencies-container {
  padding: 20px;
}

.currencies-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.currency-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  transition: background-color 0.2s;
  min-height: 120px;
}

.currency-item:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.currency-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.currency-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.currency-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: #ffffff;
}

.currency-description {
  font-size: 0.8rem;
  color: #aaaaaa;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.currency-icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
  color: #ffd700;
}

.coin-icon {
  width: 15px;
  height: 15px;
  vertical-align: middle;
  margin: 0 2px;
}

.gold {
  color: #ffd700;
}

.silver {
  color: #c0c0c0;
}

.copper {
  color: #b87333;
}
</style> 