<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUserStore } from '@/stores/user';

const loadingMessage = ref('Chargement des scores McM...');
const progress = ref(0);
const userWorld = ref(null);

const customWorldNames = {
  2002: "Bouche d'Abaddon", 2206: "Pierre Arboréenne", 2205: "Clarté d'Aurore", 2003: "Marée Noire",
  2201: "Désolation", 2102: "Lac Drakkar", 2207: "Lointaines Cimesfroides", 2203: "Fort Ranik",
  2204: "Gandara", 2209: "Refuge de Gunnar", 2202: "Mer de Jade", 2101: "Kodash",
  2208: "Son du Meunier", 2104: "Place de Piken", 2004: "Riveflot", 2011: "Anneau de Feu",
  2012: "Ruines de Surmia", 2013: "Repos du Marin", 2103: "Outre-Monde", 2200: "Place de Vizunah",
  2014: "Crête de Blancos", 2001: "Roc d Augure", 2006: "Baie de Baruch", 2105: "Dzagonur",
  2106: "Retraite d Elona", 2010: "Faille du Destin",
};

const simulateProgress = () => {
  let progressValue = 0;
  const progressInterval = setInterval(() => {
    if (progressValue < 100) {
      progressValue += 1;
      progress.value = progressValue;
    } else {
      clearInterval(progressInterval);
    }
  }, 600);
};

const fetchWvWData = async () => {
  try {
    simulateProgress();
    const matchesResponse = await fetch('https://api.guildwars2.com/v2/wvw/matches?region=2');
    const matchIds = await matchesResponse.json();

    const filteredMatchIds = matchIds.filter((id) =>
      ['2-1', '2-2', '2-3', '2-4', '2-5', '1-1', '1-2', '1-3', '1-4'].includes(id),
    );

    const matchDetailsPromises = filteredMatchIds.map((id) =>
      fetch(`https://api.guildwars2.com/v2/wvw/matches/${id}`).then((res) => res.json()),
    );
    const matches = await Promise.all(matchDetailsPromises);

    return matches.map((match) => ({
      id: match.id,
      tier: match.id.split('-')[1],
      scores: match.scores || { red: 0, blue: 0, green: 0 },
      victoryPoints: match.victory_points || { red: 0, blue: 0, green: 0 },
    }));
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

const { isLoading, data: matches } = useQuery({
  queryKey: ['wvw'],
  queryFn: fetchWvWData,
  refetchInterval: 60000,
});

const userStore = useUserStore();
const apiKey = ref(userStore.apiKey);

const fetchAccountWorld = async () => {
  if (!apiKey.value) {
    userWorld.value = 'Clé API manquante';
    return;
  }

  try {
    const response = await fetch('https://api.guildwars2.com/v2/account', {
      headers: { Authorization: `Bearer ${apiKey.value}` },
    });
    const data = await response.json();
    const worldId = data.world;
    userWorld.value = customWorldNames[worldId] || `Serveur inconnu (${worldId})`;
  } catch (error) {
    console.error('Erreur récupération du monde McM:', error);
    userWorld.value = 'Erreur de récupération du serveur';
  }
};

fetchAccountWorld();
</script>

<template>
  <div class="wvw-container">
    <div v-if="isLoading" class="loading-bar">
      <div class="loading-progress" :style="{ width: progress + '%' }"></div>
    </div>

    <div v-if="isLoading" class="loading">{{ loadingMessage }}</div>

    <!--<h2 v-else-if="userWorld">
      Tu représentes le serveur McM {{ userWorld }}
    </h2>-->

    <div v-if="matches && matches.length" class="matches-grid">
      <div v-for="match in matches" :key="match.id" class="match-card">
        <h3>Tier {{ match.tier }}</h3>

        <div class="world-row red">
          <!-- <span class="nom-serveur">Nom : {{ customWorldNames[match.id] }}</span> -->
          <span class="victory-points">PV: {{ match.victoryPoints.red }}</span>
        </div>

        <div class="world-row blue">
          <!-- <span class="nom-serveur">Nom : {{ customWorldNames[match.id] }}</span> -->
          <span class="victory-points">PV: {{ match.victoryPoints.blue }}</span>
        </div>

        <div class="world-row green">
          <!-- <span class="nom-serveur">Nom : {{ customWorldNames[match.id] }}</span> -->
          <span class="victory-points">PV: {{ match.victoryPoints.green }}</span>
        </div>
      </div>
    </div>

    <div v-else class="error">Aucune donnée disponible</div>
  </div>
</template>

<style scoped>
.wvw-container {
  padding: 1rem;
  max-width: max-content;
  margin: 10px;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, auto);
  writing-mode: horizontal-tb;
  direction: ltr;
  gap: 1rem;
  height: auto;
  width: auto;
}

.match-card {
  background: none;
  color: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
}

.match-card h3 {
  margin-bottom: 1rem;
  color: #ffd700;
}

.world-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
}

.world-row.red {
  background: rgba(255, 0, 0, 0.3);
}
.world-row.blue {
  background: rgba(0, 0, 255, 0.3);
}
.world-row.green {
  background: rgba(0, 255, 0, 0.3);
}

.victory-points {
  font-weight: bold;
  text-align: left;
}

.loading,
.error {
  text-align: left;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: white;
}

h2 {
  color: #ffd700;
  margin-bottom: 1rem;
  text-align: center;
}

.loading-bar {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  height: 5px;
  border-radius: 3px;
  margin-bottom: 1rem;
}

.loading-progress {
  background: #ffd700;
  height: 100%;
  width: 0;
  border-radius: 3px;
}
</style>
