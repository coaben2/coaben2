<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useQuery, useMutation } from '@tanstack/vue-query';

const user = useUserStore();

const _APIKEY = 'BECC9FE0-FB9F-0C46-81DB-F864E9216DD1E5B15E0A-FDB9-490C-B92C-F75D754F98C4';
const _APIURL = 'https://api.guildwars2.com';

// const isCharactersLoaded = ref(false);
const currentCharacter = ref(null);
const loadingMessage = ref(null);
const selectedCharacter = ref(null);

// const charactersList = ref([]);
// const charactersData = ref({});

// const getCharactersList = async () => {
//   return fetch(`${_APIURL}/v2/characters?access_token=${_APIKEY}`)
//     .then((res) => res.json())
//     .then((characters) => {
//       charactersList.value = characters;

//       console.log(typeof characters);
//       console.table(characters);

//       let urls = [];
//       characters.foreach((characterName) => {
//         urls.push({
//           name: characterName,
//           url: `${_APIURL}/v2/characters/${characterName}?access_token=${_APIKEY}`,
//         });
//       });
//     });
// };

// onMounted(async () => {
//   await getCharactersList();
//   // await getCharactersData();
//   // await getCharactersList();
//   // await getInventories();
// });

const getCharacters = () => {
  loadingMessage.value = 'Chargement de la liste des personnages';
  return fetch(`${_APIURL}/v2/characters?access_token=${_APIKEY}`)
    .then((res) => res.json())
    .then((data) => {
      selectedCharacter.value = data[0];
      updateCurrentCharacter();
      // isCharactersLoaded.value = true;
      return data;
    });
};

const getCharacter = () => {
  console.log('getCharacter');
  loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
  return fetch(`${_APIURL}/v2/characters/${currentCharacter.value}?access_token=${_APIKEY}`).then(
    (res) => res.json(),
  );
};

const {
  isLoading: isCharactersLoading,
  data: charactersData,
  error: charactersError,
} = useQuery({
  queryKey: ['characters'],
  queryFn: getCharacters,
});

// const {
//   isLoading: isCharacterLoading,
//   data: characterData,
//   error: characterError,
// } = useQuery({
//   queryKey: ['character', currentCharacter.value],
//   queryFn: getCharacter,
//   enabled: isCharactersLoaded,
//   notifyOnChangeProps: 'all',
// });

const {
  isPending: isCharacterPending,
  error: characterError,
  data: characterData,
  mutate: handleGetCharacter,
} = useMutation({
  mutationFn: () => getCharacter(),
});

function updateCurrentCharacter() {
  currentCharacter.value = selectedCharacter.value;
  handleGetCharacter();
}
</script>

<template>
  <div>
    <div v-if="charactersData">
      <select
        v-model="selectedCharacter"
        @change="updateCurrentCharacter"
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

    <!-- <h2>Personnages</h2>
    <div>Current Count: {{ user.count }}</div>
    <button @click="user.increment()" class="btn">+++</button>
    <pre>{{ charactersList }}</pre>
    <pre>{{ charactersData }}</pre> -->
  </div>
</template>
