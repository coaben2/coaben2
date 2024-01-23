<script setup>
import { RouterLink } from 'vue-router';

const posts = [
  {
    thumbnail: 'I1-000.jpg',
    title: "Divinity's Reach",
    excerpt:
      "Le soleil se levait doucement sur la ville de Divinity's Reach, illuminant les rues pavées et les bâtiments majestueux. Hounoana se tenait au sommet d'une colline, les cheveux au vent et les yeux brillants d'excitation. Elle avait créé son personnage...",
    link: 'BlogPostDivinitysReach',
  },
  // [ ] Ajouter les autres articles sur le même modèle
];
</script>

<template>
  <div class="container mx-auto my-6">
    <h1 class="mb-4">Blog</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 shadow-lg" v-for="(post, k) in posts" :key="k">
        <figure v-if="post.thumbnail">
          <img
            :src="`/img/${post.thumbnail}`"
            :alt="post.title"
            class="w-full h-full aspect-video object-cover"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ post.title }}</h2>
          <p v-if="post.excerpt" class="line-clamp-3 mb-2">{{ post.excerpt }}</p>
          <div class="card-actions justify-end">
            <RouterLink :to="{ name: post.link }" class="btn btn-primary">
              Lire l'article
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
