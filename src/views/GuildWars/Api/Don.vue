<template>
  <div id="app">
    <h1>Liste des Don</h1>
    <div v-if="loading" class="loading">Loading data, please wait...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="!loading && !errorMessage">
      <section v-for="(group, index) in specificIdGroups" :key="index">
        <div class="material-group">
          <h3>{{ group.title }}</h3>
          <table class="mini-requirements-table">
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

<script>
import { getApiKey } from '@/stores/user';

export default {
  name: 'App',
  data() {
    return {
      apiKey: getApiKey(),
      characters: [],
      materials: [],
      loading: false,
      errorMessage: '',
      specificIdGroups: [
        { title: 'Don de Griffes', ids: [24351, 24350, 24349, 24348] },
        { title: 'Don d Ecailles', ids: [24289, 24288, 24287, 24286] },
        { title: 'Don d Os', ids: [24358, 24341, 24345, 24344] },
        { title: 'Don de Crocs', ids: [24357, 24356, 24355, 24354] },
        { title: 'Don de Sang', ids: [24295, 24294, 24293, 24292] },
        { title: 'Don de Venin', ids: [24283, 24282, 24281, 24280] },
        { title: 'Don de Totems', ids: [24300, 24299, 24363, 24298] },
        { title: 'Don de Poussière', ids: [24277, 24276, 24275, 24274] },
      ],
      materialNames: {
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
      },
    };
  },
  methods: {
    async fetchData() {
      if (!this.apiKey) {
        this.errorMessage = 'Please enter your API key.';
        return;
      }
      this.loading = true;
      this.errorMessage = '';

      try {
        this.characters = [];
        this.materials = [];
      } catch (error) {
        this.errorMessage = 'Error fetching data.';
      } finally {
        this.loading = false;
      }
    },
    getMaterialCount(id) {
      const material = this.materials.find((m) => m.id === id);
      return material ? material.count : 0;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  background-color: #1a1a1a;
  color: #e0e0e0;
  padding: 20px;
}

.input {
  width: 100%;
  height: 50px;
  padding: 5px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.loading {
  color: #ffd700;
}

.error {
  color: red;
  margin-bottom: 20px;
}

h1,
h2 {
  color: #ffd700;
}

.material-group {
  margin-bottom: 20px;
}

.mini-requirements-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.mini-requirements-table th,
.mini-requirements-table td {
  padding: 8px;
  border: 1px solid #444;
  text-align: left;
}

.mini-requirements-table th {
  background-color: #333;
}
</style>
