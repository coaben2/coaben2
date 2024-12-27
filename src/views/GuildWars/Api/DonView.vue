// eslint-disable-next-line vue/multi-word-component-names
<template>
  <div id="app">
    <div class="api-progress-container" v-if="user.currentApiCall">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(user.apiProgress / 8) * 100}%` }"></div>
      </div>
      <p class="progress-text">{{ user.currentApiCall }}</p>
    </div>

    <h2>Liste des Don</h2>
    <div class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center" v-if="isLoading">
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <div>
      <section v-for="(group, index) in specificIdGroups" :key="index">
        <div>
          <h2>{{ group.title }}</h2>
          <table class="styled-table">
            <thead>
              <tr>
                <th>Matériel</th>
                <th>ID</th>
                <th>Quantité Requise</th>
                <th>Quantité Possédée</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="id in group.ids" :key="id">
                <td>{{ materialNames[id]?.name || 'Unknown' }}</td>
                <td>{{ id }}</td>
                <td>{{ materialNames[id]?.quantity || 0 }}</td>
                <td>{{ getMaterialCount(id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery } from '@tanstack/vue-query';

const user = useUserStore();
const haveApiKey = computed(() => !!user.apiKey);
const loadingMessage = ref('Chargement des matériaux...');

const fetchMaterialsData = async () => {
  try {
    const materials = await user.getMaterials();
    return materials;
  } catch (error) {
    console.error('Erreur lors de la récupération des matériaux:', error);
    return null;
  }
};

const { isLoading, data: materials } = useQuery({
  queryKey: ['materials'],
  queryFn: fetchMaterialsData,
  enabled: haveApiKey,
  retry: 3,
  staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
});

const specificIdGroups = [
  { title: 'Don de Griffes', ids: [24351, 24350, 24349, 24348] },
  { title: 'Don d Ecailles', ids: [24289, 24288, 24287, 24286] },
  { title: 'Don d Os', ids: [24358, 24341, 24345, 24344] },
  { title: 'Don de Crocs', ids: [24357, 24356, 24355, 24354] },
  { title: 'Don de Sang', ids: [24295, 24294, 24293, 24292] },
  { title: 'Don de Venin', ids: [24283, 24282, 24281, 24280] },
  { title: 'Don de Totems', ids: [24300, 24299, 24363, 24298] },
  { title: 'Don de Poussière', ids: [24277, 24276, 24275, 24274] },
];

const materialNames = {
  24351: { name: 'Griffes sauvages ', quantity: 100 },
  24350: { name: 'Grandes griffes', quantity: 250 },
  24349: { name: 'Griffes acérées ', quantity: 50 },
  24348: { name: 'Griffe', quantity: 50 },
  24289: { name: 'Ecailles renforcées', quantity: 100 },
  24288: { name: 'Grandes écailles', quantity: 250 },
  24287: { name: 'Ecailles lisses', quantity: 50 },
  24286: { name: 'Ecailles', quantity: 50 },
  24358: { name: 'Os anciens', quantity: 100 },
  24341: { name: 'Os longs', quantity: 250 },
  24345: { name: 'Os lourds', quantity: 50 },
  24344: { name: 'Os', quantity: 50 },
  24357: { name: 'Crocs sauvages', quantity: 100 },
  24356: { name: 'Grands crocs', quantity: 250 },
  24355: { name: 'Crocs acérés', quantity: 50 },
  24354: { name: 'Crocs', quantity: 50 },
  24295: { name: 'Fioles de sang puissant', quantity: 100 },
  24294: { name: 'Fioles de sang absolu', quantity: 250 },
  24293: { name: 'Fioles de sang épais', quantity: 50 },
  24292: { name: 'Fioles de sang', quantity: 50 },
  24283: { name: 'Sacs à venin puissant ', quantity: 100 },
  24282: { name: 'Sacs à venin absolu', quantity: 250 },
  24281: { name: 'Sacs à venin pleins', quantity: 50 },
  24280: { name: 'Sacs à venin', quantity: 50 },
  24300: { name: 'Totems ouvragés ', quantity: 100 },
  24299: { name: 'Totems travaillés', quantity: 250 },
  24363: { name: 'Totems gravés', quantity: 50 },
  24298: { name: 'Totems', quantity: 50 },
  24277: { name: 'Tas de poussière cristalline', quantity: 100 },
  24276: { name: 'Tas de poussière incandescente', quantity: 250 },
  24275: { name: 'Tas de poussière lumineuse', quantity: 50 },
  24274: { name: 'Tas de poussière rayonnante', quantity: 50 },
  19675: { name: 'Trèfle mystique', quantity: 15 },
};

const getMaterialCount = (id) => {
  if (!materials.value) return 0;
  const material = materials.value.find((m) => m.id === parseInt(id));
  return material ? material.count : 0;
};
</script>

<style scoped>
.loading {
  padding: 1rem;
  text-align: center;
  color: #666;
}

.error {
  padding: 1rem;
  color: red;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  margin: 1rem 0;
  border-radius: 4px;
}

.styled-table {
  width: 800px;
  border-collapse: collapse;
  font-size: 18px;
  text-align: left;
  margin-bottom: 20px;
}

.styled-table th,
.styled-table td {
  border: 1px solid #ddd;
  padding: 10px;
  width: 25%;
}

.styled-table thead tr {
  color: rgb(0, 0, 0);
  text-align: left;
  background-color: rgba(0, 0, 0, 0.05);
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table td:nth-child(2),
.styled-table td:nth-child(3),
.styled-table td:nth-child(4) {
  color: rgb(0, 0, 0);
  text-align: left;
}

section {
  margin-bottom: 30px;
}

section h2 {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #333;
}

.api-progress-container {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ccc;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 5px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
