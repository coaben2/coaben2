<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <header class="bg-base-100">
        <nav class="p-4 flex flex-start gap-4">
            <RouterLink :to="{ name: 'Home' }" class="btn">Accueil</RouterLink>
            <RouterLink :to="{ name: 'GuildWars' }" class="btn">Guild Wars 2</RouterLink>
            <RouterLink :to="{ name: 'Blog' }" class="btn">Blog</RouterLink>
            <RouterLink :to="{ name: 'Portfolio' }" class="btn">Portfolio</RouterLink>
            <RouterLink :to="{ name: 'Contact' }" class="btn">Contact</RouterLink>
            <RouterLink :to="{ name: 'Login' }" class="btn">Connexion</RouterLink>
        </nav>
    </header>
</template>

<style scoped>
header nav a:not(.router-link-active) {
    @apply btn-primary;
}

header nav a.router-link-active {
    @apply btn-secondary;
}
</style>