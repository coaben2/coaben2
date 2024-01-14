<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <header class="bg-base-100">
        <nav class="p-4 flex flex-start gap-4">
            <RouterLink :to="{ name: 'Home' }" class="btn">Accueil</RouterLink>
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-primary">Guild Wars 2</div>
                <ul
                    class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-auto whitespace-nowrap min-w-52">
                    <li>
                        <RouterLink :to="{ name: 'GuildWarsLexique' }">Lexique</RouterLink>
                        <RouterLink :to="{ name: 'GuildWarsApiCharacters' }">API</RouterLink>
                        <RouterLink :to="{ name: 'GuildWarsInventoryManager' }">Vide ton sac</RouterLink>
                    </li>
                </ul>
            </div>
            <RouterLink :to="{ name: 'Blog' }" class="btn">Blog</RouterLink>
            <div class="dropdown">
                <div tabindex="0" role="button" class="btn btn-primary">blog</div>
                <ul
                    class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-auto whitespace-nowrap min-w-52">
                    <li>
                        <RouterLink :to="{ name: 'blogH1Hounoana' }">Hounoana</RouterLink>
                        <RouterLink :to="{ name: 'blogH2S2' }">Saison 2</RouterLink>
                        <RouterLink :to="{ name: 'blogKan' }">kan</RouterLink>
                        <RouterLink :to="{ name: 'blogLetR' }">La rose et le lierre</RouterLink>
                    </li>
                </ul>
            </div>
            <RouterLink :to="{ name: 'Portfolio' }" class="btn">Portfolio</RouterLink>
            <RouterLink :to="{ name: 'Contact' }" class="btn">Contact</RouterLink>
            <RouterLink :to="{ name: 'Login' }" class="btn">Connexion</RouterLink>
        </nav>
    </header>
</template>

<style scoped>
header>nav>a:not(.router-link-active) {
    @apply btn-primary;
}

header>nav>a.router-link-active {
    @apply btn-secondary;
}
</style>