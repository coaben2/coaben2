<script setup>
import { RouterView } from 'vue-router';

import AppNavigation from './components/AppNavigation.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <AppNavigation />
  <main class="flex-1">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped></style>
