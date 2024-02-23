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

const getCharacter = () => {
    loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
    return user.getCharacter(currentCharacter.value);
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
    mutationFn: () => getCharacter(),
});
</script>

<template>
    <div class="flex-container">
        <div class="flex-item" v-if="charactersData">
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
        <div class="home-container" v-if="characterData && characterData.equipment">
            <div class="home-container1">
                <div class="column-container">
                    <!-- tête-->
                    <!-- épaule-->
                    <!-- gants-->
                    <!-- torse-->
                    <!-- pantalon-->
                    <!-- botes-->
                </div>
            </div>
            <div class="home-container2">
                <div class="column-container">
                    <!-- arme1-->
                    <!-- arme2-->
                    <!-- arme3-->
                    <!-- arme4-->
                </div>
            </div>
            <div class="home-container3">
                <div class="column-container">
                    <!-- do-->
                    <!-- accesoire1-->
                    <!-- accesoire2-->
                </div>
            </div>
            <div class="home-container4">
                <div class="column-container">
                    <!-- amulette-->
                    <!-- ring1-->
                    <!-- ring2-->
                </div>
            </div>
            <img alt="image" src="" class="" />
            <div class="home-container5">
                <div class="column-container">
                    <!-- casque aqua-->
                    <!-- arme aqua1-->
                    <!-- arme aqua1-->
                </div>
            </div>
            <!-- relique-->
            <img alt="image" src="" class="" />
        </div>
        <div class="home-container6">
            <div class="column-container">
                <!--item du récolte-->
            </div>
        </div>
        <div class="home-container7">
            <div class="column-container">
                <!--item du drone-->
            </div>
        </div>
        <div class="home-container8">
            <div class="column-container">
                <!--items de pêche-->
            </div>
        </div>
        <div class="flex-container">
            <div class="flex-equipement" v-if="characterData && characterData.equipment">
                <div class="column-container">
                    <div v-for="equipmentItem in characterData.equipment" :key="equipmentItem.slot" class="column">
                        <div>
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
    </div>


    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center"
        v-if="isCharactersLoading || isCharacterPending">
        <span class="loading loading-spinner text-primary"></span>
        <span>{{ loadingMessage }}</span>
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
    width: 100%;
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

img {
    max-width: 100%;
}

.home-container {
    width: 100%;
    display: flex;
    overflow: auto;
    min-height: 100vh;
    align-items: flex-end;
    flex-direction: column;
    justify-content: center;
}

.home-container1 {
    top: 286px;
    left: 261px;
    width: 76px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 313px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container2 {
    top: 615px;
    left: 262px;
    width: 75px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 160px;
    display: flex;
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
}

.home-container3 {
    top: 613px;
    left: 592px;
    width: 228px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 47px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container4 {
    top: 665px;
    left: 589px;
    width: 234px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 48px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-image {
    top: 286px;
    left: 363px;
    width: 200px;
    height: 487px;
    position: absolute;
    object-fit: cover;
}

.home-container5 {
    top: 722px;
    left: 589px;
    width: 233px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 50px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-image1 {
    top: 730px;
    left: 831px;
    width: 36px;
    height: 32px;
    position: absolute;
    object-fit: cover;
}

.home-container6 {
    top: 615px;
    left: 52px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 40px;
    display: flex;
    position: absolute;
    align-self: stretch;
    align-items: flex-start;
}

.home-container7 {
    top: 660px;
    left: 49px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 40px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}

.home-container8 {
    top: 705px;
    left: 47px;
    width: 200px;
    border: 2px dashed rgba(120, 120, 120, 0.4);
    height: 40px;
    display: flex;
    position: absolute;
    align-items: flex-start;
}
</style>