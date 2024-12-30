<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useInventoryManagerStore } from '@/stores/InventoryManager';

const user = useUserStore();
const inventoryManager = useInventoryManagerStore();
const ignoreConsumables = ref(false);
const isAnalyzing = ref(false);

const startAnalysis = async () => {
  if (isAnalyzing.value) return;
  isAnalyzing.value = true;
  try {
    const bankData = await user.getBank();
    const materialsData = await user.getMaterials();

    await inventoryManager.analyzeInventory(bankData, materialsData);
  } catch (error) {
    console.error(error);
  } finally {
    isAnalyzing.value = false;
  }
};

const toggleSection = (section) => {
  section.visible = !section.visible;
};
</script>

<template>
  <div class="container">
    <div class="content-left">
      <div class="main-info">
        Obtenez des suggestions pour <span class="rare">nettoyer votre</span> inventaire.
      </div>

      <div class="action-container">
        <button @click="startAnalysis" :disabled="isAnalyzing" class="analyze-button">
          {{ isAnalyzing ? 'Analyse en cours...' : "Analyser l'inventaire" }}
        </button>
      </div>

      <!-- Section Conseils -->
      <div class="section">
        <h2 @click="toggleSection(tips)">Conseils divers:</h2>
        <p>Voici divers conseils sur la façon de faire de la place dans votre inventaire.</p>
        <table v-if="inventoryManager.tips.length > 0" class="data-table">
          <tbody>
            <tr v-for="(tip, index) in inventoryManager.tips" :key="index">
              <td class="cost">{{ tip }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="pending">En instance...</div>
      </div>

      <!-- Section Items à empiler -->
      <div class="section">
        <h2 @click="toggleSection(items)">Empiler ces objets:</h2>
        <p>
          Ces articles ont des piles incomplètes (moins de 250 articles) à plusieurs endroits et
          doivent être empilés ensemble pour économiser de l'espace dans l'inventaire.
        </p>
        <table v-if="inventoryManager.items.length > 0" class="data-table">
          <tbody>
            <tr v-for="(item, index) in inventoryManager.items" :key="index">
              <td class="cost">{{ item }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="pending">En instance...</div>
      </div>

      <!-- Section Crafts -->
      <div class="section">
        <h2 @click="toggleSection(crafts)">Fabriquer les objets:</h2>
        <p>
          Vous avez plus d'une pile (250 articles) d'ingrédients pour les articles suivants. Vous
          pouvez fabriquer ces objets pour réduire le nombre de piles.
        </p>
        <table v-if="inventoryManager.crafts.length > 0" class="data-table">
          <tbody>
            <tr v-for="(craft, index) in inventoryManager.crafts" :key="index">
              <td class="cost">{{ craft }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="pending">En instance...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 0;
  padding: 20px;
}

.content-left {
  margin: 0;
  padding: 0;
}

.menu {
  background-color: #f5f5f5;
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
}

.main-info {
  margin: 20px 0;
}

.rare {
  color: #ffa500;
}

.search-form {
  margin: 20px 0;
}

.form-group {
  margin: 10px 0;
}

.action-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.analyze-button {
  padding: 12px 24px;
  font-size: 1.1em;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.analyze-button:hover {
  background-color: #45a049;
}

.analyze-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.section {
  margin: 30px 0;
}

h2 {
  cursor: pointer;
  padding: 10px;
  background: none;
  color: #000;
  font-weight: normal;
  border-radius: 4px;
}

h2:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.pending {
  color: #666;
  font-style: italic;
  padding: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
