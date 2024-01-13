<script setup>
import { RouterView } from 'vue-router';

import AppNavigation from './components/AppNavigation.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <AppNavigation />
  <div class="flex-1">
    <RouterView />
  </div>
  <AppFooter />
</template>

<style scoped></style>
