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
      <h2>Recommandations d'items</h2>
      <p>Voici des suggestions pour optimiser votre inventaire :</p>
      
      <div class="recommendations-table-wrapper">
        <table class="recommendations-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-name">Item</th>
              <th class="col-count">Quantité</th>
              <th class="col-action">Action</th>
              <th class="col-message">Message</th>
              <th class="col-placements">Emplacements</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rec in recommendations"
              :key="`${rec.itemName}-${rec.type}`"
              class="recommendation-row"
              :class="rec.type"
            >
              <td class="col-icon">
                <img
                  :src="getItemIcon(rec.itemId)"
                  :alt="rec.itemName"
                  class="item-icon"
                  @error="$event.target.src = 'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png'"
                />
              </td>
              <td class="col-name">
                <span class="item-name">{{ rec.itemName }}</span>
              </td>
              <td class="col-count">
                <span class="item-count">{{ rec.currentCount }}x</span>
              </td>
              <td class="col-action">
                <div class="action-badge" :class="rec.action">
                  {{ getActionLabel(rec.action) }}
                </div>
              </td>
              <td class="col-message">
                <div class="message" v-html="rec.message"></div>
              </td>
              <td class="col-placements">
                <div v-if="rec.placements && rec.placements.length > 0" class="placement-list">
                  <span
                    v-for="placement in rec.placements"
                    :key="`${placement.source}-${placement.count}`"
                    class="placement-item"
                  >
                    {{ placement.source }}: {{ placement.count }}x
                  </span>
                </div>
                <span v-else class="no-placement">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section des piles partielles -->
    <div v-if="partialStacks.length > 0" class="partial-stacks-section">
      <h2>Empiler ces objets</h2>
      <p>
        Ces articles ont des piles incomplètes (moins de 250 articles) à plusieurs endroits et
        doivent être empilés ensemble pour économiser de l'espace dans l'inventaire.
      </p>
      
      <div class="partial-stacks-table-wrapper">
        <table class="partial-stacks-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-name">Item</th>
              <th class="col-total">Total</th>
              <th class="col-placements">Emplacements</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="stack in partialStacks"
              :key="stack.id"
              class="partial-stack-row"
            >
              <td class="col-icon">
                <img :src="getItemIcon(stack.id)" :alt="stack.id" class="item-icon" />
              </td>
              <td class="col-name">
                <span class="stack-name">{{ itemNamesCache.get(stack.id) || `Chargement...` }}</span>
              </td>
              <td class="col-total">
                <span class="total-count">{{ stack.totalCount }}x</span>
              </td>
              <td class="col-placements">
                <div class="placement-list">
                  <span
                    v-for="placement in stack.placements"
                    :key="`${placement.source}-${placement.count}`"
                    class="placement-tag"
                  >
                    {{ placement.source }}: {{ placement.count }}x
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section des items à fabriquer -->
    <div v-if="craftableItems.length > 0" class="craftable-section">
      <h2>Fabriquer les objets</h2>
      <p>
        Vous avez plus d'une pile (250 articles) d'ingrédients pour les articles suivants. Vous
        pouvez fabriquer ces objets pour réduire le nombre de piles.
      </p>
      
      <div class="craftable-table-wrapper">
        <table class="craftable-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-name">Item</th>
              <th class="col-stacks">Piles complètes</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in craftableItems"
              :key="item.id"
              class="craftable-row"
            >
              <td class="col-icon">
                <img :src="getItemIcon(item.id)" :alt="item.name" class="item-icon" />
              </td>
              <td class="col-name">
                <span class="craftable-name">{{ itemNamesCache.get(item.id) || `Chargement...` }}</span>
              </td>
              <td class="col-stacks">
                <span class="stacks-count">{{ Math.floor(item.totalCount / 250) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
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

/* Tableau des recommandations */
.recommendations-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(74, 144, 226, 0.2);
}

.recommendations-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.recommendations-table thead tr {
  background: rgba(74, 144, 226, 0.15);
  border-bottom: 2px solid rgba(74, 144, 226, 0.4);
}

.recommendations-table th {
  padding: 12px 14px;
  text-align: left;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.recommendation-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s ease;
}

.recommendation-row:last-child {
  border-bottom: none;
}

.recommendation-row:hover {
  background: rgba(74, 144, 226, 0.07);
}

.recommendation-row td {
  padding: 12px 14px;
  vertical-align: middle;
}

/* Colonne icône */
.col-icon {
  width: 52px;
  text-align: center;
  padding: 8px 10px !important;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #555;
  background: #000;
  object-fit: cover;
  display: block;
  transition: all 0.25s ease;
}

.item-icon:hover {
  border-color: #4a90e2;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.35);
}

/* Colonne nom */
.col-name {
  min-width: 180px;
}

.item-name {
  color: #4a90e2;
  font-weight: 600;
  font-size: 1rem;
}

/* Colonne quantité */
.col-count {
  white-space: nowrap;
  text-align: center;
}

.item-count {
  color: #ffd700;
  font-weight: bold;
  font-size: 1rem;
}

/* Colonne action */
.col-action {
  white-space: nowrap;
  text-align: center;
}

.action-badge {
  display: inline-block;
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
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

/* Bordure gauche colorée selon le type */
.recommendation-row.craft td:first-child {
  border-left: 3px solid #4caf50;
}
.recommendation-row.consume td:first-child {
  border-left: 3px solid #ff9800;
}
.recommendation-row.exchange td:first-child {
  border-left: 3px solid #9c27b0;
}
.recommendation-row.sell td:first-child {
  border-left: 3px solid #f44336;
}

/* Colonne message */
.col-message {
  min-width: 220px;
}

.message {
  color: #ddd;
  line-height: 1.5;
  font-size: 0.9rem;
}

.message a {
  color: #4a90e2;
  text-decoration: none;
}

.message a:hover {
  text-decoration: underline;
}

/* Colonne emplacements */
.col-placements {
  min-width: 160px;
}

.placement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.placement-item {
  background: rgba(74, 144, 226, 0.15);
  color: #4a90e2;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 0.82rem;
  border: 1px solid rgba(74, 144, 226, 0.25);
  white-space: nowrap;
}

.no-placement {
  color: #555;
  font-size: 0.9rem;
}

/* Tableau des piles partielles */
.partial-stacks-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(255, 152, 0, 0.25);
}

.partial-stacks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.partial-stacks-table thead tr {
  background: rgba(255, 152, 0, 0.12);
  border-bottom: 2px solid rgba(255, 152, 0, 0.35);
}

.partial-stacks-table th {
  padding: 12px 14px;
  text-align: left;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.partial-stack-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid #ff9800;
  transition: background 0.2s ease;
}

.partial-stack-row:last-child {
  border-bottom: none;
}

.partial-stack-row:hover {
  background: rgba(255, 152, 0, 0.07);
}

.partial-stack-row td {
  padding: 12px 14px;
  vertical-align: middle;
}

.stack-name {
  color: #ff9800;
  font-weight: 600;
  font-size: 1rem;
}

.col-total {
  white-space: nowrap;
  text-align: center;
}

.total-count {
  color: #ffd700;
  font-weight: bold;
  font-size: 1rem;
}

.placement-tag {
  background: rgba(255, 152, 0, 0.15);
  color: #ff9800;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 0.82rem;
  border: 1px solid rgba(255, 152, 0, 0.25);
  white-space: nowrap;
}

/* Tableau des items à fabriquer */
.craftable-table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid rgba(76, 175, 80, 0.25);
}

.craftable-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.craftable-table thead tr {
  background: rgba(76, 175, 80, 0.12);
  border-bottom: 2px solid rgba(76, 175, 80, 0.35);
}

.craftable-table th {
  padding: 12px 14px;
  text-align: left;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.craftable-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 3px solid #4caf50;
  transition: background 0.2s ease;
}

.craftable-row:last-child {
  border-bottom: none;
}

.craftable-row:hover {
  background: rgba(76, 175, 80, 0.07);
}

.craftable-row td {
  padding: 12px 14px;
  vertical-align: middle;
}

.craftable-name {
  color: #4caf50;
  font-weight: 600;
  font-size: 1rem;
}

.col-stacks {
  white-space: nowrap;
  text-align: center;
}

.stacks-count {
  color: #4caf50;
  font-weight: bold;
  font-size: 1rem;
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
  
  .recommendations-table th,
  .recommendations-table td {
    padding: 10px 8px;
  }

  .col-message {
    min-width: 140px;
  }

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
