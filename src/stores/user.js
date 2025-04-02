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

    // Ajout des nouvelles variables pour la gestion de l'inventaire
    const itemCounts = ref({});
    const partialStacks = ref({});
    const itemPlacements = ref({});

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
        const URLDATA = 'https://data.gw2.fr/db-icons/';
        return URLDATA + itemID + '.png';
    };

    // Fonction utile de InventoryManager.js adaptée pour Vue 3
    const addItem = (item, source) => {
        if (item) {
            if (itemCounts.value[item.id]) {
                itemCounts.value[item.id] += item.count;
            } else {
                itemCounts.value[item.id] = item.count;
            }

            if (item.count % 250 > 0 && item.count > 0) {
                const itemSource = {
                    count: item.count,
                    source: source
                };
                
                if (!partialStacks.value[item.id]) {
                    partialStacks.value[item.id] = [];
                }
                partialStacks.value[item.id].push(itemSource);
            }

            const itemSource = {
                count: item.count,
                source: source
            };
            
            if (!itemPlacements.value[item.id]) {
                itemPlacements.value[item.id] = [];
            }
            itemPlacements.value[item.id].push(itemSource);
        }
    };

    // Modification de la fonction getBank pour utiliser addItem
    const getBank = async () => {
        try {
            updateApiProgress('Chargement du coffre de banque...');
            const response = await axios.get(`${APIURL}/account/bank?access_token=${apiKey.value}`);
            // Ajout du traitement des items
            response.data.forEach(item => {
                addItem(item, 'Account bank');
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching bank data:', error);
            return null;
        }
    };

    // Modification de getMaterials pour utiliser addItem
    const getMaterials = async () => {
        try {
            updateApiProgress('Chargement des matériaux...');
            const response = await axios.get(`${APIURL}/account/materials?access_token=${apiKey.value}`);
            // Ajout du traitement des matériaux
            response.data.forEach(item => {
                addItem(item, 'Material storage');
            });
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

    const getMinis = async () => {
        try {
            const response = await axios.get(`${APIURL}/account/minis?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching minis data:', error);
            return null;
        }
    };

    const getPvpFinishers = async () => {
        try {
            const response = await axios.get(`${APIURL}/account/finishers?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pvp finishers data:', error);
            return null;
        }
    };

    const getTitles = async () => {
        try {
            const response = await axios.get(`${APIURL}/account/titles?access_token=${apiKey.value}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching titles data:', error);
            return null;
        }
    };

    async function getCurrencies() {
        try {
            const response = await fetch(`${APIURL}/account/wallet?access_token=${apiKey.value}`);
            const walletData = await response.json();

            // Récupérer les détails de toutes les monnaies
            const currenciesResponse = await fetch(`${APIURL}/currencies?ids=all`);
            const currenciesDetails = await currenciesResponse.json();

            // Combiner les données du portefeuille avec les détails des monnaies
            return walletData.map(wallet => {
                const details = currenciesDetails.find(c => c.id === wallet.id);
                return {
                    id: wallet.id,
                    value: wallet.value,
                    name: details.name,
                    description: details.description,
                    icon: details.icon,
                    order: details.order
                };
            }).sort((a, b) => a.order - b.order); // Trier selon l'ordre officiel du jeu
        } catch (error) {
            console.error('Erreur lors de la récupération des monnaies:', error);
            throw error;
        }
    }

    async function getAccount() {
        try {
            const response = await fetch(`https://api.guildwars2.com/v2/account?access_token=${apiKey.value}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du compte');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur dans getAccount:', error);
            throw error;
        }
    }

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
        getCurrencyNames,
        getMinis,
        getPvpFinishers,
        getTitles,
        itemCounts,
        partialStacks,
        itemPlacements,
        addItem,
        getCurrencies,
        getAccount
    };
});
