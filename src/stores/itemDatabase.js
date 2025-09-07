import { defineStore } from 'pinia'

// Base de données des items avec recommandations (seulement les IDs et catégories)
export const ITEM_DATABASE = {
    // Matériaux de base
    CANDY_CORN: {
        id: 36041,
        category: 'Halloween',
        recommendations: [
            {
                type: 'craft',
                minCount: 1000,
                message: (count) => `Échangez contre ${Math.floor(count / 1000)}x <a href="https://wiki-fr.guildwars2.com/wiki/Agglom%C3%A9rat_de_bonbons">Agglomérat de bonbons</a>.`,
                action: 'exchange'
            }
        ]
    },

    BLOODSTONE_DUST: {
        id: 46731,
        category: 'Ascended',
        recommendations: [
            {
                type: 'consume',
                minCount: 250,
                requiresItem: 66999, // Mawdrey II
                message: (count, hasRequiredItem) => hasRequiredItem 
                    ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} poussières. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
                    : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces poussières.`,
                action: 'consume'
            }
        ]
    },

    EMPYREAL_FRAGMENT: {
        id: 46735,
        category: 'Ascended',
        recommendations: [
            {
                type: 'consume',
                minCount: 250,
                requiresItem: 66999, // Mawdrey II
                message: (count, hasRequiredItem) => hasRequiredItem 
                    ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} fragments. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
                    : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces fragments.`,
                action: 'consume'
            }
        ]
    },

    DRAGONITE_ORE: {
        id: 46733,
        category: 'Ascended',
        recommendations: [
            {
                type: 'consume',
                minCount: 250,
                requiresItem: 66999, // Mawdrey II
                message: (count, hasRequiredItem) => hasRequiredItem 
                    ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} minerais. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
                    : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour consommer ces minerais.`,
                action: 'consume'
            }
        ]
    },

    QUARTZ_CRYSTAL: {
        id: 43773,
        category: 'Crafting',
        recommendations: [
            {
                type: 'craft',
                minCount: 250,
                message: (count) => `Transformez ${Math.floor(count / 25)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Cristal_de_quartz_charg%C3%A9">Cristal de quartz chargé</a>.`,
                action: 'craft'
            }
        ]
    },

    // Essences de chance
    LUCK_ESSENCE_FINE: {
        id: 45175,
        category: 'Luck',
        recommendations: [
            {
                type: 'consume',
                minCount: 100,
                message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
                action: 'consume'
            }
        ]
    },

    LUCK_ESSENCE_MASTERWORK: {
        id: 45176,
        category: 'Luck',
        recommendations: [
            {
                type: 'consume',
                minCount: 50,
                message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
                action: 'consume'
            }
        ]
    },

    LUCK_ESSENCE_RARE: {
        id: 45177,
        category: 'Luck',
        recommendations: [
            {
                type: 'consume',
                minCount: 25,
                message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
                action: 'consume'
            }
        ]
    },

    LUCK_ESSENCE_EXOTIC: {
        id: 45178,
        category: 'Luck',
        recommendations: [
            {
                type: 'consume',
                minCount: 10,
                message: (count) => `Consommez ${count}x pour augmenter votre chance.`,
                action: 'consume'
            }
        ]
    },

    // Matériaux de craft
    ANCIENT_WOOD_LOG: {
        id: 19725,
        category: 'Wood',
        recommendations: [
            {
                type: 'craft',
                minCount: 250,
                message: (count) => `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Planche_de_bois_ancien">Planche de bois ancien</a>.`,
                action: 'craft'
            }
        ]
    },

    ORICHALCUM_ORE: {
        id: 19701,
        category: 'Ore',
        recommendations: [
            {
                type: 'craft',
                minCount: 250,
                message: (count) => `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Lingot_d%27orichalque">Lingot d'orichalque</a>.`,
                action: 'craft'
            }
        ]
    },

    GOSSAMER_SCRAP: {
        id: 19748,
        category: 'Cloth',
        recommendations: [
            {
                type: 'craft',
                minCount: 250,
                message: (count) => `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Bol_de_gaze">Bol de gaze</a>.`,
                action: 'craft'
            }
        ]
    },

    HARDENED_LEATHER_SECTION: {
        id: 19729,
        category: 'Leather',
        recommendations: [
            {
                type: 'craft',
                minCount: 250,
                message: (count) => `Transformez ${Math.floor(count / 250)}x en <a href="https://wiki-fr.guildwars2.com/wiki/Feuille_de_cuir_durci">Feuille de cuir durci</a>.`,
                action: 'craft'
            }
        ]
    }
}

// Store pour gérer les recommandations d'items
export const useItemDatabaseStore = defineStore('itemDatabase', () => {
    
    // Cache pour les icônes des items
    const itemIconsCache = new Map()
    
    // Cache pour les noms des items
    const itemNamesCache = new Map()
    
    // Fonction pour récupérer le nom officiel d'un item via l'API GW2
    const getItemName = async (itemId) => {
        // Vérifier le cache d'abord
        if (itemNamesCache.has(itemId)) {
            return itemNamesCache.get(itemId)
        }
        
        try {
            // Récupérer les informations de l'item via l'API GW2
            const response = await fetch(`https://api.guildwars2.com/v2/items/${itemId}`)
            if (!response.ok) {
                throw new Error(`Item ${itemId} non trouvé`)
            }
            
            const itemData = await response.json()
            const itemName = itemData.name
            
            // Mettre en cache le nom
            itemNamesCache.set(itemId, itemName)
            
            return itemName
        } catch (error) {
            console.error(`Erreur lors de la récupération du nom pour l'item ${itemId}:`, error)
            
            // Nom par défaut en cas d'erreur
            const defaultName = `Item ${itemId}`
            itemNamesCache.set(itemId, defaultName)
            
            return defaultName
        }
    }
    
    // Fonction pour récupérer les noms de plusieurs items en lot
    const getItemNamesBatch = async (itemIds) => {
        const uniqueIds = [...new Set(itemIds)]
        const namePromises = uniqueIds.map(id => getItemName(id))
        
        try {
            const names = await Promise.all(namePromises)
            const nameMap = new Map()
            
            uniqueIds.forEach((id, index) => {
                nameMap.set(id, names[index])
            })
            
            return nameMap
        } catch (error) {
            console.error('Erreur lors de la récupération des noms en lot:', error)
            return new Map()
        }
    }
    
    // Fonction pour récupérer l'icône officielle d'un item via l'API GW2
    const getItemIcon = async (itemId) => {
        // Vérifier le cache d'abord
        if (itemIconsCache.has(itemId)) {
            return itemIconsCache.get(itemId)
        }
        
        try {
            // Récupérer les informations de l'item via l'API GW2
            const response = await fetch(`https://api.guildwars2.com/v2/items/${itemId}`)
            if (!response.ok) {
                throw new Error(`Item ${itemId} non trouvé`)
            }
            
            const itemData = await response.json()
            const iconUrl = itemData.icon
            
            // Mettre en cache l'icône
            itemIconsCache.set(itemId, iconUrl)
            
            return iconUrl
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'icône pour l'item ${itemId}:`, error)
            
            // Icône par défaut en cas d'erreur
            const defaultIcon = 'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png'
            itemIconsCache.set(itemId, defaultIcon)
            
            return defaultIcon
        }
    }
    
    // Fonction pour récupérer les icônes de plusieurs items en lot
    const getItemIconsBatch = async (itemIds) => {
        const uniqueIds = [...new Set(itemIds)]
        const iconPromises = uniqueIds.map(id => getItemIcon(id))
        
        try {
            const icons = await Promise.all(iconPromises)
            const iconMap = new Map()
            
            uniqueIds.forEach((id, index) => {
                iconMap.set(id, icons[index])
            })
            
            return iconMap
        } catch (error) {
            console.error('Erreur lors de la récupération des icônes en lot:', error)
            return new Map()
        }
    }
    
    // Fonction pour obtenir les recommandations pour un item
    const getItemRecommendations = async (itemId, itemCounts, itemPlacements) => {
        const item = ITEM_DATABASE[Object.keys(ITEM_DATABASE).find(key => ITEM_DATABASE[key].id === itemId)]
        
        if (!item) return null
        
        const count = itemCounts[itemId] || 0
        const recommendations = []
        
        // Récupérer le nom de l'item via l'API
        const itemName = await getItemName(itemId)
        
        item.recommendations.forEach(rec => {
            if (count >= (rec.minCount || 0)) {
                const hasRequiredItem = rec.requiresItem ? (itemCounts[rec.requiresItem] > 0) : true
                
                if (hasRequiredItem) {
                    recommendations.push({
                        ...rec,
                        itemName: itemName,
                        itemId: item.id,
                        currentCount: count,
                        message: rec.message(count, hasRequiredItem),
                        placements: itemPlacements[itemId] || []
                    })
                }
            }
        })
        
        return recommendations
    }
    
    // Fonction pour obtenir toutes les recommandations
    const getAllRecommendations = async (itemCounts, itemPlacements) => {
        const allRecommendations = []
        
        for (const item of Object.values(ITEM_DATABASE)) {
            const recs = await getItemRecommendations(item.id, itemCounts, itemPlacements)
            if (recs && recs.length > 0) {
                allRecommendations.push(...recs)
            }
        }
        
        return allRecommendations
    }
    
    // Fonction pour vérifier si un item a des recommandations
    const hasRecommendations = (itemId, itemCounts) => {
        const item = Object.values(ITEM_DATABASE).find(item => item.id === itemId)
        if (!item) return false
        
        const count = itemCounts[itemId] || 0
        return item.recommendations.some(rec => count >= (rec.minCount || 0))
    }
    
    // Fonction pour obtenir les items par catégorie
    const getItemsByCategory = (category) => {
        return Object.values(ITEM_DATABASE).filter(item => item.category === category)
    }
    
    // Fonction pour rechercher des items par nom
    const searchItems = async (searchTerm) => {
        const term = searchTerm.toLowerCase()
        const results = []
        
        for (const item of Object.values(ITEM_DATABASE)) {
            const itemName = await getItemName(item.id)
            if (itemName.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)) {
                results.push({
                    ...item,
                    name: itemName
                })
            }
        }
        
        return results
    }
    
    // Fonction pour vider le cache des icônes et noms
    const clearCache = () => {
        itemIconsCache.clear()
        itemNamesCache.clear()
    }
    
    return {
        ITEM_DATABASE,
        getItemName,
        getItemNamesBatch,
        getItemIcon,
        getItemIconsBatch,
        getItemRecommendations,
        getAllRecommendations,
        hasRecommendations,
        getItemsByCategory,
        searchItems,
        clearCache
    }
}) 