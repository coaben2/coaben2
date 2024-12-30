import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useInventoryManagerStore = defineStore('inventoryManager', () => {
    const partialStacks = ref({});
    const itemPlacements = ref({});
    const itemCounts = ref({});
    const items = ref([]);
    const crafts = ref([]);
    const tips = ref([]);

    const addItem = (item, source) => {
        if (!item) return;

        // Gérer les compteurs d'items
        if (itemCounts.value[item.id]) {
            itemCounts.value[item.id] += item.count;
        } else {
            itemCounts.value[item.id] = item.count;
        }

        // Gérer les piles partielles
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

        // Gérer les emplacements d'items
        const itemSource = {
            count: item.count,
            source: source
        };

        if (!itemPlacements.value[item.id]) {
            itemPlacements.value[item.id] = [];
        }
        itemPlacements.value[item.id].push(itemSource);
    };

    const analyzeInventory = async (bankData, materialsData) => {
        try {
            // Réinitialiser les tableaux
            items.value = [];
            crafts.value = [];
            tips.value = [];

            // Analyser les données de la banque
            if (bankData) {
                bankData.forEach(item => {
                    if (item) addItem(item, 'Banque');
                });
            }

            // Analyser les matériaux
            if (materialsData) {
                materialsData.forEach(item => {
                    if (item) addItem(item, 'Stockage de matériaux');
                });
            }

            // Générer les conseils
            generateTips();
            // Identifier les items à empiler
            identifyStackableItems();
            // Identifier les possibilités de craft
            identifyCraftingOptions();

        } catch (error) {
            console.error('Erreur lors de l\'analyse:', error);
            return null;
        }
    };

    const generateTips = () => {
        // Logique pour générer les conseils
        tips.value = [];
        // Ajouter les conseils en fonction des items trouvés
    };

    const identifyStackableItems = () => {
        // Logique pour identifier les items qui peuvent être empilés
        items.value = [];
        // Parcourir partialStacks et ajouter les items pertinents
    };

    const identifyCraftingOptions = () => {
        // Logique pour identifier les options de craft
        crafts.value = [];
        // Analyser itemCounts pour trouver les possibilités de craft
    };

    return {
        analyzeInventory,
        items,
        crafts,
        tips
    };
}); 