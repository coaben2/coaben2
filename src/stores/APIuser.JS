import { ref } from 'vue';
import { defineStore } from 'pinia';
import GW2API from 'gw2api-client';

const api = new GW2API();

export const useUserStore = defineStore('user', () => {
    const apiKey = ref(null);
    const newApiKey = ref(null);
    const haveApiKey = ref(false);
    const error = ref(null);

    const checkApiKey = async () => {
        error.value = null;
        if (!newApiKey.value.length) return;
        try {
            await api.authenticate(newApiKey.value);
            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        }
    };

    const saveApiKey = () => {
        localStorage.setItem('gw2-api-key', newApiKey.value);
        apiKey.value = newApiKey.value;
        haveApiKey.value = true;
    };

    const initApiKey = () => {
        const localApiKey = localStorage.getItem('gw2-api-key');
        if (localApiKey) {
            apiKey.value = localApiKey;
            haveApiKey.value = true;
        }
    };

    const setApiKey = async (token) => {
        newApiKey.value = token;
        if (await checkApiKey()) {
            saveApiKey();
        }
    };

    const getApiKey = () => {
        return apiKey.value;
    };

    const displayApiKey = () => {
        return apiKey.value ? apiKey.value : "Aucune clé API enregistrée";
    };

    const deleteApiKey = () => {
        localStorage.removeItem('gw2-api-key');
        apiKey.value = null;
        haveApiKey.value = false;
    };

    const getCharacters = async () => {
        try {
            const characters = await api.characters();
            return characters;
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la récupération des personnages:', error);
            throw new Error('Une erreur s\'est produite lors de la récupération des personnages');
        }
    };

    initApiKey();

    return { displayApiKey, deleteApiKey, apiKey, newApiKey, setApiKey, haveApiKey, error, getApiKey, getCharacters };
});
