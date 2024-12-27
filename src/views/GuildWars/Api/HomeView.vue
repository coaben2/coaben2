<script setup>
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const newApiKey = ref('');
const user = useUserStore();
const showNotification = ref(false);

const setAndSaveApiKey = async () => {
  await user.setApiKey(newApiKey.value);
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

onMounted(() => {
  user.initApiKey();
});
const placeholderText = 'Entrez une clé API avec toutes les permissions';
</script>

<template>
  <div>
    <div v-if="showNotification" class="notification">
      <span class="notification-icon">✓</span>
      Clé API sauvegardée avec succès!
    </div>
    <div id="settings">
      <label for="api-key" class="label">clé API:</label>
      <input
        id="apiKey"
        name="api-key"
        type="text"
        class="input"
        :placeholder="placeholderText"
        v-model="newApiKey"
      />
      <button
        @click="setAndSaveApiKey"
        id="keySubmit"
        class="submit-button"
        title="Afficher le menu"
      >
        <i class="material-icons">envoyer</i>
      </button>
    </div>
    <div>
      <h1>API Guild Wars 2</h1>
      <ul class="flex gap-2">
        <li>
          <RouterLink :to="{ name: 'GuildWarsApiCharacters' }">Personnages</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsApiBank' }">Banque</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsApiCollectibles' }">Collectibles</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsApiMoney' }">Monnaie</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsApiUnlocks' }">Débloqué</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsInventoryManager' }">Rangement du sac</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'GuildWarsDON' }">Craft légendaire</RouterLink>
        </li>
      </ul>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#settings {
  margin-top: 2px;
}

.label {
  font-weight: bold;
}

.input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 60%;
}

.submit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}

.submit-button i {
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}
.gap-2 {
  display: flex;
  gap: 1rem;
}

.gap-2 li {
  list-style: none;
  padding: 10px 20px;
  border: 1px solid transparent;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.gap-2 li:hover {
  background-color: #32cd32;
  border-color: black;
}

.gap-2 li a {
  text-decoration: none;
  color: black;
  transition: color 0.3s ease;
}

.gap-2 li:hover a {
  color: black;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

.notification-icon {
  font-weight: bold;
  font-size: 1.2em;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
