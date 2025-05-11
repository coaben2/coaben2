<template>
  <div>
    <h1>Liste des Decks</h1>
    <ul>
      <li v-for="deck in decks" :key="deck.id">
        <router-link :to="`/decks/${deck.id}`">{{ deck.name }}</router-link>
        <p>{{ deck.format }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'DeckListView',
  setup() {
    const decks = ref([]);

    onMounted(async () => {
      const response = await axios.get('/api/decks');
      decks.value = response.data.decks;
    });

    return { decks };
  },
};
</script>

<style scoped>
/* Ajoutez ici vos styles spécifiques à la vue */
</style> 