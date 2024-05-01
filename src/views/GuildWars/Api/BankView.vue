<script>
/*import { computed, onMounted } from 'vue';
import { getBank } from '@/stores/getALL';

const useBankData = () => {
    const bankData = computed(() => getBank());

    onMounted(async () => {
        await bankData.value;
    });

    return {
        bankData
    };
};

export default {
    setup() {
        return useBankData();
    }
};*/

</script>
<template>
    <div>
        <h1>Informations de la banque</h1>
        <div v-if="bankData">
            <ul>
                <li v-for="(item, index) in bankData" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>