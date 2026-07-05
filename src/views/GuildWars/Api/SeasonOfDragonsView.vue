<template>
  <section class="dragon-regalia">
    <div class="top-row">
      <div class="api-form panel">
        <p class="help-text">
          Suivi de l'amulette legendaire liee au succes "Seasons of the Dragons".
        </p>
        <p class="help-text">
          Permissions conseillees : <strong>account</strong>, <strong>progression</strong>
        </p>
        <div class="input-row">
          <button type="button" @click="analyzeProgress" :disabled="loading">
            {{ loading ? 'Analyse en cours...' : "Rafraichir l'analyse" }}
          </button>
        </div>
      </div>

      <article v-if="hasResults" class="panel score-panel">
        <h3>Progression globale : {{ globalProgress }} %</h3>
        <p class="score-level">Compte : {{ accountName || 'Inconnu' }}</p>
        <ul class="score-details">
          <li>Etapes terminees : {{ completedStages }} / {{ stagesProgress.length }}</li>
          <li>Episodes d'histoire termines : {{ completedStories }} / {{ totalStories }}</li>
          <li>Succes etapes termines : {{ completedAchievementStages }} / {{ achievementStages }}</li>
          <li v-if="returnMetaProgress.total > 0">
            Meta-succes "Retour" : {{ returnMetaProgress.completed }} / {{ returnMetaProgress.total }}
          </li>
        </ul>
      </article>
    </div>

    <p v-if="errorMessage" class="error-box">{{ errorMessage }}</p>

    <article v-if="hasResults" class="panel">
      <h3>Suivi ordonne de l'histoire et des succes</h3>

      <div class="stage-accordion">
        <details
          v-for="stage in stagesProgress"
          :key="stage.key"
          :class="['stage-item', `stage-${stage.key}`]"
        >
          <summary>
            <span>#{{ stage.order }} - {{ stage.label }}</span>
            <span :class="statusClass(stage.status)">
              {{ statusLabel(stage.status) }} - {{ stage.progress }}%
            </span>
          </summary>

          <div class="stage-body">
            <div class="story-block">
              <h5>Histoire</h5>
              <p v-if="stage.stories.length === 0" class="empty-text">
                Pas d'episode d'histoire suivi pour cette etape.
              </p>
              <p v-else class="story-summary">
                {{ stage.storyCompleted }} / {{ stage.stories.length }} episodes termines
              </p>
              <ul v-if="stage.stories.length > 0">
                <li v-for="story in stage.stories" :key="story.id">
                  <span>{{ story.name }}</span>
                  <span :class="statusClass(story.status)">{{ statusLabel(story.status) }}</span>
                </li>
              </ul>
            </div>

            <div class="achievement-block">
              <h5>Succes d'etape</h5>
              <p class="achievement-name">{{ stage.achievement.name }}</p>
              <a
                v-if="getStageTutorialLink(stage.key)"
                :href="getStageTutorialLink(stage.key)"
                target="_blank"
                rel="noopener noreferrer"
                class="tutorial-link"
              >
                Tuto LBM
              </a>
              <p class="achievement-progress">
                Progression : {{ stage.achievement.current }} / {{ stage.achievement.max }}
              </p>
              <p :class="statusClass(stage.achievement.status)">
                {{ statusLabel(stage.achievement.status) }}
              </p>
            </div>
          </div>
        </details>

        <details v-if="returnMetaProgress.total > 0" class="stage-item stage-return-metas">
          <summary>
            <span>24 meta-succes (retour + final)</span>
            <span :class="statusClass(returnMetaProgress.inProgress > 0 ? 'in-progress' : 'unlocked')">
              {{ returnMetaProgress.completed }} / {{ returnMetaProgress.total }}
            </span>
          </summary>

          <div class="stage-body">
            <p class="story-summary">
              {{ returnMetaProgress.completed }} termines, {{ returnMetaProgress.inProgress }} en cours,
              {{ returnMetaProgress.total - returnMetaProgress.completed - returnMetaProgress.inProgress }} non commences
            </p>
            <ul class="return-meta-list">
              <li v-for="meta in returnMetaProgress.achievements" :key="meta.id" class="return-meta-item">
                <span class="return-meta-name">{{ meta.name }} (#{{ meta.id }})</span>
                <span class="return-meta-right">
                  <span :class="statusClass(meta.status)">{{ statusLabel(meta.status) }}</span>
                  <span class="return-meta-progress">{{ meta.current }} / {{ meta.max }}</span>
                </span>
              </li>
            </ul>
          </div>
        </details>
      </div>
    </article>
  </section>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { getLbmUnlockLink } from '@/data/lbmUnlockLinks';

const API_BASE = 'https://api.guildwars2.com/v2';

const DRAGON_STAGES = [
  {
    key: 'lw2',
    order: 1,
    label: 'Living World Saison 2',
    seasonId: 'A515A1D3-4BD7-4594-AE30-2C5D05FF5960',
    achievementId: 7909,
  },
  {
    key: 'hot',
    order: 2,
    label: 'Heart of Thorns',
    seasonId: 'B8901E58-DC9D-4525-ADB2-79C93593291E',
    achievementId: 7856,
  },
  {
    key: 'lw3',
    order: 3,
    label: 'Living World Saison 3',
    seasonId: '09766A86-D88D-4DF2-9385-259E9A8CA583',
    achievementId: 8140,
  },
  {
    key: 'pof',
    order: 4,
    label: 'Path of Fire',
    seasonId: 'EAB597C0-C484-4FD3-9430-31433BAC81B6',
    achievementId: 8421,
  },
  {
    key: 'lw4',
    order: 5,
    label: 'Living World Saison 4',
    seasonId: 'C22AFD21-667A-4AA8-8210-AC74EAEE58BB',
    achievementId: 8415,
  },
  {
    key: 'ibs',
    order: 6,
    label: 'The Icebrood Saga',
    seasonId: 'EDCAE800-302A-4D9B-8331-3CC769ADA0B3',
    achievementId: 8521,
  },
  {
    key: 'sod-final',
    order: 7,
    label: 'Final - Seasons of the Dragons (Amulette)',
    seasonId: null,
    achievementId: 5790,
  },
];

const DRAGON_ACHIEVEMENT_IDS = DRAGON_STAGES.map((stage) => stage.achievementId);
const SOD_MASTER_ACHIEVEMENT_ID = 5790;
const RETURN_META_STAGE_BY_ID = {
  5758: 'lw2',
  5773: 'lw2',
  5804: 'lw2',
  5748: 'lw2',
  5829: 'lw2',
  5742: 'lw3',
  5751: 'lw3',
  5756: 'lw3',
  5779: 'lw3',
  5743: 'lw3',
  5948: 'lw4',
  5884: 'lw4',
  6005: 'lw4',
  5901: 'lw4',
  6023: 'lw4',
  5995: 'lw4',
  5888: 'ibs',
  5991: 'ibs',
  6024: 'ibs',
  5886: 'ibs',
  5869: 'ibs',
  5926: 'ibs',
  5861: 'ibs',
};
const RETURN_META_ACHIEVEMENT_IDS = DRAGON_STAGES.flatMap((stage) =>
  Object.entries(RETURN_META_STAGE_BY_ID)
    .filter(([, stageKey]) => stageKey === stage.key)
    .map(([achievementId]) => Number(achievementId)),
);

const userStore = useUserStore();

const STAGE_TUTORIAL_KEY_BY_STAGE = {
  lw2: 'sod-lw2',
  hot: 'sod-hot',
  lw3: 'sod-lw3',
  pof: 'sod-pof',
  lw4: 'sod-lw4',
  ibs: 'sod-ibs',
  'sod-final': 'sod-final',
};

const loading = ref(false);
const errorMessage = ref('');
const accountName = ref('');
const stagesProgress = ref([]);
const returnMetaProgress = ref({ total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] });

const hasResults = computed(() => stagesProgress.value.length > 0);

const completedStages = computed(
  () => stagesProgress.value.filter((stage) => stage.status === 'unlocked').length,
);

const totalStories = computed(() =>
  stagesProgress.value.reduce((sum, stage) => sum + stage.stories.length, 0),
);

const completedStories = computed(() =>
  stagesProgress.value.reduce((sum, stage) => sum + stage.storyCompleted, 0),
);

const achievementStages = computed(() => stagesProgress.value.length);

const completedAchievementStages = computed(
  () => stagesProgress.value.filter((stage) => stage.achievement.status === 'unlocked').length,
);

const globalProgress = computed(() => {
  if (!stagesProgress.value.length) return 0;
  const total = stagesProgress.value.reduce((sum, stage) => sum + stage.progress, 0);
  return Math.round(total / stagesProgress.value.length);
});

const statusLabel = (status) => {
  if (status === 'unlocked') return '✅ Termine';
  if (status === 'in-progress') return '🟡 En cours';
  if (status === 'locked') return '❌ Non commence';
  return 'A verifier';
};

const statusClass = (status) => {
  if (status === 'unlocked') return 'status-ok';
  if (status === 'in-progress') return 'status-progress';
  if (status === 'locked') return 'status-ko';
  return 'status-unknown';
};

const getStageTutorialLink = (stageKey) => {
  const tutorialKey = STAGE_TUTORIAL_KEY_BY_STAGE[stageKey];
  return tutorialKey ? getLbmUnlockLink(tutorialKey) : null;
};

const fetchStories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/stories?ids=all&lang=fr`);
    return response.data || [];
  } catch {
    const idsResponse = await axios.get(`${API_BASE}/stories`);
    const ids = idsResponse.data || [];
    const chunks = [];

    for (let i = 0; i < ids.length; i += 140) {
      chunks.push(ids.slice(i, i + 140));
    }

    const allStories = [];
    for (const chunk of chunks) {
      const response = await axios.get(`${API_BASE}/stories?ids=${chunk.join(',')}&lang=fr`);
      allStories.push(...(response.data || []));
    }

    return allStories;
  }
};

const fetchAllAccountAchievements = async (apiKey) => {
  const allAchievements = [];
  let page = 0;
  const pageSize = 200;

  while (page < 60) {
    const response = await axios.get(
      `${API_BASE}/account/achievements?access_token=${apiKey}&page=${page}&page_size=${pageSize}`,
    );
    const chunk = response.data || [];
    allAchievements.push(...chunk);

    if (chunk.length < pageSize) {
      break;
    }

    page += 1;
  }

  return allAchievements;
};

const fetchReturnMetaProgress = async (accountAchievementMap) => {
  const returnMetaIds = RETURN_META_ACHIEVEMENT_IDS;
  const allTrackedIds = [...new Set([...returnMetaIds, SOD_MASTER_ACHIEVEMENT_ID])];

  if (!allTrackedIds.length) {
    return { total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] };
  }

  const definitionResponse = await axios.get(`${API_BASE}/achievements?ids=${allTrackedIds.join(',')}&lang=fr`);
  const definitionMap = new Map((definitionResponse.data || []).map((achievement) => [achievement.id, achievement]));

  let completed = 0;
  let inProgress = 0;
  const achievements = [];

  for (const id of [...returnMetaIds, SOD_MASTER_ACHIEVEMENT_ID]) {
    const accountAchievement = accountAchievementMap.get(id) || null;
    const definition = definitionMap.get(id) || null;
    const parsed = parseAchievementProgress(accountAchievement, definition);

    if (parsed.status === 'unlocked') {
      completed += 1;
    } else if (parsed.status === 'in-progress') {
      inProgress += 1;
    }

    achievements.push({
      id,
      name: parsed.name,
      current: parsed.current,
      max: parsed.max,
      status: parsed.status,
    });
  }

  return {
    total: allTrackedIds.length,
    completed,
    inProgress,
    ids: allTrackedIds,
    achievements,
  };
};

const formatApiError = (error) => {
  const status = error?.response?.status;
  const endpoint = error?.config?.url?.replace(/access_token=[^&]+/g, 'access_token=***');
  const apiText = error?.response?.data?.text;

  if (status === 404) {
    if (endpoint) {
      return `Endpoint introuvable (404) : ${endpoint}`;
    }
    return 'Endpoint API introuvable (404).';
  }

  return apiText || error?.message || "Erreur lors de l'analyse du suivi Saison des Dragons.";
};

const buildStoryStatusesFromAchievement = (stories, achievement) => {
  if (!stories.length) return [];

  if (achievement.status === 'unlocked') {
    return stories.map((story) => ({
      ...story,
      status: 'unlocked',
    }));
  }

  const ratio = achievement.max > 0 ? Math.max(0, Math.min(1, achievement.current / achievement.max)) : 0;
  const unlockedCount = Math.floor(ratio * stories.length);
  const hasProgress = achievement.status === 'in-progress' || unlockedCount > 0;

  return stories.map((story, index) => {
    if (index < unlockedCount) {
      return {
        ...story,
        status: 'unlocked',
      };
    }

    if (index === unlockedCount && hasProgress) {
      return {
        ...story,
        status: 'in-progress',
      };
    }

    return {
      ...story,
      status: 'locked',
    };
  });
};

const buildStoryStatusesFromBits = ({ stories, accountAchievement, definition }) => {
  if (!stories.length || !definition) {
    return null;
  }

  if (accountAchievement?.done) {
    return stories.map((story) => ({
      ...story,
      status: 'unlocked',
    }));
  }

  const definitionBits = Array.isArray(definition.bits) ? definition.bits : [];
  const objectiveBitIndexes = definitionBits
    .map((bit, index) => ({ bit, index }))
    .filter(({ bit }) => {
      if (typeof bit === 'string') {
        return true;
      }

      if (!bit || typeof bit !== 'object') {
        return false;
      }

      return bit.type === 'Objective' || bit.type === 'Text';
    })
    .map(({ index }) => index);

  if (!objectiveBitIndexes.length || objectiveBitIndexes.length !== stories.length) {
    return null;
  }

  const completedBits = new Set(
    (Array.isArray(accountAchievement?.bits) ? accountAchievement.bits : []).filter((bitIndex) =>
      Number.isInteger(bitIndex),
    ),
  );

  const mappedStories = stories.map((story, index) => ({
    ...story,
    status: completedBits.has(objectiveBitIndexes[index]) ? 'unlocked' : 'locked',
  }));

  if (mappedStories.every((story) => story.status === 'locked')) {
    return mappedStories;
  }

  const firstLockedIndex = mappedStories.findIndex((story) => story.status === 'locked');
  if (firstLockedIndex >= 0) {
    mappedStories[firstLockedIndex] = {
      ...mappedStories[firstLockedIndex],
      status: 'in-progress',
    };
  }

  return mappedStories;
};

const parseAchievementProgress = (accountAchievement, definition) => {
  if (!accountAchievement) {
    return {
      name: definition?.name || `Succes #${definition?.id || 'inconnu'}`,
      current: 0,
      max: 0,
      status: 'locked',
    };
  }

  const done = Boolean(accountAchievement.done);
  const current = Number.isFinite(accountAchievement.current) ? Number(accountAchievement.current) : 0;
  const max = Number.isFinite(accountAchievement.max) ? Number(accountAchievement.max) : 0;

  let status = 'locked';
  if (done) {
    status = 'unlocked';
  } else if (current > 0) {
    status = 'in-progress';
  }

  return {
    name: definition?.name || `Succes #${definition?.id || accountAchievement.id}`,
    current: done && max === 0 ? 1 : current,
    max: done && max === 0 ? 1 : Math.max(max, 1),
    status,
  };
};

const buildStageAchievementFromReturnMetas = ({
  stage,
  returnMetaAchievements,
  fallbackAchievement,
  masterAchievementStatus,
}) => {
  if (masterAchievementStatus === 'unlocked') {
    return {
      name: `Meta-succes de retour - ${stage.label}`,
      current: 1,
      max: 1,
      status: 'unlocked',
    };
  }

  const mapped = (returnMetaAchievements || []).filter(
    (achievement) => RETURN_META_STAGE_BY_ID[achievement.id] === stage.key,
  );

  if (!mapped.length) {
    return fallbackAchievement;
  }

  const completed = mapped.filter((achievement) => achievement.status === 'unlocked').length;
  const inProgress = mapped.some((achievement) => achievement.status === 'in-progress');
  const max = mapped.length;

  let status = 'locked';
  if (completed === max) {
    status = 'unlocked';
  } else if (completed > 0 || inProgress) {
    status = 'in-progress';
  }

  return {
    name: `Meta-succes de retour - ${stage.label}`,
    current: completed,
    max,
    status,
  };
};

const mergeStageStatus = ({ stories, achievement }) => {
  const completedStoriesCount = stories.filter((story) => story.status === 'unlocked').length;
  const hasStoryProgress = stories.some((story) => story.status === 'in-progress' || story.status === 'unlocked');

  if (stories.length === 0) {
    return achievement.status;
  }

  if (completedStoriesCount === stories.length && achievement.status === 'unlocked') {
    return 'unlocked';
  }

  if (hasStoryProgress || achievement.status === 'in-progress' || achievement.status === 'unlocked') {
    return 'in-progress';
  }

  return 'locked';
};

const computeStageProgress = ({ stories, achievement }) => {
  const storyPart = stories.length
    ? stories.filter((story) => story.status === 'unlocked').length / stories.length
    : null;

  let achievementPart = 0;
  if (achievement.status === 'unlocked') {
    achievementPart = 1;
  } else if (achievement.max > 0) {
    achievementPart = achievement.current / achievement.max;
  }

  if (storyPart === null) {
    return Math.round(achievementPart * 100);
  }

  return Math.round((storyPart * 0.6 + achievementPart * 0.4) * 100);
};

const analyzeProgress = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const apiKey = (userStore.getApiKey() || userStore.apiKey || '').trim();
    if (!apiKey) {
      throw new Error('Aucune cle API enregistree. Ajoutez-la dans le panneau API principal.');
    }

    const [tokenInfoResponse, accountResponse] = await Promise.all([
      axios.get(`${API_BASE}/tokeninfo?access_token=${apiKey}`),
      axios.get(`${API_BASE}/account?access_token=${apiKey}`),
    ]);

    const permissions = tokenInfoResponse.data.permissions || [];
    if (!permissions.includes('progression')) {
      throw new Error("La cle API doit contenir la permission 'progression'.");
    }

    accountName.value = accountResponse.data.name || '';

    const [allAccountAchievements, allStories, achievementDefinitionsResponse] =
      await Promise.all([
        fetchAllAccountAchievements(apiKey),
        fetchStories(),
        axios.get(`${API_BASE}/achievements?ids=${DRAGON_ACHIEVEMENT_IDS.join(',')}&lang=fr`),
      ]);

    const accountAchievementMap = new Map(
      (allAccountAchievements || []).map((achievement) => [achievement.id, achievement]),
    );
    const achievementDefinitionMap = new Map(
      (achievementDefinitionsResponse.data || []).map((achievement) => [achievement.id, achievement]),
    );

    let returnProgress = { total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] };
    try {
      returnProgress = await fetchReturnMetaProgress(accountAchievementMap);
    } catch {
      returnProgress = { total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] };
    }

    const masterAchievementStatus =
      returnProgress.achievements.find((achievement) => achievement.id === SOD_MASTER_ACHIEVEMENT_ID)?.status ||
      'locked';

    const orderedStages = DRAGON_STAGES.map((stage) => {
      const rawStories = stage.seasonId
        ? allStories
            .filter((story) => story.season === stage.seasonId)
            .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
            .map((story) => ({
              id: story.id,
              name: story.name,
              status: 'locked',
            }))
        : [];

      const fallbackAchievement = parseAchievementProgress(
        accountAchievementMap.get(stage.achievementId),
        achievementDefinitionMap.get(stage.achievementId),
      );
      const storiesFromBits = buildStoryStatusesFromBits({
        stories: rawStories,
        accountAchievement: accountAchievementMap.get(stage.achievementId),
        definition: achievementDefinitionMap.get(stage.achievementId),
      });
      const achievement =
        stage.key === 'sod-final'
          ? fallbackAchievement
          : buildStageAchievementFromReturnMetas({
              stage,
              returnMetaAchievements: returnProgress.achievements,
              fallbackAchievement,
              masterAchievementStatus,
            });
      const stories = storiesFromBits || buildStoryStatusesFromAchievement(rawStories, achievement);

      const stageStatus = mergeStageStatus({ stories, achievement });
      const progress = computeStageProgress({ stories, achievement });

      return {
        ...stage,
        stories,
        storyCompleted: stories.filter((story) => story.status === 'unlocked').length,
        achievement,
        status: stageStatus,
        progress,
      };
    });

    stagesProgress.value = orderedStages;
    returnMetaProgress.value = returnProgress;
  } catch (error) {
    errorMessage.value = formatApiError(error);
    stagesProgress.value = [];
    accountName.value = '';
    returnMetaProgress.value = { total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] };
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
.dragon-regalia {
  padding: 1rem;
  display: grid;
  gap: 1rem;
  color: #000;
}

.top-row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 1rem;
  align-items: start;
}

.panel {
  background: #f4f4f493;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
}

.api-form {
  display: grid;
  gap: 0.5rem;
}

.help-text {
  margin: 0;
  color: #000;
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

.score-panel {
  height: fit-content;
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

.error-box {
  margin: 0;
  padding: 0.75rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #000;
}

.stage-accordion {
  display: grid;
  gap: 0.6rem;
}

.stage-item {
  --stage-color: #8b1e24;
  --stage-soft: #fff3f3;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: var(--stage-soft);
  padding: 0.3rem 0.7rem;
  border-left: 6px solid var(--stage-color);
}

.stage-item summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.45rem 0;
  cursor: pointer;
  font-weight: 600;
  color: #000;
}

.stage-body {
  border-top: 1px solid #e5e7eb;
  padding: 0.55rem 0;
  display: grid;
  gap: 0.6rem;
}

.stage-lw2 {
  --stage-color: #5f6fb2;
  --stage-soft: #f3f5ff;
}

.stage-hot {
  --stage-color: #3a6b2f;
  --stage-soft: #f3faef;
}

.stage-lw3 {
  --stage-color: #367894;
  --stage-soft: #edf9ff;
}

.stage-pof {
  --stage-color: #b66a1e;
  --stage-soft: #fff7ef;
}

.stage-lw4 {
  --stage-color: #8d4a99;
  --stage-soft: #fcf2ff;
}

.stage-ibs {
  --stage-color: #4a8cc7;
  --stage-soft: #f1f8ff;
}

.stage-sod-final {
  --stage-color: #9b6a2a;
  --stage-soft: #fff7ef;
}

.story-block h5,
.achievement-block h5 {
  margin: 0.35rem 0;
}

.story-summary,
.achievement-progress,
.achievement-name {
  margin: 0.2rem 0;
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

.story-block ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.return-meta-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.35rem;
}

.return-meta-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  border-bottom: 1px dashed #d1d5db;
}

.return-meta-name {
  font-weight: 600;
}

.return-meta-right {
  display: flex;
  gap: 0.75rem;
  white-space: nowrap;
}

.return-meta-progress {
  font-weight: 600;
}

.story-block li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.2rem 0;
}

.empty-text {
  margin: 0;
}

.status-ok {
  color: #000;
  font-weight: 600;
}

.status-progress {
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

  .input-row {
    flex-direction: column;
  }
}
</style>