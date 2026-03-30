<script setup>
import { ref } from 'vue';
import gw2Builds from '@/data/gw2Builds.json';

defineProps({
  builds: {
    type: Array,
    required: true,
  },
  profession: {
    type: String,
    required: false,
    default: '',
  },
  showProfession: {
    type: Boolean,
    default: false,
  },
});

const copiedId = ref(null);
const isEnriching = ref(false);
const enrichStatus = ref('');
const isDev = import.meta.env.DEV;
const isAddingBuild = ref(false);
const newBuild = ref({
  id: '',
  name: '',
  specialization: '',
  mode: 'PvE',
  source: 'Snowcrows',
  chatCode: '',
  details: {
    weapons: '',
    stats: '',
    runes: '',
    sigils: ''
  }
});

const professionMapping = {
  // Guerrier
  'Berserker': 'guerrier', 'Brise-sort': 'guerrier', 'Lame-jurée': 'guerrier', 'guerrier': 'guerrier',
  // Gardien
  'Draconnier': 'gardien', 'Incendiaire': 'gardien', 'Subjugueur': 'gardien', 'gardien': 'gardien',
  // Revenant
  'Héraut': 'revenant', 'Renégat': 'revenant', 'Justicier': 'revenant', 'revenant': 'revenant',
  // Rôdeur
  'Druide': 'rodeur', 'Animorphe': 'rodeur', 'Indomptable': 'rodeur', 'rodeur': 'rodeur',
  // Voleur
  'Fracasseur': 'voleur', 'Sniper': 'voleur', 'Spectre': 'voleur', 'voleur': 'voleur',
  // Ingénieur
  'Scrapper': 'ingenieur', 'Holographiste': 'ingenieur', 'Mécatronicien': 'ingenieur', 'ingenieur': 'ingenieur',
  // Élémentaliste
  'Cataclyste': 'elementaliste', 'Tisse-sort': 'elementaliste', 'Catalyseur': 'elementaliste', 'elementaliste': 'elementaliste',
  // Envoûteur
  'Chronomancien': 'envouteur', 'Mirage': 'envouteur', 'Virtuose': 'envouteur', 'envouteur': 'envouteur',
  // Nécromant
  'Faucheur': 'necromant', 'Fléau': 'necromant', 'Augure': 'necromant', 'necromant': 'necromant'
};

const sources = ['Snowcrows', 'Discretize', 'GuildJen', 'Metabattle', 'GW2Mists'];

const saveBuild = async () => {
  const profKey = professionMapping[newBuild.value.specialization];
  if (!profKey) {
    enrichStatus.value = "Erreur: Spécialisation inconnue pour le mapping de profession.";
    return;
  }

  try {
    const response = await fetch('/api/add-build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        build: { ...newBuild.value },
        profession: profKey
      })
    });
    const data = await response.json();
    if (data.success) {
      enrichStatus.value = 'Build ajouté !';
      isAddingBuild.value = false;
      // Reset form
      newBuild.value = {
        id: '', name: '', specialization: '', mode: 'PvE', source: 'Snowcrows', chatCode: '',
        details: { weapons: '', stats: '', runes: '', sigils: '' }
      };
    } else {
      enrichStatus.value = `Erreur: ${data.error}`;
    }
  } catch (err) {
    enrichStatus.value = `Erreur: ${err.message}`;
  }
};

const enrichData = async () => {
  isEnriching.value = true;
  enrichStatus.value = 'Calcul en cours...';
  try {
    const response = await fetch('/api/enrich', { method: 'POST' });
    const data = await response.json();
    if (data.success) {
      enrichStatus.value = 'Enrichissement terminé ! (Vite peut redémarrer)';
    } else {
      enrichStatus.value = `Erreur: ${data.error}`;
    }
  } catch (err) {
    enrichStatus.value = `Erreur: ${err.message}`;
  } finally {
    isEnriching.value = false;
    setTimeout(() => {
      enrichStatus.value = '';
    }, 5000);
  }
};

const copyToClipboard = async (text, id) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedId.value = id;
    setTimeout(() => {
      copiedId.value = null;
    }, 2000);
  } catch (err) {
    console.error('Erreur lors de la copie: ', err);
  }
};

const profColors = {
  guerrier: '#FFD100',
  gardien: '#72C1D9',
  revenant: '#D12727',
  rodeur: '#8DD448',
  voleur: '#C08F95',
  ingenieur: '#D09C59',
  elementaliste: '#F68A87',
  envouteur: '#B679D5',
  necromant: '#52A76F',
};

const getRoleStyle = (mode) => {
  if (!mode) return 'text-gray-20';
  return 'text-gray-20';
};
</script>

<template>
 <div class="w-full mx-auto bg-[#0f0f0f] rounded-xl border border-white/5 shadow-2xl overflow-visible">
    <!-- Dev Only: Control Bar -->
    <div
      v-if="isDev"
      class="p-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <button
          @click="enrichData"
          :disabled="isEnriching"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
        >
          <svg
            v-if="isEnriching"
            class="animate-spin h-3 w-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isEnriching ? 'Enrichissement...' : 'Calculer les icônes' }}
        </button>
        <button
          @click="isAddingBuild = !isAddingBuild"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-lg"
        >
          {{ isAddingBuild ? 'Annuler' : 'Ajouter un Build' }}
        </button>
        <span
          v-if="enrichStatus"
          class="text-[9px] font-black uppercase tracking-widest"
          :class="enrichStatus.includes('Erreur') ? 'text-red-400' : 'text-emerald-400'"
        >
          {{ enrichStatus }}
        </span>
      </div>
      <div class="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">Dev Mode Only</div>
    </div>

    <!-- Add Build Form (Dev Mode) -->
    <div v-if="isAddingBuild && isDev" class="p-6 bg-white/[0.02] border-b border-white/5">
      <h3 class="text-sm font-black uppercase text-blue-400 mb-4 tracking-widest">Nouveau Build</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">ID</label>
          <input v-model="newBuild.id" type="text" placeholder="mes-condi-mirage-pvp" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Nom</label>
          <input v-model="newBuild.name" type="text" placeholder="Condition Mirage" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Spécialisation</label>
          <select v-model="newBuild.specialization" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none">
            <option v-for="spec in Object.keys(professionMapping)" :key="spec" :value="spec">{{ spec }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Mode</label>
          <input v-model="newBuild.mode" type="text" placeholder="PvP" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Source</label>
          <select v-model="newBuild.source" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none">
            <option v-for="src in sources" :key="src" :value="src">{{ src }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Code Chat</label>
          <input v-model="newBuild.chatCode" type="text" placeholder="[&...]" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Armes</label>
          <input v-model="newBuild.details.weapons" type="text" placeholder="Bâton / Bâton" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Stats</label>
          <input v-model="newBuild.details.stats" type="text" placeholder="14 Vipérin" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Rune</label>
          <input v-model="newBuild.details.runes" type="text" placeholder="Aventurier" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
        <div class="space-y-1 lg:col-span-3">
          <label class="text-[9px] font-bold text-gray-500 uppercase">Cachets</label>
          <input v-model="newBuild.details.sigils" type="text" placeholder="Énergie, Destinée, Malice, Tourmente" class="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:border-blue-500 outline-none" />
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="saveBuild" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-xl transition-all">
          Enregistrer le Build
        </button>
      </div>
    </div>

    <table class="w-full text-left border-collapse table-fixed">
      <thead class="bg-[#0a0a0a] border-b border-white/10">
        <tr>
          <th
            class="py-2 pl-8 pr-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold w-[22%]"
          >
            Build
          </th>
          <th
            class="py-2 px-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold w-[10%] text-center border-l border-white/5"
          >
            Role
          </th>
          <th
            class="py-2 px-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold w-[14%] border-l border-white/5"
          >
            Armes
          </th>
          <th
            class="py-2 px-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold border-l border-white/5 w-[20%]"
          >
            Traits
          </th>
          <th
            class="py-2 px-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold border-l border-white/5 w-[24%]"
          >
            Skills
          </th>
          <th
            class="py-2 px-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold text-center border-l border-white/5 w-[10%]"
          >
            Lien
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="build in builds"
          :key="build.id"
          class="group hover:bg-white/[0.02] transition-colors relative"
        >
          <!-- Col 1: Build Info -->
          <td class="py-4 px-6 pl-8 relative">
            <div
              class="absolute left-0 top-0 bottom-0 w-1 z-10"
              :style="{
                backgroundColor: profColors[(build.profession || profession).toLowerCase()],
              }"
            ></div>

            <div class="flex items-center gap-3">
              <!-- Profession Icon -->
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg shrink-0 relative p-1.5 overflow-hidden"
                :style="{
                  backgroundColor:
                    build.profession || profession
                      ? profColors[(build.profession || profession).toLowerCase()]
                      : '#333',
                }"
              >
                <img
                  v-if="build.enriched?.professionIcon"
                  :src="build.enriched.professionIcon"
                  class="w-full h-full object-contain brightness-0 invert"
                />
                <span v-else class="font-black text-black text-[13px]">
                  {{ (build.profession || profession || '??').substring(0, 2).toUpperCase() }}
                </span>
              </div>
              <div class="min-w-0">
                <div
                  class="font-bold text-white text-[16px] leading-tight flex items-center gap-2 truncate"
                >
                  {{ build.name }}
                </div>
                <div class="flex flex-col gap-1.5 mt-1.5">
                  <div class="flex items-center gap-2">
                    <div
                      class="inline-flex items-center w-fit px-2 py-0.5 rounded bg-white/10 text-[9px] text-gray-200 font-extrabold uppercase tracking-[0.15em] border border-white/5"
                    >
                      {{ build.specialization }}
                    </div>
                  </div>
                  <a
                    v-if="gw2Builds.sources && gw2Builds.sources[build.source]"
                    :href="gw2Builds.sources[build.source]"
                    target="_blank"
                    class="hover:text-amber-500 transition-colors flex items-center gap-1.5 underline decoration-white/10 hover:decoration-amber-500/50 underline-offset-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    {{ build.source }}
                  </a>
                  <div
                    v-else
                    class="flex items-center gap-1.5 text-[9px] text-gray-500 font-bold opacity-60"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    {{ build.source }}
                  </div>

                  <!-- Details Section (Stats, Runes, Sigils) -->
                  <div
                    v-if="
                      build.details ||
                      (build.enriched && (build.enriched.rune || build.enriched.sigils?.length))
                    "
                    class="mt-2.5 pt-2 border-t border-white/5 flex flex-col gap-2"
                  >
                    <!-- Stats badge -->
                    <div v-if="build.details?.stats" class="flex items-center gap-2 flex-wrap min-w-0">
                      <div
                        class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500/70 text-[8px] font-black uppercase tracking-wider shrink-0"
                      >
                        Stats
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap min-w-0">
                        <template v-for="(part, i) in build.details.stats.split('+')" :key="i">
                          <span v-if="i > 0" class="text-gray-600 font-black text-[9px] shrink-0">+</span>
                          <span class="text-[9px] text-gray-300 font-bold whitespace-nowrap">
                            {{ part.trim() }}
                          </span>
                        </template>
                      </div>
                    </div>

                    <!-- Rune Section (Icon + Text) -->
                    <div
                      v-if="build.details?.runes || build.enriched?.rune"
                      class="flex items-center gap-2"
                    >
                      <div
                        class="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500/70 text-[8px] font-black uppercase tracking-wider h-fit"
                      >
                        Rune
                      </div>
                      <div class="flex items-center gap-1.5 min-h-[24px]">
                        <img
                          v-if="build.enriched?.rune"
                          :src="build.enriched.rune.icon"
                          :alt="build.enriched.rune.name"
                          :title="build.enriched.rune.name"
                          class="w-6 h-6 rounded border border-white/10"
                        />
                        <span class="text-[9px] text-gray-400 font-bold truncate">{{
                          build.details?.runes || build.enriched?.rune?.name
                        }}</span>
                      </div>
                    </div>

                    <!-- Sigils Section (Icons + List Text) -->
                    <div
                      v-if="build.details?.sigils || build.enriched?.sigils?.length"
                      class="flex items-center gap-2"
                    >
                      <div
                        class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500/70 text-[8px] font-black uppercase tracking-wider h-fit"
                      >
                        Cachets
                      </div>
                      <div class="flex flex-col gap-1">
                        <!-- Sigil Icons (Up to 4) -->
                        <div v-if="build.enriched?.sigils?.length" class="flex items-center gap-1">
                          <img
                            v-for="sigil in build.enriched.sigils"
                            :key="sigil.id"
                            :src="sigil.icon"
                            :alt="sigil.name"
                            :title="sigil.name"
                            class="w-6 h-6 rounded border border-white/10"
                          />
                        </div>
                        <span class="text-[9px] text-gray-400 font-bold truncate">{{
                          build.details?.sigils ||
                          build.enriched?.sigils?.map((s) => s.name).join(', ')
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>

          <!-- Col 2: Role -->
          <td class="py-2 px-6 align-middle text-center border-l border-white/5">
            <div
              v-if="build.mode"
              class="text-[18px] sm:text-[20px] lg:text-[24px] tracking-tighter uppercase font-black leading-none italic"
              :class="getRoleStyle(build.mode)"
            >
              {{ build.mode.replace('PvE ', '').replace(' PvP', '').replace(' / Strike', '') }}
            </div>
          </td>

          <!-- Col 3: Weapons -->
          <td class="py-4 px-6 align-middle border-l border-white/5">
            <div
              class="text-[13px] text-gray-400 font-bold leading-relaxed"
              v-if="build.details?.weapons"
            >
              <div
                v-for="(wep, i) in build.details.weapons.split('+').map((w) => w.trim())"
                :key="i"
                class="truncate flex items-center gap-1.5"
              >
                <span class="opacity-60 text-[10px]">{{ i === 0 ? 'M1' : 'M2' }}</span>
                {{ wep }}
              </div>
            </div>
          </td>

          <!-- Col 4: Traits (Archetypes + 9 Traits) -->
          <td class="py-2 px-6 align-middle border-l border-white/5">
            <div class="flex flex-col gap-1.5" v-if="build.enriched">
              <div
                v-for="(spec, sIdx) in build.enriched.specs?.slice(0, 3)"
                :key="sIdx"
                class="flex items-center gap-2"
              >
                <!-- Spec Icon -->
                <div
                  class="w-10 h-10 rounded-full border border-white/10 bg-white/[0.05] relative group/spec shrink-0"
                >
                  <img
                    :src="spec.icon"
                    class="w-full h-full object-cover p-0.5 rounded-full overflow-hidden"
                  />
                  <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-[7px] text-white rounded opacity-0 group-hover/spec:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none"
                  >
                    {{ spec.name }}
                  </div>
                </div>
                <!-- 3 Traits for this spec -->
                <div class="flex items-center gap-0.5">
                  <template
                    v-for="(trait, tIdx) in build.enriched.traits?.slice(sIdx * 3, (sIdx + 1) * 3)"
                    :key="tIdx"
                  >
                    <div
                      class="w-10 h-10 flex items-center justify-center relative bg-white/[0.03] border border-white/5 group/trait"
                      style="
                        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                      "
                    >
                      <img :src="trait.icon" class="w-full h-full object-cover p-1 opacity-90" />
                      <div
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl opacity-0 scale-95 group-hover/trait:opacity-100 group-hover/trait:scale-100 transition-all pointer-events-none z-[100]"
                      >
                        <div class="text-[9px] font-black uppercase text-emerald-500 mb-1">
                          {{ trait.name }}
                        </div>
                        <div
                          class="text-[8px] text-gray-400 leading-tight description"
                          v-html="trait.description"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </td>

          <!-- Col 5: Skills & Pets -->
          <td class="py-2 px-6 align-middle border-l border-white/5">
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-1" v-if="build.enriched?.skills">
                <div
                  v-for="(skill, idx) in build.enriched.skills.slice(0, 5)"
                  :key="idx"
                  class="w-12 h-12 bg-white/[0.03] border border-white/5 rounded flex items-center justify-center relative group/skill"
                >
                  <img :src="skill.icon" class="w-full h-full p-0.5 rounded overflow-hidden" />
                  <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl opacity-0 scale-95 group-hover/skill:opacity-100 group-hover/skill:scale-100 transition-all pointer-events-none z-[100]"
                  >
                    <div class="text-[10px] font-black uppercase text-amber-500 mb-1">
                      {{ skill.name }}
                    </div>
                    <div
                      class="text-[9px] text-gray-400 leading-tight description"
                      v-html="skill.description"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- Pets -->
              <div v-if="build.enriched?.pets?.length" class="flex items-center gap-1 opacity-80">
                <div class="text-[8px] font-bold text-emerald-600 mr-1 uppercase">Mascottes</div>
                <div
                  v-for="(pet, idx) in build.enriched.pets"
                  :key="idx"
                  class="w-10 h-10 bg-white/[0.05] border border-emerald-500/20 rounded-full flex items-center justify-center relative group/pet"
                >
                  <img
                    :src="pet.icon"
                    class="w-full h-full object-cover rounded-full overflow-hidden"
                  />
                  <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-[8px] text-white rounded opacity-0 group-hover/pet:opacity-100 transition-opacity whitespace-nowrap z-[100] pointer-events-none"
                  >
                    {{ pet.name }}
                  </div>
                </div>
              </div>
            </div>
          </td>

          <!-- Col 6: Lien -->
          <td class="py-2 px-6 align-middle text-center border-l border-white/5">
            <button
              v-if="build.chatCode"
              @click="copyToClipboard(build.chatCode, build.id)"
              class="inline-flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 group/btn"
            >
              <svg
                v-if="copiedId === build.id"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-emerald-500 mb-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500 group-hover/btn:text-gray-300 mb-0.5 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              <span
                class="text-[9px] font-black uppercase tracking-[0.2em]"
                :class="
                  copiedId === build.id
                    ? 'text-emerald-500'
                    : 'text-gray-500 group-hover/btn:text-gray-300'
                "
              >
                {{ copiedId === build.id ? 'OK' : 'Code' }}
              </span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

<div class="bg-[#050505] py-3 px-6 border-t border-white/5 text-center">
  <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
    Pour plus de build voir les sites :
    <a href="https://snowcrows.com" target="_blank" class="hover:text-white transition-colors ml-2">Snowcrows</a>,
    <a href="https://gw2mists.com" target="_blank" class="hover:text-white transition-colors ml-2">GW2Mists</a>,
    <a href="https://guildjen.com" target="_blank" class="hover:text-white transition-colors ml-2">GuildJen</a>,
    <a href="https://discretize.eu" target="_blank" class="hover:text-white transition-colors ml-2">Discretize</a>,
    <a href="https://metabattle.com" target="_blank" class="hover:text-white transition-colors ml-2">Metabattle</a>
  </span>
</div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.description) {
  color: #aaa;
}
:deep(.description) b {
  color: #fff;
}
:deep(.description) p {
  margin: 0;
}
</style>
