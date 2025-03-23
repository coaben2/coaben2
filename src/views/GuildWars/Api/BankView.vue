<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement du coffre de banque...');

const fetchBankData = async () => {
  try {
    const bankData = await user.getBank();
    return bankData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la banque:', error);
    return null;
  }
};

const { isLoading, data: bankData } = useQuery({
  queryKey: ['bank'],
  queryFn: fetchBankData,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5,
});
</script>

<template>
  <div>
    <!-- Indicateur de chargement -->
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <!-- Affichage du contenu de la banque -->
    <div v-if="bankData" class="bank-container">
      <h3>Contenu de la banque</h3>
      <div class="items-grid">
        <div v-for="(item, index) in bankData" :key="index" class="item-slot">
          <template v-if="item">
            <img
              :src="user.getIconUrl(item.id)"
              :alt="item.id"
              class="item-icon"
              :class="{ 'grayed-out': item.count === 0 }"
            />
            <span class="item-count" v-if="item.count > 1">{{ item.count }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bank-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: fit-content;
  margin: 0;
}

.item-slot {
  width: 70px;
  height: 70px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-slot.grayed-out {
  filter: grayscale(100%);
  opacity: 0.5;
}

.item-icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background-color: white;
  color: black;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

h3 {
  margin-left: 10px;
}
</style>
