<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink :to="{ name: 'Home' }">Accueil</RouterLink>
        <RouterLink :to="{ name: 'GuildWars' }">Guild Wars 2</RouterLink>
        <RouterLink :to="{ name: 'Blog' }">Blog</RouterLink>
        <RouterLink :to="{ name: 'Portfolio' }">Portfolio</RouterLink>
        <RouterLink :to="{ name: 'Contact' }">Contact</RouterLink>
        <RouterLink :to="{ name: 'Login' }">Connexion</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
