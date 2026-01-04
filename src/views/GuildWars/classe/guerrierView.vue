<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950/60 via-black/80 to-black p-8 md:p-12 border border-orange-500/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-orange-500 uppercase tracking-tighter leading-none">Guerrier</h1>
            <div class="h-1 flex-1 bg-orange-500/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Maître des armes tactique, le guerrier excelle par sa force brute et sa polyvalence. 
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full lg:w-72">
          <div class="bg-black/60 p-5 rounded-2xl border border-orange-500/30 shadow-xl">
            <div class="flex justify-between items-center mb-1">
              <span class="text-orange-500 text-xs font-black italic">Armure LOURDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : L'Adrénaline</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-orange-500/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              Le guerrier génère de l'adrénaline à chaque attaque réussie. Cette ressource alimente les <span class="text-orange-400 font-bold">Compétences de Déchaînement</span> situées sur la touche <kbd class="px-2 py-0.5 bg-orange-700 rounded text-xs text-white border border-orange-400">F1</kbd>.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-orange-950/40 rounded-xl border border-orange-500/50">
                <h4 class="text-orange-400 font-bold text-sm uppercase">Niveau 1</h4>
                <p class="text-xs text-white">10 Adrénaline : Effets de base.</p>
              </div>
              <div class="p-4 bg-orange-950/60 rounded-xl border border-orange-500/70 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                <h4 class="text-orange-400 font-bold text-sm uppercase">Niveau 2</h4>
                <p class="text-xs text-white">20 Adrénaline : Dégâts accrus.</p>
              </div>
              <div class="p-4 bg-orange-950/80 rounded-xl border border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                <h4 class="text-orange-400 font-bold text-sm uppercase">Niveau 3</h4>
                <p class="text-xs text-white font-bold">30 Adrénaline : Puissance maximale.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Armes</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-orange-500/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-black/50 p-6 rounded-2xl border border-orange-500/20 space-y-4">
              <h3 class="text-orange-400 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> 
                Armes de Corps à Corps
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon / Marteau</span> <span class="text-orange-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Hache / Épée / Masse / Dague</span> <span class="text-orange-400">Main gauche</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Hache / Épée / Masse / Dague</span> <span class="text-orange-400">Main droite</span></li>
              </ul>
            </div>
            <div class="bg-black/50 p-6 rounded-2xl border border-orange-500/20 space-y-4">
              <h3 class="text-orange-400 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> 
                Soutien & Distance
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Arc Long / Fusil / Lance / baton</span> <span class="text-orange-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bouclier / Cor de guerre / Torche / Pistolet</span> <span class="text-orange-400">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Compétences Utilitaires</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-orange-500/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <h4 class="font-bold text-orange-400 mb-1 italic">{{ skill.title }}</h4>
              <p class="text-xs text-white leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-8">
          
          <div class="bg-black/60 rounded-3xl border border-orange-500/30 p-6 space-y-6">
            <h3 class="text-xl font-bold text-white uppercase tracking-widest text-center">Aptitudes de Base</h3>
            <div class="space-y-2">
              <div v-for="spec in coreSpecs" :key="spec.name" class="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-orange-500/50 transition-all cursor-default">
                <span class="font-bold text-sm text-white group-hover:text-orange-400">{{ spec.name }}</span>
                <span class="text-[10px] text-orange-300 uppercase font-mono font-bold">{{ spec.focus }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-orange-500 uppercase tracking-widest px-2">Élites</h3>
            
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
  { title: 'Bannières', desc: 'Placez des étendards pour octroyer des avantages puissants aux alliés dans une large zone.' },
  { title: 'Cris', desc: 'Ordres vocaux qui soignent les alliés ou infligent des altérations de contrôle aux ennemis.' },
  { title: 'Signets', desc: 'Offrent des bonus de statistiques permanents et des effets actifs dévastateurs une fois activés.' },
  { title: 'Postures', desc: 'Techniques de concentration permettant d\'ignorer la douleur ou de gagner de la stabilité.' },
  { title: 'Physiques', desc: 'Utilisez votre corps comme une arme : coups de pied, jet de rochers ou charges violentes.' },
  { title: 'Rage', desc: 'Compétences exclusives au Berserker pour prolonger son état de fureur et attaquer plus vite.' }
];

const coreSpecs = [
  { name: 'Force', focus: 'Dégâts de Puissance' },
  { name: 'Armes', focus: 'Coups Critiques' },
  { name: 'Défense', focus: 'Survie / Armure' },
  { name: 'Tactique', focus: 'Soutien de Groupe' },
  { name: 'Discipline', focus: 'Fluidité / F1' }
];

const eliteSpecs = [
  { 
    name: 'Berserker', 
    desc: '"Entrez dans une rage folle pour déchaîner des attaques primales."', 
    weapon: 'Torche', 
    bg: 'bg-red-900/40', 
    border: 'border-red-500/50' 
  },
  { 
    name: 'Brise-sort', 
    desc: '"Maître de la dague capable de contrer la magie adverse."', 
    weapon: 'Dagues', 
    bg: 'bg-red-900/40', 
    border: 'border-blue-500/50' 
  },
  { 
    name: 'Lame-jurée', 
    desc: '"Dégainez le pistolet-lame pour des entailles chargées."', 
    weapon: 'Pistolet', 
    bg: 'bg-red-900/40', 
    border: 'border-amber-500/50' 
  },
  { 
    name: 'Parangon', 
    desc: '"Le meneur de troupes utilisant des chants pour inspirer ses alliés."', 
    weapon: 'Lance', 
    bg: 'bg-red-900/40', 
    border: 'border-orange-500/50' 
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
  text-shadow: 0 10px 30px rgba(234, 88, 12, 0.4);
}

kbd {
  box-shadow: 0 2px 0 rgba(0,0,0,0.8);
}
</style>