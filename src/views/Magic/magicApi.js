import axios from 'axios';

/**
 * Récupère une page de cartes Magic en français depuis Scryfall.
 * @param {number} page - Le numéro de page à récupérer (1 par défaut)
 * @param {number} pageSize - Nombre de cartes à retourner (20 par défaut, max 75 sur Scryfall)
 * @param {string} setCode - (optionnel) Code de l'extension à filtrer
 * @returns {Promise<Array>} Liste des cartes (en français si dispo)
 */
export async function fetchMagicCardsFR(page = 1, pageSize = 20, setCode = null) {
  let q = `lang:fr game:arena`;
  if (setCode) {
    q += ` e:${setCode}`;
  }
  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&order=set&unique=prints&page=${page}`;
  const response = await axios.get(url);
  return response.data.data.slice(0, pageSize);
}

/**
 * Recherche avancée de cartes avec filtres multiples
 * @param {Object} filters - Objet contenant les filtres de recherche
 * @returns {Promise<Array>} Liste des cartes correspondant aux critères
 */
export async function searchCardsAdvanced(filters = {}) {
  let query = `lang:fr game:arena`;
  
  if (filters.name) query += ` name:"${filters.name}"`;
  if (filters.set) query += ` e:${filters.set}`;
  if (filters.type) query += ` t:${filters.type}`;
  if (filters.color) query += ` c:${filters.color}`;
  if (filters.cmc) query += ` cmc=${filters.cmc}`;
  if (filters.rarity) query += ` r:${filters.rarity}`;
  if (filters.keyword) query += ` o:"${filters.keyword}"`;
  
  try {
    const response = await axios.get(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&page=${filters.page || 1}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche avancée:', error);
    return [];
  }
}

/**
 * Récupère les informations détaillées d'une carte par son nom
 * @param {string} cardName - Nom de la carte
 * @returns {Promise<Object>} Informations détaillées de la carte
 */
export async function getCardByName(cardName) {
  try {
    const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la carte:', error);
    return null;
  }
}

/**
 * Récupère les prix d'une carte depuis différentes sources
 * @param {string} cardName - Nom de la carte
 * @returns {Promise<Object>} Prix de la carte depuis différentes sources
 */
export async function getCardPrices(cardName) {
  try {
    const card = await getCardByName(cardName);
    if (!card) return null;
    
    return {
      cardName: card.name,
      prices: card.prices,
      priceSources: {
        tcgplayer: card.prices?.usd,
        cardmarket: card.prices?.eur,
        cardkingdom: null, // À implémenter avec leur API
        cardhoarder: null, // À implémenter avec leur API
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    return null;
  }
}

/**
 * Analyse les statistiques d'un deck
 * @param {Array} deckCards - Liste des cartes du deck
 * @returns {Object} Statistiques détaillées du deck
 */
export function analyzeDeck(deckCards) {
  const stats = {
    totalCards: deckCards.length,
    manaCurve: {},
    colorDistribution: { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 },
    typeDistribution: {},
    rarityDistribution: {},
    averageCMC: 0,
    totalCMC: 0,
    lands: 0,
    creatures: 0,
    spells: 0
  };

  deckCards.forEach(card => {
    // Mana curve
    const cmc = card.cmc || 0;
    stats.manaCurve[cmc] = (stats.manaCurve[cmc] || 0) + 1;
    stats.totalCMC += cmc;

    // Couleurs
    if (card.colors && card.colors.length > 0) {
      card.colors.forEach(color => {
        stats.colorDistribution[color]++;
      });
    } else {
      stats.colorDistribution.C++;
    }

    // Types
    const typeLine = card.type_line || '';
    if (typeLine.includes('Land')) stats.lands++;
    if (typeLine.includes('Creature')) stats.creatures++;
    if (!typeLine.includes('Land')) stats.spells++;

    const primaryType = typeLine.split('—')[0]?.trim() || 'Autre';
    stats.typeDistribution[primaryType] = (stats.typeDistribution[primaryType] || 0) + 1;

    // Rareté
    const rarity = card.rarity || 'unknown';
    stats.rarityDistribution[rarity] = (stats.rarityDistribution[rarity] || 0) + 1;
  });

  stats.averageCMC = stats.totalCards > 0 ? (stats.totalCMC / stats.totalCards).toFixed(2) : 0;

  return stats;
}

/**
 * Vérifie la validité d'un deck selon les règles MTG
 * @param {Array} deckCards - Liste des cartes du deck
 * @returns {Object} Résultats de validation
 */
export function validateDeck(deckCards) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Vérification du nombre de cartes
  if (deckCards.length < 60) {
    validation.errors.push('Le deck doit contenir au moins 60 cartes');
    validation.isValid = false;
  }

  if (deckCards.length > 60) {
    validation.warnings.push('Le deck contient plus de 60 cartes');
  }

  // Vérification des cartes en 4 exemplaires maximum
  const cardCounts = {};
  deckCards.forEach(card => {
    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
  });

  Object.entries(cardCounts).forEach(([cardName, count]) => {
    if (count > 4) {
      validation.errors.push(`${cardName} apparaît ${count} fois (maximum 4)`);
      validation.isValid = false;
    }
  });

  // Vérification des terrains de base
  const basicLands = ['Plaine', 'Île', 'Marais', 'Montagne', 'Forêt'];
  const hasBasicLands = basicLands.some(land => 
    deckCards.some(card => card.name === land)
  );

  if (!hasBasicLands) {
    validation.warnings.push('Aucun terrain de base détecté');
  }

  return validation;
}

/**
 * Exporte un deck dans différents formats
 * @param {Array} deckCards - Liste des cartes du deck
 * @param {string} format - Format d'export ('txt', 'dek', 'cod')
 * @returns {string} Deck exporté dans le format demandé
 */
export function exportDeck(deckCards, format = 'txt') {
  const cardCounts = {};
  deckCards.forEach(card => {
    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
  });

  switch (format) {
    case 'txt':
      return Object.entries(cardCounts)
        .map(([name, count]) => `${count} ${name}`)
        .join('\n');

    case 'dek':
      return `[MTGO Deck]
${Object.entries(cardCounts)
  .map(([name, count]) => `${count} ${name}`)
  .join('\n')}`;

    case 'cod':
      return `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
  <deckname>Exported Deck</deckname>
  <zone name="main">
${Object.entries(cardCounts)
  .map(([name, count]) => `    <card number="${count}" name="${name}"/>`)
  .join('\n')}
  </zone>
</cockatrice_deck>`;

    default:
      return Object.entries(cardCounts)
        .map(([name, count]) => `${count} ${name}`)
        .join('\n');
  }
}

/**
 * Importe un deck depuis différents formats
 * @param {string} deckText - Texte du deck à importer
 * @param {string} format - Format d'import ('txt', 'dek', 'cod')
 * @returns {Promise<Array>} Liste des cartes du deck
 */
export async function importDeck(deckText, format = 'txt') {
  const cards = [];
  const lines = deckText.split('\n').filter(line => line.trim());

  try {
    for (const line of lines) {
      if (format === 'cod') {
        // Format Cockatrice XML
        const match = line.match(/<card number="(\d+)" name="([^"]+)"/);
        if (match) {
          const [, count, name] = match;
          const card = await getCardByName(name);
          if (card) {
            for (let i = 0; i < parseInt(count); i++) {
              cards.push(card);
            }
          }
        }
      } else {
        // Formats texte (txt, dek)
        const match = line.match(/^(\d+)\s+(.+)$/);
        if (match) {
          const [, count, name] = match;
          const card = await getCardByName(name);
          if (card) {
            for (let i = 0; i < parseInt(count); i++) {
              cards.push(card);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'import du deck:', error);
  }

  return cards;
}

/**
 * Génère des recommandations de cartes basées sur un deck existant
 * @param {Array} deckCards - Cartes du deck actuel
 * @returns {Promise<Array>} Cartes recommandées
 */
export async function getCardRecommendations(deckCards) {
  try {
    // Analyse du deck pour déterminer les couleurs et stratégie
    const stats = analyzeDeck(deckCards);
    const mainColors = Object.entries(stats.colorDistribution)
      .filter(([color, count]) => count > 0 && color !== 'C')
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([color]) => color);

    // Recherche de cartes populaires dans ces couleurs
    let query = `lang:fr game:arena`;
    if (mainColors.length > 0) {
      query += ` c:${mainColors.join('')}`;
    }

    const response = await axios.get(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=edhrec&unique=cards`);
    const recommendations = response.data.data || [];

    // Filtrer les cartes déjà dans le deck
    const deckCardNames = deckCards.map(card => card.name);
    return recommendations.filter(card => !deckCardNames.includes(card.name)).slice(0, 20);
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    return [];
  }
}

/**
 * Récupère la liste de toutes les extensions (sets) Magic, triées par date de sortie décroissante.
 * @returns {Promise<Array>} Liste des extensions (sets)
 */
export async function fetchAllSets() {
  const response = await axios.get('https://api.scryfall.com/sets');
  // On ne garde que les extensions principales (type:expansion, type:core, type:supplemental)
  return response.data.data
    .filter(set => ['expansion','core','supplemental'].includes(set.set_type))
    .sort((a, b) => new Date(b.released_at) - new Date(a.released_at));
} 