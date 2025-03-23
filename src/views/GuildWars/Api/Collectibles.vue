<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement des matériaux...');

const fetchCollectibles = async () => {
  try {
    const materialsData = await user.getMaterials();
    const collectiblesData = materialsData.filter((item) => item.count > 0);
    console.log('Matériaux récupérés:', collectiblesData);
    return collectiblesData;
  } catch (error) {
    console.error('Erreur lors de la récupération des matériaux:', error);
    return null;
  }
};

const { isLoading, data: collectibles } = useQuery({
  queryKey: ['materials'],
  queryFn: fetchCollectibles,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5,
});

const showItemDetails = (item) => {
  item.showDetails = true;
};

const hideItemDetails = (item) => {
  item.showDetails = false;
};
</script>

<template>
  <div>
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>
    <div v-if="collectibles" class="collectibles-container">
      <h3>Liste des matériaux</h3>
      <div class="items-grid">
        <div
          v-for="(item, index) in collectibles"
          :key="index"
          class="item-slot"
          :class="{ 'grayed-out': item.count === 0 }"
        >
          <template v-if="item">
            <img
              :src="user.getIconUrl(item.id)"
              :alt="item.name"
              class="item-icon"
              @mouseover="showItemDetails(item)"
              @mouseout="hideItemDetails(item)"
            />
            <span class="item-count">{{ item.count }}</span>
            <div v-if="item.showDetails" class="item-details">
              <p>{{ item.name }}</p>
              <p>ID: {{ item.id }}</p>
              <p>Quantité: {{ item.count }}</p>
              <p>Catégorie: {{ item.category }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collectibles-container {
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

.item-details {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}

h3 {
  margin-left: 10px;
}
</style>
