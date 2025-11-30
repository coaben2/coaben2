<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery, useMutation } from '@tanstack/vue-query';

const user = useUserStore();

const haveApiKey = computed(() => !!user.apiKey);

const currentCharacter = ref(null);
const loadingMessage = ref(null);

const getCharacters = async () => {
  loadingMessage.value = 'Chargement de la liste des personnages';

  try {
    const characters = await user.getCharacters();
    if (!characters) {
      return false;
    }
    currentCharacter.value = characters[0];
    handleGetCharacter();
    return characters;
  } catch (error) {
    return false;
  }
};

const getCharacterNames = () => {
  loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
  const result = user.getCharacterNames(currentCharacter.value);
  return result;
};

const { isLoading: isCharactersLoading, data: charactersData } = useQuery({
  queryKey: ['characters'],
  queryFn: getCharacters,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5,
  /*onError: (error) => {
    console.error('Erreur lors de la requête:', error);
  },*/
});

const {
  isPending: isCharacterPending,
  data: characterData,
  mutate: handleGetCharacter,
} = useMutation({
  mutationFn: () => getCharacterNames(),
});

const getIconUrl = (itemID) => {
  const URLDATA = 'https://data.gw2.fr/db-icons/';
  return URLDATA + itemID + '.png';
};

// const getItemsDetails = async (itemId, event) => {
//   try {
//     const response = await fetch(`http://api.guildwars2.com/v2/items/${itemId}`);
//     const data = await response.json();

//     const itemDetailsDiv = document.createElement('div');
//     itemDetailsDiv.id = 'item-details';
//     itemDetailsDiv.style.position = 'fixed';
//     itemDetailsDiv.style.top = '50%';
//     itemDetailsDiv.style.left = '50%';
//     itemDetailsDiv.style.transform = 'translate(-50%, -50%)';
//     itemDetailsDiv.style.zIndex = '9999';
//     itemDetailsDiv.style.background = 'white';
//     itemDetailsDiv.style.padding = '20px';

//     const keysToDisplay = ['name', 'icon', 'rarity', 'id'];

//     keysToDisplay.sort();

//     const ul = document.createElement('ul');
//     ul.style.listStyleType = 'none';
//     ul.style.padding = '0';

//     for (const key of keysToDisplay) {
//       const li = document.createElement('li');
//       li.textContent = `${key}: ${data[key]}`;
//       ul.appendChild(li);
//     }

//     itemDetailsDiv.appendChild(ul);

//     document.body.appendChild(itemDetailsDiv);

//     itemDetailsDiv.addEventListener('mouseout', hideItemDetails);

//     itemDetailsDiv.addEventListener('mouseover', (event) => {
//       event.stopPropagation();
//     });

//     itemDetailsDiv.style.top = `${event.clientY}px`;
//     itemDetailsDiv.style.left = `${event.clientX}px`;
//   } catch (error) {
//     console.error(
//       "Une erreur est survenue lors de la récupération des détails de l'objet: ",
//       error,
//     );
//   }
// };
const hideItemDetails = () => {
  const itemDetailsDiv = document.getElementById('item-details');
  if (itemDetailsDiv) {
    itemDetailsDiv.remove();
  }
};

const getProfessionImage = (profession) => {
  return new URL(`/public/img/${profession}.png`, import.meta.url).href;
};

// Reset la progression quand on change de page
onUnmounted(() => {
  user.resetApiProgress();
});
</script>
<template>
  <div>
    <div
      class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center"
      v-if="isCharactersLoading || isCharacterPending"
    >
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>
    <div class="home-container">
      <div class="home-container01" v-if="charactersData">
        <select
          v-model="currentCharacter"
          @change="handleGetCharacter"
          class="select select-bordered"
        >
          <option v-for="character in charactersData" :key="character" :value="character">
            {{ character }}
          </option>
        </select>
        <p>Races : {{ characterData.race }}</p>
        <p>genre: {{ characterData.gender }}</p>
        <p>Profession: {{ characterData.profession }}</p>
        <p>niveau: {{ characterData.level }}</p>
        <h3 class="mb-6">métiers :</h3>
        <table class="bordered-table">
          <thead>
            <tr>
              <th>Métier</th>
              <th>Niveau</th>
              <th>état</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="craftingItem in characterData.crafting" :key="craftingItem.discipline">
              <td>{{ craftingItem.discipline }}</td>
              <td>{{ craftingItem.rating }}</td>
              <td>{{ craftingItem.active ? 'Actif' : 'Inactif' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="home-container02">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['Sickle', 'Axe', 'Pick']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="characterData.equipment.find((item) => item.slot === slot).icon"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container03">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['PowerCore', 'SensoryArray', 'ServiceChip']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container04">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['FishingRod', 'FishingLure']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container05">
        <div class="column-container">
          <ul>
            <li
              v-for="slot in ['Helm', 'Shoulders', 'Gloves', 'Coat', 'Leggings', 'Boots']"
              :key="slot"
            >
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container06">
        <div class="column-container">
          <ul>
            <li v-for="slot in ['WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container07">
        <div class="column-container">
          <!-- stat-->
          <!--Power-->
          <!--Precision-->
          <!--Toughness-->
          <!--Vitality-->
          <!--Condition Damage-->
          <!--Condition Duration-->
          <!--Healing-->
          <!--BoonDuration-->
        </div>
      </div>
      <div class="home-container08">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['Backpack', 'Accessory1', 'Accessory2']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container09">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['Amulet', 'Ring1', 'Ring2']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container10">
        <div class="column-container">
          <ul class="horizontal-list">
            <li v-for="slot in ['HelmAquatic', 'WeaponAquaticA', 'WeaponAquaticB']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container11">
        <div>
          <ul>
            <li v-for="slot in ['Relic']" :key="slot">
              <img
                v-if="characterData && characterData.equipment.find((item) => item.slot === slot)"
                :src="getIconUrl(characterData.equipment.find((item) => item.slot === slot).id)"
                :alt="characterData.equipment.find((item) => item.slot === slot).id"
                @mouseover="
                  getItemsDetails(
                    characterData.equipment.find((item) => item.slot === slot).id,
                    $event,
                  )
                "
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="home-container13">
        <img :src="getProfessionImage(characterData.profession)" :alt="characterData.profession" />
      </div>
    </div>
    <div class="home-container12" v-if="characterData">
      <div>
        <div class="bag-container" v-for="(bag, bagIndex) in characterData.bags" :key="bagIndex">
          <h3>sac : {{ bagIndex + 1 }}</h3>
          <ul class="item-grid">
            <li class="item-icon" v-for="(item, itemIndex) in bag.inventory" :key="itemIndex">
              <img
                v-if="item"
                :src="getIconUrl(item.id)"
                :alt="item.id"
                @mouseover="getItemsDetails(characterData.equipment.find(item.id), $event)"
                @mouseout="hideItemDetails"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bordered-table {
  border-collapse: collapse;
  width: 200px;
}

.bordered-table th,
.bordered-table td {
  border: 1px solid black;

  padding: 6px;
  text-align: left;
}

.column-container {
  display: flex;
  flex-wrap: wrap;
}

.column {
  width: 25%;
  box-sizing: border-box;
  padding: 5px;
}

.horizontal-list {
  display: flex;
  list-style: none;
  padding: 0;
}

.horizontal-list li {
  margin-right: 1px;
}

:root {
  --container-size: 70px;
}

.home-container {
  width: max-content;
  display: grid;
  grid-template-areas:
    'un un un cinq deux deux deux sept sept sept onze'
    'un un un cinq trois trois trois sept sept sept .'
    'un un un cinq quatre quatre quatre sept sept sept .'
    'un un un cinq douze douze douze sept sept sept .'
    'un un un cinq douze douze douze sept sept sept .'
    'un un un cinq douze douze douze sept sept sept .'
    'un un un six douze douze douze huit huit huit .'
    'un un un six douze douze douze neuf neuf neuf .'
    'un un un six douze douze douze dix dix dix .'
    'un un un six douze douze douze . . . .'
    'sac sac sac sac sac sac sac sac sac sac sac';
  grid-template-columns: repeat(11, var(--container-size));
  grid-template-rows: repeat(10, var(--container-size));
}

.home-container > div {
  border: 2px dashed rgba(0, 0, 0, 0.5);
  position: relative;
  min-height: 50px;
  background: transparent;
}

.home-container01 {
  grid-area: un;
}

.home-container02 {
  grid-area: deux;
  display: flex;
  gap: 2rem;
}

.home-container03 {
  grid-area: trois;
  display: flex;
  gap: 2rem;
}

.home-container04 {
  grid-area: quatre;
  display: flex;
  gap: 2rem;
}

.home-container05 {
  grid-area: cinq;
}

.home-container06 {
  grid-area: six;
}

.home-container07 {
  grid-area: sept;
}

.home-container08 {
  grid-area: huit;
  display: flex;
  gap: 2rem;
}

.home-container09 {
  grid-area: neuf;
  display: flex;
  gap: 2rem;
}

.home-container10 {
  grid-area: dix;
  display: flex;
  gap: 2rem;
}

.home-container11 {
  grid-area: onze;
}

.home-container12 {
  width: max-content;
  grid-area: sac;
}

.home-container13 {
  grid-area: douze;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container13 img {
  max-width: 100%;
  height: auto;
  max-height: 200px;
}

.item-info {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid black;
  padding: 5px;
  z-index: 999;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(10, auto);
  grid-gap: 10px;
  list-style: none;
}

.item-grid li {
  display: flex;
  justify-content: center;
}

.item-icon {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.bag-container {
  display: block;
  border: 2px dashed rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}
</style>
