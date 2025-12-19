<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-950/80 via-black/90 to-black p-8 md:p-12 border border-fuchsia-600/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-fuchsia-500 uppercase tracking-tighter leading-none">Envoûteur</h1>
            <div class="h-1 flex-1 bg-fuchsia-500/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Maître du mirage et de la tromperie, l'envoûteur tisse des <span class="text-fuchsia-400 font-bold">Illusions</span> pour désorienter et anéantir ses rivaux.
          </p>
        </div>
        <div class="bg-black/80 p-5 rounded-2xl border border-fuchsia-600/30 self-center shadow-xl">
          <span class="text-fuchsia-500 text-xs font-black italic uppercase tracking-widest">Armure Légère</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Illusions</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-fuchsia-600/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              L'envoûteur crée des **Clones** et des **Fantasmes**. Il peut les sacrifier via les compétences de <span class="text-fuchsia-400 font-bold">Brisure</span> (<kbd class="px-2 py-0.5 bg-fuchsia-800 rounded text-xs text-white border border-fuchsia-500">F1-F4</kbd>) pour infliger des dégâts, de la confusion ou de la stupeur.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-fuchsia-900/30 rounded-xl border border-fuchsia-600/50">
                <h4 class="text-fuchsia-400 font-bold text-sm uppercase mb-1 text-center">Clones</h4>
                <p class="text-[10px] text-white text-center italic">Copies fragiles qui harcèlent la cible.</p>
              </div>
              <div class="p-4 bg-fuchsia-900/30 rounded-xl border border-fuchsia-600/50">
                <h4 class="text-fuchsia-400 font-bold text-sm uppercase mb-1 text-center">Fantasmes</h4>
                <p class="text-[10px] text-white text-center italic">Invocations puissantes avec des attaques uniques.</p>
              </div>
              <div class="p-4 bg-fuchsia-900/30 rounded-xl border border-fuchsia-600/50">
                <h4 class="text-fuchsia-400 font-bold text-sm uppercase mb-1 text-center">Distorsion</h4>
                <p class="text-[10px] text-white text-center italic">Évitement pur en brisant vos illusions.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Arsenal de Prestige</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-fuchsia-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div class="bg-black/60 p-6 rounded-2xl border border-fuchsia-600/20">
              <h3 class="text-fuchsia-500 font-bold mb-4 uppercase text-xs">Maniement Élégant</h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon / Bâton / Lance / Fusil</span><span>2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>épée / Ache / Dague / Sceptre</span><span>Mains Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Épée / Pistolet / Focus / Torche / Bouclier</span><span>Mains Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Arts de l'Éther</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-fuchsia-900/10 rounded-2xl border border-fuchsia-600/20 hover:bg-fuchsia-900/20 transition-all">
                <h4 class="font-bold text-fuchsia-400 mb-1 italic">{{ skill.title }}</h4>
                <p class="text-xs text-white/80 leading-relaxed">{{ skill.desc }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-6">
          <h3 class="text-2xl font-black text-white uppercase tracking-widest px-2 italic">Spécialisations</h3>
          
          <div v-for="elite in eliteSpecs" :key="elite.name" 
               :class="['relative group overflow-hidden rounded-2xl border p-5 transition-all shadow-xl', 
                        elite.name === 'Troubadour' ? 'border-fuchsia-500 bg-fuchsia-950/40 shadow-fuchsia-500/20' : 'border-fuchsia-600/30 bg-black/60']">
            
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-black text-white uppercase">{{ elite.name }}</h4>
              <span class="text-[10px] bg-fuchsia-600 text-white px-2 py-0.5 rounded font-bold uppercase">{{ elite.weapon }}</span>
            </div>
            
            <p class="text-white/80 text-xs italic mb-4 leading-tight">{{ elite.desc }}</p>
            
            <div class="pt-3 border-t border-fuchsia-600/20">
              <div class="flex items-center gap-2">
                <span class="text-[9px] text-fuchsia-500 uppercase font-bold italic">Régime :</span>
                <span class="text-[10px] text-white font-mono uppercase">{{ elite.mechanic }}</span>
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
  { title: 'Chants de Guerre', desc: 'Compétences du Troubadour qui émettent des ondes de choc harmoniques autour de la lance.' },
  { title: 'Mantra', desc: 'Méditez pour préparer des sorts puissants pouvant être lancés plusieurs fois instantanément.' },
  { title: 'Glamour', desc: 'Zones de lumière manipulant le temps, l\'espace et la visibilité des alliés.' },
  { title: 'Manipulations', desc: 'Sorts éthérés pour refléter les projectiles ou se téléporter.' },
  { title: 'Signets', desc: 'Améliorent passivement vos illusions ou votre propre puissance mentale.' }
];

const eliteSpecs = [
  { 
    name: 'Chronomancien', 
    desc: 'Un maître du temps capable d\'arrêter les horloges et de déchirer le continuum.', 
    weapon: 'Bouclier',
    mechanic: 'Déchirure Temporelle'
  },
  { 
    name: 'Mirage', 
    desc: 'Un duelliste insaisissable qui danse à travers les attaques grâce au manteau de mirage.', 
    weapon: 'Hache',
    mechanic: 'Esquive de Mirage'
  },
  { 
    name: 'Virtuose', 
    desc: 'Remplace ses clones par des dagues psychiques prêtes à être projetées.', 
    weapon: 'Dague',
    mechanic: 'Lames de l\'esprit'
  },
  { 
    name: 'Troubadour', 
    desc: 'Transforme la lance en diapason éthéré, utilisant des résonances pour amplifier la douleur ennemie.', 
    weapon: 'Lance',
    mechanic: 'Symphonie Brisée'
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
h1 { text-shadow: 0 0 30px rgba(217, 70, 239, 0.4); }
</style>