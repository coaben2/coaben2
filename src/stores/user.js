import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const APIURL = 'https://api.guildwars2.com/v2';

export const useUserStore = defineStore('user', () => {
    const apiKey = ref(null);
    const newApiKey = ref(null);
    const haveApiKey = ref(false);
    const error = ref(null);
    const apiProgress = ref(0);
    const currentApiCall = ref('');
    const totalApiCalls = ref(0);
    const completedCalls = ref(0);
    const apiCalls = ref([]);

    const updateApiProgress = (call) => {
        currentApiCall.value = call;
        completedCalls.value++;
        apiProgress.value = (completedCalls.value / totalApiCalls.value) * 100;
        apiCalls.value.push(call);
    };

    const resetApiProgress = () => {
        apiProgress.value = 0;
        currentApiCall.value = '';
        completedCalls.value = 0;
        apiCalls.value = [];
    };

    const initializeAllData = async () => {
        resetApiProgress();
        totalApiCalls.value = 7;

        try {
            await Promise.all([
                getCharacters(),
                getMaterials(),
                getBank(),
                getMoney(apiKey.value),
                getItems(),
                getCollectibles(),
                getCurrencyNames()
            ]);

            return true;
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des données:', error);
            return false;
        }
    };

    const getStoredApiKey = () => {
        return apiKey.value;
    }

    const checkApiKey = async () => {
        error.value = null;
        if (!newApiKey.value) return false;
        try {
            const response = await axios.get(`${APIURL}/account?access_token=${newApiKey.value}`);

            if (!response.status || response.data.text) {
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
            updateApiProgress('Chargement des personnages...');
            if (!apiKey.value) {
                console.error('Pas de clé API disponible');
                return false;
            }
            const response = await axios.get(`${APIURL}/characters?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Erreur détaillée:', error.response || error);
            throw new Error(`Erreur lors de la récupération des personnages: ${error}`);
        }
    };

    const getCharacterNames = async (name) => {
        try {
            updateApiProgress(`Chargement du personnage ${name}...`);
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
    const getMaterials = async () => {
        try {
            updateApiProgress('Chargement des matériaux...');
            const response = await axios.get(`${APIURL}/account/materials?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching materials data:', error);
            return null;
        }
    };

    const getItems = async () => {
        try {
            updateApiProgress('Chargement des objets...');
            const response = await axios.get(`${APIURL}/items?ids=all&access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching items data:', error);
            return null;
        }
    };

    const getRecipes = async () => {
        try {
            const response = await axios.get(`${APIURL}/recipes?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recipes data:', error);
            return null;
        }
    };

    const getSkins = async () => {
        try {
            const response = await axios.get(`${APIURL}/skins?access_token=${apiKey.value}`);;
            return response.data;
        } catch (error) {
            console.error('Error fetching skins data:', error);
            return null;
        }
    };

    const getColors = async () => {
        try {
            const response = await axios.get(`${APIURL}/colors?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching colors data:', error);
            return null;
        }
    };

    const getBank = async () => {
        try {
            updateApiProgress('Chargement du coffre de banque...');
            const response = await axios.get(`${APIURL}/account/bank?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bank data:', error);
            return null;
        }
    };
    const getMoney = async (apiKey) => {
        try {
            updateApiProgress('Chargement des monnaies...');
            const response = await axios.get(`${APIURL}/account/wallet?access_token=${apiKey}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching wallet data:', error);
            return null;
        }
    };

    const getCollectibles = async () => {
        try {
            updateApiProgress('Chargement des objets de collection...');
            const response = await axios.get(`${APIURL}/account/inventory?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching collectibles data:', error);
            return null;
        }
    };

    const getCurrencyNames = async () => {
        try {
            const response = await axios.get(`${APIURL}/currencies?ids=all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching currency names:', error);
            return null;
        }
    };

    return {
        haveApiKey,
        apiKey,
        apiProgress,
        currentApiCall,
        apiCalls,
        totalApiCalls,
        completedCalls,
        initializeAllData,
        resetApiProgress,
        getIconUrl,
        getStoredApiKey,
        initApiKey,
        setApiKey,
        getApiKey,
        getCharacters,
        getCharacterNames,
        getBank,
        getMaterials,
        getItems,
        getRecipes,
        getSkins,
        getColors,
        getMoney,
        getCollectibles,
        getCurrencyNames
    };
});
