<template>
  <div>
    <div class="api-guide">
      <h2>Comment créer une clé API ?</h2>
      <p>
        Pour créer une clé API, rendez-vous sur le site officiel d'ArenaNet :
        <a href="https://account.arena.net/" target="_blank" rel="noopener noreferrer">
          account.arena.net
          <i class="fas fa-external-link-alt"></i>
        </a>
      </p>

      <div class="steps">
        <div class="step">
          <h3>1. Connectez-vous à votre compte</h3>
          <p>Utilisez vos identifiants Guild Wars 2 pour vous connecter.</p>
        </div>

        <div class="step">
          <h3>2. Accédez à la section Applications</h3>
          <p>Dans le menu, cliquez sur "Applications".</p>
        </div>

        <div class="step">
          <h3>3. Créez une nouvelle clé</h3>
          <p>
            Cliquez sur "Nouvelle clé" et :<br />
            - Donnez un nom à votre clé (ex: "GW2")<br />
            - Cochez toutes les permissions nécessaires<br />
            - Cliquez sur "Créer une clé API"
          </p>
        </div>
      </div>
    </div>

    <div class="api-permissions">
      <h2>Vérification des permissions de votre clé API</h2>

      <div class="permissions-grid">
        <div v-for="(permission, index) in permissions" :key="index" class="permission-item">
          <div class="permission-name">{{ permission.name }}</div>
          <div
            class="permission-status"
            :class="{
              'status-ok': permission.status === true,
              'status-error': permission.status === false,
              'status-pending': permission.status === null,
            }"
          >
            <i class="fas" :class="getStatusIcon(permission.status)"></i>
          </div>
        </div>
      </div>
    </div>
    <p>
      Les clés d'application permettent à des outils et applications tiers d'accéder à votre compte
      Guild Wars 2 en lecture seule.<br />
      Pour les utiliser, créez une clé, copiez-la puis collez-la dans le champ affiché par l'outil
      ou l'application tiers.<br />
      Chaque clé contient un ensemble de permissions qui limitent le contenu accessible par les
      outils tiers.<br />
      Vous pouvez supprimer une clé à tout moment pour retirer ces permissions.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const user = useUserStore();

const permissions = ref([
  { name: 'Trading Post', key: 'tradingpost', status: null },
  { name: 'Personnages', key: 'characters', status: null },
  { name: 'WvW', key: 'wvw', status: null },
  { name: 'PvP', key: 'pvp', status: null },
  { name: 'Progression', key: 'progression', status: null },
  { name: 'Portefeuille', key: 'wallet', status: null },
  { name: 'Guildes', key: 'guilds', status: null },
  { name: 'Builds', key: 'builds', status: null },
  { name: 'Compte', key: 'account', status: null },
  { name: 'Inventaires', key: 'inventories', status: null },
  { name: 'Débloqués', key: 'unlocks', status: null },
]);

const getStatusIcon = (status) => {
  if (status === true) return 'fa-check';
  if (status === false) return 'fa-times';
  return 'fa-circle-notch fa-spin';
};

const checkPermissions = async () => {
  const apiKey = user.getApiKey();
  if (!apiKey) return;

  try {
    const response = await axios.get(
      `https://api.guildwars2.com/v2/tokeninfo?access_token=${apiKey}`,
    );
    const userPermissions = response.data.permissions;

    permissions.value.forEach((permission) => {
      permission.status = userPermissions.includes(permission.key);
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des permissions:', error);
    permissions.value.forEach((permission) => {
      permission.status = false;
    });
  }
};

// Vérifier les permissions au montage du composant
onMounted(() => {
  checkPermissions();
});

// Surveiller les changements de clé API
watch(
  () => user.apiKey,
  () => {
    checkPermissions();
  },
);
</script>

<style scoped>
.api-guide {
  width: 1200px;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
}

.api-guide a {
  color: #007bff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.api-guide a:hover {
  text-decoration: underline;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
}

.step {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step h3 {
  color: #333;
  margin-bottom: 15px;
}

.step-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 10px 0;
}

.api-permissions {
  width: 1200px;
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.permission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.permission-name {
  font-weight: 500;
}

.permission-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.status-ok {
  color: #4caf50;
}

.status-error {
  color: #f44336;
}

.status-pending {
  color: #ffc107;
}
</style>
