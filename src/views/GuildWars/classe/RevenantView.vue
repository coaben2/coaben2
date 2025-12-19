<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-950/70 via-black/90 to-black p-8 md:p-12 border border-red-600/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-red-600 uppercase tracking-tighter leading-none">Revenant</h1>
            <div class="h-1 flex-1 bg-red-600/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Héros des Brumes, le revenant canalise le pouvoir de légendes historiques pour manipuler l'énergie éthérée et dominer le champ de bataille.
          </p>
        </div>

        <div class="flex flex-col gap-4 w-full lg:w-72">
          <div class="bg-black/80 p-5 rounded-2xl border border-red-600/40 shadow-2xl">
            <div class="flex justify-between items-center mb-1">
              <span class="text-red-500 text-xs font-black italic">Armure LOURDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Postures Légendaires</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-red-600/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              Le revenant invoque des <span class="text-red-500 font-bold">Légendes</span> pour modifier ses compétences. Changer de posture sur <kbd class="px-2 py-0.5 bg-red-800 rounded text-xs text-white border border-red-500">F1</kbd> consomme de l'<span class="text-red-400 font-bold">Énergie</span>, une ressource qui se recharge continuellement.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="legend in coreLegends" :key="legend.name" class="p-4 bg-red-950/60 rounded-xl border border-red-600 text-center group hover:bg-red-600/20 transition-colors">
                <h4 class="text-red-400 font-bold text-xs uppercase group-hover:text-red-500">{{ legend.name }}</h4>
                <p class="text-[10px] text-white mt-1">{{ legend.desc }}</p>
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
            <div class="bg-black/60 p-6 rounded-2xl border border-red-600/30 space-y-4">
              <h3 class="text-red-500 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> 
                Arsenal des Brumes
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon / Marteau / Lance</span> <span class="text-red-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Épée / Masse / Dague</span> <span class="text-red-400">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Épée / Hache</span> <span class="text-red-400">Main Gauche</span></li>
              </ul>
            </div>
            <div class="bg-black/60 p-6 rounded-2xl border border-red-600/30 space-y-4">
              <h3 class="text-red-500 font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> 
                Distance & Soutien
              </h3>
              <ul class="space-y-2 text-white text-sm font-medium">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Arc Court / Bâton</span> <span class="text-red-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Sceptre</span> <span class="text-red-400">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bouclier</span> <span class="text-red-400">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Capacités Éthérées</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-red-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-white/10 rounded-2xl border border-white/20 hover:bg-red-900/20 transition-all">
              <h4 class="font-bold text-red-400 mb-1 italic">{{ skill.title }}</h4>
              <p class="text-xs text-white leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-8">
          
          <div class="bg-black/70 rounded-3xl border border-red-600/40 p-6 space-y-6">
            <h3 class="text-xl font-bold text-white uppercase tracking-widest text-center">Aptitudes de Base</h3>
            <div class="space-y-2">
              <div v-for="spec in coreSpecs" :key="spec.name" class="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-transparent hover:border-red-600/50 transition-all cursor-default">
                <span class="font-bold text-sm text-white group-hover:text-red-400">{{ spec.name }}</span>
                <span class="text-[10px] text-red-300 uppercase font-mono font-bold">{{ spec.focus }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-red-600 uppercase tracking-widest px-2">Élites</h3>
            
            <div v-for="elite in eliteSpecs" :key="elite.name" 
                 :class="['relative group overflow-hidden rounded-2xl border p-5 transition-all hover:scale-105', elite.bg, elite.border]">
              <h4 class="text-lg font-black text-white uppercase">{{ elite.name }}</h4>
              <p class="text-[10px] text-red-400 font-bold mb-1 italic">{{ elite.legend }}</p>
              <p class="text-xs text-white italic leading-tight">{{ elite.desc }}</p>
              <div class="mt-3 flex gap-2">
                <span class="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-white/20 text-white uppercase font-bold">{{ elite.weapon }}</span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
const coreLegends = [
  { name: 'Shiro Tagachi', desc: 'Assassin légendaire : Mobilité et dégâts de frappe.' },
  { name: 'Ventari', desc: 'Centaure légendaire : Soins et purification via la tablette.' },
  { name: 'Mallyx', desc: 'Démon légendaire : Maîtrise des altérations et tourment.' },
  { name: 'Jalis Martelfer', desc: 'Nain légendaire : Robustesse et défense de zone.' }
];

const skillTypes = [
  { title: 'Facettes', desc: 'Auras de Glint qui consomment de l\'énergie pour octroyer des avantages constants.' },
  { title: 'Ordres de Kalla', desc: 'Invocations d\'esprits Charrs pour le contrôle et le soutien offensif.' },
  { title: 'Alliances', desc: 'Passage entre Archemorus (Dégâts) et Viktor (Soin) en une compétence.' },
  { title: 'Échos de Razah', desc: 'Compétences du Conduit manipulant les énergies pures des Brumes.' },
  { title: 'Compétences de Brumes', desc: 'Capacités utilitaires qui varient selon la légende active.' },
  { title: 'Déchaînement', desc: 'Libération d\'énergie accumulée pour des effets dévastateurs.' }
];

const coreSpecs = [
  { name: 'Dévastation', focus: 'Dégâts de Frappe' },
  { name: 'Corruption', focus: 'Altérations' },
  { name: 'Rétribution', focus: 'Tanking' },
  { name: 'Salut', focus: 'Soins / Support' },
  { name: 'Invocation', focus: 'Énergie / Swap' }
];

const eliteSpecs = [
  { 
    name: 'Héraut', 
    legend: 'Glint (Dragon)',
    desc: 'Offre des avantages permanents à ses alliés grâce aux facettes.', 
    weapon: 'Bouclier', 
    bg: 'bg-red-950/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Renégat', 
    legend: 'Kalla (Renégate)',
    desc: 'Invoque sa troupe pour submerger l\'ennemi sous une pluie de flèches.', 
    weapon: 'Arc Court', 
    bg: 'bg-red-950/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Justicier', 
    legend: 'Alliance (Champions)',
    desc: 'Saute au cœur de la mêlée pour écraser ses ennemis ou soigner les siens.', 
    weapon: 'Espadon', 
    bg: 'bg-red-950/40', 
    border: 'border-red-600/50' 
  },
  { 
    name: 'Conduit', 
    legend: 'Razah (Entité)',
    desc: 'Canalise les énergies éthérées pour devenir un pur vecteur des Brumes.', 
    weapon: 'Lance', 
    bg: 'bg-red-900/60', 
    border: 'border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
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