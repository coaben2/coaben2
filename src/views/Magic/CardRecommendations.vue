<template>
  <div class="recommendations-panel">
    <div class="recommendations-header">
      <h3>Recommandations</h3>
      <button @click="refreshRecommendations" class="btn-secondary" :disabled="loading">
        {{ loading ? 'Chargement...' : 'Actualiser' }}
      </button>
    </div>

    <div v-if="recommendations.length > 0" class="recommendations-grid">
      <div 
        v-for="card in recommendations" 
        :key="card.id"
        class="recommendation-card"
        @click="addToDeck(card)"
        @mouseenter="onCardHover(card)"
        @mouseleave="onCardLeave"
      >
        <img :src="card.image_uris?.small" :alt="card.name" />
        <div class="card-info">
          <span class="card-name">{{ card.name }}</span>
          <span class="card-cost" v-html="renderManaCost(card.mana_cost)"></span>
        </div>
        <div class="card-type">{{ getCardType(card) }}</div>
      </div>
    </div>

    <div v-else-if="!loading" class="no-recommendations">
      <p>Ajoutez des cartes à votre deck pour voir des recommandations</p>
    </div>

    <div v-if="loading" class="loading">
      <p>Génération des recommandations...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { getCardRecommendations } from './magicApi';

const props = defineProps({
  deckCards: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['add-card', 'card-hover', 'card-leave']);

const recommendations = ref([]);
const loading = ref(false);

const manaSymbolMap = {
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
  C: 'https://svgs.scryfall.io/card-symbols/C.svg',
};

const renderManaCost = (manaCost) => {
  if (!manaCost) return '';
  return manaCost.replace(/\{(.*?)\}/g, (match, symbol) => {
    const url = manaSymbolMap[symbol];
    return url ? `<img src="${url}" alt="${symbol}" class="mana-icon" />` : match;
  });
};

const getCardType = (card) => {
  const typeLine = card.type_line || '';
  return typeLine.split('—')[0]?.trim() || 'Autre';
};

const refreshRecommendations = async () => {
  if (props.deckCards.length === 0) return;
  
  loading.value = true;
  try {
    recommendations.value = await getCardRecommendations(props.deckCards);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
  } finally {
    loading.value = false;
  }
};

const addToDeck = (card) => {
  emit('add-card', card);
};

const onCardHover = (card) => {
  emit('card-hover', card);
};

const onCardLeave = () => {
  emit('card-leave');
};

// Surveiller les changements dans le deck pour actualiser les recommandations
watch(() => props.deckCards.length, () => {
  if (props.deckCards.length > 0) {
    refreshRecommendations();
  } else {
    recommendations.value = [];
  }
}, { immediate: true });
</script>

<style scoped>
.recommendations-panel {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  height: 100%;
  overflow-y: auto;
}

.recommendations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.recommendations-header h3 {
  margin: 0;
  color: #333;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
}

.recommendation-card {
  background: white;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e0e0e0;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recommendation-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.card-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 0.5rem;
}

.card-cost {
  display: flex;
  align-items: center;
}

.card-type {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
}

.no-recommendations,
.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.btn-secondary {
  padding: 0.25rem 0.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.mana-icon) {
  width: 12px;
  height: 12px;
  vertical-align: middle;
  margin: 0 1px;
}
</style> 