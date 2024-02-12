<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery, useMutation } from '@tanstack/vue-query';

const user = useUserStore();

const haveApiKey = computed(() => !!user.haveApiKey);

const currentCharacter = ref(null);
const loadingMessage = ref(null);

const getCharacters = async () => {
  loadingMessage.value = 'Chargement de la liste des personnages';

  const characters = await user.getCharacters();
  if (!characters) return false;

  currentCharacter.value = characters[0];
  handleGetCharacter();
  return characters;
};

const getCharacter = () => {
  loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
  return user.getCharacter(currentCharacter.value);
};

const { isLoading: isCharactersLoading, data: charactersData } = useQuery({
  queryKey: ['characters'],
  queryFn: getCharacters,
  enabled: haveApiKey,
});

const {
  isPending: isCharacterPending,
  data: characterData,
  mutate: handleGetCharacter,
} = useMutation({
  mutationFn: () => getCharacter(),
});
</script>

<template>
  <div>
    <div v-if="charactersData">
      <select
        v-model="currentCharacter"
        @change="handleGetCharacter"
        class="select select-bordered"
      >
        <option v-for="character in charactersData" :key="character" :value="character">
          {{ character }}
        </option>
      </select>
    </div>

    <div
      class="rounded bg-opacity-50 bg-black p-4 my-4 flex gap-2 items-center"
      v-if="isCharactersLoading || isCharacterPending"
    >
      <span class="loading loading-spinner text-primary"></span>
      <span>{{ loadingMessage }}</span>
    </div>

    <pre v-if="characterData">{{ characterData }}</pre>
  </div>
</template>
