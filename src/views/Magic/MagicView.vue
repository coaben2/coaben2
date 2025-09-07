<template>
  <div class="magic-cards-container">
    <MagicNavigation />
    <h1>Cartes Magic</h1>
    <div v-if="sets.length" class="sets-select-container">
      <label for="set-select">Extension :</label>
      <select id="set-select" v-model="selectedSet" @change="onSetChange">
        <option v-for="set in sets" :key="set.code" :value="set.code">
          {{ set.name }} ({{ set.code.toUpperCase() }})
        </option>
      </select>
    </div>
    <div v-if="hoveredCard" class="card-zoom-global">
      <div class="card-zoom-header">
        <span class="card-zoom-title">{{ hoveredCard.printed_name || hoveredCard.name }}</span>
        <span class="mana-cost" v-html="renderManaCost(hoveredCard.mana_cost)"></span>
      </div>
      <div
        class="oracle-text"
        v-html="renderManaInText(hoveredCard.printed_text || hoveredCard.oracle_text)"
      ></div>
      <button @click="addToDeck(hoveredCard)">Ajouter au deck</button>
    </div>
    <div class="cards-grid">
      <div v-for="card in arenaCards" :key="card.id" class="card-item" @click="selectCard(card)">
        <img :src="card.image_uris?.small" :alt="card.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchMagicCardsFR, fetchAllSets } from './magicApi';
import MagicNavigation from './MagicNavigation.vue';

const arenaCards = ref([]);
const page = ref(1);
const pageSize = 20;
const loading = ref(false);
const sets = ref([]);
const selectedSet = ref('');
const hoveredCard = ref(null);
const deck = ref([]); // ton deck local

const manaSymbolMap = {
  // Couleurs de base
  W: 'https://svgs.scryfall.io/card-symbols/W.svg',
  U: 'https://svgs.scryfall.io/card-symbols/U.svg',
  B: 'https://svgs.scryfall.io/card-symbols/B.svg',
  R: 'https://svgs.scryfall.io/card-symbols/R.svg',
  G: 'https://svgs.scryfall.io/card-symbols/G.svg',
  C: 'https://svgs.scryfall.io/card-symbols/C.svg',

  // Incolores et autres
  S: 'https://svgs.scryfall.io/card-symbols/S.svg',
  X: 'https://svgs.scryfall.io/card-symbols/X.svg',
  Y: 'https://svgs.scryfall.io/card-symbols/Y.svg',
  Z: 'https://svgs.scryfall.io/card-symbols/Z.svg',
  '∞': 'https://svgs.scryfall.io/card-symbols/infinity.svg',

  // Couleurs hybrides
  'W/U': 'https://svgs.scryfall.io/card-symbols/wu.svg',
  'W/B': 'https://svgs.scryfall.io/card-symbols/wb.svg',
  'U/B': 'https://svgs.scryfall.io/card-symbols/ub.svg',
  'U/R': 'https://svgs.scryfall.io/card-symbols/ur.svg',
  'B/R': 'https://svgs.scryfall.io/card-symbols/br.svg',
  'B/G': 'https://svgs.scryfall.io/card-symbols/bg.svg',
  'R/G': 'https://svgs.scryfall.io/card-symbols/rg.svg',
  'R/W': 'https://svgs.scryfall.io/card-symbols/rw.svg',
  'G/W': 'https://svgs.scryfall.io/card-symbols/gw.svg',
  'G/U': 'https://svgs.scryfall.io/card-symbols/gu.svg',

  // Couleurs hybrides inversées (sécurité)
  'U/W': 'https://svgs.scryfall.io/card-symbols/wu.svg',
  'B/W': 'https://svgs.scryfall.io/card-symbols/wb.svg',
  'B/U': 'https://svgs.scryfall.io/card-symbols/ub.svg',
  'R/U': 'https://svgs.scryfall.io/card-symbols/ur.svg',
  'R/B': 'https://svgs.scryfall.io/card-symbols/br.svg',
  'G/B': 'https://svgs.scryfall.io/card-symbols/bg.svg',
  'G/R': 'https://svgs.scryfall.io/card-symbols/rg.svg',
  'W/R': 'https://svgs.scryfall.io/card-symbols/rw.svg',
  'W/G': 'https://svgs.scryfall.io/card-symbols/gw.svg',
  'U/G': 'https://svgs.scryfall.io/card-symbols/gu.svg',

  // Hybrides avec couleurs + 2
  '2/W': 'https://svgs.scryfall.io/card-symbols/2w.svg',
  '2/U': 'https://svgs.scryfall.io/card-symbols/2u.svg',
  '2/B': 'https://svgs.scryfall.io/card-symbols/2b.svg',
  '2/R': 'https://svgs.scryfall.io/card-symbols/2r.svg',
  '2/G': 'https://svgs.scryfall.io/card-symbols/2g.svg',

  // Phyrexian mana
  'W/P': 'https://svgs.scryfall.io/card-symbols/wp.svg',
  'U/P': 'https://svgs.scryfall.io/card-symbols/up.svg',
  'B/P': 'https://svgs.scryfall.io/card-symbols/bp.svg',
  'R/P': 'https://svgs.scryfall.io/card-symbols/rp.svg',
  'G/P': 'https://svgs.scryfall.io/card-symbols/gp.svg',

  // Symboles d'action
  T: 'https://svgs.scryfall.io/card-symbols/t.svg',
  Q: 'https://svgs.scryfall.io/card-symbols/q.svg',

  // Autres
  P: 'https://svgs.scryfall.io/card-symbols/p.svg',
  E: 'https://svgs.scryfall.io/card-symbols/e.svg',
  A: 'https://svgs.scryfall.io/card-symbols/a.svg',
  H: 'https://svgs.scryfall.io/card-symbols/h.svg',

  // Nombres 0 à 20
  ...Object.fromEntries(
    [...Array(21).keys()].map((n) => [String(n), `https://svgs.scryfall.io/card-symbols/${n}.svg`]),
  ),
};

function renderManaCost(manaCost) {
  if (!manaCost) return '';
  const matches = manaCost.match(/\{(.*?)\}/g);
  if (!matches) return manaCost;
  return matches
    .map((symbol) => {
      const clean = symbol.replace(/[{}]/g, '');
      const url = manaSymbolMap[clean];
      if (url) {
        return `<img src="${url}" alt="${clean}" class="mana-icon" />`;
      }
      return symbol;
    })
    .join('');
}

function renderManaInText(text) {
  if (!text) return '';
  return text.replace(/\{(.*?)\}/g, (match, symbol) => {
    const url = manaSymbolMap[symbol];
    if (url) {
      return `<img src="${url}" alt="${symbol}" class="mana-icon" />`;
    }
    return match;
  });
}

const selectCard = (card) => {
  if (hoveredCard.value && hoveredCard.value.id === card.id) {
    hoveredCard.value = null;
  } else {
    hoveredCard.value = card;
  }
};

function addToDeck(card) {
  // Ici tu ajoutes la carte au deck local
  deck.value.push(card);
  // Tu peux aussi utiliser localStorage pour la persistance temporaire
  // localStorage.setItem('monDeck', JSON.stringify(deck.value));
  alert('Carte ajoutée au deck !');
}

const loadCards = async (reset = false) => {
  loading.value = true;
  if (reset) arenaCards.value = [];
  const cards = await fetchMagicCardsFR(page.value, pageSize, selectedSet.value);
  arenaCards.value.push(...cards);
  loading.value = false;
};

const handleScroll = () => {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
  if (bottom && !loading.value) {
    page.value++;
    loadCards();
  }
};

const onSetChange = () => {
  page.value = 1;
  loadCards(true);
};

onMounted(async () => {
  sets.value = await fetchAllSets();
  if (sets.value.length) {
    selectedSet.value = sets.value[0].code;
    await loadCards(true);
  }
  window.addEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.magic-cards-container {
  padding: 2rem;
  max-width: 100%;
}

.sets-select-container {
  margin-bottom: 1.5rem;
}

.sets-select-container label {
  font-weight: bold;
  margin-right: 0.5rem;
}

.sets-select-container select {
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #bbb;
  font-size: 1rem;
}

.cards-grid {
  width: 1200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 1rem;
}

.card-item {
  width: 100%;
  aspect-ratio: 65 / 91;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.card-item img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: box-shadow 0.2s ease-in-out;
}

.card-item:hover img {
  box-shadow: 0 0 12px 2px #007bff;
}

.card-zoom-global {
  width: 260px;
  height: 362px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  padding: 12px 10px 10px 10px;
  position: fixed;
  left: 1300px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.card-zoom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  min-height: 32px;
}

.card-zoom-title {
  font-size: 1.1rem;
  font-weight: bold;
  flex: 1;
  margin-right: 8px;
  white-space: normal;
  word-break: break-word;
}

.mana-cost {
  display: flex;
  align-items: center;
  min-width: 35px;
  flex-wrap: wrap;
}

:deep(.oracle-text img.mana-icon),
:deep(.mana-cost img.mana-icon) {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: 0 2px;
}
.mana-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: 0 2px;
}

.oracle-text {
  font-size: 0.95rem;
  margin-top: 10px;
  white-space: pre-line;
  word-break: break-word;
  flex: 1;
  color: #222;
  overflow-y: auto;
  max-height: calc(362px - 32px - 10px - 28px);
  padding-right: 4px;
}
</style>
