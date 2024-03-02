<script setup>
import { RouterLink } from 'vue-router';

const posts = [
  {
    thumbnail: 'I1-000.jpg',
    title: "Divinity's Reach",
    excerpt:
      "Le soleil se levait doucement sur la ville de Divinity's Reach, illuminant les rues pavées et les bâtiments majestueux. Hounoana se tenait au sommet d'une colline, les cheveux au vent et les yeux brillants d'excitation.",
    link: 'BlogPostDivinitysReach',
  },
  {
    thumbnail: 'I2-001.png',
    title: 'Heart of stone',
    excerpt:
      'De mystérieuses perturbations agitaient les Terres sauvages de Brisban, dans le sud-ouest de Tyrie. Le calme apparent de la région avait été perturbé, et les camps séraphins, en charge de traquer les contrebandiers dans les environs, se retrouvaient confrontés à de nouveaux problèmes.',
    link: 'BlogPostHeartOfStone',
  },
  {
    thumbnail: 'Louv.png',
    title: 'Louv et les mystères de la forêt',
    excerpt:
      "Au cœur d'une vaste forêt, dans un endroit où les rayons du soleil peinaient à percer l'épaisse canopée, vivait une louve solitaire nommée Kan. Sa fourrure d'un blanc pur se détachait de manière saisissante dans l'obscurité de la forêt.",
    link: 'BlogPostLouvEtLesMysteresDeLaForet',
  },
  {
    thumbnail: '',
    title: 'Le lierre et la rose',
    excerpt:
      "Il était une fois une magnifique rose, épanouie et fière dans un jardin enchanteur. Elle dégageait un parfum envoûtant et attirait l'attention de tous ceux qui la croisaient. Au fil du temps, une liane de lierre s'était enroulée autour d'elle, tombant amoureusement sous son charme.",
    link: 'BlogPostLeLierreEtLaRose',
  },
  {
    thumbnail: 'I3-028.png',
    title: 'La capitaines pirates',
    excerpt:
      "LA capitaine pirate à l'avant du navire a gracieusement coupé les vagues, ses cheveux gris volant au vent tandis que ses oreilles de loup trahissaient sa nature sauvage et impitoyable.",
    link: 'BlogPostLouvpirates',
  },
];
</script>

<template>
  <div class="container mx-auto my-6">
    <h1 class="mb-4">Blog</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div class="card bg-base-100 shadow-lg" v-for="(post, k) in posts" :key="k">
        <figure v-if="post.thumbnail">
          <img :src="`/img/${post.thumbnail}`" :alt="post.title" class="w-full h-full aspect-video object-cover" />
        </figure>
        <div class="card-body">
          <h2 class="card-title font-bold text-xl">{{ post.title }}</h2>
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
