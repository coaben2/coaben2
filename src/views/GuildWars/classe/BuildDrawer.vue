<script setup>
import { ref } from 'vue';
import BuildTable from './BuildTable.vue';

defineProps({
  builds: {
    type: Array,
    required: true,
    default: () => []
  },
  profession: {
    type: String,
    required: true
  }
});

const isExpanded = ref(false);

const toggleDrawer = () => {
  isExpanded.value = !isExpanded.value;
};

const profColors = {
  Guerrier: '#FFD100',
  Gardien: '#72C1D9',
  Revenant: '#D12727',
  Rodeur: '#8DD448',
  Voleur: '#C08F95',
  Ingenieur: '#D09C59',
  Elementaliste: '#F68A87',
  Envouteur: '#B679D5',
  Necromant: '#52A76F'
};
</script>

<template>
<div 
  class="fixed bottom-0 left-0 right-0 h-screen z-[100] transition-all duration-500 ease-in-out transform"
  :class="isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'"
>
    <!-- Handle / Toggle Bar -->
    <div 
      @click="toggleDrawer"
      class="h-12 flex items-center justify-between px-6 cursor-pointer backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      :style="{ backgroundColor: `${profColors[profession]}CC` }"
    >
      <div class="flex items-center gap-3 text-black font-black uppercase tracking-widest text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Builds Populaires - {{ profession }}
        <span class="bg-black/20 px-2 py-0.5 rounded text-[10px] ml-2">{{ builds.length }} dispos</span>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold text-black/60 hidden sm:block">
          {{ isExpanded ? 'RÉDUIRE' : 'AFFICHER LES BUILDS' }}
        </span>
        <div class="bg-black/10 rounded-full p-1 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Content Drawer -->
    <div class="bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5 overflow-y-auto p-4 sm:p-6 custom-scrollbar shadow-2xl">
      <div class="max-w-7xl mx-auto">
        <BuildTable :builds="builds" :profession="profession" />
        <div class="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-[0.2em] opacity-50">
          Guild Wars 2 Build Database &bull; Updated via API
        </div>
      </div>
    </div>
  </div>

  <!-- Spacer to prevent content from being hidden behind the closed handle -->
  <div class="h-12"></div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
