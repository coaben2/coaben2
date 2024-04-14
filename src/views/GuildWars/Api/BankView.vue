<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { getAPI } from '@/stores/user';
/*https://api.guildwars2.com/v2/account/bank?access_token=1C7DCB56-B3A6-6D48-9DEA-6ACD600C767A269BB1CB-9FC3-4AD9-943D-20BF2B54648E*/
const APIURL = 'https://api.guildwars2.com/v2';

const isLoading = ref(true);
const bankData = ref([]);

const getBank = async () => {
    try {
        const response = await axios.get(`${APIURL}/account/bank?access_token=${getAPI.apiKey.value}`);
        bankData.value = response.data;
        isLoading.value = false;
    } catch (error) {
        console.error('Error fetching bank data:', error);
        isLoading.value = false;
    }
};

onMounted(() => {
    getBank();
});
</script>

<template>
    <div>
        <div v-if="isLoading">
            Loading bank data...
        </div>
        <div v-else>
            <ul>
                <li v-for="(item, index) in bankData" :key="index">
                    <p>ID: {{ item.id }}</p>
                    <p>Count: {{ item.count }}</p>
                    <p>Binding: {{ item.binding }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
