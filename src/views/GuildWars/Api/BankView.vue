<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

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

const getCharacterNames = () => {
    loadingMessage.value = `Chargement du personnage : ${currentCharacter.value}`;
    return user.getCharacterNames(currentCharacter.value);
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
    mutationFn: () => getCharacterNames(),
});

const getBankItems = async function () {
    const response = await fetch(`$https://api.guildwars2.com/v2/bank?access_token=${apiKey}`);
    return await response.json();
};

</script>

<template>
    <div>
        <h2>Contenu de la banque</h2>
        <p>{{ getBankItems }}</p>
    </div>
</template>