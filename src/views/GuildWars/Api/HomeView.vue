<script setup>
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const newApiKey = ref('');
const userStore = useUserStore();

const setAndSaveApiKey = async () => {
    await userStore.setApiKey(newApiKey.value);
    alert('Clé API sauvegardée avec succès!');
};

onMounted(() => {
    userStore.initApiKey();
});
const placeholderText = 'Entrez une clé API avec toutes les permissions';
</script>

<template>
    <div>
        <div id="settings">
            <label for="api-key" class="label">clé API:</label>
            <input id="apiKey" name="api-key" type="text" class="input" :placeholder="placeholderText"
                v-model="newApiKey">
            <button @click="setAndSaveApiKey" id="keySubmit" class="submit-button">
                <i class="material-icons">envoyer</i>
            </button>
        </div>
        <div>
            <h1>API Guild Wars 2</h1>
            <ul class="flex gap-2">
                <li>
                    <RouterLink :to="{ name: 'GuildWarsApiCharacters' }">Personnages</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'GuildWarsApiBank' }">Banque</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'GuildWarsApiCollectibles' }">collectibles</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'GuildWarsApiMoney' }">monnais</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'GuildWarsApiUnlocks' }">Débloqué</RouterLink>
                </li>
            </ul>
            <RouterView />
        </div>
    </div>
</template>

<style scoped>
#settings {
    margin-top: 2px;
}

.label {
    font-weight: bold;
}

.input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 60%;
}

.submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
}

.submit-button i {
    font-size: 16px;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>
