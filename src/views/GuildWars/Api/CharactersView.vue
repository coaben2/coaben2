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
/* const getProfessionImage = (profession) => {
    if (!profession) return '/img/default.png';

    const professions = ['Elementalist', 'Engineer', 'Guardian', 'Mesmer', 'Necromancer', 'Ranger', 'Revenant', 'Thief', 'Warrior'];

    if (professions.includes(profession)) {
        return `/img/${profession}.png`;
    } else {
        return '/img/default.png';
    }
}; */

</script>
<template>
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center"
        v-if="isCharactersLoading || isCharacterPending">
        <span class="loading loading-spinner text-primary"></span>
        <span>{{ loadingMessage }}</span>
    </div>
    <div class="home-container">
        <div class="home-container01" v-if="charactersData">
            <select v-model="currentCharacter" @change="handleGetCharacter" class="select select-bordered">
                <option v-for="character in charactersData" :key="character" :value="character">
                    {{ character }}
                </option>
            </select>
            <p>Race: {{ characterData.race }}</p>
            <p>genre: {{ characterData.gender }}</p>
            <p>Profession: {{ characterData.profession }}</p>
            <p>niveau: {{ characterData.level }}</p>
            <H3 class="mb-6">métiers :</H3>
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
                <!--item du récolte-->
                <!--Sickle-->
                <!--Axe-->
                <!--Pick-->
            </div>
        </div>
        <div class="home-container03">
            <div class="column-container">
                <!--item du drone-->
                <!--PowerCore-->
                <!--SensoryArray-->
                <!--ServiceChip-->
            </div>
        </div>
        <div class="home-container04">
            <div class="column-container">
                <!--items de pêche-->
                <!--FishingRod-->
                <!--FishingLure-->
            </div>
        </div>
        <div class="home-container05">
            <div class="column-container">
                <!-- tête Helm-->
                <!-- épaule Shoulders-->
                <!-- gants Gloves-->
                <!-- torse Coat-->
                <!-- pantalon Leggings-->
                <!-- bottes Boots-->
            </div>
        </div>
        <div class="home-container06">
            <div class="column-container">
                <!-- arme1 WeaponA1-->
                <!-- arme2 WeaponA2-->
                <!-- arme3 WeaponB1-->
                <!-- arme4 WeaponB2-->
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
                <!-- do Backpack-->
                <!-- accesoire1 Accessory1-->
                <!-- accesoire2 Accessory2-->
            </div>
        </div>
        <div class="home-container09">
            <div class="column-container">
                <!-- amulette Amulet-->
                <!-- anneau1 Ring1-->
                <!-- anneau2 Ring2-->
            </div>
        </div>
        <div class="home-container10">
            <div class="column-container">
                <!-- casque aqua HelmAquatic-->
                <!-- arme aqua1 WeaponAquaticA-->
                <!-- arme aqua1 WeaponAquaticB-->
            </div>
        </div>
        <div class="home-container11">
            <div>
                <!-- relique-->
                <!--Relic-->
            </div>
        </div>
        <!--visuel de la classe jouée-->

        <!--<img :src="getProfessionImage(characterData.profession)" alt="Profession Image" class="home-image" />-->

    </div>

    <!-- code fonctionne pour les item-->
    <div class="flex-container">
        <div class="flex-equipement" v-if="characterData && characterData.equipment">
            <div class="column-container">
                <div v-for="equipmentItem in characterData.equipment" :key="equipmentItem.slot" class="column">
                    <div class="item-container">
                        <img :src="'https://v2.lebusmagique.fr/img/api/items/' + equipmentItem.id + '.png'"
                            :alt="equipmentItem.id" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="flex-item" v-if="characterData && characterData.bags">
        <h2>sac :</h2>
        <div v-for="bags in characterData.bags" :key="bags.id">
            <h3>{{ bags.slot }}</h3>
            <ul>
                <li>{{ bags.id }}</li>
                <li>
                    <ul>
                        <li v-for="item in bags.contents" :key="item.id">
                            {{ item.id }}
                        </li>
                    </ul>
                </li>
            </ul>
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

.home-container {
    width: 100%;
    display: flex;
    overflow: auto;
    min-height: 100vh;
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
    height: 40px;
    display: flex;
    position: absolute;
    align-self: stretch;
    align-items: flex-start;
}

.home-container03 {
    top: calc(200px + 45px);
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 40px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container04 {
    top: calc(200px + 90px);
    left: 350px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 41px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container05 {
    top: 200px;
    left: 265px;
    width: 75px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 300px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container06 {
    top: 505px;
    left: 265px;
    width: 75px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 160px;
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
    height: 47px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container09 {
    top: calc(500px + 40px);
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 48px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container10 {
    top: calc(500px + 90px);
    left: 560px;
    width: 250px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 50px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container11 {
    top: 200px;
    left: 820px;
    width: 50px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 50px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-image {
    top: calc(200px + 140px);
    left: 350px;
    width: 200px;
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
</style>