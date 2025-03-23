import { defineStore } from 'pinia'

// Définition des constantes pour les IDs d'items
export const ITEM_IDS = {
    CANDY_CORN: 36041,
    BLOODSTONE_DUST: 46731,
    EMPYREAL_FRAGMENT: 46735,
    DRAGONITE_ORE: 46733,
    QUARTZ_CRYSTAL: 43773,
    LUCK_ESSENCE_FINE: 45175,
    LUCK_ESSENCE_MASTERWORK: 45176,
    LUCK_ESSENCE_RARE: 45177,
    LUCK_ESSENCE_EXOTIC: 45178
}

export const useItemRecommendationsStore = defineStore('itemRecommendations', {
    state: () => ({
        recommendations: [
            {
                id: ITEM_IDS.CANDY_CORN,
                minCount: 1000,
                checkCollection: true,
                icon: 'https://render.guildwars2.com/file/7AF3232140CB5DF159E4E54C2F092F69B5BD460F/499376.png',
                getMessage: (count) => `Échangez contre ${Math.floor(count / 1000)}x <a href="https://wiki-fr.guildwars2.com/wiki/Agglom%C3%A9rat_de_bonbons">Agglomérat de bonbons</a>.`
            },
            {
                id: ITEM_IDS.BLOODSTONE_DUST,
                checkCollection: true,
                icon: 'https://render.guildwars2.com/file/1468C6A946BFF0A42CBD08A70E45F8F05851FED0/631480.png',
                requiresItem: 66999, // Mawdrey II
                getMessage: (count, hasRequiredItem) => hasRequiredItem 
                    ? `Nourrissez votre <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a> pour vous débarrasser de ${count} poussières de pierre de sang. Cela prendra ${Math.ceil(0.9 * (count / 250))} jours.`
                    : `Obtenez <a href="https://wiki-fr.guildwars2.com/wiki/Mawdrey_II">Mawdrey II</a>.`
            }
        ]
    }),

    actions: {
        generateRecommendations(itemCounts, itemPlacements) {
            const recommendations = []
            
            this.recommendations.forEach(recommendation => {
                const count = itemCounts[recommendation.id] || 0
                const hasRequiredItem = recommendation.requiresItem ? (itemCounts[recommendation.requiresItem] > 0) : true
                
                if (this.shouldShowRecommendation(recommendation, count)) {
                    const html = this.buildRecommendationHtml(recommendation, count, hasRequiredItem, itemPlacements[recommendation.id])
                    recommendations.push(html)
                }
            })
            
            return recommendations.join('')
        },

        shouldShowRecommendation(recommendation, count) {
            if (recommendation.minCount && count < recommendation.minCount) {
                return false
            }
            return true
        },

        buildRecommendationHtml(recommendation, count, hasRequiredItem, placements = []) {
            const html = []
            
            html.push(`<tr><td class="icon" rowspan="${placements.length || 1}"><img src="${recommendation.icon}" />`)
            html.push(`<td class="name" rowspan="${placements.length || 1}">`)
            html.push(recommendation.getMessage(count, hasRequiredItem))
            html.push('</td>')
            
            if (placements && placements.length > 0) {
                this.addItemSourceHtml(placements, html)
            } else {
                html.push('<td class="cost">&nbsp;</td></tr>')
            }
            
            return html.join('')
        },

        addItemSourceHtml(placements, html) {
            placements.forEach((placement, index) => {
                if (index > 0) {
                    html.push('<tr>')
                }
                html.push('<td class="cost">')
                html.push(placement.count)
                html.push('</td>')
                html.push('<td class="cost">')
                html.push(placement.source)
                html.push('</td>')
                html.push('</tr>')
            })
        }
    }
}) 