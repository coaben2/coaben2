<script>
/*import { ref } from 'vue';
import { getAPI } from '@/stores/getAPI';

export default {
    name: 'BankData',
    setup() {
        const bankData = ref(null);

        const fetchBankData = async () => {
            const api = getAPI();
            const data = await api.getBank();
            bankData.value = data;
        };

        return {
            fetchBankData,
            bankData
        };
    }
};*/
</script>
<template>
    <div>
        <div v-if="bankData">
            <h2>Bank Contents:</h2>
            <ul>
                <li v-for="(item, index) in bankData" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
        <div v-else>
            <p>No bank data available</p>
        </div>
    </div>
</template>