<template>
  <div>
    <h1>Future page MAGIC</h1>
    <!--<header>
      <nav>
        <ul>
          <li>
            <RouterLink to="/magic/deck-list">Deck List</RouterLink>
          </li>
          <li>
            <RouterLink to="/magic/collection">Collection</RouterLink>
          </li>
          
        </ul>
      </nav>
    </header>
    <main>
      <button @click="triggerFileInput" class="import-button">Importer un deck</button>
      <input type="file" ref="fileInput" @change="importDeck" style="display: none;" />
      <section>
        <h2>Mes Decks</h2>
        <ul>
          <li v-for="deck in decks" :key="deck.id">
            {{ deck.name }} - {{ deck.format }}
            <button @click="editDeck(deck.id)">Éditer</button>
            <button @click="deleteDeck(deck.id)">Supprimer</button>
          </li>
        </ul>
      </section>
      <section>
        <h2>Cartes Arena</h2>
        <ul>
          <li v-for="card in arenaCards" :key="card.id">
            <img :src="card.image_uris.small" :alt="card.name" />
            <p>{{ card.name }} - {{ card.set_name }}</p>
          </li>
        </ul>
      </section>
    </main>-->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const fileInput = ref(null);
const decks = ref([]);
const arenaCards = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const importDeck = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const deckData = e.target.result;
      console.log('Importation du deck depuis le fichier:', file.name);
      
      try {
        const response = await axios.post('/api/import-deck', {
          userId: 1,
          deckName: 'Nom du Deck', 
          deckList: deckData
        });
        console.log('Réponse du serveur:', response.data);
        fetchDecks();
      } catch (error) {
        console.error('Erreur lors de l\'importation du deck:', error);
      }
    };
    reader.readAsText(file);
  }
};

const fetchDecks = async () => {
  try {
    const response = await axios.get('/api/decks');
    decks.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des decks:', error);
  }
};

const fetchArenaCards = async () => {
  try {
    const response = await axios.get('https://api.scryfall.com/cards');
    arenaCards.value = response.data.data; 
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
  }
};

onMounted(() => {
  fetchDecks();
  fetchArenaCards();
});
</script>

<style scoped>
nav {
  background-color: #f8f9fa;
  padding: 1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

li {
  display: inline-block;
  margin: 10px;
  text-align: center;
}

a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
}

.import-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.import-button:hover {
  background-color: #0056b3;
}

img {
  max-width: 100px;
  border-radius: 8px;
}
</style>