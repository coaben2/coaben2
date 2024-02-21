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
        <!-- modif visuel voir si on peut faire comme dans le jeux les 6 pieces de stuf / les 4 armes-->
        <!-- le do les 2 accessoires-->
        <!-- amulette les 2 anneaux-->
        <!-- la relique-->
        <!--item de récoltes-->
        <!--item du drone-->
        <!--items de pêche-->
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
</style>