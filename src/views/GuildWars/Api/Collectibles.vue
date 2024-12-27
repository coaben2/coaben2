<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement des objets de collection...');

const fetchCollectibles = async () => {
  try {
    const collectiblesData = await user.getCollectibles();
    return collectiblesData;
  } catch (error) {
    console.error('Erreur lors de la récupération des collectibles:', error);
    return null;
  }
};

const { isLoading, data: collectibles } = useQuery({
  queryKey: ['collectibles'],
  queryFn: fetchCollectibles,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
});
</script>

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

    <!-- Grille des collectibles -->
    <div v-if="collectibles" class="collectibles-container">
      <h3>Objets de collection</h3>
      <div class="items-grid">
        <div v-for="(item, index) in collectibles" :key="index" class="item-slot">
          <template v-if="item">
            <img
              :src="user.getIconUrl(item.id)"
              :alt="item.name"
              class="item-icon"
              @mouseover="showItemDetails"
              @mouseout="hideItemDetails"
            />
            <span class="item-count" v-if="item.count > 1">{{ item.count }}</span>
            <div v-if="item.showDetails" class="item-details">
              <p>{{ item.name }}</p>
              <p>ID: {{ item.id }}</p>
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
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10 items par ligne */
  gap: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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

.item-icon {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-count {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12px;
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
