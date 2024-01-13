<script setup>
import { RouterView } from 'vue-router';

import MainNavigation from './components/MainNavigation.vue';
</script>

<template>
  <MainNavigation />
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
