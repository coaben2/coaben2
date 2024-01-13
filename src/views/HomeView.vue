<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center py-24">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-4">Bienvenue</h1>
          <p class="py-2"> Ce site Internet réunit plusieurs projets.</p>
          <p class="py-2">Merci au personnes qui me font des retour afin de l'améliorer.</p>
        </div>
      </div>
    </div>
    <div class="container mx-auto max-w-3xl">
      <div class="flex gap-4">
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Lexique</h4>
          <p class="flex-1">
            Un lexique pour vous aider à comprendre les subtilités des langues utilisées dans
            <strong>Guild&nbsp;Wars&nbsp;2</strong>.
          </p>
          <RouterLink :to="{ name: 'GuildWars' }" class="btn btn-sm btn-outline btn-primary">Découvrir le lexique
          </RouterLink>
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Blog</h4>
          <p class="flex-1">Un blog d'histoires écrites avec l'aide d'une <strong>IA</strong>, ainsi que des illustrations
            réalisées par
            <strong>IA</strong>.
          </p>
          <RouterLink :to="{ name: 'Blog' }" class="btn btn-sm btn-outline btn-primary">Lire les articles</RouterLink>
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Portfolio</h4>
          <p class="flex-1">Un portfolio qui reprend l'intégralité des images générées par <strong>IA</strong>.</p>
          <RouterLink :to="{ name: 'Portfolio' }" class="btn btn-sm btn-outline btn-primary">Regarder le portfolio
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="mt-24">
      <h2 class="text-center mb-4">Sites et outils utilisés</h2>
      <div class="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div class="tooltip" data-tip="Générer des textes">
          <a href="https://chat.openai.com/auth/login?next=/chat" target="_blank" rel="nofollow"
            class="btn btn-outline btn-sm w-full">ChatGPT</a>
        </div>
        <div class="tooltip" data-tip="Générer des images">
          <a href="https://starryai.com/" target="_blank" rel="nofollow"
            class="btn btn-outline btn-sm w-full">StarryAI</a>
        </div>
        <div class="tooltip" data-tip="Générer des images">
          <a href="https://creator.nightcafe.studio/" target="_blank" rel="nofollow"
            class="btn btn-outline btn-sm w-full">NightCafé</a>
        </div>
        <div class="tooltip" data-tip="Apprendre à créer votre site avec HTML5 et CSS3">
          <a href="https://openclassrooms.com/" target="_blank" rel="nofollow" class="btn btn-outline btn-sm w-full">Open
            Classrooms</a>
        </div>
      </div>
    </div>
  </div>
</template>
