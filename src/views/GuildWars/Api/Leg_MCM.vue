<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const apiKey = ref(userStore.apiKey);

const triumphantArmor = ref({
  light: {
    name: 'Légère',
    rarity: 'Exotique',
    pieces: [
      { name: 'Masque', id: 78512, skin: 78506, légendaire: 78518 },
      { name: 'Épaulettes', id: 78513, skin: 78507, légendaire: 78519 },
      { name: 'Manteau', id: 78514, skin: 78508, légendaire: 78520 },
      { name: 'Gants', id: 78515, skin: 78509, légendaire: 78521 },
      { name: 'Pantalon', id: 78516, skin: 78510, légendaire: 78522 },
      { name: 'Bottes', id: 78517, skin: 78511, légendaire: 78523 }
    ]
  },
  medium: {
    name: 'Intermédiaire',
    rarity: 'Exotique',
    pieces: [
      { name: 'Masque', id: 78524, skin: 78503, légendaire: 78530 },
      { name: 'Épaulettes', id: 78525, skin: 78504, légendaire: 78531 },
      { name: 'Manteau', id: 78526, skin: 78505, légendaire: 78532 },
      { name: 'Gants', id: 78527, skin: 78506, légendaire: 78533 },
      { name: 'Pantalon', id: 78528, skin: 78507, légendaire: 78534 },
      { name: 'Bottes', id: 78529, skin: 78508, légendaire: 78535 }
    ]
  },
  heavy: {
    name: 'Lourde',
    rarity: 'Exotique',
    pieces: [
      { name: 'Heaume', id: 78536, skin: 78501, légendaire: 78542 },
      { name: 'Épaulettes', id: 78537, skin: 78502, légendaire: 78543 },
      { name: 'Plastron', id: 78538, skin: 78503, légendaire: 78544 },
      { name: 'Gantelets', id: 78539, skin: 78504, légendaire: 78545 },
      { name: 'Jambières', id: 78540, skin: 78505, légendaire: 78546 },
      { name: 'Bottes', id: 78541, skin: 78506, légendaire: 78547 }
    ]
  }
});

const unlockedSkins = ref([]);
const inventory = ref([]);

const checkArmorPieces = async () => {
  try {
    const [skinsResponse, charactersResponse, bankResponse] = await Promise.all([
      fetch(`https://api.guildwars2.com/v2/account/skins?access_token=${apiKey.value}`),
      fetch(`https://api.guildwars2.com/v2/characters?access_token=${apiKey.value}`),
      fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey.value}`)
    ]);

    const [skins, characters, bank] = await Promise.all([
      skinsResponse.json(),
      charactersResponse.json(),
      bankResponse.json()
    ]);

    const characterInventories = await Promise.all(
      characters.map(charName =>
        fetch(`https://api.guildwars2.com/v2/characters/${charName}/inventory?access_token=${apiKey.value}`)
          .then(res => res.json())
      )
    );

    unlockedSkins.value = skins;

    inventory.value = [
      ...bank.filter(item => item !== null).map(item => item.id),
      ...characterInventories.flatMap(char => 
        char.bags
          .filter(bag => bag !== null)
          .flatMap(bag => bag.inventory
            .filter(item => item !== null)
            .map(item => item.id)
          )
      )
    ];

  } catch (error) {
    console.error('Erreur lors de la vérification des pièces:', error);
  }
};

const isSkinUnlocked = (skinId, itemId) => {
  return unlockedSkins.value.includes(skinId) || inventory.value.includes(itemId);
};

onMounted(async () => {
  if (apiKey.value) {
    await checkArmorPieces();
  }
});

const selectedPieces = ref([]);
const craftingMaterials = ref({
  // commun
  memories_of_battle: { id: 71581, name: 'Souvenir de bataille', required: 750, have: 0, tradable: true, price: 0 },
  wvw_tickets: { id: 71581, name: 'Tickets d\'escarmouche', required: 1445, have: 0, tradable: false },
  Testimony_of_Jade_Heroics:{ id: 97457, name:'Témoignage de Jade Heroics',required:250,have: 0, tradable: false},
  gift_of_battle: { id: 19678, name: 'Don de bataille', required: 1, have: 0, tradable: false },
  mystic_clovers: { id: 19975, name: 'trèfles mystiques', required: 15, have: 0, tradable: false },
  
  //cube energie noir
  Dark_Energy : {id : 71994, name :'Boule d\'énergie noire' , required: 1,have:0,tradable: true,price :0},
  Matrice : {id : 73248, name :'Matrice stabilisatrice' , required: 75,have:0,tradable: true,price :0},
  
  // Don des griffes
  t6_claw: { id: 24351, name: 'Griffe vicieuse', required: 100, have: 0, tradable: true, price: 0 },
  t5_claw: { id: 24350, name: 'Grande griffe', required: 250, have: 0, tradable: true, price: 0 },
  t4_claw: { id: 24349, name: 'Griffe acérée', required: 50, have: 0, tradable: true, price: 0 },
  t3_claw: { id: 24348, name: 'Griffe', required: 50, have: 0, tradable: true, price: 0 },

  // Don des écailles
  t6_scale: { id: 24289, name: 'Écaille cuirassée', required: 100, have: 0, tradable: true, price: 0 },
  t5_scale: { id: 24288, name: 'Grande écaille', required: 250, have: 0, tradable: true, price: 0 },
  t4_scale: { id: 24287, name: 'Écaille lisse', required: 50, have: 0, tradable: true, price: 0 },
  t3_scale: { id: 24286, name: 'Écaille', required: 50, have: 0, tradable: true, price: 0 },

  // Don des os
  t6_bone: { id: 24358, name: 'Os ancien', required: 100, have: 0, tradable: true, price: 0 },
  t5_bone: { id: 24341, name: 'Grand os', required: 250, have: 0, tradable: true, price: 0 },
  t4_bone: { id: 24345, name: 'Os lourd', required: 50, have: 0, tradable: true, price: 0 },
  t3_bone: { id: 24344, name: 'Os', required: 50, have: 0, tradable: true, price: 0 },

  // Don des crocs
  t6_fang: { id: 24357, name: 'Croc vicieux', required: 100, have: 0, tradable: true, price: 0 },
  t5_fang: { id: 24356, name: 'Grand croc', required: 250, have: 0, tradable: true, price: 0 },
  t4_fang: { id: 24355, name: 'Croc acéré', required: 50, have: 0, tradable: true, price: 0 },
  t3_fang: { id: 24354, name: 'Croc', required: 50, have: 0, tradable: true, price: 0 },

  // Don du sang
  t6_blood: { id: 24295, name: 'Fiole de sang puissant', required: 100, have: 0, tradable: true, price: 0 },
  t5_blood: { id: 24294, name: 'Fiole de sang potent', required: 250, have: 0, tradable: true, price: 0 },
  t4_blood: { id: 24293, name: 'Fiole de sang épais', required: 50, have: 0, tradable: true, price: 0 },
  t3_blood: { id: 24292, name: 'Fiole de sang', required: 50, have: 0, tradable: true, price: 0 },

  // Don du venin
  t6_venom: { id: 24283, name: 'Sac de venin puissant', required: 100, have: 0, tradable: true, price: 0 },
  t5_venom: { id: 24282, name: 'Sac de venin potent', required: 250, have: 0, tradable: true, price: 0 },
  t4_venom: { id: 24281, name: 'Sac de venin plein', required: 50, have: 0, tradable: true, price: 0 },
  t3_venom: { id: 24280, name: 'Sac de venin', required: 50, have: 0, tradable: true, price: 0 },

  // Don des totems
  t6_totem: { id: 24300, name: 'Totem élaboré', required: 100, have: 0, tradable: true, price: 0 },
  t5_totem: { id: 24299, name: 'Totem intriqué', required: 250, have: 0, tradable: true, price: 0 },
  t4_totem: { id: 24363, name: 'Totem gravé', required: 50, have: 0, tradable: true, price: 0 },
  t3_totem: { id: 24298, name: 'Totem', required: 50, have: 0, tradable: true, price: 0 },

  // Don de la poussière
  t6_dust: { id: 24277, name: 'Tas de poussière cristalline', required: 100, have: 0, tradable: true, price: 0 },
  t5_dust: { id: 24276, name: 'Tas de poussière incandescente', required: 250, have: 0, tradable: true, price: 0 },
  t4_dust: { id: 24275, name: 'Tas de poussière radieuse', required: 50, have: 0, tradable: true, price: 0 },
  t3_dust: { id: 24274, name: 'Tas de poussière luminescente', required: 50, have: 0, tradable: true, price: 0 },
});
const calculateMaterials = async () => {
  try {
    const [materialsResponse, walletResponse, bankResponse] = await Promise.all([
      fetch(`https://api.guildwars2.com/v2/account/materials?access_token=${apiKey.value}`),
      fetch(`https://api.guildwars2.com/v2/account/wallet?access_token=${apiKey.value}`),
      fetch(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey.value}`)
    ]);

    const [materials, wallet, bank] = await Promise.all([
      materialsResponse.json(),
      walletResponse.json(),
      bankResponse.json()
    ]);

    await fetchPrices();

    craftingMaterials.value.memories_of_battle.have = wallet.find(w => w.id === 15 /* ID McM */)?.value || 0;
    craftingMaterials.value.wvw_tickets.have = wallet.find(w => w.id === 26 /* ID tickets */)?.value || 0;
    
    const countItem = (itemId) => {
      const bankCount = bank
        .filter(item => item && item.id === itemId)
        .reduce((sum, item) => sum + item.count, 0);
      
      const materialCount = materials
        .filter(item => item && item.id === itemId)
        .reduce((sum, item) => sum + item.count, 0);

      return bankCount + materialCount;
    };

    Object.values(craftingMaterials.value).forEach(material => {
      if (material.id) {
        material.have = countItem(material.id);
      }
    });

  } catch (error) {
    console.error('Erreur lors du calcul des matériaux:', error);
  }
};

const calculateDifference = (material) => {
  const diff = material.required * selectedPieces.value.length - material.have;
  if (diff <= 0) return { diff: 0, cost: 0 };

  return {
    diff,
    cost: material.tradable && material.price ? diff * material.price : 0
  };
};
const calculateTotalCost = () => {
  return Object.values(craftingMaterials.value)
    .reduce((total, material) => {
      const { cost } = calculateDifference(material);
      return total + cost;
    }, 0);
};

const fetchPrices = async () => {
  const tradableIds = Object.values(craftingMaterials.value)
    .filter(mat => mat.tradable)
    .map(mat => mat.id)
    .join(',');

  const response = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${tradableIds}`);
  const prices = await response.json();
  
  prices.forEach(item => {
    const material = Object.values(craftingMaterials.value).find(mat => mat.id === item.id);
    if (material) {
      material.price = item.sells.unit_price;
    }
  });
};
</script>

<template>
  <div class="triumphant-armor">
    <h2>Armures du héros triomphant</h2>
    <p>partie du site en test / codage en cours</p>

    <div class="armor-tables">
      <div v-for="(armor, type) in triumphantArmor" :key="type" class="armor-type">
        <h3>{{ armor.name }}</h3>

        <table>
          <thead>
            <tr>
              <th>Pièce</th>
              <th>Base</th>
              <th>Élevé</th>
              <th>légendaire</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="piece in armor.pieces" :key="piece.name">
              <td>{{ piece.name }}</td>
              <td :class="{ unlocked: isSkinUnlocked(piece.skin, piece.skin) }">
                {{ isSkinUnlocked(piece.skin, piece.skin) ? '✓' : '✗' }}
              </td>
              <td :class="{ unlocked: isSkinUnlocked(piece.id, piece.id) }">
                {{ isSkinUnlocked(piece.id, piece.id) ? '✓' : '✗' }}
              </td>
              <td :class="{ unlocked: isSkinUnlocked(piece.légendaire, piece.légendaire) }">
                {{ isSkinUnlocked(piece.légendaire, piece.légendaire) ? '✓' : '✗' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="legendary-calculator">
      <h3>Calculateur de craft légendaire</h3>
      
      <div class="piece-selector">
        <h4>Sélectionner les pièces à crafter :</h4>
        <div class="checkbox-grid">
          <label v-for="(armor, type) in triumphantArmor" :key="type">
            <div class="armor-group">
              <h5>{{ armor.name }}</h5>
              <div v-for="piece in armor.pieces" :key="piece.name" class="piece-checkbox">
                <input 
                  type="checkbox" 
                  :value="`${type}-${piece.name}`"
                  v-model="selectedPieces"
                >
                {{ piece.name }}
              </div>
            </div>
          </label>
        </div>
        
        <button @click="calculateMaterials" class="calculate-btn">
          Calculer les matériaux
        </button>
      </div>

      <div v-if="selectedPieces.length > 0" class="materials-table">
        <h4>Matériaux nécessaires pour {{ selectedPieces.length }} pièce(s)</h4>
        <table>
          <thead>
            <tr>
              <th>Matériau</th>
              <th>Requis</th>
              <th>Possédés</th>
              <th>Manquant</th>
              <th>Coût</th>
            </tr>
          </thead>
          <thead v-if="selectedPieces.length > 0">
            <tr class="total-row">
              <td colspan="4" class="text-right">
                <strong>Coût total :</strong>
              </td>
              <td>
                <strong>{{ (calculateTotalCost() / 10000).toFixed(2) }} po</strong>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="material in craftingMaterials" :key="material.id">
              <td>{{ material.name }}</td>
              <td>{{ material.required * selectedPieces.length }}</td>
              <td>{{ material.have }}</td>
              <td :class="{ 'negative': calculateDifference(material).diff > 0 }">
                {{ calculateDifference(material).diff }}
              </td>
              <td v-if="material.tradable && calculateDifference(material).diff > 0">
                {{ (calculateDifference(material).cost / 10000).toFixed(2) }} po
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.triumphant-armor {
  padding: 2rem;
  margin: 0;
  max-width: 100%;
}

h2 {
  color: #ffd700;
  margin-bottom: 2rem;
  text-align: left;
}

.armor-tables {
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
}

.armor-type {
  flex: 0 0 auto;
  width: 400px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

h3 {
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: left;
}

.armor-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.armor-info p {
  margin: 0.25rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th, td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

th {
  background: rgba(0, 0, 0, 0.3);
  color: #ffd700;
}

td {
  color: #fff;
}

td:first-child {
  text-align: left;
}

.unlocked {
  color: #4caf50;
}

tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 1200px) {
  .armor-tables {
    flex-direction: column;
    align-items: flex-start;
  }

  .armor-type {
    width: 100%;
    max-width: none;
  }
}

.legendary-calculator {
  margin-top: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
}

.piece-selector {
  margin-bottom: 2rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.armor-group {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 4px;
}

.piece-checkbox {
  margin: 0.5rem 0;
}

.calculate-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.calculate-btn:hover {
  background: #45a049;
}

.materials-table {
  margin-top: 2rem;
}

.negative {
  color: #ff4444;
}

.materials-table table {
  margin-top: 1rem;
  width: 100%;
}

.materials-table th,
.materials-table td {
  padding: 0.75rem;
  text-align: center;
}

.materials-table td:first-child {
  text-align: left;
}

.text-right {
  text-align: right !important;
}

.total-row {
  background: rgba(255, 215, 0, 0.1);
}

.total-row td {
  border-top: 2px solid rgba(255, 215, 0, 0.3);
}
</style>
