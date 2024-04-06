<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery, useMutation } from '@tanstack/vue-query';


const user = useUserStore();

const haveApiKey = computed(() => !!user.haveApiKey);

const currentCharacter = ref(null);
const loadingMessage = ref(null);

const getCharacters = async () => {
    loadingMessage.value = 'Chargement de la liste des personnages';

    const characters = await user.getCharacters();
    if (!characters) return false;
    currentCharacter.value = characters[0];
    handleGetCharacter();
    return characters;
};

const getCharacterNames = () => {
    loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
    return user.getCharacterNames(currentCharacter.value);
};

const { isLoading: isCharactersLoading, data: charactersData } = useQuery({
    queryKey: ['characters'],
    queryFn: getCharacters,
    enabled: haveApiKey,
});

const {
    isPending: isCharacterPending,
    data: characterData,
    mutate: handleGetCharacter,
} = useMutation({
    mutationFn: () => getCharacterNames(),
});
/*const getProfessionImage = (profession) => {
    if (!profession) return '/img/default.png';

    const professions = ['Elementalist', 'Engineer', 'Guardian', 'Mesmer', 'Necromancer', 'Ranger', 'Revenant', 'Thief', 'Warrior'];

    if (professions.includes(profession)) {
        return `/img/${profession}.png`;
    } else {
        return '/img/default.png';
    }
};*/

const getIconUrl = (itemID) => {
    const URLDATA = 'https://data.gw2.fr/db-icons/'
    return URLDATA + itemID + '.png';
};
</script>
<template>

    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center"
        v-if="isCharactersLoading || isCharacterPending">
        <span class="loading loading-spinner text-primary"></span>
        <span>{{ loadingMessage }}</span>
    </div>
    <p>{{ user.displayApiKey() }}</p>
    <div class="home-container">
        <div class="home-container01" v-if="charactersData">
            <select v-model="currentCharacter" @change="handleGetCharacter" class="select select-bordered">
                <option v-for="character in charactersData" :key="character" :value="character">
                    {{ character }}
                </option>
            </select>
            <p>Race : {{ characterData.race }}</p>
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
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="characterData.equipment.find(item => item.slot === slot).icon"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container03">
            <div class="column-container">
                <ul class="horizontal-list">
                    <li v-for="slot in ['PowerCore', 'SensoryArray', 'ServiceChip']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container04">
            <div class="column-container">
                <ul class="horizontal-list">
                    <li v-for="slot in ['FishingRod', 'FishingLure']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container05">
            <div class="column-container">
                <ul>
                    <li v-for="slot in ['Helm', 'Shoulders', 'Gloves', 'Coat', 'Leggings', 'Boots']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container06">
            <div class="column-container">
                <ul>
                    <li v-for="slot in ['WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
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
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container09">
            <div class="column-container">
                <ul class="horizontal-list">
                    <li v-for="slot in ['Amulet', 'Ring1', 'Ring2']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container10">
            <div class="column-container">
                <ul class="horizontal-list">
                    <li v-for="slot in ['HelmAquatic', 'WeaponAquaticA', 'WeaponAquaticB']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container11">
            <div>
                <ul>
                    <li v-for="slot in ['Relic']" :key="slot">
                        <img v-if="characterData && characterData.equipment.find(item => item.slot === slot)"
                            :src="getIconUrl(characterData.equipment.find(item => item.slot === slot).id)"
                            :alt="characterData.equipment.find(item => item.slot === slot).id"
                            @mouseover="getItemsDetails(characterData.equipment.find(item => item.slot === slot).id)" />
                    </li>
                </ul>
            </div>
        </div>
        <div class="home-container13">
            <div>
                <ul>
                    <li v-for="slot in ['attributes']" :key="slot" class="attribute-item">
                    </li>
                </ul>
            </div>
        </div>
        <!--<img :src="getProfessionImage(characterData.profession)" alt="Profession Image" class="home-image" />
-->
    </div>
    <div class="home-container12" v-if="characterData">
        <div>
            <div class="bag-container" v-for="(bag, bagIndex) in characterData.bags" :key="bagIndex">
                <h3>sac : {{ bagIndex + 1 }}</h3>
                <ul class="item-grid">
                    <li class="item-icon" v-for="(item, itemIndex) in bag.inventory" :key="itemIndex">
                        <img v-if="item" :src="getIconUrl(item.id)" :alt="item.id"
                            @mouseover="getItemsDetails(item.id)" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <pre v-if="characterData">{{ characterData }}</pre>
</template>

<style scoped>
.flex-container {
    display: flex;
}

.flex-item {
    flex: 2;
    margin-right: 20px;
}

.flex-equipement {
    flex: 4;
    margin-right: 20px;
}

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

.home-container {
    width: 100%;
    display: flex;
    overflow: auto;
    height: 200vh;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
}

.home-container01 {
    top: 200px;
    left: 20px;
    width: auto;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: auto;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container02 {
    top: 200px;
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-self: stretch;
    align-items: flex-start;
}

.home-container03 {
    top: calc(200px + 70px);
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container04 {
    top: calc(200px + 140px);
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container05 {
    top: 200px;
    left: 265px;
    width: 70px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 390px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container06 {
    top: 600px;
    left: 265px;
    width: 70px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 270px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container07 {
    top: 200px;
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 300px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container08 {
    top: 500px;
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container09 {
    top: calc(500px + 70px);
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container10 {
    top: calc(500px + 140px);
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container11 {
    top: 200px;
    left: 820px;
    width: 70px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 70px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container12 {
    top: 900px;
    left: 20px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-image {
    top: calc(200px + 200px);
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 300px;
    position: absolute;
    object-fit: cover;
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
    border: 2px dashed rgba(120, 120, 120, 0.4);
    margin-bottom: 20px;
}

/* Media Query */
@media (max-width: 250px) {
    .home-container {
        height: auto;
    }

    .home-container01,
    .home-container02,
    .home-container03,
    .home-container04,
    .home-container05,
    .home-container06,
    .home-container07,
    .home-container08,
    .home-container09,
    .home-container10,
    .home-container11,
    .home-container12 {
        position: static;
        width: 100%;
        margin: 0;
        border: none;
        height: auto;
    }

    .item-icon {
        width: 50px;
        height: 50px;
    }
}
</style>