<template>
  <div>
    <!-- Indicateur de chargement -->
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Liste des monnaies -->
    <div v-if="walletData" class="wallet-container">
      <h3>Liste des monnaies du jeu</h3>
      <table class="currencies-table">
        <thead>
          <tr>
            <th>Nom de la monnaie</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(currency, index) in walletData"
            :key="index"
            :class="{ highlighted: currency.id === 1 }"
          >
            <template v-if="currency.id === 1">
              <td>
                {{ currency.name }}
              </td>
              <td class="amount">{{ formatCurrencyValue(currency.value) }}</td>
            </template>

            <template v-else>
              <td>{{ currency.name }}</td>
              <td class="amount">{{ currency.value }}</td>
            </template>
          </tr>
        </tbody>
      </table>
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
const currencyNames = ref({});

const formatCurrencyValue = (value) => {
  const gold = Math.floor(value / 10000);
  const silver = Math.floor((value % 10000) / 100);
  const copper = value % 100;
  return `${gold}Po ${silver}silver ${copper}copper`;
};
// Récupérer les noms des monnaies
const fetchCurrencyNames = async () => {
  const currencies = await user.getCurrencyNames();
  const namesMap = {};
  currencies.forEach((currency) => {
    namesMap[currency.id] = currency.name;
  });
  currencyNames.value = namesMap;
};

const fetchWalletData = async () => {
  try {
    await fetchCurrencyNames();
    const walletData = await user.getMoney(user.apiKey);
    // Ajouter les noms aux données du wallet
    return walletData.map((currency) => ({
      ...currency,
      name: currencyNames.value[currency.id] || `Monnaie ${currency.id}`,
    }));
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
  staleTime: 1000 * 60 * 5,
});
</script>

<style scoped>
.wallet-container {
  padding: 20px;
}

.currencies-table {
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.currencies-table th,
.currencies-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.currencies-table th {
  font-weight: bold;
  color: #000000;
}
.currencies-table td.amount {
  text-align: right;
  font-family: monospace;
  font-size: 1.1em;
  color: #000000;
}
</style>
