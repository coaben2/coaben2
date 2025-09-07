<template>
  <div class="deck-builder-home">
    <div class="top-section">
      <div class="navigation-section">
        <MagicNavigation />
      </div>
      <div class="analysis-section">
        <DeckAnalysis :deck-cards="deckCards" />
      </div>
    </div>
    
    <div class="deck-builder-content">
      <div class="main-panel">
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
              <button @click="testStartingHand" class="btn-secondary">Test Main</button>
              <button @click="importMTGADeck" class="btn-import">📁 Importer MTGA</button>
              <input 
                ref="mtgaFileInput"
                type="file" 
                accept=".txt,.dek,.mtga"
                @change="handleMTGAFileUpload"
                style="display: none;"
              />
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
                  @mouseenter="hoverCard = card"
                  @mouseleave="hoverCard = null"
                >
                  <img :src="card.image_uris?.small" :alt="card.name" />
                  <div class="card-quantity">{{ getCardQuantity(card) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau latéral avec recommandations -->
      <div class="sidebar-panel">
        <!-- Recommandations -->
        <CardRecommendations 
          :deck-cards="deckCards" 
          @add-card="addToDeck"
          @card-hover="hoverCard = $event"
          @card-leave="hoverCard = null"
        />
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
          <div class="card-text-content" v-html="renderManaInText(getCardTextInFrench(hoverCard))"></div>
          <div class="card-text-info">
            <small v-if="hoverCard.printed_text && isFrenchText(hoverCard.printed_text)" class="text-french">🇫🇷 Texte français</small>
            <small v-else-if="hoverCard.printed_text" class="text-printed">📖 Texte imprimé</small>
            <small v-else-if="hoverCard.oracle_text" class="text-english">🇺🇸 Texte oracle (anglais)</small>
            <small v-else class="text-none">❌ Aucun texte</small>
          </div>
        </div>
        <div class="card-zoom-actions">
          <button 
            v-if="!isCardInDeck(hoverCard)" 
            @click="addToDeck(hoverCard)" 
            class="btn-primary"
          >
            Ajouter au deck
          </button>
          <button 
            v-else 
            @click="removeFromDeck(hoverCard, getCardIndexInDeck(hoverCard))" 
            class="btn-danger"
          >
            Retirer du deck
          </button>
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
import { searchCardsAdvanced, fetchAllSets } from './magicApi';
import MagicNavigation from './MagicNavigation.vue';
import DeckAnalysis from './DeckAnalysis.vue';
import CardRecommendations from './CardRecommendations.vue';

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
};

// Computed properties
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
    const filters = {
      name: searchQuery.value,
      set: selectedSet.value,
      type: selectedType.value,
      color: selectedColor.value,
      page: currentPage.value
    };
    
    searchResults.value = await searchCardsAdvanced(filters);
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

const renderManaCost = (manaCost) => {
  if (!manaCost) return '';
  return manaCost.replace(/\{(.*?)\}/g, (match, symbol) => {
    const url = manaSymbolMap[symbol];
    return url ? `<img src="${url}" alt="${symbol}" class="mana-icon" />` : match;
  });
};

// Référence pour l'input file
const mtgaFileInput = ref(null);

// Fonction pour déclencher l'import MTGA
const importMTGADeck = () => {
  mtgaFileInput.value?.click();
};

// Fonction pour gérer l'upload du fichier MTGA
const handleMTGAFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const importedCards = parseMTGAFile(text);
    
    if (importedCards.length > 0) {
      // Demander confirmation avant de remplacer le deck
      if (deckCards.value.length > 0) {
        if (!confirm(`Importer ${importedCards.length} cartes et remplacer le deck actuel ?`)) {
          return;
        }
      }
      
      // Récupérer les détails complets des cartes via l'API
      await loadImportedCards(importedCards);
      
      // Réinitialiser l'input file
      event.target.value = '';
      
      alert(`Deck importé avec succès ! ${importedCards.length} cartes ajoutées.`);
    } else {
      alert('Aucune carte trouvée dans le fichier. Vérifiez le format du fichier.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    alert('Erreur lors de l\'import du fichier. Vérifiez le format.');
  }
};

// Fonction pour parser le fichier MTGA
const parseMTGAFile = (fileContent) => {
  const lines = fileContent.split('\n');
  const cards = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('//')) continue;
    
    // Format MTGA: "2 Lightning Bolt (STA) 42"
    // Format alternatif: "2 Lightning Bolt"
    const match = trimmedLine.match(/^(\d+)\s+(.+?)(?:\s+\(([^)]+)\)\s+(\d+))?$/);
    
    if (match) {
      const [, quantity, cardName, setCode, cardNumber] = match;
      cards.push({
        name: cardName.trim(),
        quantity: parseInt(quantity),
        setCode: setCode || null,
        cardNumber: cardNumber || null
      });
    }
  }
  
  return cards;
};

// Fonction pour charger les détails complets des cartes importées
const loadImportedCards = async (importedCards) => {
  const newDeckCards = [];
  let foundCards = 0;
  let notFoundCards = [];
  
  // Afficher un indicateur de progression
  const progressMessage = `Import en cours... 0/${importedCards.length} cartes trouvées`;
  console.log(progressMessage);
  
  for (let i = 0; i < importedCards.length; i++) {
    const importedCard = importedCards[i];
    
    try {
      // Rechercher la carte par nom
      const searchResults = await searchCardsAdvanced({
        name: importedCard.name,
        exact: true
      });
      
      if (searchResults.length > 0) {
        // Prendre la première correspondance (la plus récente généralement)
        const card = searchResults[0];
        
        // Ajouter la quantité demandée
        for (let j = 0; j < importedCard.quantity; j++) {
          newDeckCards.push(card);
        }
        
        foundCards += importedCard.quantity;
        console.log(`Import en cours... ${foundCards}/${importedCards.length} cartes trouvées`);
      } else {
        notFoundCards.push(importedCard.name);
        console.warn(`Carte non trouvée: ${importedCard.name}`);
      }
      
      // Petite pause pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Erreur lors de la recherche de ${importedCard.name}:`, error);
      notFoundCards.push(importedCard.name);
    }
  }
  
  // Remplacer le deck actuel
  deckCards.value = newDeckCards;
  saveDeckToStorage();
  
  // Afficher un résumé de l'import
  if (notFoundCards.length > 0) {
    console.warn(`Cartes non trouvées: ${notFoundCards.join(', ')}`);
  }
  
  console.log(`Import terminé: ${foundCards} cartes importées sur ${importedCards.length} demandées`);
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

const saveDeckToStorage = () => {
  localStorage.setItem('mtgDeckCards', JSON.stringify(deckCards.value));
};

const loadDeckFromStorage = () => {
  const saved = localStorage.getItem('mtgDeckCards');
  if (saved) {
    deckCards.value = JSON.parse(saved);
  }
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

// Helper functions for deck panel
const isCardInDeck = (card) => {
  return deckCards.value.some(c => c.id === card.id);
};

const getCardIndexInDeck = (card) => {
  return deckCards.value.findIndex(c => c.id === card.id);
};

// Fonction pour obtenir le texte de la carte en français
const getCardTextInFrench = (card) => {
  if (!card) return '';
  
  // Priorité 1: Texte imprimé (généralement dans la langue de l'édition)
  if (card.printed_text) {
    return card.printed_text;
  }
  
  // Priorité 2: Vérifier si c'est une édition française
  if (card.set && card.set.toLowerCase().includes('fr')) {
    // Chercher dans les faces de la carte pour du texte français
    if (card.card_faces) {
      for (const face of card.card_faces) {
        if (face.printed_text) {
          return face.printed_text;
        }
      }
    }
  }
  
  // Priorité 3: Texte oracle (texte officiel, souvent en anglais)
  if (card.oracle_text) {
    return card.oracle_text;
  }
  
  // Priorité 4: Vérifier les faces de la carte pour du texte oracle
  if (card.card_faces) {
    for (const face of card.card_faces) {
      if (face.oracle_text) {
        return face.oracle_text;
      }
    }
  }
  
  // Priorité 5: Texte de la carte (fallback)
  if (card.card_text) {
    return card.card_text;
  }
  
  // Si aucun texte n'est disponible
  return 'Aucune description disponible';
};

// Helper function to check if text is in French
const isFrenchText = (text) => {
  // Simple check for French characters (é, à, ç, etc.)
  // This is a very basic check and might need more sophisticated logic
  // for truly accurate French detection.
  return /[éèêëàâäôöùûüç]/i.test(text);
};

// Initialisation
onMounted(async () => {
  sets.value = await fetchAllSets();
  loadDeckFromStorage();
  await searchCards();
});
</script>

<style scoped>
.deck-builder-home {
  padding: 1rem;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
}

.top-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.navigation-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.analysis-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.deck-builder-content {
  display: grid;
  grid-template-columns: 1fr 1fr 300px;
  gap: 1rem;
  height: calc(100vh - 200px);
}

.main-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
  max-height: 100%;
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

.deck-actions {
  display: flex;
  gap: 0.5rem;
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

.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
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

.card-text-content {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #007bff;
}

.card-text-info {
  display: flex;
  gap: 0.5rem;
}

.card-text-info small {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.text-french {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.text-english {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.text-printed {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.text-none {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
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

.btn-import {
  background: #28a745; /* Vert foncé */
  color: white;
}

.btn-import:hover {
  background: #218838; /* Vert encore plus foncé */
}

:deep(.mana-icon) {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: 0 2px;
}
</style> 