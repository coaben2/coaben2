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

      <div class="table-controls">
        <label class="sort-label">Trier par</label>
        <select v-model="recommendationSort.key" class="sort-select">
          <option value="item">Item</option>
          <option value="quantity">Quantité</option>
          <option value="action">Action</option>
        </select>
        <button class="sort-button" @click="toggleSort(recommendationSort)">
          {{ recommendationSort.dir === 'asc' ? 'Croissant' : 'Décroissant' }}
        </button>
      </div>
      
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
            <tr class="filter-row">
              <th></th>
              <th><input v-model="recommendationFilters.item" class="column-filter" placeholder="Filtrer item" /></th>
              <th><input v-model="recommendationFilters.quantity" class="column-filter" placeholder="Min qty" /></th>
              <th><input v-model="recommendationFilters.action" class="column-filter" placeholder="Filtrer action" /></th>
              <th><input v-model="recommendationFilters.message" class="column-filter" placeholder="Filtrer message" /></th>
              <th><input v-model="recommendationFilters.placement" class="column-filter" placeholder="Filtrer emplacement" /></th>
            </tr>
            <tr
              v-for="rec in filteredRecommendations"
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

      <div class="table-controls">
        <label class="sort-label">Trier par</label>
        <select v-model="partialStackSort.key" class="sort-select">
          <option value="item">Item</option>
          <option value="total">Total</option>
        </select>
        <button class="sort-button" @click="toggleSort(partialStackSort)">
          {{ partialStackSort.dir === 'asc' ? 'Croissant' : 'Décroissant' }}
        </button>
      </div>
      
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
            <tr class="filter-row">
              <th></th>
              <th><input v-model="partialStackFilters.item" class="column-filter" placeholder="Filtrer item" /></th>
              <th><input v-model="partialStackFilters.total" class="column-filter" placeholder="Min total" /></th>
              <th><input v-model="partialStackFilters.placement" class="column-filter" placeholder="Filtrer emplacement" /></th>
            </tr>
            <tr
              v-for="stack in filteredPartialStacks"
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

    <div v-if="possibleCrafts.length > 0" class="craftable-section">
      <h2>Crafts possibles avec vos ressources</h2>
      <p>
        Cette liste montre les recettes que vous pouvez fabriquer immédiatement avec les objets
        disponibles sur le compte.
      </p>

      <div class="table-controls">
        <label class="sort-label">Trier par</label>
        <select v-model="possibleCraftSort.key" class="sort-select">
          <option value="output">Objet crafté</option>
          <option value="craftCount">Nombre de crafts</option>
          <option value="outputCount">Quantité produite</option>
          <option value="discipline">Métier</option>
        </select>
        <button class="sort-button" @click="toggleSort(possibleCraftSort)">
          {{ possibleCraftSort.dir === 'asc' ? 'Croissant' : 'Décroissant' }}
        </button>
      </div>

      <div class="craftable-table-wrapper">
        <table class="craftable-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-best-craft">Objet crafté</th>
              <th class="col-stacks">Nombre de crafts</th>
              <th class="col-count">Quantité produite</th>
              <th class="col-discipline">Métier</th>
              <th class="col-message">Ingrédients</th>
            </tr>
          </thead>
          <tbody>
            <tr class="filter-row">
              <th></th>
              <th><input v-model="possibleCraftFilters.output" class="column-filter" placeholder="Filtrer craft" /></th>
              <th><input v-model="possibleCraftFilters.craftCount" class="column-filter" placeholder="Min crafts" /></th>
              <th><input v-model="possibleCraftFilters.outputCount" class="column-filter" placeholder="Min quantité" /></th>
              <th><input v-model="possibleCraftFilters.discipline" class="column-filter" placeholder="Filtrer métier" /></th>
              <th><input v-model="possibleCraftFilters.ingredient" class="column-filter" placeholder="Filtrer ingrédient" /></th>
            </tr>
            <tr
              v-for="craft in filteredPossibleCrafts"
              :key="`possible-${craft.recipeId}`"
              class="craftable-row"
            >
              <td class="col-icon">
                <img :src="getItemIcon(craft.outputItemId)" :alt="craft.outputItemId" class="item-icon" />
              </td>
              <td class="col-best-craft">
                <span class="best-craft-name">
                  {{ itemNamesCache.get(craft.outputItemId) || `Chargement...` }}
                </span>
              </td>
              <td class="col-stacks">
                <span class="stacks-count">{{ craft.maxCraftCount }}</span>
              </td>
              <td class="col-count">
                <span class="item-count">{{ craft.totalOutputCount }}x</span>
              </td>
              <td class="col-discipline">
                <span class="discipline-name">{{ formatCraftDisciplines(craft.disciplines) }}</span>
              </td>
              <td class="col-message">
                <div class="message">{{ formatIngredients(craft.ingredients) }}</div>
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
        Vous avez plus d'une pile (250 articles) d'ingrédients pour les articles suivants. Cette
        table met en avant le métier associé et l'objet crafté le plus rentable à revendre.
      </p>

      <div class="table-controls">
        <label class="sort-label">Trier par</label>
        <select v-model="craftableSort.key" class="sort-select">
          <option value="item">Item</option>
          <option value="stacks">Piles complètes</option>
          <option value="discipline">Métier</option>
          <option value="bestCraft">Meilleur craft</option>
          <option value="profit">Profit net total</option>
        </select>
        <button class="sort-button" @click="toggleSort(craftableSort)">
          {{ craftableSort.dir === 'asc' ? 'Croissant' : 'Décroissant' }}
        </button>
      </div>
      
      <div class="craftable-table-wrapper">
        <table class="craftable-table">
          <thead>
            <tr>
              <th class="col-icon"></th>
              <th class="col-name">Item</th>
              <th class="col-stacks">Piles complètes</th>
              <th class="col-discipline">Métier</th>
              <th class="col-best-craft">Meilleur craft (revente)</th>
              <th class="col-profit">Profit net total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="filter-row">
              <th></th>
              <th><input v-model="craftableFilters.item" class="column-filter" placeholder="Filtrer item" /></th>
              <th><input v-model="craftableFilters.stacks" class="column-filter" placeholder="Min piles" /></th>
              <th><input v-model="craftableFilters.discipline" class="column-filter" placeholder="Filtrer métier" /></th>
              <th><input v-model="craftableFilters.bestCraft" class="column-filter" placeholder="Filtrer craft" /></th>
              <th><input v-model="craftableFilters.profit" class="column-filter" placeholder="Min profit" /></th>
            </tr>
            <tr
              v-for="item in filteredCraftableItems"
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
              <td class="col-discipline">
                <span class="discipline-name">
                  {{ formatCraftDisciplines(craftResaleMap[item.id].disciplines) }}
                </span>
              </td>
              <td class="col-best-craft">
                <span class="best-craft-name">
                  {{ itemNamesCache.get(craftResaleMap[item.id].outputItemId) || `Chargement...` }}
                </span>
              </td>
              <td class="col-profit">
                <span
                  class="profit-value"
                  :class="craftResaleMap[item.id].totalProfit > 0 ? 'positive' : 'negative'"
                >
                  {{ formatCoins(craftResaleMap[item.id].totalProfit) }}
                </span>
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
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useItemDatabaseStore } from '@/stores/itemDatabase'

const userStore = useUserStore()
const itemDatabaseStore = useItemDatabaseStore()

const recommendations = ref([])
const partialStacks = ref([])
const possibleCrafts = ref([])
const craftableItems = ref([])
const craftResaleMap = ref({})
const hasData = ref(false)
const loadingNames = ref(false)
const itemNamesCache = new Map() // Cache pour les noms des items
const itemIconsCache = new Map()
const isAnalyzing = ref(false)
const FALLBACK_ICON = 'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png'
let needsReanalyze = false
let bootstrapAttempted = false
let analyzeTimer = null

const recommendationFilters = ref({
  item: '',
  quantity: '',
  action: '',
  message: '',
  placement: '',
})

const partialStackFilters = ref({
  item: '',
  total: '',
  placement: '',
})

const possibleCraftFilters = ref({
  output: '',
  craftCount: '',
  outputCount: '',
  discipline: '',
  ingredient: '',
})

const craftableFilters = ref({
  item: '',
  stacks: '',
  discipline: '',
  bestCraft: '',
  profit: '',
})

const recommendationSort = ref({ key: 'item', dir: 'asc' })
const partialStackSort = ref({ key: 'total', dir: 'desc' })
const possibleCraftSort = ref({ key: 'craftCount', dir: 'desc' })
const craftableSort = ref({ key: 'profit', dir: 'desc' })

const toggleSort = (sortRef) => {
  sortRef.value.dir = sortRef.value.dir === 'asc' ? 'desc' : 'asc'
}

const sortBy = (items, selector, dir) => {
  const direction = dir === 'asc' ? 1 : -1

  return [...items].sort((a, b) => {
    const aValue = selector(a)
    const bValue = selector(b)

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction
    }

    return String(aValue).localeCompare(String(bValue), 'fr', { sensitivity: 'base' }) * direction
  })
}

const aggregatePlacements = (placements = []) => {
  const grouped = new Map()

  placements.forEach((placement) => {
    if (!placement?.source) {
      return
    }

    const previousCount = grouped.get(placement.source) || 0
    grouped.set(placement.source, previousCount + Number(placement.count || 0))
  })

  return [...grouped.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => a.source.localeCompare(b.source, 'fr', { sensitivity: 'base' }))
}

const toNumberOrNull = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const includesNormalized = (value, filterValue) => {
  if (!filterValue) {
    return true
  }

  return String(value || '').toLowerCase().includes(filterValue.toLowerCase())
}

const filteredRecommendations = computed(() => {
  const f = recommendationFilters.value
  const minQty = toNumberOrNull(f.quantity)

  const filtered = recommendations.value.filter((rec) => {
    const placements = (rec.placements || [])
      .map((p) => `${p.source} ${p.count}`)
      .join(' ')

    const qtyOk = minQty === null || Number(rec.currentCount || 0) >= minQty
    return (
      includesNormalized(rec.itemName, f.item)
      && qtyOk
      && includesNormalized(getActionLabel(rec.action), f.action)
      && includesNormalized(rec.message, f.message)
      && includesNormalized(placements, f.placement)
    )
  })

  const sortConfig = recommendationSort.value
  const selectorByKey = {
    item: (rec) => rec.itemName,
    quantity: (rec) => Number(rec.currentCount || 0),
    action: (rec) => getActionLabel(rec.action),
  }

  return sortBy(filtered, selectorByKey[sortConfig.key] || selectorByKey.item, sortConfig.dir)
})

const filteredPartialStacks = computed(() => {
  const f = partialStackFilters.value
  const minTotal = toNumberOrNull(f.total)

  const filtered = partialStacks.value.filter((stack) => {
    const name = itemNamesCache.get(stack.id) || `Item ${stack.id}`
    const placements = (stack.placements || [])
      .map((p) => `${p.source} ${p.count}`)
      .join(' ')

    const totalOk = minTotal === null || Number(stack.totalCount || 0) >= minTotal
    return includesNormalized(name, f.item) && totalOk && includesNormalized(placements, f.placement)
  })

  const sortConfig = partialStackSort.value
  const selectorByKey = {
    item: (stack) => itemNamesCache.get(stack.id) || `Item ${stack.id}`,
    total: (stack) => Number(stack.totalCount || 0),
  }

  return sortBy(filtered, selectorByKey[sortConfig.key] || selectorByKey.total, sortConfig.dir)
})

const filteredPossibleCrafts = computed(() => {
  const f = possibleCraftFilters.value
  const minCraftCount = toNumberOrNull(f.craftCount)
  const minOutputCount = toNumberOrNull(f.outputCount)

  const filtered = possibleCrafts.value.filter((craft) => {
    const outputName = itemNamesCache.get(craft.outputItemId) || `Item ${craft.outputItemId}`
    const disciplines = formatCraftDisciplines(craft.disciplines)
    const ingredients = formatIngredients(craft.ingredients)
    const craftCountOk = minCraftCount === null || Number(craft.maxCraftCount || 0) >= minCraftCount
    const outputCountOk = minOutputCount === null || Number(craft.totalOutputCount || 0) >= minOutputCount

    return (
      includesNormalized(outputName, f.output)
      && craftCountOk
      && outputCountOk
      && includesNormalized(disciplines, f.discipline)
      && includesNormalized(ingredients, f.ingredient)
    )
  })

  const sortConfig = possibleCraftSort.value
  const selectorByKey = {
    output: (craft) => itemNamesCache.get(craft.outputItemId) || `Item ${craft.outputItemId}`,
    craftCount: (craft) => Number(craft.maxCraftCount || 0),
    outputCount: (craft) => Number(craft.totalOutputCount || 0),
    discipline: (craft) => formatCraftDisciplines(craft.disciplines),
  }

  return sortBy(filtered, selectorByKey[sortConfig.key] || selectorByKey.craftCount, sortConfig.dir)
})

const filteredCraftableItems = computed(() => {
  const f = craftableFilters.value
  const minStacks = toNumberOrNull(f.stacks)
  const minProfit = toNumberOrNull(f.profit)

  const filtered = craftableItems.value.filter((item) => {
    const recipe = craftResaleMap.value[item.id]
    if (!recipe) {
      return false
    }

    const itemName = itemNamesCache.get(item.id) || `Item ${item.id}`
    const outputName = itemNamesCache.get(recipe.outputItemId) || `Item ${recipe.outputItemId}`
    const stacksCount = Math.floor(Number(item.totalCount || 0) / 250)
    const profit = Number(recipe.totalProfit || 0)
    const stacksOk = minStacks === null || stacksCount >= minStacks
    const profitOk = minProfit === null || profit >= minProfit

    return (
      includesNormalized(itemName, f.item)
      && stacksOk
      && includesNormalized(formatCraftDisciplines(recipe.disciplines), f.discipline)
      && includesNormalized(outputName, f.bestCraft)
      && profitOk
    )
  })

  const sortConfig = craftableSort.value
  const selectorByKey = {
    item: (item) => itemNamesCache.get(item.id) || `Item ${item.id}`,
    stacks: (item) => Math.floor(Number(item.totalCount || 0) / 250),
    discipline: (item) => formatCraftDisciplines(craftResaleMap.value[item.id]?.disciplines || []),
    bestCraft: (item) => {
      const outputId = craftResaleMap.value[item.id]?.outputItemId
      return itemNamesCache.get(outputId) || `Item ${outputId}`
    },
    profit: (item) => Number(craftResaleMap.value[item.id]?.totalProfit || 0),
  }

  return sortBy(filtered, selectorByKey[sortConfig.key] || selectorByKey.profit, sortConfig.dir)
})

const resetViewData = () => {
  recommendations.value = []
  partialStacks.value = []
  possibleCrafts.value = []
  craftableItems.value = []
  craftResaleMap.value = {}
  hasData.value = false
  itemNamesCache.clear()
  itemIconsCache.clear()
}

const scheduleAnalyze = (delay = 150) => {
  if (analyzeTimer) {
    clearTimeout(analyzeTimer)
  }

  analyzeTimer = setTimeout(async () => {
    analyzeTimer = null
    await analyzeInventory()
  }, delay)
}

const formatCoins = (copperValue) => {
  const value = Math.floor(Number(copperValue) || 0)
  const sign = value < 0 ? '-' : ''
  const absValue = Math.abs(value)
  const gold = Math.floor(absValue / 10000)
  const silver = Math.floor((absValue % 10000) / 100)
  const copper = absValue % 100
  return `${sign}${gold}g ${silver}s ${copper}c`
}

const formatCraftDisciplines = (disciplines = []) => {
  const labels = {
    Armorsmith: 'Armurier',
    Artificer: 'Artificier',
    Chef: 'Chef',
    Huntsman: 'Chasseur',
    Jeweler: 'Joaillier',
    Leatherworker: 'Travailleur du cuir',
    Scribe: 'Scribe',
    Tailor: 'Tailleur',
    Weaponsmith: 'Forgeron d\'armes'
  }

  if (!disciplines.length) {
    return 'Métier non précisé'
  }

  return disciplines.map(discipline => labels[discipline] || discipline).join(', ')
}

// Fonction pour obtenir l'icône d'un item via user.js
const getItemIcon = (itemId) => {
  return itemIconsCache.get(itemId) || FALLBACK_ICON
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

const formatIngredients = (ingredients = []) => {
  return ingredients
    .map((ingredient) => {
      const itemName = itemNamesCache.get(ingredient.item_id) || `Item ${ingredient.item_id}`
      return `${ingredient.count}x ${itemName}`
    })
    .join(', ')
}

// Fonction pour analyser l'inventaire et générer les recommandations
const analyzeInventory = async () => {
  if (isAnalyzing.value) {
    needsReanalyze = true
    return
  }

  isAnalyzing.value = true

  // Vérifier que la clé API est disponible
  if (!userStore.apiKey || !userStore.haveApiKey) {
    resetViewData()
    isAnalyzing.value = false
    return
  }

  // Si on arrive directement sur la page, tenter d'initialiser les données une fois.
  if (!bootstrapAttempted && Object.keys(userStore.itemCounts || {}).length === 0) {
    bootstrapAttempted = true
    await userStore.initializeAllData()
  }
  
  const itemCounts = userStore.itemCounts
  const aggregatedPlacements = Object.fromEntries(
    Object.entries(userStore.itemPlacements || {}).map(([itemId, placements]) => [
      itemId,
      aggregatePlacements(placements),
    ]),
  )
  
  if (!itemCounts || Object.keys(itemCounts).length === 0) {
    resetViewData()
    isAnalyzing.value = false
    return
  }
  
  hasData.value = true
  loadingNames.value = true
  
  try {
    // Obtenir toutes les recommandations (maintenant asynchrone)
    recommendations.value = await itemDatabaseStore.getAllRecommendations(itemCounts, aggregatedPlacements)
    
    // Analyser les piles partielles
    partialStacks.value = Object.entries(itemCounts)
      .filter(([, count]) => count > 0 && count < 250)
      .map(([id, count]) => ({
        id: parseInt(id),
        totalCount: count,
        placements: aggregatedPlacements[id] || []
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
        totalCount: count,
        placements: aggregatedPlacements[id] || []
      }))

    const unlockedRecipeIds = await userStore.getUnlockedRecipes()
    const unlockedRecipeSet = Array.isArray(unlockedRecipeIds)
      ? new Set(unlockedRecipeIds)
      : null

    possibleCrafts.value = await itemDatabaseStore.getAccountCraftableRecipes(
      itemCounts,
      unlockedRecipeSet
    )

    const craftableItemIds = craftableItems.value.map(item => item.id)

    craftResaleMap.value = await itemDatabaseStore.getBestCraftResaleMap(
      itemCounts,
      craftableItemIds,
      unlockedRecipeSet
    )

    // Afficher uniquement les items avec un craft rentable a la revente
    craftableItems.value = craftableItems.value.filter(item => Boolean(craftResaleMap.value[item.id]))
    
    // Précharger les noms et icônes des items
    await preloadItemAssets()
    
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'inventaire:', error)
  } finally {
    loadingNames.value = false
    isAnalyzing.value = false

    if (needsReanalyze) {
      needsReanalyze = false
      scheduleAnalyze(0)
    }
  }
}

// Fonction pour précharger les noms des items
const preloadItemAssets = async () => {
  try {
    // Collecter tous les IDs d'items uniques
    const allItemIds = new Set()
    
    // IDs des recommandations
    recommendations.value.forEach(rec => allItemIds.add(rec.itemId))
    
    // IDs des piles partielles
    partialStacks.value.forEach(stack => allItemIds.add(stack.id))
    
    // IDs des items à fabriquer
    craftableItems.value.forEach(item => allItemIds.add(item.id))

    // IDs des meilleurs crafts de revente
    Object.values(craftResaleMap.value).forEach(craft => {
      if (craft?.outputItemId) {
        allItemIds.add(craft.outputItemId)
      }
    })

    // IDs des crafts possibles et de leurs ingrédients
    possibleCrafts.value.forEach(craft => {
      allItemIds.add(craft.outputItemId)
      craft.ingredients.forEach(ingredient => {
        allItemIds.add(ingredient.item_id)
      })
    })
    
    // Récupérer tous les noms en lot
    const namesMap = await itemDatabaseStore.getItemNamesBatch([...allItemIds])
    const iconsMap = await itemDatabaseStore.getItemIconsBatch([...allItemIds])
    
    // Mettre à jour le cache local
    namesMap.forEach((name, id) => {
      itemNamesCache.set(id, name)
    })

    iconsMap.forEach((icon, id) => {
      itemIconsCache.set(id, icon || FALLBACK_ICON)
    })
    
  } catch (error) {
    console.error('Erreur lors du préchargement des noms:', error)
  }
}

// Initialiser l'analyse au montage du composant
onMounted(async () => {
  userStore.initApiKey()
  scheduleAnalyze(0)

  userStore.$subscribe(() => {
    scheduleAnalyze()
  })
})

watch(
  () => [userStore.apiKey, userStore.haveApiKey],
  () => {
    scheduleAnalyze(0)
  },
)

onUnmounted(() => {
  if (analyzeTimer) {
    clearTimeout(analyzeTimer)
    analyzeTimer = null
  }
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

.filter-row th {
  background: rgba(255, 255, 255, 0.03);
  padding: 8px;
}

.column-filter {
  width: 100%;
  min-width: 90px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.35);
  color: #f5f5f5;
  font-size: 0.82rem;
}

.column-filter::placeholder {
  color: #a8a8a8;
}

.table-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
}

.sort-label {
  color: #ddd;
  font-size: 0.88rem;
}

.sort-select {
  min-width: 160px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.35);
  color: #f5f5f5;
}

.sort-button {
  padding: 6px 12px;
  border: 1px solid rgba(74, 144, 226, 0.45);
  border-radius: 6px;
  background: rgba(74, 144, 226, 0.2);
  color: #e8f2ff;
  cursor: pointer;
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

.col-best-craft {
  min-width: 220px;
}

.col-discipline {
  min-width: 150px;
}

.col-profit {
  min-width: 140px;
  text-align: center;
}

.stacks-count {
  color: #4caf50;
  font-weight: bold;
  font-size: 1rem;
}

.best-craft-name {
  color: #9be38f;
  font-weight: 600;
}

.discipline-name {
  color: #d5f5cf;
  font-weight: 600;
}

.profit-value {
  font-weight: bold;
}

.profit-value.positive {
  color: #4caf50;
}

.profit-value.negative {
  color: #f44336;
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
