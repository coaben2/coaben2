<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/60 via-black/80 to-black p-8 md:p-12 border border-blue-500/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-blue-400 uppercase tracking-tighter leading-none">Gardien</h1>
            <div class="h-1 flex-1 bg-blue-500/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Défenseur dévoué, le gardien protège ses alliés à l'aide de vertus magiques et de sorts de soutien puissants.
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full lg:w-72">
          <div class="bg-black/60 p-5 rounded-2xl border border-blue-500/30 shadow-xl">
            <div class="flex justify-between items-center mb-1">
              <span class="text-blue-400 text-xs font-black italic">Armure LOURDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Les Vertus</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-blue-500/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              Le gardien possède trois <span class="text-blue-400 font-bold">Vertus</span> passives. Il peut les activer pour offrir des bonus immédiats aux alliés sur les touches <kbd class="px-2 py-0.5 bg-blue-700 rounded text-xs text-white border border-blue-400">F1</kbd> à <kbd class="px-2 py-0.5 bg-blue-700 rounded text-xs text-white border border-blue-400">F3</kbd>.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-blue-950/40 rounded-xl border border-blue-500/50">
                <h4 class="text-blue-400 font-bold text-sm uppercase">Justice</h4>
                <p class="text-xs text-white">Brûle les ennemis régulièrement. L'activer inflige des dégâts de feu.</p>
              </div>
              <div class="p-4 bg-blue-950/60 rounded-xl border border-blue-500/70 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <h4 class="text-blue-400 font-bold text-sm uppercase">Résolution</h4>
                <p class="text-xs text-white">Soigne passivement. L'activer dissipe les altérations et soigne les alliés.</p>
              </div>
              <div class="p-4 bg-blue-950/80 rounded-xl border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <h4 class="text-blue-400 font-bold text-sm uppercase">Courage</h4>
                <p class="text-xs text-white font-bold">Confère une égide. L'activer protège instantanément la zone.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Armes</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-blue-500/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-black/50 p-6 rounded-2xl border border-blue-500/20 space-y-4">
              <h3 class="text-blue-400 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> 
                Armes de Corps à Corps
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon / Marteau / Lance</span> <span class="text-blue-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Sceptre / Épée / Masse / Hache / Pistolet</span> <span class="text-blue-400">Main droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Épée / Pistolet</span> <span class="text-blue-400">Main Gauche</span></li>
              </ul>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-blue-500/20 space-y-4">
              <h3 class="text-blue-400 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> 
                Soutien & Distance
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bâton / Arc Long / Lance</span> <span class="text-blue-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bouclier / Focus</span> <span class="text-blue-400">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Compétences Utilitaires</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-blue-500/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <h4 class="font-bold text-blue-400 mb-1 italic">{{ skill.title }}</h4>
              <p class="text-xs text-white leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-8">
          
          <div class="bg-black/60 rounded-3xl border border-blue-500/30 p-6 space-y-6">
            <h3 class="text-xl font-bold text-white uppercase tracking-widest text-center">Aptitudes de Base</h3>
            <div class="space-y-2">
              <div v-for="spec in coreSpecs" :key="spec.name" class="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-blue-500/50 transition-all cursor-default">
                <span class="font-bold text-sm text-white group-hover:text-blue-400">{{ spec.name }}</span>
                <span class="text-[10px] text-blue-300 uppercase font-mono font-bold">{{ spec.focus }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-blue-400 uppercase tracking-widest px-2">Élites</h3>
            
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
  { title: 'Consécrations', desc: 'Zones de lumière purifiant les alliés ou brûlant les ennemis au sol.' },
  { title: 'Méditations', desc: 'Sorts instantanés pour se soigner, se téléporter ou riposter avec force.' },
  { title: 'Armes Spirituelles', desc: 'Invoquez des marteaux ou des épées de lumière pour combattre à vos côtés.' },
  { title: 'Cris', desc: 'Invocations puissantes qui confèrent égide, protection et régénération aux alliés.' },
  { title: 'Signets', desc: 'Offrent des bonus défensifs passifs et des effets de zone lors de l\'activation.' },
  { title: 'Symboles', desc: 'Gravures lumineuses créées par vos attaques d\'armes, aidant les alliés en zone.' }
];

const coreSpecs = [
  { name: 'Zèle', focus: 'Dégâts & Symboles' },
  { name: 'Rayonnement', focus: 'Critiques & Brûlure' },
  { name: 'Valeur', focus: 'Défense / Robustesse' },
  { name: 'Honneur', focus: 'Soin / Soutien' },
  { name: 'Vertus', focus: 'Amélioration F1/F2/F3' }
];

const eliteSpecs = [
  { 
    name: 'Draconnier', 
    desc: '"Utilisez des pièges de lumière et un arc long pour abattre vos proies."', 
    weapon: 'Arc Long', 
    bg: 'bg-blue-900/40', 
    border: 'border-blue-500/50' 
  },
  { 
    name: 'Incendiaire', 
    desc: '"Maniez des haches et des grimoires pour purifier par le feu."', 
    weapon: 'Hache', 
    bg: 'bg-blue-900/40', 
    border: 'border-orange-400/50' 
  },
  { 
    name: 'Subjugueur', 
    desc: '"Un guerrier agile utilisant deux épées pour des frappes fulgurantes."', 
    weapon: 'Épée (M. Gauche)', 
    bg: 'bg-blue-900/40', 
    border: 'border-cyan-400/50' 
  },
  { 
    name: 'Luminescence', 
    desc: '"Le gardien rayonnant utilisant les Vertus pour focaliser l\'énergie solaire."', 
    weapon: 'Lance', 
    bg: 'bg-blue-900/40', 
    border: 'border-yellow-400/50' 
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
  text-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

kbd {
  box-shadow: 0 2px 0 rgba(0,0,0,0.8);
}
</style>