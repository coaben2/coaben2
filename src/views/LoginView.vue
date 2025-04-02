<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

const loadingMessage = ref('Chargement des scores McM...');
const progress = ref(0); // État pour la progression de la barre

// Fonction pour simuler la progression de la barre de chargement
const simulateProgress = () => {
  let progressInterval;
  let progressValue = 0;
  progressInterval = setInterval(() => {
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
    const matchDetailsPromises = matchIds.map(id => 
      fetch(`https://api.guildwars2.com/v2/wvw/matches/${id}`).then(res => res.json())
    );
    const matches = await Promise.all(matchDetailsPromises);
    const worldsResponse = await fetch('https://api.guildwars2.com/v2/worlds?ids=all');
    const worlds = await worldsResponse.json();
    const worldsMap = Object.fromEntries(worlds.map(world => [world.id, world.name]));

    return matches
      .filter(match => {
        const tier = match.id.split('-')[1];
        return ['1', '2', '3', '4', '5'].includes(tier);
      })
      .map(match => ({
        id: match.id,
        tier: match.id.split('-')[1],
        worlds: {
          red: worldsMap[match.worlds.red] || 'Inconnu',
          blue: worldsMap[match.worlds.blue] || 'Inconnu',
          green: worldsMap[match.worlds.green] || 'Inconnu'
        },
        scores: match.scores || { red: 0, blue: 0, green: 0 },
        victoryPoints: match.victory_points || { red: 0, blue: 0, green: 0 }
      }));
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

const { isLoading, data: matches } = useQuery({
  queryKey: ['wvw'],
  queryFn: fetchWvWData,
  refetchInterval: 60000 
});
</script>

<template>
  <div class="wvw-container">
    <div v-if="isLoading" class="loading-bar">
      <div class="loading-progress" :style="{ width: progress + '%' }"></div>
    </div>

    <div v-if="isLoading" class="loading">
      {{ loadingMessage }}
    </div>

    <div v-else-if="matches && matches.length" class="matches-grid">

      <div v-for="match in matches" :key="match.id" class="match-card">
        <h3>Tier {{ match.tier }}</h3>

        <div class="world-row red">
          <span class="world-name">{{ match.worlds.red }}</span>
          <span class="world-score">{{ match.scores.red.toLocaleString() }}</span>
          <span class="victory-points">PV: {{ match.victoryPoints.red }}</span>
        </div>

        <div class="world-row blue">
          <span class="world-name">{{ match.worlds.blue }}</span>
          <span class="world-score">{{ match.scores.blue.toLocaleString() }}</span>
          <span class="victory-points">PV: {{ match.victoryPoints.blue }}</span>
        </div>

        <div class="world-row green">
          <span class="world-name">{{ match.worlds.green }}</span>
          <span class="world-score">{{ match.scores.green.toLocaleString() }}</span>
          <span class="victory-points">PV: {{ match.victoryPoints.green }}</span>
        </div>
      </div>
    </div>

    <div v-else class="error">
      Aucune donnée disponible
    </div>
  </div>
</template>

<style scoped>
.wvw-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 10px;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.match-card {
  background: black;
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
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
}

.world-row.red { background: rgba(255, 0, 0, 0.3); }
.world-row.blue { background: rgba(0, 0, 255, 0.3); }
.world-row.green { background: rgba(0, 255, 0, 0.3); }

.world-name { font-weight: bold; }
.world-score, .victory-points { text-align: left; }

.loading, .error {
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
