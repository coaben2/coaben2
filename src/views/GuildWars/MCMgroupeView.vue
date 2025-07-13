<template>
  <h1>GW2 - Groupes dynamiques</h1>
  
  <!-- Sélecteur de mode -->
  <div class="mode-selector">
    <button 
      :class="{ active: currentMode === 'mcm' }" 
      @click="switchMode('mcm')"
    >
      MCM (10 groupes de 5)
    </button>
    <button 
      :class="{ active: currentMode === 'pve' }" 
      @click="switchMode('pve')"
    >
      PVE (2 groupes de 5)
    </button>
  </div>

  <div id="groups">
    <div v-for="(group, groupIndex) in groups" :key="groupIndex" class="group">
      <div class="buff-column">
        <div 
          v-for="buff in currentRequiredBuffs" 
          :key="buff" 
          class="buff"
          :data-count="getBuffCount(group, buff)"
        >
          {{ getBuffDisplay(group, buff) }}
        </div>
      </div>
      
      <div class="members-column">
        <div v-for="(member, memberIndex) in group" :key="memberIndex" class="member">
          <img 
            v-if="member && specializations[member]" 
            :src="specializations[member].icon" 
            :alt="member"
          />
          <div v-else class="placeholder"></div>
          
          <select 
            :value="member || ''" 
            @change="updateMember(groupIndex, memberIndex, $event.target.value)"
          >
            <option value="">-- Choisir --</option>
            <option 
              v-for="specName in Object.keys(specializations)" 
              :key="specName" 
              :value="specName"
            >
              {{ specName }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

const API_URL = 'https://api.guildwars2.com/v2/specializations?lang=fr'

// Buffs MCM
const requiredBuffsMCM = [
  'Pouvoir',
  'Stabilité',
  'Célérité',
  'Alacrité',
  'Résistance',
  'Super vitesse',
  'Régénération',
  'Soin',
  'Fureur',
  'Protection',
]

// Buffs PVE
const requiredBuffsPVE = [
  'Pouvoir',
  'Alacrité',
  'Fureur',
  'Protection',
  'Régénération',
  'Soin',
  'Stabilité',
  'Résistance',
]

const currentMode = ref('mcm')
const specializations = reactive({})
const groups = ref([])

// Configuration des groupes selon le mode
const groupConfig = {
  mcm: { count: 10, size: 5 },
  pve: { count: 2, size: 5 }
}

// Buffs requis selon le mode actuel
const currentRequiredBuffs = computed(() => {
  return currentMode.value === 'mcm' ? requiredBuffsMCM : requiredBuffsPVE
})

// Données des buffs MCM
const buffsDataMCM = {
  Tempest: ['Soin', 'Pouvoir', 'Stabilité', 'Régénération'],
  TisseSort: ['Pouvoir', 'Fureur', 'Super vitesse'],
  Catalyseur: ['Pouvoir', 'Fureur', 'Stabilité', 'Protection'],
  Chronomancien: ['Alacrité', 'Stabilité', 'Fureur', 'Célérité'],
  Mirage: ['Pouvoir'],
  Virtuose: ['Pouvoir', 'Fureur'],
  Incendiaire: ['Pouvoir', 'Résistance', 'Fureur', 'Stabilité'],
  Brisesort: ['Pouvoir', 'Stabilité', 'Protection'],
  Vertu: ['Pouvoir', 'Protection', 'Fureur'],
  Holographiste: ['Pouvoir', 'Super vitesse'],
  Mécatronicien: ['Pouvoir', 'Protection'],
  Faucheur: ['Pouvoir', 'Résistance', 'Vulnérabilité'],
  Fléau: ['Barrière', 'Résistance'],
  Augure: ['Pouvoir', 'Fureur'],
  Druide: ['Soin', 'Régénération', 'Protection'],
  Indomptable: ['Fureur', 'Pouvoir'],
  Animorph: ['Célérité', 'Fureur'],
  Héraut: ['Pouvoir', 'Fureur', 'Protection'],
  Renégat: ['Pouvoir', 'Alacrité', 'Fureur'],
  Vindicteur: ['Pouvoir', 'Protection', 'Résistance'],
  Berserker: ['Pouvoir', 'Fureur'],
  Marteleur: ['Pouvoir', 'Protection', 'Stabilité'],
  Anéantisseur: ['Pouvoir', 'Stabilité'],
  Fractureur: ['Pouvoir'],
  Deadeye: ['Pouvoir', 'Fureur'],
  Spectre: ['Soin', 'Fureur', 'Barrière'],
  Daredevil: ['Pouvoir'],
  sniper: ['Pouvoir', 'Fureur'],
}

// Données des buffs PVE
const buffsDataPVE = {
  Tempest: ['Soin', 'Pouvoir', 'Régénération'],
  TisseSort: ['Pouvoir', 'Fureur'],
  Catalyseur: ['Pouvoir', 'Fureur', 'Protection'],
  Chronomancien: ['Alacrité', 'Fureur'],
  Mirage: ['Pouvoir'],
  Virtuose: ['Pouvoir', 'Fureur'],
  Incendiaire: ['Pouvoir', 'Fureur'],
  Brisesort: ['Pouvoir', 'Protection'],
  Vertu: ['Pouvoir', 'Protection', 'Fureur'],
  Holographiste: ['Pouvoir'],
  Mécatronicien: ['Pouvoir', 'Protection'],
  Faucheur: ['Pouvoir'],
  Fléau: ['Résistance'],
  Augure: ['Pouvoir', 'Fureur'],
  Druide: ['Soin', 'Régénération', 'Protection'],
  Indomptable: ['Fureur', 'Pouvoir'],
  Animorph: ['Fureur'],
  Héraut: ['Pouvoir', 'Fureur', 'Protection'],
  Renégat: ['Pouvoir', 'Alacrité', 'Fureur'],
  Vindicteur: ['Pouvoir', 'Protection'],
  Berserker: ['Pouvoir', 'Fureur'],
  Marteleur: ['Pouvoir', 'Protection'],
  Anéantisseur: ['Pouvoir'],
  Fractureur: ['Pouvoir'],
  Deadeye: ['Pouvoir', 'Fureur'],
  Spectre: ['Soin', 'Fureur'],
  Daredevil: ['Pouvoir'],
  sniper: ['Pouvoir', 'Fureur'],
}

function getBuffCount(group, buff) {
  let count = 0
  group.forEach((member) => {
    if (member && specializations[member]) {
      const buffsData = currentMode.value === 'mcm' ? buffsDataMCM : buffsDataPVE
      const memberBuffs = buffsData[member] || []
      memberBuffs.forEach((b) => {
        if (b === buff) count++
      })
    }
  })
  return count
}

function getBuffDisplay(group, buff) {
  const count = getBuffCount(group, buff)
  if (count === 0) return `❌ ${buff}`
  if (count === 1) return `✅ ${buff}`
  return `${count}× ${buff}`
}

function updateMember(groupIndex, memberIndex, value) {
  groups.value[groupIndex][memberIndex] = value || null
}

function switchMode(mode) {
  currentMode.value = mode
  const config = groupConfig[mode]
  groups.value = Array.from({ length: config.count }, () => Array(config.size).fill(null))
}

onMounted(() => {
  // Initialiser avec le mode MCM par défaut
  switchMode('mcm')
  
  fetch(API_URL)
    .then((r) => r.json())
    .then((ids) =>
      fetch(`https://api.guildwars2.com/v2/specializations?ids=${ids.join(',')}&lang=fr`),
    )
    .then((r) => r.json())
    .then((data) => {
      data.forEach((spec) => {
        if (spec.elite) {
          specializations[spec.name] = {
            id: spec.id,
            icon: spec.icon,
            buffs: [],
          }
        }
      })
    })
    .catch((e) => console.error('Erreur API GW2:', e))
})
</script>

<style scoped>
.mode-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.mode-selector button {
  padding: 10px 20px;
  background: #333;
  color: #fff;
  border: 2px solid #555;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-selector button.active {
  background: #4a90e2;
  border-color: #4a90e2;
}

.mode-selector button:hover {
  background: #555;
}

#groups {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 10px;
  width: 100%;
}

.group {
  display: flex;
  border: 2px solid #444;
  border-radius: 8px;
  margin-bottom: 30px;
  padding: 10px;
  background: #2a2a2a;
  width: 100%;
}

.buff-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.buff {
  min-width: 140px;
  text-align: center;
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 6px;
  background: #3a3a3a;
}

.buff[data-count='0'] {
  background: #902222;
}

.buff[data-count='1'] {
  background: #226622;
}

.buff[data-count='2'] {
  background: #227766;
}

.buff[data-count='3'] {
  background: #4499aa;
}

.buff[data-count='4'] {
  background: #66bbcc;
}

.buff[data-count='5'] {
  background: #88ddff;
}

.members-column {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex: 1;
  justify-content: space-between;
}

.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 80px;
}

.member img {
  width: 96px;
  height: 96px;
  border-radius: 10px;
  border: 2px solid #666;
  background: #000;
}

.placeholder {
  width: 96px;
  height: 96px;
  border-radius: 10px;
  border: 2px dashed #444;
}

select {
  margin-top: 6px;
  padding: 4px;
  background: #333;
  color: #fff;
  border: 1px solid #555;
}
</style>
