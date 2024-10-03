import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const APIURL = 'https://api.guildwars2.com/v2';

export const useUserStore = defineStore('user', () => {
    const apiKey = ref(null);
    const newApiKey = ref(null);
    const haveApiKey = ref(false);
    const error = ref(null);

    const getStoredApiKey = () => {
        return apiKey.value;
    }

    const checkApiKey = async () => {
        error.value = null;
        if (!newApiKey.value) return false;
        try {
            const response = await axios.get(`${APIURL}/account?access_token=${newApiKey.value}`);

            if (!response.ok || response.data.text) {
                throw new Error('Clé API non valide');
            }
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

    const getCharacters = async () => {
        try {
            const response = await axios.get(`${APIURL}/characters?access_token=${apiKey.value}&`);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des personnages: ${error}`);
        }
    };

    const getCharacterNames = async (name) => {
        try {
            const response = await axios.get(`${APIURL}/characters/${name}?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du personnage ${name}: ${error}`);
        }
    };
    const getIconUrl = (itemID) => {
        const URLDATA = 'https://data.gw2.fr/db-icons/'
        return URLDATA + itemID + '.png';
    };
    return { getIconUrl, getStoredApiKey, initApiKey, setApiKey, getApiKey, getCharacters, getCharacterNames };
});
