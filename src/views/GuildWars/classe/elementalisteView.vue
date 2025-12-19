<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/70 via-black/90 to-black p-8 md:p-12 border border-red-600/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-red-600 uppercase tracking-tighter leading-none">Élémentaliste</h1>
            <div class="h-1 flex-1 bg-red-600/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Maître des forces de la nature, l'élémentaliste canalise le feu, l'eau, l'air et la terre pour terrasser ses ennemis.
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full lg:w-72">
          <div class="bg-black/60 p-5 rounded-2xl border border-red-600/30 shadow-xl">
            <div class="flex justify-between items-center mb-1">
              <span class="text-red-500 text-xs font-black italic">Armure LÉGÈRE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Les Affinités</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-red-600/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              L'élémentaliste alterne entre quatre <span class="text-red-500 font-bold">Affinités Élémentaires</span> qui modifient ses compétences sur les touches <kbd class="px-2 py-0.5 bg-red-800 rounded text-xs text-white border border-red-500">F1</kbd> à <kbd class="px-2 py-0.5 bg-red-800 rounded text-xs text-white border border-red-500">F4</kbd>.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 bg-red-900/50 rounded-xl border border-red-600 text-center">
                <h4 class="text-red-400 font-bold text-sm uppercase">Feu</h4>
                <p class="text-[10px] text-white">Dégâts et brûlures.</p>
              </div>
              <div class="p-4 bg-blue-900/30 rounded-xl border border-blue-500/50 text-center">
                <h4 class="text-blue-300 font-bold text-sm uppercase">Eau</h4>
                <p class="text-[10px] text-white">Soins et glace.</p>
              </div>
              <div class="p-4 bg-purple-900/30 rounded-xl border border-purple-500/50 text-center">
                <h4 class="text-purple-300 font-bold text-sm uppercase">Air</h4>
                <p class="text-[10px] text-white">Foudre et vitesse.</p>
              </div>
              <div class="p-4 bg-orange-900/30 rounded-xl border border-orange-500/50 text-center">
                <h4 class="text-orange-300 font-bold text-sm uppercase">Terre</h4>
                <p class="text-[10px] text-white">Protection et saignements.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Armes</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-red-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-black/50 p-6 rounded-2xl border border-red-600/20 space-y-4">
              <h3 class="text-red-500 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> 
                Maîtrise Élémentaire
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bâton / Marteau / Lance</span> <span class="text-red-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Épée / Sceptre / Dague / Pistolet</span> <span class="text-red-400">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Dague</span> <span class="text-red-400">Main Gauche</span></li>
              </ul>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-red-600/20 space-y-4">
              <h3 class="text-red-500 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> 
                Auxiliaires & Soutien
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon (Invoqué)</span> <span class="text-red-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Cor / Focus</span> <span class="text-red-400">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Compétences Utilitaires</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-red-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <h4 class="font-bold text-red-500 mb-1 italic">{{ skill.title }}</h4>
              <p class="text-xs text-white leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-8">
          
          <div class="bg-black/60 rounded-3xl border border-red-600/30 p-6 space-y-6">
            <h3 class="text-xl font-bold text-white uppercase tracking-widest text-center">Aptitudes de Base</h3>
            <div class="space-y-2">
              <div v-for="spec in coreSpecs" :key="spec.name" class="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-red-600/50 transition-all cursor-default">
                <span class="font-bold text-sm text-white group-hover:text-red-500">{{ spec.name }}</span>
                <span class="text-[10px] text-red-400 uppercase font-mono font-bold">{{ spec.focus }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-red-600 uppercase tracking-widest px-2">Élites</h3>
            
            <div v-for="elite in eliteSpecs" :key="elite.name" 
                 :class="['relative group overflow-hidden rounded-2xl border p-5 transition-all hover:scale-105', elite.bg, elite.border]">
              <h4 class="text-lg font-black text-white uppercase">{{ elite.name }}</h4>
              <p class="text-xs text-white mt-1 italic">{{ elite.desc }}</p>
              <div class="mt-3 flex gap-2">
                <span class="text-[10px] bg-black/40 px-2 py-0.5 rounded border border-white/20 text-white uppercase font-bold">{{ elite.weapon }}</span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
const skillTypes = [
  { title: 'Cris', desc: 'Invocations vocales puissantes qui soignent les alliés ou affaiblissent les ennemis.' },
  { title: 'Postures', desc: 'Techniques de concentration permettant de fusionner les éléments ou d\'augmenter sa vitesse.' },
  { title: 'Augmentations', desc: 'Sorts qui s\'amplifient lorsque vous êtes à proximité de vos sphères de jade.' },
  { title: 'Méditations', desc: 'Compétences de l\'Évocateur permettant de focaliser l\'énergie pour des effets immédiats.' },
  { title: 'Familiers', desc: 'Invoquez des entités élémentaires pour vous assister durant le combat.' },
  { title: 'Surcharges', desc: 'Libérez toute la puissance d\'une affinité pour créer une tempête dévastatrice.' }
];

const coreSpecs = [
  { name: 'Feu', focus: 'Dégâts & Brûlures' },
  { name: 'Air', focus: 'Critiques & Foudre' },
  { name: 'Terre', focus: 'Défense & Saignements' },
  { name: 'Eau', focus: 'Soins & Givre' },
  { name: 'Arcanes', focus: 'Vitesse de Recharge' }
];

const eliteSpecs = [
  { 
    name: 'Cataclyste', 
    desc: '"Utilise des cors de guerre et des cris pour surcharger ses affinités élémentaires."', 
    weapon: 'Cor de guerre', 
    bg: 'bg-red-900/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Tissesort', 
    desc: '"Manie l\'épée et les postures pour utiliser deux affinités simultanément."', 
    weapon: 'Épée', 
    bg: 'bg-red-900/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Catalyseur', 
    desc: '"Manie le marteau et déploie des sphères de jade pour octroyer des avantages."', 
    weapon: 'Marteau', 
    bg: 'bg-red-900/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Évocateur', 
    desc: '"Utilise les méditations et les familiers pour dominer ses rivaux."', 
    weapon: 'Lance', 
    bg: 'bg-red-900/40', 
    border: 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
  }
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

h1 {
  text-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

kbd {
  box-shadow: 0 2px 0 rgba(0,0,0,0.8);
}
</style>