<template>
  <div class="inventory-manager">
    <div class="header">
      <h1>Gestionnaire d'inventaire GW2</h1>
      <p>Obtenez des suggestions pour <span class="highlight">nettoyer votre</span> inventaire.</p>
      
      <!-- Indicateur de chargement des icônes -->
      <div v-if="loadingNames" class="loading-indicator">
        <span class="loading-text">Chargement des noms des items...</span>
        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- Section des recommandations d'items -->
    <div v-if="recommendations.length > 0" class="recommendations-section">
      <h2>🎯 Recommandations d'items</h2>
      <p>Voici des suggestions pour optimiser votre inventaire :</p>
      
      <div class="recommendations-grid">
        <div 
          v-for="rec in recommendations" 
          :key="`${rec.itemName}-${rec.type}`" 
          class="recommendation-card"
          :class="rec.type"
        >
          <div class="item-header">
            <img 
              :src="getItemIcon(rec.itemId)" 
              :alt="rec.itemName" 
              class="item-icon"
              @error="$event.target.src = 'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png'"
            />
            <div class="item-info">
              <h3 class="item-name">{{ rec.itemName }}</h3>
              <span class="item-count">{{ rec.currentCount }}x</span>
            </div>
          </div>
          
          <div class="recommendation-content">
            <div class="message" v-html="rec.message"></div>
            <div class="action-badge" :class="rec.action">
              {{ getActionLabel(rec.action) }}
            </div>
          </div>
          
          <!-- Affichage des emplacements si disponibles -->
          <div v-if="rec.placements && rec.placements.length > 0" class="placements">
            <h4>Emplacements :</h4>
            <div class="placement-list">
              <span 
                v-for="placement in rec.placements" 
                :key="`${placement.source}-${placement.count}`"
                class="placement-item"
              >
                {{ placement.source }}: {{ placement.count }}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section des piles partielles -->
    <div v-if="partialStacks.length > 0" class="partial-stacks-section">
      <h2>📦 Empiler ces objets</h2>
      <p>
        Ces articles ont des piles incomplètes (moins de 250 articles) à plusieurs endroits et
        doivent être empilés ensemble pour économiser de l'espace dans l'inventaire.
      </p>
      
      <div class="partial-stacks-grid">
        <div 
          v-for="stack in partialStacks" 
          :key="stack.id" 
          class="partial-stack-card"
        >
          <div class="stack-header">
            <img :src="getItemIcon(stack.id)" :alt="stack.id" class="item-icon" />
            <div class="stack-info">
              <h3>{{ itemNamesCache.get(stack.id) || `Chargement...` }}</h3>
              <span class="total-count">Total: {{ stack.totalCount }}x</span>
            </div>
          </div>
          
          <div class="stack-details">
            <div 
              v-for="placement in stack.placements" 
              :key="`${placement.source}-${placement.count}`"
              class="placement-detail"
            >
              <span class="source">{{ placement.source }}</span>
              <span class="count">{{ placement.count }}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section des items à fabriquer -->
    <div v-if="craftableItems.length > 0" class="craftable-section">
      <h2>⚒️ Fabriquer les objets</h2>
      <p>
        Vous avez plus d'une pile (250 articles) d'ingrédients pour les articles suivants. Vous
        pouvez fabriquer ces objets pour réduire le nombre de piles.
      </p>
      
      <div class="craftable-grid">
        <div 
          v-for="item in craftableItems" 
          :key="item.id" 
          class="craftable-card"
        >
          <div class="item-header">
            <img :src="getItemIcon(item.id)" :alt="item.name" class="item-icon" />
            <div class="item-info">
              <h3>{{ itemNamesCache.get(item.id) || `Chargement...` }}</h3>
              <span class="stacks-count">{{ Math.floor(item.totalCount / 250) }} piles complètes</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message si aucune recommandation -->
    <div v-if="!hasData" class="no-data">
      <p>Aucune donnée d'inventaire disponible. Assurez-vous d'avoir configuré votre clé API.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useItemDatabaseStore } from '@/stores/itemDatabase'

const userStore = useUserStore()
const itemDatabaseStore = useItemDatabaseStore()

const recommendations = ref([])
const partialStacks = ref([])
const craftableItems = ref([])
const hasData = ref(false)
const loadingNames = ref(false)
const itemNamesCache = new Map() // Cache pour les noms des items

// Fonction pour obtenir l'icône d'un item via user.js
const getItemIcon = (itemId) => {
  return userStore.getIconUrl(itemId)
}

// Fonction pour obtenir le label d'une action
const getActionLabel = (action) => {
  const labels = {
    'craft': 'Fabriquer',
    'consume': 'Consommer',
    'exchange': 'Échanger',
    'sell': 'Vendre'
  }
  return labels[action] || action
}

// Fonction pour analyser l'inventaire et générer les recommandations
const analyzeInventory = async () => {
  // Vérifier que la clé API est disponible
  if (!userStore.apiKey) {
    hasData.value = false
    return
  }
  
  const itemCounts = userStore.itemCounts
  const itemPlacements = userStore.itemPlacements
  
  if (!itemCounts || Object.keys(itemCounts).length === 0) {
    hasData.value = false
    return
  }
  
  hasData.value = true
  loadingNames.value = true
  
  try {
    // Obtenir toutes les recommandations (maintenant asynchrone)
    recommendations.value = await itemDatabaseStore.getAllRecommendations(itemCounts, itemPlacements)
    
    // Analyser les piles partielles
    partialStacks.value = Object.entries(itemCounts)
      .filter(([, count]) => count > 0 && count < 250)
      .map(([id, count]) => ({
        id: parseInt(id),
        totalCount: count,
        placements: itemPlacements[id] || []
      }))
    
    // Filtrer les items avec des piles partielles à plusieurs endroits
    partialStacks.value = partialStacks.value.filter(stack => 
      stack.placements.length > 1
    )
    
    // Analyser les items à fabriquer
    craftableItems.value = Object.entries(itemCounts)
      .filter(([, count]) => count >= 250)
      .map(([id, count]) => ({
        id: parseInt(id),
        count: count,
        placements: itemPlacements[id] || []
      }))
    
    // Précharger les noms des items
    await preloadItemNames()
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'inventaire:', error)
  } finally {
    loadingNames.value = false
  }
}

// Fonction pour précharger les noms des items
const preloadItemNames = async () => {
  try {
    // Collecter tous les IDs d'items uniques
    const allItemIds = new Set()
    
    // IDs des recommandations
    recommendations.value.forEach(rec => allItemIds.add(rec.itemId))
    
    // IDs des piles partielles
    partialStacks.value.forEach(stack => allItemIds.add(stack.id))
    
    // IDs des items à fabriquer
    craftableItems.value.forEach(item => allItemIds.add(item.id))
    
    // Récupérer tous les noms en lot
    const namesMap = await itemDatabaseStore.getItemNamesBatch([...allItemIds])
    
    // Mettre à jour le cache local
    namesMap.forEach((name, id) => {
      itemNamesCache.set(id, name)
    })
    
  } catch (error) {
    console.error('Erreur lors du préchargement des noms:', error)
  }
}

// Initialiser l'analyse au montage du composant
onMounted(async () => {
  // Attendre que les données soient chargées et que la clé API soit disponible
  if (userStore.apiKey && userStore.haveApiKey) {
    await analyzeInventory()
  }
  
  // Surveiller les changements dans les données
  userStore.$subscribe(async () => {
    if (userStore.apiKey && userStore.haveApiKey) {
      await analyzeInventory()
    }
  })
})
</script>

<style scoped>
.inventory-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255, 215, 0, 0.1));
  border-radius: 15px;
  border: 1px solid rgba(74, 144, 226, 0.3);
}

.header h1 {
  color: #4a90e2;
  margin-bottom: 15px;
  font-size: 2.5rem;
}

.header p {
  font-size: 1.2rem;
  margin: 0;
}

.highlight {
  color: #ffd700;
  font-weight: bold;
}

/* Indicateur de chargement des icônes */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  padding: 10px 20px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(74, 144, 226, 0.3);
}

.loading-text {
  color: #4a90e2;
  font-size: 0.9rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(74, 144, 226, 0.3);
  border-top: 2px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Sections générales */
.recommendations-section,
.partial-stacks-section,
.craftable-section {
  margin-bottom: 40px;
  padding: 25px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.recommendations-section h2,
.partial-stacks-section h2,
.craftable-section h2 {
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.recommendations-section p,
.partial-stacks-section p,
.craftable-section p {
  color: #ccc;
  margin-bottom: 25px;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Grille des recommandations */
.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: rgba(42, 42, 42, 0.8);
  border-radius: 10px;
  padding: 20px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.recommendation-card.craft {
  border-color: #4caf50;
}

.recommendation-card.consume {
  border-color: #ff9800;
}

.recommendation-card.exchange {
  border-color: #9c27b0;
}

.recommendation-card.sell {
  border-color: #f44336;
}

/* En-tête des items */
.item-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.item-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 2px solid #555;
  background: #000;
  object-fit: cover;
  transition: all 0.3s ease;
}

.item-icon:hover {
  border-color: #4a90e2;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
}

.item-icon[src*="default"] {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.item-info {
  flex: 1;
}

.item-name {
  color: #4a90e2;
  margin: 0 0 5px 0;
  font-size: 1.3rem;
}

.item-count {
  color: #ffd700;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Contenu des recommandations */
.recommendation-content {
  margin-bottom: 15px;
}

.message {
  color: #fff;
  line-height: 1.5;
  margin-bottom: 15px;
}

.message a {
  color: #4a90e2;
  text-decoration: none;
}

.message a:hover {
  text-decoration: underline;
}

.action-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-badge.craft {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid #4caf50;
}

.action-badge.consume {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid #ff9800;
}

.action-badge.exchange {
  background: rgba(156, 39, 176, 0.2);
  color: #9c27b0;
  border: 1px solid #9c27b0;
}

.action-badge.sell {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

/* Emplacements */
.placements {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.placements h4 {
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 1rem;
}

.placement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.placement-item {
  background: rgba(74, 144, 226, 0.2);
  color: #4a90e2;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid rgba(74, 144, 226, 0.3);
}

/* Grille des piles partielles */
.partial-stacks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.partial-stack-card {
  background: rgba(42, 42, 42, 0.8);
  border-radius: 10px;
  padding: 20px;
  border: 2px solid #ff9800;
  transition: all 0.3s ease;
}

.partial-stack-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.stack-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.stack-info h3 {
  color: #ff9800;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.total-count {
  color: #ffd700;
  font-weight: bold;
}

.stack-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placement-detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.source {
  color: #ccc;
  font-size: 0.9rem;
}

.count {
  color: #ffd700;
  font-weight: bold;
}

/* Grille des items à fabriquer */
.craftable-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.craftable-card {
  background: rgba(42, 42, 42, 0.8);
  border-radius: 10px;
  padding: 20px;
  border: 2px solid #4caf50;
  transition: all 0.3s ease;
}

.craftable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.stacks-count {
  color: #4caf50;
  font-weight: bold;
}

/* Message d'absence de données */
.no-data {
  text-align: center;
  padding: 60px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.no-data p {
  color: #888;
  font-size: 1.1rem;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .inventory-manager {
    padding: 15px;
  }
  
  .header {
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .recommendations-grid,
  .partial-stacks-grid,
  .craftable-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendation-card,
  .partial-stack-card,
  .craftable-card {
    padding: 15px;
  }
}
</style>
