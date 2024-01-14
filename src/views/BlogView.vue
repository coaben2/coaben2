<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="container mx-auto max-w-3xl">
    <div class="flex gap-4">
      <div class="w-full flex flex-col items-center text-center gap-4">
        <h4>Hounoana</h4>
        <p class="flex-1">
          L'histoire de Hounoana qui découvre
          <strong>Guild&nbsp;Wars&nbsp;2</strong>.
        </p>
        <RouterLink :to="{ name: 'blogH1Hounoana' }" class="btn btn-sm btn-outline btn-primary">Saison 1
        </RouterLink>
      </div>
      <div class="w-full flex flex-col items-center text-center gap-4">
        <h4>Saison2</h4>
        <p class="flex-1">suite de l'histoire de Hounoana
        </p>
        <RouterLink :to="{ name: 'blogH2S2' }" class="btn btn-sm btn-outline btn-primary">saison 2</RouterLink>
      </div>
      <div class="w-full flex flex-col items-center text-center gap-4">
        <h4>Kan</h4>
        <p class="flex-1">L'histoire de la louve Kan</p>
        <RouterLink :to="{ name: 'blogKan' }" class="btn btn-sm btn-outline btn-primary">Kan
        </RouterLink>
      </div>
      <div class="w-full flex flex-col items-center text-center gap-4">
        <h4>La rose et le lierre</h4>
        <p class="flex-1">L'histoire de La rose et le lierre</p>
        <RouterLink :to="{ name: 'blogLetR' }" class="btn btn-sm btn-outline btn-primary">
        </RouterLink>
      </div>
    </div>
  </div>
</template>
