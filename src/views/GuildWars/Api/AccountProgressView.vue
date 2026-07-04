<template>
  <section class="account-progress">
    <div class="top-row">
      <div class="api-form">
        <p class="help-text">
          Cette page utilise la cle API deja enregistree dans la section API Guild Wars 2.
        </p>
        <p class="help-text">
          Permissions conseillees :
          <strong>account</strong>, <strong>progression</strong>, <strong>unlocks</strong>
        </p>
        <div class="input-row">
          <button type="button" @click="analyzeProgress" :disabled="loading">
            {{ loading ? 'Analyse en cours...' : 'Rafraichir l\'analyse' }}
          </button>
        </div>
      </div>

      <article v-if="hasResults" class="panel score-panel">
        <h3>Progression {{ progressScore }} %</h3>
        <p class="score-level">Niveau du compte : {{ accountLevel }}</p>
        <ul class="score-details">
          <li>Extensions possedees : {{ scoreBreakdown.expansionPoints }} pts</li>
          <li>Saisons Living World possedees : {{ scoreBreakdown.seasonPoints }} pts</li>
          <li>Deblocages majeurs obtenus : {{ scoreBreakdown.featurePoints }} pts</li>
          <li>Total : {{ scoreBreakdown.totalPoints }} / {{ scoreBreakdown.maxPoints }} pts</li>
        </ul>
      </article>
    </div>

    <p v-if="errorMessage" class="error-box">{{ errorMessage }}</p>

    <div v-if="hasResults" class="results-grid">
      <article class="panel cycles-panel">
        <h3>contenu avec statut</h3>
        <p v-if="accountName" class="account-name">Compte : {{ accountName }}</p>

        <div class="cycle-accordion">
          <details
            v-for="cycle in cycleCards"
            :key="cycle.key"
            :class="['cycle-item', `cycle-${cycle.key}`]"
          >
            <summary>
              <span>{{ cycle.label }}</span>
              <span :class="statusClass(cycle.status)">{{ statusLabel(cycle.status) }}</span>
            </summary>

            <div class="cycle-body">
              <p v-if="cycle.groups.length === 0" class="empty-cycle">
                Aucun contenu specifique configure pour ce cycle.
              </p>

              <div v-for="group in cycle.groups" :key="`${cycle.key}-${group.title}`" class="tier-block">
                <h5>{{ group.title }}</h5>
                <ul>
                  <li v-for="item in group.items" :key="item.key">
                    <div class="item-main">
                      <span>{{ item.label }}</span>
                      <a
                        v-if="getTutorialLink(item.key)"
                        :href="getTutorialLink(item.key)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="tutorial-link"
                      >
                        Tuto LBM
                      </a>
                    </div>
                    <span :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </article>

    </div>
  </section>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { getLbmUnlockLink } from '@/data/lbmUnlockLinks';

const API_BASE = 'https://api.guildwars2.com/v2';

const userStore = useUserStore();

const loading = ref(false);
const errorMessage = ref('');

const accountName = ref('');
const cycleStatuses = ref([]);
const majorFeatureStatuses = ref([]);
const recommendationCycles = ref([]);
const scoreBreakdown = ref({
  expansionPoints: 0,
  seasonPoints: 0,
  featurePoints: 0,
  totalPoints: 0,
  maxPoints: 1,
});

const hasResults = computed(() => cycleStatuses.value.length > 0);

const cycleCards = computed(() => {
  const recommendationByCycleKey = new Map(
    recommendationCycles.value.map((cycle) => [cycle.cycleKey, cycle]),
  );

  return cycleStatuses.value.map((cycle) => ({
    ...cycle,
    groups: recommendationByCycleKey.get(cycle.key)?.groups || [],
  }));
});

const progressScore = computed(() => {
  const { totalPoints, maxPoints } = scoreBreakdown.value;
  return Math.round((totalPoints / Math.max(maxPoints, 1)) * 100);
});

const accountLevel = computed(() => {
  if (progressScore.value < 25) return 'Novice';
  if (progressScore.value < 50) return 'Aventurier';
  if (progressScore.value < 75) return 'Veteran';
  if (progressScore.value < 90) return 'Expert';
  return 'Maitre de Tyrie';
});

const statusLabel = (status) => {
  if (status === 'unlocked') return '✅ Debloque';
  if (status === 'locked') return '❌ Non debloque';
  return 'A verifier';
};

const statusClass = (status) => {
  if (status === 'unlocked') return 'status-ok';
  if (status === 'locked') return 'status-ko';
  return 'status-unknown';
};

const getTutorialLink = (itemKey) => getLbmUnlockLink(itemKey);

const hasMasteryByPattern = (masteryTexts, pattern) =>
  masteryTexts.some((text) => pattern.test(text));

const hasMasteryId = (masteredTrackIds, id) => masteredTrackIds.has(id);
const hasAnyMasteryId = (masteredTrackIds, ids) => ids.some((id) => masteredTrackIds.has(id));

const getCycleStatuses = ({ access, masteryTexts, masteredTrackIds, canReadProgression }) => {
  const hasAccess = (value) => access.includes(value);

  const lwS3 = canReadProgression
    ? hasAnyMasteryId(masteredTrackIds, [13]) ||
      hasMasteryByPattern(masteryTexts, /(Ancient Magics|Oakheart|Counter Magic|Thermal Propulsion)/i)
    : null;
  const lwS4 = canReadProgression
    ? hasAnyMasteryId(masteredTrackIds, [19, 20, 21]) ||
      hasMasteryByPattern(masteryTexts, /(Roller Beetle|Skyscale|Crystal Champion)/i)
    : null;
  const ibs = canReadProgression
    ? hasAnyMasteryId(masteredTrackIds, [22, 23, 24, 25, 26, 27]) ||
      hasMasteryByPattern(masteryTexts, /(Raven Attunement|United Legions Waystation|Essence Manipulation|Dragon Slayer)/i)
    : null;

  return [
    { key: 'tyria-core', label: 'Tyrie Core', status: 'unlocked' },
    {
      key: 'heart-of-thorns',
      label: 'Heart of Thorns',
      status: hasAccess('HeartOfThorns') || hasAccess('PathOfFire') ? 'unlocked' : 'locked',
    },
    {
      key: 'path-of-fire',
      label: 'Path of Fire',
      status: hasAccess('PathOfFire') ? 'unlocked' : 'locked',
    },
    {
      key: 'lw-s3',
      label: 'Living World S3',
      status: lwS3 === null ? 'unknown' : lwS3 ? 'unlocked' : 'locked',
    },
    {
      key: 'lw-s4',
      label: 'Living World S4',
      status: lwS4 === null ? 'unknown' : lwS4 ? 'unlocked' : 'locked',
    },
    {
      key: 'icebrood',
      label: 'Icebrood Saga',
      status: ibs === null ? 'unknown' : ibs ? 'unlocked' : 'locked',
    },
    {
      key: 'eod',
      label: 'End of Dragons',
      status: hasAccess('EndOfDragons') ? 'unlocked' : 'locked',
    },
    {
      key: 'soto',
      label: 'Secrets of the Obscure',
      status: hasAccess('SecretsOfTheObscure') ? 'unlocked' : 'locked',
    },
    {
      key: 'janthir',
      label: 'Janthir Wilds',
      status: hasAccess('JanthirWilds') ? 'unlocked' : 'locked',
    },
  ];
};

const buildRecommendationDefinitions = ({
  cycleStatusByKey,
  masteryTexts,
  masteredTrackIds,
  canReadProgression,
}) => {
  const hasCycle = (cycleKey) => cycleStatusByKey.get(cycleKey) === 'unlocked';
  const hasMastery = (pattern) => hasMasteryByPattern(masteryTexts, pattern);

  const withUnknownIfNoProgression = (fn, cycleKey) => {
    if (!hasCycle(cycleKey)) return 'locked';
    if (!canReadProgression) return 'unknown';
    return fn() ? 'unlocked' : 'locked';
  };

  return [
    {
      cycle: 'Tyrie',
      cycleKey: 'tyria-core',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'tyria-masteries',
              label: 'Maitrises centrales',
              status: canReadProgression
                ? hasMasteryId(masteredTrackIds, 4) || hasMastery(/(Pact Commander|Central Tyria)/i)
                  ? 'unlocked'
                  : 'locked'
                : 'unknown',
            },
          ],
        },
        {
          title: 'Recommande',
          items: [
            {
              key: 'tyria-fractals',
              label: 'Fractales',
              status: canReadProgression
                ? hasMasteryId(masteredTrackIds, 5) || hasMastery(/Fractal/i)
                  ? 'unlocked'
                  : 'locked'
                : 'unknown',
            },
          ],
        },
      ],
    },
    {
      cycle: 'Heart of Thorns',
      cycleKey: 'heart-of-thorns',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'hot-glider',
              label: 'Planeur',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 8) || hasMastery(/(Glider|Gliding)/i),
                'heart-of-thorns',
              ),
            },
            {
              key: 'hot-mushrooms',
              label: 'Champignons rebondissants',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 2), 'heart-of-thorns'),
            },
            {
              key: 'hot-itzel',
              label: 'Itzel',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 2) || hasMastery(/Itzel/i),
                'heart-of-thorns',
              ),
            },
            {
              key: 'hot-nuhoch',
              label: 'Nuhoch',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 3) || hasMastery(/Nuhoch/i),
                'heart-of-thorns',
              ),
            },
            {
              key: 'hot-exalted',
              label: 'Exaltes',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 1) || hasMastery(/Exalted/i),
                'heart-of-thorns',
              ),
            },
          ],
        },
        {
          title: 'Recommande',
          items: [
            {
              key: 'hot-raids',
              label: 'Raids',
              status: hasCycle('heart-of-thorns') ? 'unlocked' : 'locked',
            },
          ],
        },
      ],
    },
    {
      cycle: 'Path of Fire',
      cycleKey: 'path-of-fire',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'pof-raptor',
              label: 'Raptor',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 14), 'path-of-fire'),
            },
            {
              key: 'pof-springer',
              label: 'Lapin',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 17), 'path-of-fire'),
            },
            {
              key: 'pof-skimmer',
              label: 'Raie manta',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 15), 'path-of-fire'),
            },
            {
              key: 'pof-jackal',
              label: 'Jackal',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 18), 'path-of-fire'),
            },
          ],
        },
        {
          title: 'Tres recommande',
          items: [
            {
              key: 'pof-griffon',
              label: 'Griffon',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 16), 'path-of-fire'),
            },
            {
              key: 'pof-beetle',
              label: 'Roller Beetle',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 20), 'path-of-fire'),
            },
            {
              key: 'pof-skyscale',
              label: 'Skyscale',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 21), 'path-of-fire'),
            },
          ],
        },
      ],
    },
    {
      cycle: 'Living World Saison 4',
      cycleKey: 'lw-s4',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'lw4-beetle',
              label: 'Roller Beetle',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 20), 'lw-s4'),
            },
            {
              key: 'lw4-skyscale-prereq',
              label: 'Skyscale (pre-requis)',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 21), 'lw-s4'),
            },
          ],
        },
      ],
    },
    {
      cycle: 'End of Dragons',
      cycleKey: 'eod',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'eod-jade-bot',
              label: 'Jade Bot',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 33) || hasMastery(/Jade Bot/i),
                'eod',
              ),
            },
            {
              key: 'eod-jade-batteries',
              label: 'Batteries Jade',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 33), 'eod'),
            },
            {
              key: 'eod-ziplines',
              label: 'Tyroliennes',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 33), 'eod'),
            },
            {
              key: 'eod-fishing',
              label: 'Peche',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 31) || hasMastery(/Fishing/i),
                'eod',
              ),
            },
            {
              key: 'eod-skiff',
              label: 'Bateau (Skiff)',
              status: withUnknownIfNoProgression(
                () => hasMasteryId(masteredTrackIds, 29) || hasMastery(/Skiff/i),
                'eod',
              ),
            },
            {
              key: 'eod-turtle',
              label: 'Tortue de siege',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 30), 'eod'),
            },
          ],
        },
      ],
    },
    {
      cycle: 'Secrets of the Obscure',
      cycleKey: 'soto',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'soto-new-skyscale',
              label: 'Nouvelle acquisition du Skyscale',
              status: withUnknownIfNoProgression(
                () => hasAnyMasteryId(masteredTrackIds, [21, 36]),
                'soto',
              ),
            },
            {
              key: 'soto-flight',
              label: 'Maitrises de vol avancees',
              status: withUnknownIfNoProgression(
                () =>
                  hasAnyMasteryId(masteredTrackIds, [36, 37, 38, 39]) ||
                  hasMastery(/(Skywatch|Heart of the Obscure|Astral Ward|Flight Training)/i),
                'soto',
              ),
            },
          ],
        },
        {
          title: 'Tres recommande',
          items: [
            {
              key: 'soto-convergences',
              label: 'Convergences',
              status: withUnknownIfNoProgression(() => hasMasteryId(masteredTrackIds, 39), 'soto'),
            },
          ],
        },
      ],
    },
    {
      cycle: 'Janthir Wilds',
      cycleKey: 'janthir',
      groups: [
        {
          title: 'Priorite absolue',
          items: [
            {
              key: 'janthir-homestead',
              label: 'Homestead',
              status: hasCycle('janthir') ? 'unlocked' : 'locked',
            },
            {
              key: 'janthir-land-spear',
              label: 'Lance terrestre pour toutes les professions',
              status: hasCycle('janthir') ? 'unlocked' : 'locked',
            },
          ],
        },
        {
          title: 'Tres recommande',
          items: [
            {
              key: 'janthir-regional-masteries',
              label: 'Maitrises regionales',
              status: withUnknownIfNoProgression(
                () => hasAnyMasteryId(masteredTrackIds, [40, 42, 43, 44, 45, 46, 47]),
                'janthir',
              ),
            },
            {
              key: 'janthir-exploration',
              label: "Recompenses d'exploration",
              status: hasCycle('janthir') ? 'unlocked' : 'locked',
            },
          ],
        },
      ],
    },
  ];
};

const flattenRecommendationItems = (recommendationData) =>
  recommendationData.flatMap((cycle) => cycle.groups.flatMap((group) => group.items));

const buildMasteryTexts = (accountMasteries, masteryDefinitionsById) => {
  const texts = [];

  for (const entry of accountMasteries) {
    const masteryId = Number(entry?.id);
    if (!Number.isFinite(masteryId)) {
      continue;
    }

    const level = Number(entry?.level);
    if (!Number.isFinite(level) || level <= 0) {
      continue;
    }

    const definition = masteryDefinitionsById.get(masteryId);
    if (!definition) {
      continue;
    }

    const trackTexts = [
      definition.name,
      definition.requirement,
      definition.region,
      ...(definition.levels || []).slice(0, level).flatMap((masteryLevel) => [
        masteryLevel?.name,
        masteryLevel?.description,
        masteryLevel?.instruction,
      ]),
    ]
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value) => value.trim());

    texts.push(...trackTexts);
  }

  return texts;
};

const analyzeProgress = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const apiKey = (userStore.getApiKey() || userStore.apiKey || '').trim();
    if (!apiKey) {
      throw new Error('Aucune cle API enregistree. Renseignez-la dans le panneau API principal.');
    }

    const [tokenInfoResponse, accountResponse] = await Promise.all([
      axios.get(`${API_BASE}/tokeninfo?access_token=${apiKey}`),
      axios.get(`${API_BASE}/account?access_token=${apiKey}`),
    ]);

    const permissions = tokenInfoResponse.data.permissions || [];
    const canReadProgression = permissions.includes('progression');

    accountName.value = accountResponse.data.name || '';

    let masteryTexts = [];
    let masteredTrackIds = new Set();

    if (canReadProgression) {
      const accountMasteriesResponse = await axios.get(
        `${API_BASE}/account/masteries?access_token=${apiKey}`,
      );
      const accountMasteries = accountMasteriesResponse.data || [];
      masteredTrackIds = new Set(
        accountMasteries
          .filter((entry) => Number(entry.level) > 0)
          .map((entry) => Number(entry.id))
          .filter(Boolean),
      );

      const masteryIds = [...masteredTrackIds].join(',');

      if (masteryIds) {
        const masteryDetailsResponse = await axios.get(`${API_BASE}/masteries?ids=${masteryIds}&lang=en`);
        const masteryDefinitions = masteryDetailsResponse.data || [];
        const masteryDefinitionsById = new Map(
          masteryDefinitions.map((mastery) => [Number(mastery.id), mastery]),
        );
        masteryTexts = buildMasteryTexts(accountMasteries, masteryDefinitionsById);
      }
    }

    cycleStatuses.value = getCycleStatuses({
      access: accountResponse.data.access || [],
      masteryTexts,
      masteredTrackIds,
      canReadProgression,
    });

    const cycleStatusByKey = new Map(cycleStatuses.value.map((cycle) => [cycle.key, cycle.status]));
    const recommendations = buildRecommendationDefinitions({
      cycleStatusByKey,
      masteryTexts,
      masteredTrackIds,
      canReadProgression,
    });

    recommendationCycles.value = recommendations;
    majorFeatureStatuses.value = flattenRecommendationItems(recommendations);

    const expansionCycleKeys = ['heart-of-thorns', 'path-of-fire', 'eod', 'soto', 'janthir'];
    const seasonCycleKeys = ['lw-s3', 'lw-s4', 'icebrood'];

    const ownedExpansionCount = expansionCycleKeys.filter(
      (key) => cycleStatusByKey.get(key) === 'unlocked',
    ).length;
    const ownedSeasonCount = seasonCycleKeys.filter(
      (key) => cycleStatusByKey.get(key) === 'unlocked',
    ).length;
    const unlockedMajorFeatures = majorFeatureStatuses.value.filter(
      (feature) => feature.status === 'unlocked',
    ).length;

    const expansionPoints = ownedExpansionCount * 10;
    const seasonPoints = ownedSeasonCount * 5;
    const featurePoints = unlockedMajorFeatures * 2;

    const maxPoints = expansionCycleKeys.length * 10 + seasonCycleKeys.length * 5 + majorFeatureStatuses.value.length * 2;

    scoreBreakdown.value = {
      expansionPoints,
      seasonPoints,
      featurePoints,
      totalPoints: expansionPoints + seasonPoints + featurePoints,
      maxPoints,
    };
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.text || error.message || "Erreur lors de l'analyse de la progression.";
    cycleStatuses.value = [];
    majorFeatureStatuses.value = [];
    recommendationCycles.value = [];
    scoreBreakdown.value = {
      expansionPoints: 0,
      seasonPoints: 0,
      featurePoints: 0,
      totalPoints: 0,
      maxPoints: 1,
    };
    accountName.value = '';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  userStore.initApiKey();
  if (userStore.apiKey) {
    analyzeProgress();
  }
});

watch(
  () => userStore.apiKey,
  (newKey, oldKey) => {
    if (newKey && newKey !== oldKey) {
      analyzeProgress();
    }
  },
);
</script>

<style scoped>
.account-progress {
  padding: 1rem;
  display: grid;
  gap: 1rem;
  color: #000;
}

.section-header h2 {
  margin: 0;
}

.section-header p {
  margin: 0.25rem 0 0;
  color: #000;
}

.top-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 1rem;
  align-items: start;
}

.api-form {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f4f4f493;
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row button {
  border: none;
  border-radius: 6px;
  background: #0d6efd;
  color: #000;
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.input-row button:disabled {
  opacity: 0.7;
  cursor: default;
}

.help-text {
  margin: 0;
  color: #000;
}

.error-box {
  margin: 0;
  padding: 0.75rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #000;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.cycles-panel {
  display: grid;
  gap: 0.8rem;
}

.panel {
  background: #f4f4f493;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
}

.panel h3 {
  margin-top: 0;
}

.account-name {
  margin-top: 0;
  font-weight: 600;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.55rem 0.2rem;
}

.cycle-accordion {
  display: grid;
  gap: 0.6rem;
}

.cycle-item {
  --cycle-color: #8b1e24;
  --cycle-soft: #fff3f3;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: var(--cycle-soft);
  padding: 0.3rem 0.7rem;
  border-left: 6px solid var(--cycle-color);
}

.cycle-item summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.45rem 0;
  cursor: pointer;
  font-weight: 600;
  color: #000;
}

.cycle-body {
  border-top: 1px solid #e5e7eb;
  padding: 0.55rem 0;
}

.cycle-tyria-core {
  --cycle-color: #a11d2a;
  --cycle-soft: #fff4f5;
}

.cycle-heart-of-thorns {
  --cycle-color: #3a6b2f;
  --cycle-soft: #f3faef;
}

.cycle-path-of-fire {
  --cycle-color: #b66a1e;
  --cycle-soft: #fff7ef;
}

.cycle-lw-s3 {
  --cycle-color: #5f6fb2;
  --cycle-soft: #f3f5ff;
}

.cycle-lw-s4 {
  --cycle-color: #8d4a99;
  --cycle-soft: #fcf2ff;
}

.cycle-icebrood {
  --cycle-color: #4a8cc7;
  --cycle-soft: #f1f8ff;
}

.cycle-eod {
  --cycle-color: #2d8c73;
  --cycle-soft: #effbf8;
}

.cycle-soto {
  --cycle-color: #5a4bb7;
  --cycle-soft: #f4f2ff;
}

.cycle-janthir {
  --cycle-color: #9b6a2a;
  --cycle-soft: #fff7ef;
}

.empty-cycle {
  margin: 0;
  color: #000;
}

.score-panel {
  height: fit-content;
}

.tier-block h5 {
  margin: 0.35rem 0;
}

.tier-block ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tier-block li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.2rem 0;
}

.item-main {
  display: grid;
  gap: 0.1rem;
}

.tutorial-link {
  width: fit-content;
  font-size: 0.85rem;
  color: #000;
  text-decoration: none;
}

.tutorial-link:hover {
  text-decoration: underline;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.2rem 0;
}

.score-level {
  margin-top: 0;
  color: #000;
  font-weight: 600;
}

.score-details {
  margin: 0;
  padding-left: 1rem;
}

.status-ok {
  color: #000;
  font-weight: 600;
}

.status-ko {
  color: #000;
  font-weight: 600;
}

.status-unknown {
  color: #000;
  font-weight: 600;
}

@media (max-width: 640px) {
  .top-row {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .input-row {
    flex-direction: column;
  }
}
</style>
