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

const CURRENT_EVENT_ACHIEVEMENTS = [
  {
    key: 'sod-master',
    order: 1,
    id: 5790,
    fallbackName: 'Seasons of the Dragons',
    requirement: 'Complete les 24 meta-succes Return pour debloquer la regalia.',
  },
  {
    key: 'return-to-research',
    order: 2,
    id: 5823,
    fallbackName: 'Return to Research',
    requirement: 'Apres Champions episode 5, parle a Taimi et Gorrik a l Eye of the North.',
  },
  {
    key: 'studying-scarlet',
    order: 3,
    id: 5830,
    fallbackName: 'Studying Scarlet',
    requirement: 'Se debloque apres Return to Research et Return to Silverwastes 2.',
  },
  {
    key: 'peer-review',
    order: 4,
    id: 5851,
    fallbackName: 'Peer Review',
    requirement: 'Se debloque apres Studying Scarlet et Return to Siren\'s Landing.',
  },
  {
    key: 'parallel-analysis',
    order: 5,
    id: 5990,
    fallbackName: 'Parallel Analysis',
    requirement: 'Se debloque apres Peer Review et Return to Dragonfall.',
  },
  {
    key: 'end-conjecture',
    order: 6,
    id: 5960,
    fallbackName: 'End Conjecture',
    requirement: 'Se debloque apres Parallel Analysis et Return to the Dragonstorm.',
  },
];

const DRAGON_ACHIEVEMENT_IDS = DRAGON_STAGES.map((stage) => stage.achievementId);
const CURRENT_EVENT_ACHIEVEMENT_IDS = CURRENT_EVENT_ACHIEVEMENTS.map((achievement) => achievement.id);
const TRACKED_ACHIEVEMENT_IDS = [...new Set([...DRAGON_ACHIEVEMENT_IDS, ...CURRENT_EVENT_ACHIEVEMENT_IDS])];
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

const STAGE_TUTORIAL_KEY_BY_STAGE = {
  lw2: 'sod-lw2',
  hot: 'sod-hot',
  lw3: 'sod-lw3',
  pof: 'sod-pof',
  lw4: 'sod-lw4',
  ibs: 'sod-ibs',
  'sod-final': 'sod-final',
};

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

const parseAchievementProgress = (accountAchievement, definition, fallbackName) => {
  if (!accountAchievement) {
    return {
      name: definition?.name || fallbackName || `Succes #${definition?.id || 'inconnu'}`,
      current: 0,
      max: 1,
      status: 'locked',
    };
  }

  const done = Boolean(accountAchievement.done);
  const current = Number.isFinite(accountAchievement.current) ? Number(accountAchievement.current) : 0;
  const max = Number.isFinite(accountAchievement.max) ? Number(accountAchievement.max) : 0;

  let status = 'locked';
  if (done) {
    status = 'unlocked';
  } else if (current > 0 || (Array.isArray(accountAchievement.bits) && accountAchievement.bits.length > 0)) {
    status = 'in-progress';
  }

  return {
    name: definition?.name || fallbackName || `Succes #${definition?.id || accountAchievement.id}`,
    current: done && max === 0 ? 1 : current,
    max: done && max === 0 ? 1 : Math.max(max, 1),
    status,
  };
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

export const useSeasonOfDragonsTracker = () => {
  const userStore = useUserStore();

  const loading = ref(false);
  const errorMessage = ref('');
  const accountName = ref('');
  const stagesProgress = ref([]);
  const currentEventAchievements = ref([]);
  const returnMetaProgress = ref({ total: 0, completed: 0, inProgress: 0, ids: [], achievements: [] });

  const hasResults = computed(
    () => stagesProgress.value.length > 0 || currentEventAchievements.value.length > 0,
  );

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

  const completedCurrentEventAchievements = computed(
    () => currentEventAchievements.value.filter((achievement) => achievement.status === 'unlocked').length,
  );

  const currentEventAchievementCount = computed(() => currentEventAchievements.value.length);

  const globalProgress = computed(() => {
    if (!stagesProgress.value.length) return 0;
    const total = stagesProgress.value.reduce((sum, stage) => sum + stage.progress, 0);
    return Math.round(total / stagesProgress.value.length);
  });

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

      const [allAccountAchievements, allStories, achievementDefinitionsResponse] = await Promise.all([
        fetchAllAccountAchievements(apiKey),
        fetchStories(),
        axios.get(`${API_BASE}/achievements?ids=${TRACKED_ACHIEVEMENT_IDS.join(',')}&lang=fr`),
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
          stage.label,
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

      const orderedCurrentEvents = CURRENT_EVENT_ACHIEVEMENTS.map((entry) => {
        const parsed = parseAchievementProgress(
          accountAchievementMap.get(entry.id),
          achievementDefinitionMap.get(entry.id),
          entry.fallbackName,
        );

        return {
          ...entry,
          name: parsed.name,
          current: parsed.current,
          max: parsed.max,
          status: parsed.status,
        };
      });

      stagesProgress.value = orderedStages;
      currentEventAchievements.value = orderedCurrentEvents;
      returnMetaProgress.value = returnProgress;
    } catch (error) {
      errorMessage.value = formatApiError(error);
      stagesProgress.value = [];
      currentEventAchievements.value = [];
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

  return {
    achievementStages,
    accountName,
    analyzeProgress,
    completedAchievementStages,
    completedCurrentEventAchievements,
    completedStages,
    completedStories,
    currentEventAchievementCount,
    currentEventAchievements,
    errorMessage,
    getStageTutorialLink,
    globalProgress,
    hasResults,
    loading,
    returnMetaProgress,
    stagesProgress,
    statusClass,
    statusLabel,
    totalStories,
  };
};