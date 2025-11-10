<script setup>
import { RouterLink } from 'vue-router';
import { inject } from '@vercel/analytics';
inject();
</script>

<template>
  <div class="container max-w-2xl mx-auto bg-black bg-opacity-75 p-6 md:rounded-lg md:my-6">
    <div class="text-center mb-24 mt-12">
      <h1 class="text-5xl font-bold mb-4">Bienvenue</h1>
      <p class="py-2">Ce site Internet réunit plusieurs projets.</p>
      <p class="py-2">Merci au personnes qui me font des retour afin de l'améliorer.</p>
    </div>
    <div class="">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Lexique</h4>
          <p class="flex-1">
            Un lexique pour vous aider à comprendre les subtilités des langues utilisées dans
            <strong>Guild&nbsp;Wars&nbsp;2</strong>.
          </p>
          <RouterLink :to="{ name: 'GuildWarsLexique' }" class="btn btn-sm btn-outline btn-primary"
            >Découvrir le lexique
          </RouterLink>
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>API GW2</h4>
          <p class="flex-1">plusieur outils utilisant <strong>l'API de GW2.</strong></p>
          <RouterLink :to="{ name: 'GuildWarsAPI' }" class="btn btn-sm btn-outline btn-primary"
            >Découvrir APi
          </RouterLink>
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Groupe Dynamique GW2</h4>
          <p class="flex-1">Outil pour créer des groupes optimisés.</p>
          <RouterLink :to="{ name: 'Groupe_MCM' }" class="btn btn-sm btn-outline btn-primary"
            >Créer un groupe
          </RouterLink>
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Blog</h4>
          <p class="flex-1">
            Un blog d'histoires écrites , ainsi que des illustrations réalisées par
            <strong>IA</strong>.
          </p>
          <RouterLink :to="{ name: 'Blog' }" class="btn btn-sm btn-outline btn-primary"
            >Lire les articles</RouterLink
          >
        </div>
        <div class="w-full flex flex-col items-center text-center gap-4">
          <h4>Portfolio</h4>
          <p class="flex-1">
            Un portfolio qui reprend l'intégralité des images générées par <strong>IA</strong>.
          </p>
          <RouterLink :to="{ name: 'Portfolio' }" class="btn btn-sm btn-outline btn-primary"
            >Regarder le portfolio
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="mt-24">
      <h2 class="text-center mb-4">Sites et outils utilisés</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <div class="tooltip" data-tip="Générer des textes">
          <a
            href="https://chat.openai.com/auth/login?next=/chat"
            target="_blank"
            rel="nofollow"
            class="btn btn-outline btn-sm w-full"
            >ChatGPT</a
          >
        </div>
        <div class="tooltip" data-tip="Générer des images">
          <a
            href="https://starryai.com/"
            target="_blank"
            rel="nofollow"
            class="btn btn-outline btn-sm w-full"
            >StarryAI</a
          >
        </div>
        <div class="tooltip" data-tip="Générer des images">
          <a
            href="https://creator.nightcafe.studio/"
            target="_blank"
            rel="nofollow"
            class="btn btn-outline btn-sm w-full"
            >NightCafé</a
          >
        </div>
        <div class="tooltip" data-tip="Apprendre à créer votre site avec HTML5 et CSS3">
          <a
            href="https://openclassrooms.com/"
            target="_blank"
            rel="nofollow"
            class="btn btn-outline btn-sm w-full"
            >Open Classrooms</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
