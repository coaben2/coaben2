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
        <div class="score-track">
          <div class="score-track-fill" :style="{ width: `${globalProgress}%` }" />
        </div>
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

    <div v-if="hasResults" class="panel observatory-overview">
      <div class="overview-top">
        <h3>Vue observatoire</h3>
        <label class="toggle">
          <input v-model="hideCompleted" type="checkbox" />
          <span>Afficher uniquement les elements restants</span>
        </label>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <p class="kpi-label">Etapes terminees</p>
          <p class="kpi-value">{{ completedStages }} / {{ stagesProgress.length }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">Current Events finis</p>
          <p class="kpi-value">{{ completedCurrentEventAchievements }} / {{ currentEventAchievementCount }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">Meta retour termines</p>
          <p class="kpi-value">{{ returnMetaProgress.completed }} / {{ returnMetaProgress.total || 0 }}</p>
        </div>
        <div class="kpi-card">
          <p class="kpi-label">En cours</p>
          <p class="kpi-value">{{ inProgressCount }}</p>
        </div>
      </div>

      <div v-if="nextObjectives.length" class="next-steps">
        <h4>Prochaines etapes conseillees</h4>
        <ul>
          <li v-for="objective in nextObjectives" :key="objective.key">
            <strong>{{ objective.kind }}</strong> : {{ objective.label }}
          </li>
        </ul>
      </div>
    </div>

    <article v-if="hasResults" class="panel">
      <h3>Timeline des etapes</h3>
      <div class="stage-timeline">
        <div
          v-for="stage in stagesProgress"
          :key="`${stage.key}-chip`"
          :class="['timeline-chip', `timeline-${stage.key}`, statusClass(stage.status)]"
        >
          <span>#{{ stage.order }}</span>
          <span>{{ stage.label }}</span>
          <strong>{{ stage.progress }}%</strong>
        </div>
      </div>
    </article>

    <article v-if="hasResults" class="panel">
      <h3>Succes Current Events</h3>
      <p class="story-summary">
        {{ completedCurrentEventAchievements }} / {{ currentEventAchievementCount }} succes valides
      </p>

      <ul class="current-event-list">
        <li
          v-for="achievement in filteredCurrentEvents"
          :key="achievement.id"
          class="current-event-item"
        >
          <div class="current-event-main">
            <p class="achievement-name">#{{ achievement.order }} - {{ achievement.name }}</p>
            <p class="current-event-requirement">{{ achievement.requirement }}</p>
            <div class="inline-progress">
              <div class="inline-progress-fill" :style="{ width: `${achievementPercent(achievement)}%` }" />
            </div>
          </div>
          <div class="current-event-side">
            <span :class="statusClass(achievement.status)">{{ statusLabel(achievement.status) }}</span>
            <span class="return-meta-progress">{{ achievement.current }} / {{ achievement.max }}</span>
          </div>
        </li>
      </ul>
      <p v-if="filteredCurrentEvents.length === 0" class="empty-text">
        Tous les succes Current Events visibles sont deja termines.
      </p>
    </article>

    <article v-if="hasResults" class="panel">
      <h3>Suivi ordonne de l'histoire et des succes</h3>

      <div class="stage-accordion">
        <details
          v-for="stage in filteredStages"
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
            <div class="inline-progress">
              <div class="inline-progress-fill" :style="{ width: `${stage.progress}%` }" />
            </div>

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
      </div>

      <p v-if="filteredStages.length === 0" class="empty-text">
        Toutes les etapes sont marquees comme terminees avec le filtre actif.
      </p>
    </article>

    <article v-if="hasResults && returnMetaProgress.total > 0" class="panel">
      <h3>24 meta-succes (retour + final)</h3>
      <p :class="statusClass(returnMetaSummaryStatus)">
        {{ returnMetaProgress.completed }} termines, {{ returnMetaProgress.inProgress }} en cours,
        {{ returnMetaProgress.total - returnMetaProgress.completed - returnMetaProgress.inProgress }} non commences
      </p>

      <ul class="return-meta-list">
        <li v-for="meta in filteredReturnMetas" :key="meta.id" class="return-meta-item">
          <span class="return-meta-name">{{ meta.name }} (#{{ meta.id }})</span>
          <span class="return-meta-right">
            <span :class="statusClass(meta.status)">{{ statusLabel(meta.status) }}</span>
            <span class="return-meta-progress">{{ meta.current }} / {{ meta.max }}</span>
          </span>
        </li>
      </ul>
      <p v-if="filteredReturnMetas.length === 0" class="empty-text">
        Toutes les metas sont terminees avec le filtre actif.
      </p>
    </article>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useSeasonOfDragonsTracker } from './useSeasonOfDragons';

const {
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
} = useSeasonOfDragonsTracker();

const hideCompleted = ref(false);

const filteredStages = computed(() =>
  hideCompleted.value
    ? stagesProgress.value.filter((stage) => stage.status !== 'unlocked')
    : stagesProgress.value,
);

const filteredCurrentEvents = computed(() =>
  hideCompleted.value
    ? currentEventAchievements.value.filter((achievement) => achievement.status !== 'unlocked')
    : currentEventAchievements.value,
);

const filteredReturnMetas = computed(() => {
  const allMetas = returnMetaProgress.value.achievements || [];
  if (!hideCompleted.value) {
    return allMetas;
  }
  return allMetas.filter((meta) => meta.status !== 'unlocked');
});

const returnMetaSummaryStatus = computed(() => {
  const total = returnMetaProgress.value.total || 0;
  const completed = returnMetaProgress.value.completed || 0;
  const inProgress = returnMetaProgress.value.inProgress || 0;

  if (total > 0 && completed === total) return 'unlocked';
  if (inProgress > 0 || completed > 0) return 'in-progress';
  return 'locked';
});

const inProgressCount = computed(() => {
  const stageInProgress = stagesProgress.value.filter((stage) => stage.status === 'in-progress').length;
  const eventInProgress = currentEventAchievements.value.filter((achievement) => achievement.status === 'in-progress').length;
  const returnInProgress = returnMetaProgress.value.inProgress || 0;

  return stageInProgress + eventInProgress + returnInProgress;
});

const nextObjectives = computed(() => {
  const objectives = [];

  for (const stage of stagesProgress.value) {
    if (stage.status !== 'unlocked') {
      objectives.push({
        key: `stage-${stage.key}`,
        kind: 'Etape',
        label: `${stage.label} (${stage.progress}%)`,
      });
    }
  }

  for (const achievement of currentEventAchievements.value) {
    if (achievement.status !== 'unlocked') {
      objectives.push({
        key: `current-${achievement.id}`,
        kind: 'Current Event',
        label: `${achievement.name} (${achievement.current}/${achievement.max})`,
      });
    }
  }

  for (const meta of returnMetaProgress.value.achievements || []) {
    if (meta.status !== 'unlocked') {
      objectives.push({
        key: `meta-${meta.id}`,
        kind: 'Meta retour',
        label: `${meta.name} (${meta.current}/${meta.max})`,
      });
    }
  }

  return objectives.slice(0, 8);
});

const achievementPercent = (achievement) => {
  const max = Math.max(Number(achievement.max) || 0, 1);
  const current = Math.max(Number(achievement.current) || 0, 0);
  return Math.round((current / max) * 100);
};
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

.score-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.score-track-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d6efd, #22c55e);
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

.observatory-overview {
  display: grid;
  gap: 0.9rem;
}

.overview-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.overview-top h3 {
  margin: 0;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.92rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 0.65rem;
}

.kpi-card {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f8fafc;
  padding: 0.6rem;
}

.kpi-label {
  margin: 0;
  font-size: 0.84rem;
  color: #374151;
}

.kpi-value {
  margin: 0.25rem 0 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.next-steps {
  border-top: 1px solid #d1d5db;
  padding-top: 0.8rem;
}

.next-steps h4 {
  margin: 0 0 0.45rem;
}

.next-steps ul {
  margin: 0;
  padding-left: 1rem;
}

.stage-timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 0.55rem;
}

.timeline-chip {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.45rem 0.7rem;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
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

.inline-progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.inline-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d6efd, #16a34a);
}

.stage-lw2,
.timeline-lw2 {
  --stage-color: #5f6fb2;
  --stage-soft: #f3f5ff;
}

.stage-hot,
.timeline-hot {
  --stage-color: #3a6b2f;
  --stage-soft: #f3faef;
}

.stage-lw3,
.timeline-lw3 {
  --stage-color: #367894;
  --stage-soft: #edf9ff;
}

.stage-pof,
.timeline-pof {
  --stage-color: #b66a1e;
  --stage-soft: #fff7ef;
}

.stage-lw4,
.timeline-lw4 {
  --stage-color: #8d4a99;
  --stage-soft: #fcf2ff;
}

.stage-ibs,
.timeline-ibs {
  --stage-color: #4a8cc7;
  --stage-soft: #f1f8ff;
}

.stage-sod-final,
.timeline-sod-final {
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

.story-block ul,
.return-meta-list,
.current-event-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.return-meta-list {
  display: grid;
  gap: 0.35rem;
}

.current-event-list {
  display: grid;
  gap: 0.55rem;
}

.current-event-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px dashed #d1d5db;
}

.current-event-main {
  display: grid;
  gap: 0.25rem;
  flex: 1;
}

.current-event-requirement {
  margin: 0;
  color: #374151;
  font-size: 0.92rem;
}

.current-event-side {
  display: grid;
  justify-items: end;
  gap: 0.3rem;
  white-space: nowrap;
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

  .kpi-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }

  .input-row {
    flex-direction: column;
  }

  .current-event-item,
  .return-meta-item {
    flex-direction: column;
  }

  .current-event-side,
  .return-meta-right {
    justify-items: start;
    white-space: normal;
  }
}
</style>
