<script setup>
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUserStore } from '@/stores/user';

const loadingMessage = ref('Chargement des scores McM...');
const progress = ref(0);
const userWorldId = ref(null);
const userWvwTeamId = ref(null);
const userWorldError = ref('');
const colorLabels = {
  red: 'Rouge',
  blue: 'Bleu',
  green: 'Vert',
};
const tierLabels = {
  1: 'Un',
  2: 'Deux',
  3: 'Trois',
  4: 'Quatre',
  5: 'Cinq',
};
const regionLabels = {
  1: 'Amérique',
  2: 'Europe',
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
      allWorlds: match.all_worlds || { red: [], blue: [], green: [] },
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

const usMatches = computed(() => matches.value?.filter((m) => m.id.startsWith('1-')) ?? []);
const euMatches = computed(() => matches.value?.filter((m) => m.id.startsWith('2-')) ?? []);

const userWvwPlacement = computed(() => {
  const identifier = Number(userWvwTeamId.value || userWorldId.value || 0);

  if (!identifier || !matches.value?.length) {
    return null;
  }

  for (const match of matches.value) {
    for (const color of ['red', 'blue', 'green']) {
      const worldsInColor = (match.allWorlds?.[color] || []).map(Number);
      if (worldsInColor.includes(identifier)) {
        const regionCode = match.id.split('-')[0];
        return {
          tier: match.tier,
          tierLabel: tierLabels[match.tier] || match.tier,
          color,
          colorLabel: colorLabels[color],
          regionLabel: regionLabels[regionCode] || 'Inconnue',
        };
      }
    }
  }

  return null;
});

const userStore = useUserStore();
const apiKey = ref(userStore.apiKey);

const fetchAccountWorld = async () => {
  if (!apiKey.value) {
    userWorldError.value = 'Clé API manquante';
    return;
  }

  try {
    const accountUrl = new URL('https://api.guildwars2.com/v2/account');
    accountUrl.searchParams.set('access_token', apiKey.value);
    const accountWvwUrl = new URL('https://api.guildwars2.com/v2/account/wvw');
    accountWvwUrl.searchParams.set('access_token', apiKey.value);

    const [response, responseWvw] = await Promise.all([
      fetch(accountUrl.toString()),
      fetch(accountWvwUrl.toString()),
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    userWorldId.value = Number(data.world) || null;

    if (responseWvw.ok) {
      const wvwData = await responseWvw.json();
      userWvwTeamId.value = Number(wvwData.team) || null;
    } else {
      userWvwTeamId.value = null;
    }

    userWorldError.value = '';
  } catch (error) {
    console.error('Erreur récupération du monde McM:', error);
    userWorldError.value = 'Erreur de récupération du serveur';
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

    <h2 v-if="userWvwPlacement" class="user-placement-title">Ton placement McM</h2>
    <div v-if="userWvwPlacement" class="user-placement" :class="userWvwPlacement.color">
      Zone {{ userWvwPlacement.regionLabel }} - Équipe {{ userWvwPlacement.colorLabel }} - Tier
      {{ userWvwPlacement.tierLabel }}
    </div>
    <h2 v-else-if="userWorldError">{{ userWorldError }}</h2>
    <!-- Matches US -->
    <div v-if="usMatches.length" class="region-section">
      <h2>Amérique</h2>
      <div class="matches-grid">
        <div v-for="match in usMatches" :key="match.id" class="match-card">
          <h3>Tier {{ match.tier }}</h3>
          <div class="world-row red">
            <span class="victory-points">PV: {{ match.victoryPoints.red }}</span>
          </div>
          <div class="world-row blue">
            <span class="victory-points">PV: {{ match.victoryPoints.blue }}</span>
          </div>
          <div class="world-row green">
            <span class="victory-points">PV: {{ match.victoryPoints.green }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Matches EU -->
    <div v-if="euMatches.length" class="region-section">
      <h2>Europe</h2>
      <div class="matches-grid">
        <div v-for="match in euMatches" :key="match.id" class="match-card">
          <h3>Tier {{ match.tier }}</h3>
          <div class="world-row red">
            <span class="victory-points">PV: {{ match.victoryPoints.red }}</span>
          </div>
          <div class="world-row blue">
            <span class="victory-points">PV: {{ match.victoryPoints.blue }}</span>
          </div>
          <div class="world-row green">
            <span class="victory-points">PV: {{ match.victoryPoints.green }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!usMatches.length && !euMatches.length" class="error">Aucune donnée disponible</div>
    <div class="fond-page">
      <h2>Abréviation et mot clé en MCM</h2>
      <h2>Lexique Général & Technique</h2>
      <dl>
        <dt>AoE (Area of Effect)</dt>
        <dd>Zone d'effet d'un sort.</dd>

        <dt>Bomb / Bombing</dt>
        <dd>
          Action de placer un maximum de compétences à effets de zone (AoE), généralement sur le tag
          du lead, pour faire tomber les adversaires au sol. Souvent en référence à la 5ᵉ compétence
          d’ombre du Fléau.
        </dd>

        <dt>Borderlands</dt>
        <dd>Territoires frontaliers.</dd>

        <dt>Bulle</dt>
        <dd>
          Compétence n°5 de la catapulte et/ou compétence n°3 du générateur de bouclier. Désigne
          aussi les <strong>Vents de désenchantement</strong> (élite du Brisesort) qui bloque les
          projectiles et supprime les avantages. Le joueur est alors appelé
          <span class="highlight">"war bulle"</span>.
        </dd>

        <dt>Buff</dt>
        <dd>Avantage temporaire conféré à un personnage.</dd>

        <dt>Camp de Supply</dt>
        <dd>Camp de ravitaillement.</dd>

        <dt>CBE / EBG</dt>
        <dd>Carte Champs de Bataille Éternels.</dd>

        <dt>CC (Crowd Control)</dt>
        <dd>
          Sorts de contrôle (givre, boitement, etc.). Permet de faire tomber la barre de défiance
          (barre bleue).
        </dd>

        <dt>CD (Cooldown)</dt>
        <dd>Temps de recharge avant qu'un sort soit de nouveau disponible.</dd>

        <dt>Dodge</dt>
        <dd>Esquive.</dd>

        <dt>Down</dt>
        <dd>Adversaire au sol. On dit "achever", "valider" ou "faire les achevs".</dd>

        <dt>Escarmouche</dt>
        <dd>Période de deux heures au sein d’un match-up.</dd>

        <dt>Home Map</dt>
        <dd>Territoire frontalier appartenant à votre propre serveur.</dd>

        <dt>KT (Karma Train)</dt>
        <dd>
          Action de tourner sur une carte pour capturer et réinitialiser les structures adverses en
          boucle.
        </dd>

        <dt>Lead / Commandant</dt>
        <dd>
          Joueur avec un tag (flèche bleue) qui dirige le groupe. On parle de
          <span class="highlight">Lead PU</span> pour celui qui regroupe les joueurs sans guilde.
        </dd>

        <dt>Multi Map</dt>
        <dd>Se dit d'un bus qui change de carte selon les besoins spécifiques de chacune.</dd>

        <dt>Match-up (MU)</dt>
        <dd>Période de référence du McM d'une durée d'une semaine.</dd>

        <dt>P1 / Out</dt>
        <dd>Première muraille d'une structure.</dd>

        <dt>P2 / Inner</dt>
        <dd>Deuxième muraille d'une structure.</dd>

        <dt>PPK / PPT</dt>
        <dd>
          <strong>PPK :</strong> Points par Kill. <strong>PPT :</strong> Points par Tick (score
          généré toutes les 5 min par les structures tenues).
        </dd>

        <dt>PU (Pick Up)</dt>
        <dd>Joueur n'appartenant à aucune structure ou guilde organisée présente.</dd>

        <dt>Refresh</dt>
        <dd>Action d'utiliser une arme de siège pour remettre son compteur d'expiration à zéro.</dd>

        <dt>TDS</dt>
        <dd>Tour du Spawn (la première tour en sortant du point de départ).</dd>

        <dt>Tier (T0 à T3)</dt>
        <dd>Niveau de développement d'une structure (T0: neutre, T3: fortifiée).</dd>

        <dt>WP (Waypoint)</dt>
        <dd>Point de passage / téléportation.</dd>
      </dl>

      <h2>Ordres et Expressions en Combat</h2>
      <dl>
        <dt>"Back !"</dt>
        <dd>Faire demi-tour immédiatement.</dd>

        <dt>"Buff / Explo"</dt>
        <dd>
          Demande de poser des zones (Feu pour la puissance, Air pour la rapidité) et d'y utiliser
          des coups de grâce explosifs.
        </dd>

        <dt>"Clean TS/Discord"</dt>
        <dd>Demande de silence radio pour écouter les instructions du lead.</dd>

        <dt>"Double Esquive !"</dt>
        <dd>Réaliser deux esquives consécutives pour traverser une zone dangereuse.</dd>

        <dt>"Empo"</dt>
        <dd>Compétence 4 du bâton du Gardien (Empower) pour monter le pouvoir du groupe.</dd>

        <dt>"Fufu"</dt>
        <dd>Furtivité collective (souvent via une zone de fumée combinée à une explosion).</dd>

        <dt>"INC" (Incoming)</dt>
        <dd>Un groupe ennemi arrive sur votre position.</dd>

        <dt>"Pas de Tag / Croix"</dt>
        <dd>
          Ne pas attaquer pour ne pas faire apparaître les épées oranges sur la carte et rester
          discret.
        </dd>

        <dt>"Repack !"</dt>
        <dd>Se regrouper serré sur le tag du commandant.</dd>

        <dt>"Tagger / Contest"</dt>
        <dd>Attaquer une structure pour empêcher l'utilisation du WP adverse.</dd>

        <dt>"Tortue / Turtle"</dt>
        <dd>Se regrouper en boule pour partager les dégâts et les soins.</dd>

        <dt>"TP Mesmer / Voile"</dt>
        <dd>
          Utilisation des portails ou de l'invisibilité de l'Envoûteur pour surprendre l'ennemi.
        </dd>
      </dl>
    </div>
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
  margin-bottom: 1rem;
  text-align: center;
}

.user-placement-title {
  margin-bottom: 0.4rem;
}

.user-placement {
  margin: 0 auto 1rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  width: fit-content;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.user-placement.red {
  background: rgba(200, 20, 20, 0.85);
}

.user-placement.blue {
  background: rgba(24, 84, 201, 0.85);
}

.user-placement.green {
  background: rgba(22, 134, 58, 0.9);
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
dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 20px;
}
dt {
  font-weight: bold;
  color: #000dfb;
  white-space: nowrap;
}
dd {
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f9f9f9;
}
.highlight {
  color: #2980b9;
}
.fond-page {
  background-color: #f4f4f493;
  color: #000000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
