<script>
import axios from 'axios';
import { getApiKey } from '@/stores/user';

const apiKey = getApiKey
export default {
    data() {
        return {
            bankItems: [],
            loading: false,
            error: null,
        };
    },
    mounted() {
        this.getBank();
    },
    methods: {
        async getBank() {
            this.loading = true;
            try {
                const response = await axios.get(`https://api.guildwars2.com/v2/account/bank?access_token=${apiKey}`);
                this.bankItems = response.data;
            } catch (error) {
                this.error = error.message || 'Une erreur est survenue lors de la récupération des données de la banque.';
            }
            this.loading = false;
        }
    }
};
</script>
<template>
    <div>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error">Erreur lors du chargement de la banque.</div>
        <div v-else>
            <div class="total-values" v-if="bankItems.length > 0">
            </div>
            <div class="item-list">
                <div class="item" v-for="item in bankItems" :key="item.id">
                    <img :src="item.icon" alt="Icone de l'item">
                    <span v-if="item.count > 1">{{ item.count }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Style de la liste des éléments de la banque */
</style>
