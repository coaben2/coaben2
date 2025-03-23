<template>
  <div class="unlocks-container">
    <h2>Éléments débloqués</h2>
    
    <div class="unlocks-table">
      <div class="unlock-row">
        <div class="unlock-info">
          <h3>Couleurs</h3>
          <p>Nombre de couleurs débloquées : {{ unlocksData.colors?.length || 0 }}</p>
        </div>
      </div>

      <div class="unlock-row">
        <div class="unlock-info">
          <h3>Miniatures</h3>
          <p>Nombre de miniatures : {{ unlocksData.minis?.length || 0 }}</p>
        </div>
      </div>

      <div class="unlock-row">
        <div class="unlock-info">
          <h3>Finisseurs PvP</h3>
          <p>Nombre de finisseurs : {{ unlocksData.pvpFinishers?.length || 0 }}</p>
        </div>
      </div>

      <div class="unlock-row">
        <div class="unlock-info">
          <h3>Titres</h3>
          <p>Nombre de titres : {{ unlocksData.titles?.length || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const unlocksData = reactive({
  colors: [],
  minis: [],
  pvpFinishers: [],
  titles: []
})

const fetchUnlocksData = async () => {
  unlocksData.colors = await userStore.getColors()
  unlocksData.minis = await userStore.getMinis()
  unlocksData.pvpFinishers = await userStore.getPvpFinishers()
  unlocksData.titles = await userStore.getTitles()
}

fetchUnlocksData()
</script>

<style scoped>
.unlocks-container {
  padding: 1rem;
}

.unlocks-table {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.unlock-row {
  display: flex;
  background-color: var(--color-background-soft);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.unlock-info {
  flex-grow: 1;
}

.unlock-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
}

.unlock-info p {
  margin: 0;
}
</style>
