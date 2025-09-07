<template>
  <div class="deck-builder-container">
    <!-- Header avec navigation -->
    <div class="deck-builder-header">
      <h1>Constructeur de Deck MTG</h1>
      <div class="header-actions">
        <button @click="saveDeck" class="btn-primary">Sauvegarder Deck</button>
        <button @click="exportDeck" class="btn-secondary">Exporter</button>
        <button @click="importDeck" class="btn-secondary">Importer</button>
        <button @click="testStartingHand" class="btn-secondary">Test Main Initiale</button>
      </div>
    </div>

    <!-- Layout principal -->
    <div class="deck-builder-layout">
      <!-- Panneau de recherche et cartes -->
      <div class="search-panel">
        <div class="search-controls">
          <div class="search-input-group">
            <input 
              v-model="searchQuery" 
              @input="searchCards"
              placeholder="Rechercher des cartes..."
              class="search-input"
            />
            <button @click="clearSearch" class="clear-btn">×</button>
          </div>
          
          <div class="filter-controls">
            <select v-model="selectedSet" @change="searchCards" class="filter-select">
              <option value="">Toutes les extensions</option>
              <option v-for="set in sets" :key="set.code" :value="set.code">
                {{ set.name }}
              </option>
            </select>
            
            <select v-model="selectedType" @change="searchCards" class="filter-select">
              <option value="">Tous les types</option>
              <option value="creature">Créature</option>
              <option value="instant">Éphémère</option>
              <option value="sorcery">Rituel</option>
              <option value="enchantment">Enchantement</option>
              <option value="artifact">Artefact</option>
              <option value="planeswalker">Planeswalker</option>
              <option value="land">Terrain</option>
            </select>
            
            <select v-model="selectedColor" @change="searchCards" class="filter-select">
              <option value="">Toutes les couleurs</option>
              <option value="W">Blanc</option>
              <option value="U">Bleu</option>
              <option value="B">Noir</option>
              <option value="R">Rouge</option>
              <option value="G">Vert</option>
            </select>
          </div>
        </div>

        <!-- Grille de cartes -->
        <div class="cards-grid">
          <div 
            v-for="card in searchResults" 
            :key="card.id" 
            class="card-item"
            @click="addToDeck(card)"
            @mouseenter="hoverCard = card"
            @mouseleave="hoverCard = null"
          >
            <img :src="card.image_uris?.small" :alt="card.name" />
            <div class="card-overlay">
              <span class="card-name">{{ card.name }}</span>
              <span class="card-cost" v-html="renderManaCost(card.mana_cost)"></span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button @click="previousPage" :disabled="currentPage <= 1">Précédent</button>
          <span>Page {{ currentPage }}</span>
          <button @click="nextPage">Suivant</button>
        </div>
      </div>

      <!-- Panneau du deck -->
      <div class="deck-panel">
        <div class="deck-header">
          <h3>Mon Deck ({{ deckCards.length }}/60)</h3>
          <div class="deck-actions">
            <button @click="clearDeck" class="btn-danger">Vider</button>
            <button @click="shuffleDeck" class="btn-secondary">Mélanger</button>
          </div>
        </div>

        <!-- Statistiques du deck -->
        <div class="deck-stats">
          <div class="stat-item">
            <span class="stat-label">Mana Curve:</span>
            <div class="mana-curve">
              <div 
                v-for="(count, cmc) in manaCurve" 
                :key="cmc"
                class="curve-bar"
                :style="{ height: `${(count / Math.max(...Object.values(manaCurve))) * 40}px` }"
              >
                <span class="curve-count">{{ count }}</span>
                <span class="curve-cmc">{{ cmc }}</span>
              </div>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">Répartition par type:</span>
            <div class="type-distribution">
              <div v-for="(count, type) in typeDistribution" :key="type" class="type-item">
                <span class="type-name">{{ type }}</span>
                <span class="type-count">{{ count }}</span>
              </div>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="stat-label">Répartition par couleur:</span>
            <div class="color-distribution">
              <div v-for="(count, color) in colorDistribution" :key="color" class="color-item">
                <img :src="getManaSymbol(color)" :alt="color" class="color-symbol" />
                <span class="color-count">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Liste des cartes du deck -->
        <div class="deck-cards">
          <div class="deck-section" v-for="(cards, type) in deckByType" :key="type">
            <h4>{{ getTypeLabel(type) }} ({{ cards.length }})</h4>
            <div class="deck-cards-grid">
              <div 
                v-for="(card, index) in cards" 
                :key="`${card.id}-${index}`"
                class="deck-card-item"
                @click="removeFromDeck(card, index)"
              >
                <img :src="card.image_uris?.small" :alt="card.name" />
                <div class="card-quantity">{{ getCardQuantity(card) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau de zoom de carte -->
      <div v-if="hoverCard" class="card-zoom-panel">
        <div class="card-zoom-header">
          <h4>{{ hoverCard.name }}</h4>
          <span class="mana-cost" v-html="renderManaCost(hoverCard.mana_cost)"></span>
        </div>
        <div class="card-zoom-image">
          <img :src="hoverCard.image_uris?.normal" :alt="hoverCard.name" />
        </div>
        <div class="card-zoom-text">
          <div v-html="renderManaInText(hoverCard.oracle_text)"></div>
        </div>
        <div class="card-zoom-actions">
          <button @click="addToDeck(hoverCard)" class="btn-primary">Ajouter au deck</button>
          <div class="price-info" v-if="hoverCard.prices">
            <span>Prix: {{ getLowestPrice(hoverCard.prices) }}€</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de test de main initiale -->
    <div v-if="showStartingHandModal" class="modal-overlay" @click="closeStartingHandModal">
      <div class="modal-content" @click.stop>
        <h3>Test de Main Initiale</h3>
        <div class="starting-hand">
          <div v-for="(card, index) in startingHand" :key="index" class="hand-card">
            <img :src="card.image_uris?.small" :alt="card.name" />
            <span class="card-name">{{ card.name }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="mulligan" class="btn-secondary">Mulligan</button>
          <button @click="closeStartingHandModal" class="btn-primary">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchMagicCardsFR, fetchAllSets } from './magicApi';

// État réactif
const searchQuery = ref('');
const selectedSet = ref('');
const selectedType = ref('');
const selectedColor = ref('');
const searchResults = ref([]);
const deckCards = ref([]);
const hoverCard = ref(null);
const sets = ref([]);
const currentPage = ref(1);
const showStartingHandModal = ref(false);
const startingHand = ref([]);

// Symboles de mana
const manaSymbolMap = {
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
  C: 'https://svgs.scryfall.io/card-symbols/C.svg',
  // ... autres symboles
};

// Computed properties
const manaCurve = computed(() => {
  const curve = {};
  deckCards.value.forEach(card => {
    const cmc = card.cmc || 0;
    curve[cmc] = (curve[cmc] || 0) + 1;
  });
  return curve;
});

const typeDistribution = computed(() => {
  const distribution = {};
  deckCards.value.forEach(card => {
    const type = card.type_line?.split('—')[0]?.trim() || 'Autre';
    distribution[type] = (distribution[type] || 0) + 1;
  });
  return distribution;
});

const colorDistribution = computed(() => {
  const distribution = { W: 0, U: 0, B: 0, R: 0, G: 0 };
  deckCards.value.forEach(card => {
    if (card.colors) {
      card.colors.forEach(color => {
        distribution[color]++;
      });
    }
  });
  return distribution;
});

const deckByType = computed(() => {
  const grouped = {};
  deckCards.value.forEach(card => {
    const type = card.type_line?.split('—')[0]?.trim() || 'Autre';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(card);
  });
  return grouped;
});

// Méthodes
const searchCards = async () => {
  try {
    let query = `lang:fr game:arena`;
    if (searchQuery.value) query += ` name:"${searchQuery.value}"`;
    if (selectedSet.value) query += ` e:${selectedSet.value}`;
    if (selectedType.value) query += ` t:${selectedType.value}`;
    if (selectedColor.value) query += ` c:${selectedColor.value}`;
    
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&page=${currentPage.value}`);
    const data = await response.json();
    searchResults.value = data.data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
  }
};

const addToDeck = (card) => {
  if (deckCards.value.length >= 60) {
    alert('Le deck est complet (60 cartes maximum)');
    return;
  }
  deckCards.value.push(card);
  saveDeckToStorage();
};

const removeFromDeck = (card, index) => {
  deckCards.value.splice(index, 1);
  saveDeckToStorage();
};

const clearDeck = () => {
  if (confirm('Êtes-vous sûr de vouloir vider le deck ?')) {
    deckCards.value = [];
    saveDeckToStorage();
  }
};

const shuffleDeck = () => {
  deckCards.value = deckCards.value.sort(() => Math.random() - 0.5);
};

const getCardQuantity = (card) => {
  return deckCards.value.filter(c => c.id === card.id).length;
};

const getTypeLabel = (type) => {
  const labels = {
    'Creature': 'Créatures',
    'Instant': 'Éphémères',
    'Sorcery': 'Rituels',
    'Enchantment': 'Enchantements',
    'Artifact': 'Artefacts',
    'Planeswalker': 'Planeswalkers',
    'Land': 'Terrains'
  };
  return labels[type] || type;
};

const getManaSymbol = (color) => {
  return manaSymbolMap[color] || '';
};

const renderManaCost = (manaCost) => {
  if (!manaCost) return '';
  return manaCost.replace(/\{(.*?)\}/g, (match, symbol) => {
    const url = manaSymbolMap[symbol];
    return url ? `<img src="${url}" alt="${symbol}" class="mana-icon" />` : match;
  });
};

const renderManaInText = (text) => {
  if (!text) return '';
  return text.replace(/\{(.*?)\}/g, (match, symbol) => {
    const url = manaSymbolMap[symbol];
    return url ? `<img src="${url}" alt="${symbol}" class="mana-icon" />` : match;
  });
};

const getLowestPrice = (prices) => {
  if (!prices) return 'N/A';
  const validPrices = Object.values(prices).filter(price => price && price > 0);
  return validPrices.length > 0 ? Math.min(...validPrices).toFixed(2) : 'N/A';
};

const saveDeck = () => {
  const deckData = {
    name: `Deck ${new Date().toLocaleDateString()}`,
    cards: deckCards.value,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('mtgDeck', JSON.stringify(deckData));
  alert('Deck sauvegardé !');
};

const saveDeckToStorage = () => {
  localStorage.setItem('mtgDeckCards', JSON.stringify(deckCards.value));
};

const loadDeckFromStorage = () => {
  const saved = localStorage.getItem('mtgDeckCards');
  if (saved) {
    deckCards.value = JSON.parse(saved);
  }
};

const exportDeck = () => {
  const deckText = deckCards.value.map(card => `1 ${card.name}`).join('\n');
  const blob = new Blob([deckText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deck.txt';
  a.click();
  URL.revokeObjectURL(url);
};

const importDeck = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt,.dek,.cod';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const text = await file.text();
      // Logique d'import basique - à améliorer
      alert('Fonctionnalité d\'import en développement');
    }
  };
  input.click();
};

const testStartingHand = () => {
  if (deckCards.value.length < 7) {
    alert('Le deck doit contenir au moins 7 cartes pour tester une main initiale');
    return;
  }
  
  const shuffled = [...deckCards.value].sort(() => Math.random() - 0.5);
  startingHand.value = shuffled.slice(0, 7);
  showStartingHandModal.value = true;
};

const mulligan = () => {
  const shuffled = [...deckCards.value].sort(() => Math.random() - 0.5);
  startingHand.value = shuffled.slice(0, 7);
};

const closeStartingHandModal = () => {
  showStartingHandModal.value = false;
  startingHand.value = [];
};

const clearSearch = () => {
  searchQuery.value = '';
  searchCards();
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    searchCards();
  }
};

const nextPage = () => {
  currentPage.value++;
  searchCards();
};

// Initialisation
onMounted(async () => {
  sets.value = await fetchAllSets();
  loadDeckFromStorage();
  await searchCards();
});
</script>

<style scoped>
.deck-builder-container {
  padding: 1rem;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
}

.deck-builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.deck-builder-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 300px;
  gap: 1rem;
  height: calc(100vh - 120px);
}

.search-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-input-group {
  display: flex;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 400px;
}

.card-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.card-item:hover {
  transform: scale(1.05);
}

.card-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deck-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-left: 1px solid #e0e0e0;
  padding-left: 1rem;
}

.deck-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deck-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-weight: bold;
  font-size: 0.9rem;
}

.mana-curve {
  display: flex;
  align-items: end;
  gap: 0.25rem;
  height: 50px;
}

.curve-bar {
  flex: 1;
  background: #007bff;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  min-height: 20px;
}

.curve-count {
  font-size: 0.7rem;
  color: white;
  font-weight: bold;
}

.curve-cmc {
  font-size: 0.6rem;
  color: white;
}

.type-distribution,
.color-distribution {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.type-item,
.color-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.color-symbol {
  width: 16px;
  height: 16px;
}

.deck-cards {
  flex: 1;
  overflow-y: auto;
}

.deck-section {
  margin-bottom: 1rem;
}

.deck-section h4 {
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e0e0e0;
}

.deck-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.25rem;
}

.deck-card-item {
  position: relative;
  cursor: pointer;
}

.deck-card-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.card-quantity {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

.card-zoom-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 100%;
  overflow-y: auto;
}

.card-zoom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-zoom-image img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.card-zoom-text {
  font-size: 0.9rem;
  line-height: 1.4;
}

.card-zoom-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-info {
  font-size: 0.8rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
}

.starting-hand {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.hand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.hand-card img {
  width: 80px;
  height: auto;
  border-radius: 4px;
}

.hand-card .card-name {
  font-size: 0.8rem;
  text-align: center;
  word-break: break-word;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

:deep(.mana-icon) {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: 0 2px;
}
</style> 