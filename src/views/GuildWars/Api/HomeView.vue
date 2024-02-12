<script setup>
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const apiKey = ref(null);

const updateApiKey = () => {
  return user.setApiKey(apiKey.value);
};

onMounted(() => {
  if (user.getApiKey()) {
    apiKey.value = user.getApiKey();
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
        @input="updateApiKey"
      />
      <div role="alert" class="alert alert-error mt-2" v-if="user.error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span v-text="user.error"></span>
      </div>
    </div>

    <RouterView />
  </div>
</template>
