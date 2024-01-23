<script setup>
// [ ] Créer un composant PostCard
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="container max-w-2xl mx-auto bg-black bg-opacity-75 p-6 md:rounded-lg md:my-6">
    <h1 class="mb-4">Blog</h1>
    <ul class="text-lg">
      <li>
        <RouterLink :to="{ name: 'BlogPostDivinitysReach' }" class="hover:underline">
          Divinity's Reach
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
