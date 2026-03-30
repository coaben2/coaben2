<script setup>
import { ref } from 'vue';

const formulas = ref([
  {
    id: 'strike',
    title: 'Dégâts Directs (Frappe)',
    equation: "Dégâts = (Dégâts de l'arme) * Puissance * Coefficient ÷ Armure de la cible",
    variables: [
      { name: 'Dégâts de l\'arme', desc: 'Moyenne des dégâts de l\'arme (ex: 1000 pour une épée exotique 80)' },
      { name: 'Puissance', desc: 'Statistique principale de dégâts directs (Base 1000 au niveau 80)' },
      { name: 'Coefficient', desc: 'Multiplicateur propre à chaque compétence (ex: 0.8 pour une attaque rapide)' },
      { name: 'Armure', desc: 'Somme de la Robustesse et de la défense d\'armure de l\'ennemi' }
    ],
    notes: [
      '<strong>Précision :</strong> Chance de critique = (Précision - 895) ÷ 21. Cap à 100% (soit 2995 pts).',
      '<strong>Férocité :</strong> Dégâts Critiques = 150% + (Férocité ÷ 15). Exemple : 1500 Férocité = 250% dégâts.',
    ],
  },
  {
    id: 'condi',
    title: 'Dégâts par Altération (DoT)',
    equation: 'Dégâts par tick = (Valeur de Base) + (Coefficient * Dégâts par altération)',
    variables: [
      { name: 'Base', desc: 'Dégâts fixes liés au niveau (augmente peu entre le niv 1 et 80)' },
      { name: 'Dégâts par altération', desc: 'Statistique augmentant la force de chaque tick' },
      { name: 'Coefficient', desc: 'Variable selon l\'altération (la Brûlure a un coefficient plus haut que le Saignement)' }
    ],
    notes: [
      "L'<strong>Expertise</strong> augmente la durée. Formule : Durée = (Expertise ÷ 15)%. Cap à +100%.",
      '<strong>Astuce :</strong> Le set d\'équipement "Vipère" est le plus utilisé pour ce build.',
    ],
  },
  {
    id: 'heal',
    title: 'Soins Sortants',
    equation: 'Soin total = Base de soin + (Pouvoir de guérison * Coefficient de soin)',
    variables: [
      { name: 'Base de soin', desc: 'Valeur de soin fixe de la compétence utilisée' },
      { name: 'Pouvoir de guérison', desc: 'Statistique de soin (Base 0)' },
      { name: 'Coefficient', desc: 'Ratio propre au skill (les gros soins ont un ratio plus élevé)' }
    ],
    notes: [
      'La <strong>Concentration</strong> augmente la durée des avantages (Boons). 15 pts = 1% de durée.',
      'Les soins ne peuvent jamais infliger de coups critiques.',
    ],
  },
]);

const statExplanations = ref([
  { stat: 'Puissance', formula: 'Dégâts directs', softCap: 'Aucun (Illimité)' },
  { stat: 'Précision', formula: '(Précision - 895) / 21', softCap: '2995 pts (100% crit)' },
  { stat: 'Férocité', formula: 'Férocité / 15', softCap: 'Aucun' },
  { stat: 'Dégâts Alté.', formula: 'Scaling des DoTs', softCap: 'Aucun' },
  { stat: 'Expertise', formula: 'Expertise / 15', softCap: '+100% durée alté.' },
  { stat: 'Concentration', formula: 'Concentration / 15', softCap: '+100% durée avantages' },
  { stat: 'Robu. / Vit.', formula: 'Défense et PV', softCap: '1000 Robustesse = Aggro Raid' },
]);

const professions = ref([
  {
    name: 'Guerrier',
    focus: 'Puissance et Férocité',
    color: '#FFD100',
    playstyle: 'DPS Physique de mêlée with forte survie',
    mechanics: [
      '<strong>Adrénaline (F1) :</strong> Générée en combat, permet de lancer des "Déchaînements" dévastateurs.',
      '<strong>Berserker :</strong> Entre en mode Rage pour augmenter la vitesse d\'attaque et les dégâts.',
      '<strong>Spellbreaker :</strong> Spécialisé dans l\'annulation des avantages ennemis (Boon Strip).',
    ],
    tips: 'Le Guerrier a un pool de PV élevé par défaut (19k). Priorisez les dégâts bruts (Set Berserker).',
  },
  {
    name: 'Gardien',
    focus: 'Support et Brûlure',
    color: '#72C1D9',
    playstyle: 'Support / DPS hybride with protections permanentes',
    mechanics: [
      '<strong>Vertus (F1-F3) :</strong> Passifs de soin et de dégâts qui peuvent être activés pour le groupe.',
      '<strong>Firebrand :</strong> Utilise des Tomes au lieu des vertus. Reine de la Brûlure et du Support.',
      '<strong>Willbender :</strong> Style assassin extrêmement mobile axé sur le DPS physique.',
    ],
    tips: 'Le Gardien a peu de PV (11k). Utilisez vos blocages (Égide) pour compenser.',
  },
  {
    name: 'Revenant',
    focus: 'Énergie et Invocations',
    color: '#D12727',
    playstyle: 'Gestion d\'énergie with switch de légendes',
    mechanics: [
      '<strong>Énergie :</strong> Toutes les compétences coûtent de l\'énergie au lieu de cooldowns classiques.',
      '<strong>Légendes :</strong> Switcher entre deux héros du passé pour changer tout votre kit utilitaire.',
      '<strong>Herald :</strong> Le meilleur support pour maintenir la Célérité et la Fureur.',
    ],
    tips: 'Changez de légende dès que votre énergie tombe sous les 10 points pour la réinitialiser à 50.',
  },
  {
    name: 'Rôdeur',
    focus: 'Précision et Guérison',
    color: '#8DD448',
    playstyle: 'Combat with familier et polyvalence nature',
    mechanics: [
      '<strong>Familiers :</strong> Gère un compagnon animal with ses propres stats et compétences.',
      '<strong>Druide :</strong> Spécialisation de soin pur utilisant la Forme Céleste.',
      '<strong>Soulbeast :</strong> Permet de fusionner with son familier pour gagner des stats massives.',
    ],
    tips: 'En Soulbeast, fusionnez avant le combat pour bénéficier des bonus de statistiques permanents.',
  },
  {
    name: 'Voleur',
    focus: 'Initiative et Discrétion',
    color: '#C08F95',
    playstyle: 'Burst DPS extrême et mobilité',
    mechanics: [
      '<strong>Initiative :</strong> Pas de cooldowns on les armes, mais une réserve d\'énergie consommable.',
      '<strong>Larcin :</strong> Permet de voler une compétence unique à l\'adversaire.',
      '<strong>Deadeye :</strong> Utilise des marques pour infliger des dégâts massifs à une cible unique.',
    ],
    tips: 'L\'initiative se recharge with le temps. Évitez de la vider d\'un coup sans garantie de kill.',
  },
  {
    name: 'Ingénieur',
    focus: 'Expertise et Polyvalence',
    color: '#D09C59',
    playstyle: 'Usage intensif de kits et de gadgets',
    mechanics: [
      '<strong>Kits d\'outils :</strong> Remplace l\'arme actuelle par des explosifs, lance-flammes ou élixirs.',
      '<strong>Holosmith :</strong> Forge photonique augmentant les dégâts au prix d\'une jauge de chaleur.',
      '<strong>Mechanist :</strong> Invoque un Jade Mech surpuissant qui combat en autonomie.',
    ],
    tips: 'C\'est la classe with le plus grand nombre de compétences actives. La mémoire musculaire est clé.',
  },
  {
    name: 'Élémentaliste',
    focus: 'Puissance et Éléments',
    color: '#F68A87',
    playstyle: 'Mage fragile with des dégâts de zone massifs',
    mechanics: [
      '<strong>Affinités (F1-F4) :</strong> Switch entre Feu, Eau, Air et Terre pour changer de rôle instantanément.',
      '<strong>Weaver :</strong> Permet de mélanger deux éléments simultanément pour des attaques hybrides.',
      '<strong>Tempest :</strong> Utilise des surcharges élémentaires pour des effets de zone persistants.',
    ],
    tips: 'Vous ne pouvez pas changer d\'armes en combat. Votre polyvalence vient uniquement des 4 affinités.',
  },
  {
    name: 'Envoûteur',
    focus: 'Illusions et Altérations',
    color: '#B679D5',
    playstyle: 'Manipulation, clones et contrôle du temps',
    mechanics: [
      '<strong>Illusions :</strong> Crée des clones de soi-même pour distraire et attaquer.',
      '<strong>Éclatement (F1-F4) :</strong> Détruit tous les clones pour infliger des dégâts, du mal-être ou de l\'invulnérabilité.',
      '<strong>Virtuoso :</strong> Remplace les clones par des dagues psychiques volantes (plus simple à gérer).',
    ],
    tips: 'Le Mirage est excellent en PvP/Solo grâce à son esquive unique qui ne l\'arrête pas d\'attaquer.',
  },
  {
    name: 'Nécromant',
    focus: 'Vitalité et Altérations',
    color: '#52A76F',
    playstyle: 'Tank naturel via une seconde barre de vie',
    mechanics: [
      '<strong>Force Vitale :</strong> Se remplit en tuant ou via des skills. Active le Linceul (Shroud).',
      '<strong>Linceul :</strong> Une barre de PV secondaire qui protège votre santé réelle.',
      '<strong>Scourge :</strong> Abandonne le linceul personnel pour des barrières de groupe massives.',
    ],
    tips: 'Le Nécromant convertit souvent sa Vitalité en d\'autres stats via ses traits.',
  },
]);

const roles = ref([
  {
    name: 'DPS Brut (Puissance)',
    stats: 'Puissance, Précision, Férocité',
    gear: 'Berserker / Assassin',
    impact: 'Dégâts directs massifs, idéal pour les cibles à faible armure et phases de burst.',
    classes: 'Guerrier, Voleur, Gardien, Élémentaliste',
  },
  {
    name: 'DPS Altération (Condition)',
    stats: 'Dégâts par altération, Expertise, Puissance',
    gear: 'Vipère / Sinistre',
    impact: 'Dégâts sur la durée (DoT). Très efficace sur les boss with beaucoup de points de vie.',
    classes: 'Nécromant, Ingénieur, Envoûteur, Rôdeur',
  },
  {
    name: 'DPS Soutien (Boon DPS)',
    stats: 'Stats DPS + Concentration',
    gear: 'Divin / Ritualiste',
    impact: 'Inflige des dégâts tout en maintenant des avantages cruciaux (Célérité ou Alacrité).',
    classes: 'Héraut, Incendiaire, Mécanicien, Chronomancien',
  },
  {
    name: 'Soutien Soigneur (Heal)',
    stats: 'Pouvoir de guérison, Concentration, Vitalité',
    gear: 'Voyageur / Ménestrel',
    impact: 'Assure la survie du groupe via les soins et maintient 100% de durée des avantages.',
    classes: 'Druide, Incendiaire, Héraut, Cataclyste',
  },
  {
    name: 'Tank (Raids)',
    stats: 'Robustesse, Concentration, Vitalité',
    gear: 'Ménestrel / Bienfaiteur',
    impact: 'Dirige le boss et absorbe les coups. L\'aggro est déterminée par la Robustesse.',
    classes: 'Chronomancien, Incendiaire, Fracasseur',
  },
]);

</script>

<template>
  <div class="gw2-stats-guide">
    <div class="container">
      <header class="guide-header">
        <h1>Statistiques Guild Wars 2</h1>
        <p class="subtitle">Comprendre les formules de calcul et optimiser son build</p>
      </header>

      <section class="section">
        <h2 class="section-title">1. Les Formules Fondamentales</h2>
        <div v-for="formula in formulas" :key="formula.id" class="formula-block">
          <h3 class="formula-title">{{ formula.title }}</h3>
          <div class="formula-box">
            <code class="formula-equation">{{ formula.equation }}</code>
          </div>
          <div class="details-grid">
            <div class="variables-list">
              <h4>Variables :</h4>
              <ul>
                <li v-for="variable in formula.variables" :key="variable.name">
                  <strong>{{ variable.name }} :</strong> {{ variable.desc }}
                </li>
              </ul>
            </div>
            <div v-if="formula.notes" class="notes-list">
              <h4>Notes critiques :</h4>
              <ul>
                <li v-for="(note, index) in formula.notes" :key="index" v-html="note"></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <hr class="section-divider" />

      <section class="section">
        <h2 class="section-title">2. Lexique et Caps des Statistiques</h2>
        <div class="stats-grid">
          <div v-for="item in statExplanations" :key="item.stat" class="stat-card">
            <h3 class="stat-name">{{ item.stat }}</h3>
            <p class="stat-formula">Usage : <code>{{ item.formula }}</code></p>
            <p class="stat-cap">Cap conseillé : <span class="cap-value">{{ item.softCap }}</span></p>
          </div>
        </div>
      </section>

      <hr class="section-divider" />

      <section class="section">
        <h2 class="section-title">3. Spécificités par Profession</h2>
        <div class="class-grid">
          <div v-for="profession in professions" :key="profession.name" class="class-card" :style="{ borderLeftColor: profession.color }">
            <div class="class-header">
              <h3 class="class-name">{{ profession.name }}</h3>
              <span class="class-badge" :style="{ backgroundColor: profession.color }">{{ profession.focus }}</span>
            </div>
            <p class="class-playstyle"><strong>Style :</strong> {{ profession.playstyle }}</p>
            <div class="mechanics-section">
              <ul class="mechanics-list">
                <li v-for="(mechanic, index) in profession.mechanics" :key="index" v-html="mechanic"></li>
              </ul>
            </div>
            <div class="tips-box">💡 {{ profession.tips }}</div>
          </div>
        </div>
      </section>

      <hr class="section-divider" />

      <section class="section">
        <h2 class="section-title">4. Résumé des Rôles et Équipements</h2>
        <div class="table-wrapper">
          <table class="stats-table">
            <thead>
              <tr>
                <th>Rôle</th>
                <th>Priorité Stats</th>
                <th>Set Idéal</th>
                <th>Impact</th>
                <th>Exemples Classes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.name">
                <td class="role-name"><strong>{{ role.name }}</strong></td>
                <td>{{ role.stats }}</td>
                <td class="gear-cell">{{ role.gear }}</td>
                <td>{{ role.impact }}</td>
                <td class="classes-cell">{{ role.classes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <hr class="section-divider" />
    </div>
  </div>
</template>

<style scoped>
.gw2-stats-guide {
  background: #0f0f0f;
  color: #e0e0e0;
  padding: 40px 20px;
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.7);
}

.guide-header {
  text-align: center;
  margin-bottom: 50px;
  border-bottom: 2px solid #f39c12;
  padding-bottom: 20px;
}

h1 { color: #f39c12; font-size: 2.5em; margin-bottom: 10px; }
.subtitle { color: #aaa; font-style: italic; }

.section { margin-bottom: 60px; }
.section-title {
  color: #3498db;
  font-size: 2em;
  border-left: 5px solid #3498db;
  padding-left: 15px;
  margin-bottom: 25px;
}

.formula-block {
  background: #252525;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 25px;
  border: 1px solid #333;
}

.formula-title { color: #2ecc71; margin-bottom: 15px; }
.formula-box {
  background: #000;
  padding: 20px;
  border-radius: 6px;
  margin: 15px 0;
  text-align: center;
}
.formula-equation { color: #f1c40f; font-family: monospace; font-size: 1.2em; }

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
.stat-card {
  background: #222;
  padding: 20px;
  border-radius: 8px;
  border-top: 4px solid #3498db;
}
.stat-name { color: #3498db; margin-bottom: 10px; }
.stat-formula code { color: #f1c40f; }
.cap-value { color: #2ecc71; font-weight: bold; }

.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 25px;
}
.class-card {
  background: #222;
  padding: 25px;
  border-radius: 10px;
  border-left: 6px solid;
}
.class-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.class-badge { color: #000; padding: 4px 10px; border-radius: 15px; font-weight: bold; font-size: 0.8em; }
.mechanics-list { padding-left: 20px; color: #ccc; }
.tips-box { background: rgba(52, 152, 219, 0.1); padding: 12px; margin-top: 15px; border-radius: 4px; font-size: 0.9em; }

.table-wrapper { overflow-x: auto; }
.stats-table { width: 100%; border-collapse: collapse; background: #111; }
.stats-table th { background: #34495e; color: #f39c12; padding: 15px; text-align: left; }
.stats-table td { padding: 15px; border-bottom: 1px solid #333; }
.role-name { color: #fff; }
.gear-cell { color: #2ecc71; font-family: monospace; }
.section-divider { border: 0; border-top: 1px solid #444; margin: 40px 0; }

@media (max-width: 768px) {
  .details-grid { grid-template-columns: 1fr; }
  .container { padding: 20px; }
}
</style>