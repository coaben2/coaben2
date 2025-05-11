<template>
  <div>
    <h1>Détails du Deck</h1>
    <div v-if="deck">
      <h2>{{ deck.name }}</h2>
      <p>Format: {{ deck.format }}</p>
      <p>Description: {{ deck.description }}</p>

      <h3>Main Deck</h3>
      <ul>
        <li v-for="card in mainDeck" :key="card.id">
          {{ card.name }} - {{ card.quantity }}
        </li>
      </ul>

      <h3>Sideboard</h3>
      <ul>
        <li v-for="card in sideboard" :key="card.id">
          {{ card.name }} - {{ card.quantity }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
  name: 'DeckDetailView',
  setup() {
    const route = useRoute();
    const deck = ref(null);
    const mainDeck = ref([]);
    const sideboard = ref([]);

    onMounted(async () => {
      const response = await axios.get(`/api/decks/${route.params.id}`);
      deck.value = response.data.deck;
      mainDeck.value = response.data.mainDeck;
      sideboard.value = response.data.sideboard;
    });

    return { deck, mainDeck, sideboard };
  },
};
</script>

<style scoped>
/* Ajoutez ici vos styles spécifiques à la vue */
</style> 