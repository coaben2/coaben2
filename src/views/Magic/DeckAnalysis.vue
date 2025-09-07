<template>
  <div class="deck-analysis-panel">
    <div class="top-analysis-row">
      <div class="analysis-header F15">
        <h3>Analyse du Deck</h3>
        <div class="deck-status" :class="validationStatus">
          <span v-if="validation.isValid" class="status-valid">✓ Valide</span>
          <span v-else class="status-invalid">✗ Problèmes détectés</span>
        </div>
      </div>

      <div class="validation-section F25">
        <h4>Validation</h4>
        <div v-if="validation.errors.length > 0" class="validation-errors">
          <div v-for="error in validation.errors" :key="error" class="error-item">
            <span class="error-icon">✗</span>
            <span>{{ error }}</span>
          </div>
        </div>
        <div v-if="validation.warnings.length > 0" class="validation-warnings">
          <div v-for="warning in validation.warnings" :key="warning" class="warning-item">
            <span class="warning-icon">⚠</span>
            <span>{{ warning }}</span>
          </div>
        </div>
        <div v-if="validation.errors.length === 0 && validation.warnings.length === 0" class="validation-success">
          <span class="success-icon">✓</span>
          <span>Deck valide !</span>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h4>Statistiques Générales</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Total de cartes:</span>
          <span class="stat-value">{{ deckStats.totalCards }}/60</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">CMC moyen:</span>
          <span class="stat-value">{{ deckStats.averageCMC }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Terrains:</span>
          <span class="stat-value">{{ deckStats.lands }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Créatures:</span>
          <span class="stat-value">{{ deckStats.creatures }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Sorts:</span>
          <span class="stat-value">{{ deckStats.spells }}</span>
        </div>
      </div>
    </div>

    <div class="colors-section">
      <h4>Répartition par Couleur</h4>
      <div class="color-distribution">
        <div v-for="(count, color) in deckStats.colorDistribution" :key="color" class="color-item" v-show="count > 0">
          <img :src="getManaSymbol(color)" :alt="color" class="color-symbol" />
          <span class="color-name">{{ getColorName(color) }}</span>
          <span class="color-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="types-section">
      <h4>Répartition par Type</h4>
      <div class="type-distribution">
        <div v-for="(count, type) in deckStats.typeDistribution" :key="type" class="type-item">
          <span class="type-name">{{ getTypeLabel(type) }}</span>
          <span class="type-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="rarity-section">
      <h4>Répartition par Rareté</h4>
      <div class="rarity-distribution">
        <div v-for="(count, rarity) in deckStats.rarityDistribution" :key="rarity" class="rarity-item" :class="`rarity-${rarity}`">
          <span class="rarity-name">{{ getRarityLabel(rarity) }}</span>
          <span class="rarity-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="curve-section full-width">
      <h4>Courbe de Mana</h4>
      <div class="mana-curve-chart">
        <div v-for="(count, cmc) in deckStats.manaCurve" :key="cmc" class="curve-bar-container">
          <div class="curve-bar" :style="{ height: `${getCurveBarHeight(count)}px` }">
            <span class="curve-count">{{ count }}</span>
          </div>
          <span class="curve-cmc">{{ cmc }}</span>
        </div>
      </div>
    </div>

    <div class="suggestions-section full-width">
      <h4>Suggestions d'Amélioration</h4>
      <div class="suggestions-list">
        <div v-if="deckStats.totalCards < 60" class="suggestion-item">
          <span class="suggestion-icon">💡</span>
          <span>Ajoutez {{ 60 - deckStats.totalCards }} cartes pour atteindre 60 cartes</span>
        </div>
        <div v-if="deckStats.lands < 20" class="suggestion-item">
          <span class="suggestion-icon">💡</span>
          <span>Considérez ajouter plus de terrains (recommandé: 20-24)</span>
        </div>
        <div v-if="parseFloat(deckStats.averageCMC) > 3.5" class="suggestion-item">
          <span class="suggestion-icon">💡</span>
          <span>Le CMC moyen est élevé, considérez des cartes moins coûteuses</span>
        </div>
        <div v-if="Object.keys(deckStats.manaCurve).length < 5" class="suggestion-item">
          <span class="suggestion-icon">💡</span>
          <span>La courbe de mana pourrait être plus équilibrée</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { analyzeDeck, validateDeck } from './magicApi';

const props = defineProps({
  deckCards: {
    type: Array,
    default: () => []
  }
});

const deckStats = computed(() => analyzeDeck(props.deckCards));
const validation = computed(() => validateDeck(props.deckCards));

const validationStatus = computed(() => {
  return validation.value.isValid ? 'valid' : 'invalid';
});

const manaSymbolMap = {
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
  C: 'https://svgs.scryfall.io/card-symbols/C.svg',
};

const getManaSymbol = (color) => manaSymbolMap[color] || '';

const getColorName = (color) => ({
  W: 'Blanc',
  U: 'Bleu',
  B: 'Noir',
  R: 'Rouge',
  G: 'Vert',
  C: 'Incolore'
}[color] || color);

const getTypeLabel = (type) => ({
  Creature: 'Créatures',
  Instant: 'Éphémères',
  Sorcery: 'Rituels',
  Enchantment: 'Enchantements',
  Artifact: 'Artefacts',
  Planeswalker: 'Planeswalkers',
  Land: 'Terrains'
}[type] || type);

const getRarityLabel = (rarity) => ({
  common: 'Commune',
  uncommon: 'Peu commune',
  rare: 'Rare',
  mythic: 'Mythique'
}[rarity] || rarity);

const getCurveBarHeight = (count) => {
  const maxCount = Math.max(...Object.values(deckStats.value.manaCurve));
  return maxCount > 0 ? (count / maxCount) * 60 : 0;
};
</script>

<style scoped>
.deck-analysis-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.top-analysis-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  grid-column: 1 / -1; /* Span full width */
}

.analysis-header {
  flex: 1;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.analysis-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.deck-status {
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
}

.deck-status.valid {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.deck-status.invalid {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.validation-section {
  flex: 1;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.validation-section h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.validation-errors,
.validation-warnings,
.validation-success {
  margin-top: 0.5rem;
}

.error-item,
.warning-item,
.success-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.error-item {
  color: #f44336;
}

.warning-item {
  color: #ff9800;
}

.success-item {
  color: #4caf50;
}

.error-icon,
.warning-icon,
.success-icon {
  font-weight: bold;
}

.stats-section,
.colors-section,
.types-section,
.rarity-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-section h4,
.colors-section h4,
.types-section h4,
.rarity-section h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid #eee;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.color-distribution,
.type-distribution,
.rarity-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-item,
.type-item,
.rarity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.color-symbol {
  width: 10px; /* Réduit à 10px comme demandé */
  height: 10px; /* Réduit à 10px comme demandé */
}

.color-name,
.type-name,
.rarity-name {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.color-count,
.type-count,
.rarity-count {
  font-weight: bold;
  color: #007bff;
}

.rarity-common {
  color: #666;
}

.rarity-uncommon {
  color: #4caf50;
}

.rarity-rare {
  color: #2196f3;
}

.rarity-mythic {
  color: #ff9800;
}

.curve-section,
.suggestions-section {
  grid-column: 1 / -1;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.curve-section h4,
.suggestions-section h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

.mana-curve-chart {
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 80px;
  padding: 1rem 0;
}

.curve-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.curve-bar {
  background: #007bff;
  min-width: 30px;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  position: relative;
}

.curve-cmc {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.suggestion-icon {
  font-size: 1.2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .top-analysis-row {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .mana-curve-chart {
    gap: 0.25rem;
  }
  
  .curve-bar {
    min-width: 20px;
  }
}
</style>
