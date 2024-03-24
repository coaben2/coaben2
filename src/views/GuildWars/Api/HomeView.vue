<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
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
                <RouterLink :to="{ name: 'GuildWarsApiCollectibles' }">collectibles</RouterLink>
            </li>
            <li>
                <RouterLink :to="{ name: 'GuildWarsApiMoney' }">monnais</RouterLink>
            </li>
            <li>
                <RouterLink :to="{ name: 'GuildWarsApiUnlocks' }">Débloqué</RouterLink>
            </li>
        </ul>
        <RouterView />
    </div>
</template>
<style scoped>
li {
    text-decoration: none;
    color: black;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 5px;
    background-color: #3b82f680;

}
</style>