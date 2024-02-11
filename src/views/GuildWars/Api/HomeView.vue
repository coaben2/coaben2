<script setup>
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const apiKey = ref(null);

onMounted(() => {
  if (user.apiKey) {
    apiKey.value = user.apiKey;
  }
});
</script>

<template>
  <div class="container mx-auto my-6">
    <h1 class="mb-4">API Guild Wars 2</h1>
    <ul class="flex gap-2 mb-4">
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiCharacters' }" class="btn">Personnages</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Banque</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Materiaux</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Portefeuille</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Déverrouillages</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Comptoir</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">JcJ</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Succès</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'GuildWarsApiBank' }" class="btn">Guildes</RouterLink>
      </li>
    </ul>

    <div class="mb-4">
      <input
        type="password"
        placeholder="Clé API Guild Wars 2"
        class="input input-xl w-full"
        v-model="apiKey"
      />
    </div>

    <RouterView />
  </div>
</template>
