<script setup>
import { RouterView } from 'vue-router';

import AppNavigation from './components/AppNavigation.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <AppNavigation />
  <main class="flex-1 relative">
    <RouterView v-slot="{ Component }">
      <transition 
        name="page" 
        mode="out-in"
        appear
      >
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
  <AppFooter />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
