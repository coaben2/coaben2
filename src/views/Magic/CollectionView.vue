<template>
  <div>
    <h1>Collection de Cartes</h1>
    <ul>
      <li v-for="card in cards" :key="card.id">
        <img :src="card.image_url" :alt="card.name" width="100" />
        <p>{{ card.name }} - {{ card.set }}</p>
        <p>{{ card.oracle_text }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CollectionView',
  setup() {
    const cards = ref([]);

    onMounted(async () => {
      const response = await axios.get('/api/cards');
      cards.value = response.data.cards;
    });

    return { cards };
  },
};
</script>

<style scoped>

</style> 