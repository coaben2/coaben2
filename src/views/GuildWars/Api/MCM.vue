<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useUserStore } from '@/stores/user';

const loadingMessage = ref('Chargement des scores McM...');
const progress = ref(0);
const userWorld = ref(null);

const customWorldNames = {
  2002: "Bouche d'Abaddon",
  2206: 'Pierre Arboréenne',
  2205: "Clarté d'Aurore",
  2003: 'Marée Noire',
  2201: 'Désolation',
  2102: 'Lac Drakkar',
  2207: 'Lointaines Cimesfroides',
  2203: 'Fort Ranik',
  2204: 'Gandara',
  2209: 'Refuge de Gunnar',
  2202: 'Mer de Jade',
  2101: 'Kodash',
  2208: 'Son du Meunier',
  2104: 'Place de Piken',
  2004: 'Riveflot',
  2011: 'Anneau de Feu',
  2012: 'Ruines de Surmia',
  2013: 'Repos du Marin',
  2103: 'Outre-Monde',
  2200: 'Place de Vizunah',
  2014: 'Crête de Blancos',
  2001: 'Roc d Augure',
  2006: 'Baie de Baruch',
  2105: 'Dzagonur',
  2106: 'Retraite d Elona',
  2010: 'Faille du Destin',
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
    <div class="fond-page">
      <h2>Abréviation et mot clée en MCM</h2>
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
