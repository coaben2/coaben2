import { defineStore } from 'pinia';
import craftRecipesByItem from '@/data/craftRecipesByItem.json';

const TP_NET_TAX_RATE = 0.85;

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Base de données des items avec recommandations (seulement les IDs et catégories)
export const ITEM_DATABASE = {
  // Matériaux de base
  CANDY_CORN: {
    id: 36041,
    category: 'Halloween',
    recommendations: [
      {
        type: 'craft',
        minCount: 1000,
        message: (count) =>
          `Échangez contre ${Math.floor(count / 1000)}x <a href="https://wiki-fr.guildwars2.com/wiki/Agglom%C3%A9rat_de_bonbons">Agglomérat de bonbons</a>.`,
        action: 'exchange',
      },
    ],
  },

  BLOODSTONE_DUST: {
    id: 46731,
    category: 'Ascended',
    recommendations: [
      {
        type: 'consume',
        minCount: 250,
        requiresItem: 66999, // Mawdrey II
        message: (count, hasRequiredItem) =>
          hasRequiredItem
            ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} poussières. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
            : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces poussières.`,
        action: 'consume',
      },
    ],
  },

  EMPYREAL_FRAGMENT: {
    id: 46735,
    category: 'Ascended',
    recommendations: [
      {
        type: 'consume',
        minCount: 250,
        requiresItem: 66999, // Mawdrey II
        message: (count, hasRequiredItem) =>
          hasRequiredItem
            ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} fragments. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
            : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces fragments.`,
        action: 'consume',
      },
    ],
  },

  DRAGONITE_ORE: {
    id: 46733,
    category: 'Ascended',
    recommendations: [
      {
        type: 'consume',
        minCount: 250,
        requiresItem: 66999, // Mawdrey II
        message: (count, hasRequiredItem) =>
          hasRequiredItem
            ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} minerais. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
            : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces minerais.`,
        action: 'consume',
      },
    ],
  },

  QUARTZ_CRYSTAL: {
    id: 43773,
    category: 'Crafting',
    recommendations: [
      {
        type: 'craft',
        minCount: 250,
        message: (count) =>
          `Transformez ${Math.floor(count / 25)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Cristal_de_quartz_charg%C3%A9">Cristal de quartz chargé</a>.`,
        action: 'craft',
      },
    ],
  },

  // Essences de chance
  LUCK_ESSENCE_FINE: {
    id: 45175,
    category: 'Luck',
    recommendations: [
      {
        type: 'consume',
        minCount: 100,
        message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
        action: 'consume',
      },
    ],
  },

  LUCK_ESSENCE_MASTERWORK: {
    id: 45176,
    category: 'Luck',
    recommendations: [
      {
        type: 'consume',
        minCount: 50,
        message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
        action: 'consume',
      },
    ],
  },

  LUCK_ESSENCE_RARE: {
    id: 45177,
    category: 'Luck',
    recommendations: [
      {
        type: 'consume',
        minCount: 25,
        message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
        action: 'consume',
      },
    ],
  },

  LUCK_ESSENCE_EXOTIC: {
    id: 45178,
    category: 'Luck',
    recommendations: [
      {
        type: 'consume',
        minCount: 10,
        message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
        action: 'consume',
      },
    ],
  },

  // Matériaux de craft
  ANCIENT_WOOD_LOG: {
    id: 19725,
    category: 'Wood',
    recommendations: [
      {
        type: 'craft',
        minCount: 250,
        message: (count) =>
          `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Planche_de_bois_ancien">Planche de bois ancien</a>.`,
        action: 'craft',
      },
    ],
  },

  ORICHALCUM_ORE: {
    id: 19701,
    category: 'Ore',
    recommendations: [
      {
        type: 'craft',
        minCount: 250,
        message: (count) =>
          `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Lingot_d%27orichalque">Lingot d'orichalque</a>.`,
        action: 'craft',
      },
    ],
  },

  GOSSAMER_SCRAP: {
    id: 19748,
    category: 'Cloth',
    recommendations: [
      {
        type: 'craft',
        minCount: 250,
        message: (count) =>
          `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Bol_de_gaze">Bol de gaze</a>.`,
        action: 'craft',
      },
    ],
  },

  HARDENED_LEATHER_SECTION: {
    id: 19729,
    category: 'Leather',
    recommendations: [
      {
        type: 'craft',
        minCount: 250,
        message: (count) =>
          `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Feuille_de_cuir_durci">Feuille de cuir durci</a>.`,
        action: 'craft',
      },
    ],
  },
};

// Store pour gérer les recommandations d'items
export const useItemDatabaseStore = defineStore('itemDatabase', () => {
  // Cache pour les icônes des items
  const itemIconsCache = new Map();

  // Cache pour les noms des items
  const itemNamesCache = new Map();

  // Cache pour les recettes
  const recipeCache = new Map();

  // Cache des IDs de recettes par ingrédient
  const recipeSearchCache = new Map();

  // Cache pour les prix Trading Post
  const priceCache = new Map();

  const getRecipesBatch = async (recipeIds) => {
    const uniqueRecipeIds = [...new Set(recipeIds.map((id) => Number(id)).filter(Boolean))];
    const missingRecipeIds = uniqueRecipeIds.filter((id) => !recipeCache.has(id));

    try {
      const recipeChunks = chunkArray(missingRecipeIds, 200);

      for (const idsChunk of recipeChunks) {
        if (idsChunk.length === 0) {
          continue;
        }

        const response = await fetch(
          `https://api.guildwars2.com/v2/recipes?ids=${idsChunk.join(',')}`,
        );
        if (!response.ok) {
          throw new Error('Impossible de recuperer les recettes');
        }

        const recipes = await response.json();
        recipes.forEach((recipe) => {
          recipeCache.set(recipe.id, recipe);
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recuperation des recettes:', error);
    }

    return uniqueRecipeIds.map((id) => recipeCache.get(id)).filter(Boolean);
  };

  const getPricesBatch = async (itemIds) => {
    const uniqueItemIds = [...new Set(itemIds.map((id) => Number(id)).filter(Boolean))];
    const missingItemIds = uniqueItemIds.filter((id) => !priceCache.has(id));

    try {
      const itemChunks = chunkArray(missingItemIds, 200);

      for (const idsChunk of itemChunks) {
        if (idsChunk.length === 0) {
          continue;
        }

        const response = await fetch(
          `https://api.guildwars2.com/v2/commerce/prices?ids=${idsChunk.join(',')}`,
        );
        if (!response.ok) {
          throw new Error('Impossible de recuperer les prix Trading Post');
        }

        const prices = await response.json();

        idsChunk.forEach((id) => {
          priceCache.set(id, null);
        });

        prices.forEach((price) => {
          priceCache.set(price.id, {
            buy: price.buys?.unit_price ?? 0,
            sell: price.sells?.unit_price ?? 0,
          });
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recuperation des prix:', error);
    }

    const priceMap = new Map();
    uniqueItemIds.forEach((id) => {
      priceMap.set(id, priceCache.get(id) || null);
    });

    return priceMap;
  };

  const searchRecipeIdsByInput = async (inputItemId) => {
    const normalizedItemId = Number(inputItemId);
    if (!normalizedItemId) {
      return [];
    }

    if (recipeSearchCache.has(normalizedItemId)) {
      return recipeSearchCache.get(normalizedItemId);
    }

    try {
      const response = await fetch(
        `https://api.guildwars2.com/v2/recipes/search?input=${normalizedItemId}`,
      );
      if (!response.ok) {
        throw new Error('Impossible de rechercher les recettes par ingrédient');
      }

      const recipeIds = await response.json();
      const normalizedRecipeIds = [...new Set(recipeIds.map((id) => Number(id)).filter(Boolean))];
      recipeSearchCache.set(normalizedItemId, normalizedRecipeIds);
      return normalizedRecipeIds;
    } catch (error) {
      console.error(`Erreur lors de la recherche des recettes pour l'item ${normalizedItemId}:`, error);
      recipeSearchCache.set(normalizedItemId, []);
      return [];
    }
  };

  const getCraftsForItem = async (itemId) => {
    const inputItemId = Number(itemId);
    const recipeEntry = craftRecipesByItem[String(inputItemId)];
    const staticRecipeIds = recipeEntry?.crafts
      ?.filter((craft) => craft.type === 'recipe' && craft.recipeId)
      .map((craft) => craft.recipeId) || [];

    const apiRecipeIds = await searchRecipeIdsByInput(inputItemId);
    const recipeIds = [...new Set([...apiRecipeIds, ...staticRecipeIds])];
    const apiRecipes = await getRecipesBatch(recipeIds);

    const manualCrafts = recipeEntry?.crafts
      ?.filter((craft) => craft.type === 'manual' && craft.outputItemId && craft.ingredients)
      .map((craft) => ({
        recipeId: `manual-${inputItemId}-${craft.outputItemId}`,
        outputItem: craft.outputItemId,
        outputCount: craft.outputItemCount || 1,
        type: 'Manual',
        disciplines: craft.disciplines || [],
        ingredients: craft.ingredients.map((ingredient) => ({
          item_id: ingredient.itemId,
          count: ingredient.count,
        })),
        vendorCost: craft.vendorCost || 0,
        label: craft.label || null,
        isManual: true,
      })) || [];

    const formattedApiRecipes = apiRecipes
      .filter((recipe) =>
        recipe.ingredients.some((ingredient) => ingredient.item_id === inputItemId),
      )
      .map((recipe) => ({
        recipeId: recipe.id,
        outputItem: recipe.output_item_id,
        outputCount: recipe.output_item_count || 1,
        type: recipe.type,
        disciplines: recipe.disciplines || [],
        ingredients: recipe.ingredients,
        vendorCost: recipe.vendor_cost || 0,
        label: null,
        isManual: false,
      }));

    return [...formattedApiRecipes, ...manualCrafts];
  };

  const getCraftCandidatesForItem = async (inputItemId) => {
    const crafts = await getCraftsForItem(inputItemId);

    return crafts.map((craft) => ({
      id: craft.recipeId,
      output_item_id: craft.outputItem,
      output_item_count: craft.outputCount,
      ingredients: craft.ingredients,
      vendorCost: craft.vendorCost || 0,
      label: craft.label || null,
      disciplines: craft.disciplines || [],
      isManual: craft.isManual || false,
      type: craft.type,
    }));
  };

  const evaluateCraftCandidate = (candidate, inputItemId, inputCount, priceMap) => {
    const inputIngredient = candidate.ingredients.find(
      (ingredient) => ingredient.item_id === inputItemId,
    );
    if (!inputIngredient || inputIngredient.count <= 0) {
      return null;
    }

    const craftCount = Math.floor(inputCount / inputIngredient.count);
    if (craftCount < 1) {
      return null;
    }

    let unitCost = candidate.vendorCost || 0;

    for (const ingredient of candidate.ingredients) {
      const ingredientPrice = priceMap.get(ingredient.item_id);
      if (!ingredientPrice || ingredientPrice.buy <= 0) {
        return null;
      }

      unitCost += ingredientPrice.buy * ingredient.count;
    }

    const outputPrice = priceMap.get(candidate.output_item_id);
    if (!outputPrice || outputPrice.sell <= 0) {
      return null;
    }

    const unitRevenue = Math.floor(
      outputPrice.sell * (candidate.output_item_count || 1) * TP_NET_TAX_RATE,
    );
    const unitProfit = unitRevenue - unitCost;

    return {
      inputItemId,
      recipeId: candidate.id,
      outputItemId: candidate.output_item_id,
      outputItemCount: candidate.output_item_count || 1,
      craftCount,
      unitCost,
      unitRevenue,
      unitProfit,
      totalProfit: unitProfit * craftCount,
      label: candidate.label || null,
      disciplines: candidate.disciplines || [],
    };
  };

  const getBestCraftResaleMap = async (itemCounts, inputItemIds, unlockedRecipeIds = null) => {
    const result = {};
    const candidatesByInput = new Map();
    const unlockedRecipeSet = unlockedRecipeIds instanceof Set
      ? unlockedRecipeIds
      : null;

    for (const itemId of inputItemIds) {
      const inputId = Number(itemId);
      const itemCount = Number(itemCounts[inputId] || itemCounts[String(inputId)] || 0);
      if (itemCount < 1) {
        continue;
      }

      const candidates = await getCraftCandidatesForItem(inputId);
      const filteredCandidates = unlockedRecipeSet
        ? candidates.filter((candidate) => {
          if (candidate.isManual) {
            return true;
          }

          const recipeId = Number(candidate.id);
          return Number.isInteger(recipeId) && unlockedRecipeSet.has(recipeId);
        })
        : candidates;

      if (filteredCandidates.length > 0) {
        candidatesByInput.set(inputId, { itemCount, candidates: filteredCandidates });
      }
    }

    if (candidatesByInput.size === 0) {
      return result;
    }

    const allPriceItemIds = new Set();
    candidatesByInput.forEach(({ candidates }) => {
      candidates.forEach((candidate) => {
        allPriceItemIds.add(candidate.output_item_id);
        candidate.ingredients.forEach((ingredient) => {
          allPriceItemIds.add(ingredient.item_id);
        });
      });
    });

    const priceMap = await getPricesBatch([...allPriceItemIds]);

    candidatesByInput.forEach(({ itemCount, candidates }, inputId) => {
      const evaluatedCandidates = candidates
        .map((candidate) => evaluateCraftCandidate(candidate, inputId, itemCount, priceMap))
        .filter(Boolean);

      if (evaluatedCandidates.length === 0) {
        return;
      }

      const bestCandidate = evaluatedCandidates.sort((a, b) => b.totalProfit - a.totalProfit)[0];
      if (bestCandidate.totalProfit > 0) {
        result[inputId] = bestCandidate;
      }
    });

    return result;
  };

  const getAccountCraftableRecipes = async (itemCounts, unlockedRecipeIds = null) => {
    const unlockedRecipeSet = unlockedRecipeIds instanceof Set
      ? unlockedRecipeIds
      : null;
    const candidateById = new Map();

    const availableItemIds = Object.entries(itemCounts)
      .filter(([, count]) => Number(count) > 0)
      .map(([id]) => Number(id))
      .filter(Boolean);

    for (const inputId of availableItemIds) {
      const candidates = await getCraftCandidatesForItem(inputId);

      for (const candidate of candidates) {
        if (unlockedRecipeSet && !candidate.isManual) {
          const recipeId = Number(candidate.id);
          if (!Number.isInteger(recipeId) || !unlockedRecipeSet.has(recipeId)) {
            continue;
          }
        }

        if (!candidateById.has(candidate.id)) {
          candidateById.set(candidate.id, candidate);
        }
      }
    }

    const craftableRecipes = [];

    candidateById.forEach((candidate) => {
      let maxCraftCount = Number.POSITIVE_INFINITY;

      for (const ingredient of candidate.ingredients) {
        const ownedCount = Number(
          itemCounts[ingredient.item_id] || itemCounts[String(ingredient.item_id)] || 0,
        );
        const possibleWithIngredient = Math.floor(ownedCount / ingredient.count);
        maxCraftCount = Math.min(maxCraftCount, possibleWithIngredient);
      }

      if (Number.isFinite(maxCraftCount) && maxCraftCount > 0) {
        craftableRecipes.push({
          recipeId: candidate.id,
          outputItemId: candidate.output_item_id,
          outputItemCount: candidate.output_item_count || 1,
          totalOutputCount: maxCraftCount * (candidate.output_item_count || 1),
          maxCraftCount,
          disciplines: candidate.disciplines || [],
          ingredients: candidate.ingredients,
          label: candidate.label || null,
          isManual: candidate.isManual || false,
          type: candidate.type,
        });
      }
    });

    return craftableRecipes.sort((a, b) => b.maxCraftCount - a.maxCraftCount);
  };

  const hasCraftRecipesForItem = async (itemId) => {
    const recipeEntry = craftRecipesByItem[String(itemId)];
    if (recipeEntry?.crafts?.length) {
      return true;
    }

    const recipeIds = await searchRecipeIdsByInput(itemId);
    return recipeIds.length > 0;
  };

  // Fonction pour récupérer le nom français d'un item via l'API GW2
  const getItemName = async (itemId) => {
    // Vérifier le cache d'abord
    if (itemNamesCache.has(itemId)) {
      return itemNamesCache.get(itemId);
    }

    try {
      // Récupérer les informations de l'item via l'API GW2
      const response = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemId}&lang=fr`);
      if (!response.ok) {
        throw new Error(`Item ${itemId} non trouvé`);
      }

      const itemData = await response.json();
      const itemName = itemData?.[0]?.name;

      if (!itemName) {
        throw new Error(`Nom FR introuvable pour l'item ${itemId}`);
      }

      // Mettre en cache le nom
      itemNamesCache.set(itemId, itemName);

      return itemName;
    } catch (error) {
      console.error(`Erreur lors de la récupération du nom pour l'item ${itemId}:`, error);

      // Nom par défaut en cas d'erreur
      const defaultName = `Item ${itemId}`;
      itemNamesCache.set(itemId, defaultName);

      return defaultName;
    }
  };

  // Fonction pour récupérer les noms de plusieurs items en lot
  const getItemNamesBatch = async (itemIds) => {
    const uniqueIds = [...new Set(itemIds)];
    const namePromises = uniqueIds.map((id) => getItemName(id));

    try {
      const names = await Promise.all(namePromises);
      const nameMap = new Map();

      uniqueIds.forEach((id, index) => {
        nameMap.set(id, names[index]);
      });

      return nameMap;
    } catch (error) {
      console.error('Erreur lors de la récupération des noms en lot:', error);
      return new Map();
    }
  };

  // Fonction pour récupérer l'icône officielle d'un item via l'API GW2
  const getItemIcon = async (itemId) => {
    // Vérifier le cache d'abord
    if (itemIconsCache.has(itemId)) {
      return itemIconsCache.get(itemId);
    }

    try {
      // Récupérer les informations de l'item via l'API GW2
      const response = await fetch(`https://api.guildwars2.com/v2/items/${itemId}`);
      if (!response.ok) {
        throw new Error(`Item ${itemId} non trouvé`);
      }

      const itemData = await response.json();
      const iconUrl = itemData.icon;

      // Mettre en cache l'icône
      itemIconsCache.set(itemId, iconUrl);

      return iconUrl;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'icône pour l'item ${itemId}:`, error);

      // Icône par défaut en cas d'erreur
      const defaultIcon =
        'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png';
      itemIconsCache.set(itemId, defaultIcon);

      return defaultIcon;
    }
  };

  // Fonction pour récupérer les icônes de plusieurs items en lot
  const getItemIconsBatch = async (itemIds) => {
    const uniqueIds = [...new Set(itemIds)];
    const iconPromises = uniqueIds.map((id) => getItemIcon(id));

    try {
      const icons = await Promise.all(iconPromises);
      const iconMap = new Map();

      uniqueIds.forEach((id, index) => {
        iconMap.set(id, icons[index]);
      });

      return iconMap;
    } catch (error) {
      console.error('Erreur lors de la récupération des icônes en lot:', error);
      return new Map();
    }
  };

  // Fonction pour obtenir les recommandations pour un item
  const getItemRecommendations = async (itemId, itemCounts, itemPlacements) => {
    const item =
      ITEM_DATABASE[Object.keys(ITEM_DATABASE).find((key) => ITEM_DATABASE[key].id === itemId)];

    if (!item) return null;

    const count = itemCounts[itemId] || 0;
    const recommendations = [];

    // Récupérer le nom de l'item via l'API
    const itemName = await getItemName(itemId);

    item.recommendations.forEach((rec) => {
      if (count >= (rec.minCount || 0)) {
        const hasRequiredItem = rec.requiresItem ? itemCounts[rec.requiresItem] > 0 : true;

        if (hasRequiredItem) {
          recommendations.push({
            ...rec,
            itemName: itemName,
            itemId: item.id,
            currentCount: count,
            message: rec.message(count, hasRequiredItem),
            placements: itemPlacements[itemId] || [],
          });
        }
      }
    });

    return recommendations;
  };

  // Fonction pour obtenir toutes les recommandations
  const getAllRecommendations = async (itemCounts, itemPlacements) => {
    const allRecommendations = [];

    for (const item of Object.values(ITEM_DATABASE)) {
      const recs = await getItemRecommendations(item.id, itemCounts, itemPlacements);
      if (recs && recs.length > 0) {
        allRecommendations.push(...recs);
      }
    }

    return allRecommendations;
  };

  // Fonction pour vérifier si un item a des recommandations
  const hasRecommendations = (itemId, itemCounts) => {
    const item = Object.values(ITEM_DATABASE).find((item) => item.id === itemId);
    if (!item) return false;

    const count = itemCounts[itemId] || 0;
    return item.recommendations.some((rec) => count >= (rec.minCount || 0));
  };

  // Fonction pour obtenir les items par catégorie
  const getItemsByCategory = (category) => {
    return Object.values(ITEM_DATABASE).filter((item) => item.category === category);
  };

  // Fonction pour rechercher des items par nom
  const searchItems = async (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const results = [];

    for (const item of Object.values(ITEM_DATABASE)) {
      const itemName = await getItemName(item.id);
      if (itemName.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)) {
        results.push({
          ...item,
          name: itemName,
        });
      }
    }

    return results;
  };

  // Fonction pour vider le cache des icônes et noms
  const clearCache = () => {
    itemIconsCache.clear();
    itemNamesCache.clear();
    recipeCache.clear();
    priceCache.clear();
  };

  return {
    ITEM_DATABASE,
    getItemName,
    getItemNamesBatch,
    getItemIcon,
    getItemIconsBatch,
    getItemRecommendations,
    getAllRecommendations,
    hasRecommendations,
    getItemsByCategory,
    searchItems,
    hasCraftRecipesForItem,
    getCraftsForItem,
    getBestCraftResaleMap,
    getAccountCraftableRecipes,
    clearCache,
  };
});
