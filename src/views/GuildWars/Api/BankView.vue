<script setup>
/*import { ref, onMounted } from 'vue';
import { getApiKey } from '@/stores/user';
import { getBank } from '@/stores/getALL';

const apiKey = getApiKey();
const bankData = ref(null);

const fetchBankData = async () => {
    try {
        bankData.value = await getBank(apiKey.value);
    } catch (error) {
        console.error('Error fetching bank data:', error);
    }
};

onMounted(() => {
    fetchBankData();
});*/
</script>
<template>
    <h3>banque</h3>
    <!--<pre v-if="bankData">{{ bankData }}</pre>
    <p v-else>Loading...</p>-->
</template>

<style scoped></style>
