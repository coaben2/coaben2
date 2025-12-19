<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-950/80 via-black/90 to-black p-8 md:p-12 border border-orange-600/40 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-orange-500 uppercase tracking-tighter leading-none">Ingénieur</h1>
            <div class="h-1 flex-1 bg-orange-500/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Maître de l'innovation technologique, l'ingénieur utilise des <span class="text-orange-400 font-bold">Kits</span> et des gadgets pour s'adapter à toutes les situations.
          </p>
        </div>
        <div class="bg-black/80 p-5 rounded-2xl border border-orange-600/30 self-center shadow-xl">
          <span class="text-orange-500 text-xs font-black italic uppercase tracking-widest">Armure Intermédiaire</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Ceinture d'outils</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-orange-600/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              L'ingénieur possède une <span class="text-orange-400 font-bold">Ceinture d'outils</span> (<kbd class="px-2 py-0.5 bg-orange-800 rounded text-xs text-white border border-orange-500">F1-F5</kbd>). Chaque compétence utilitaire choisie ajoute une compétence supplémentaire sur sa ceinture.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-orange-900/30 rounded-xl border border-orange-600/50">
                <h4 class="text-orange-400 font-bold text-sm uppercase mb-1 text-center">Polyvalence</h4>
                <p class="text-[10px] text-white text-center">Un kit pour chaque problème.</p>
              </div>
              <div class="p-4 bg-orange-900/30 rounded-xl border border-orange-600/50">
                <h4 class="text-orange-400 font-bold text-sm uppercase mb-1 text-center">Déploiement</h4>
                <p class="text-[10px] text-white text-center">Tourelles et drones automatisés.</p>
              </div>
              <div class="p-4 bg-orange-900/30 rounded-xl border border-orange-600/50">
                <h4 class="text-orange-400 font-bold text-sm uppercase mb-1 text-center">Explosifs</h4>
                <p class="text-[10px] text-white text-center">Dégâts de zone massifs.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Laboratoire d'Armes</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-orange-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div class="bg-black/60 p-6 rounded-2xl border border-orange-600/20">
              <h3 class="text-orange-500 font-bold mb-4 uppercase text-xs">Armement</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Fusil / Marteau / Lance / arc court</span> <span class="text-orange-400">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Pistolet / Épée / Masse</span> <span class="text-orange-400">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bouclier / Pistolet</span> <span class="text-orange-400">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Kits et Gadgets</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-orange-900/20 rounded-2xl border border-orange-600/30 hover:bg-orange-900/30 transition-all">
                <h4 class="font-bold text-orange-400 mb-1 italic">{{ skill.title }}</h4>
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
               :class="['relative group overflow-hidden rounded-2xl border p-5 transition-all hover:border-orange-400 shadow-lg', 
                        elite.name === 'Amalgame' ? 'border-orange-500 bg-orange-950/40 shadow-orange-500/20' : 'border-orange-600/30 bg-black/60']">
            
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-black text-white uppercase">{{ elite.name }}</h4>
              <span class="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-bold uppercase">{{ elite.weapon }}</span>
            </div>
            
            <p class="text-white/80 text-xs italic mb-4 leading-tight">{{ elite.desc }}</p>
            
            <div class="pt-3 border-t border-orange-600/20">
              <div class="flex items-center gap-2">
                <span class="text-[9px] text-orange-500 uppercase font-bold italic">Système :</span>
                <span class="text-[10px] text-white font-mono">{{ elite.mechanic }}</span>
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
  { title: 'Kits de combat', desc: 'Remplacez votre arme actuelle par un kit spécialisé (Flammes, Médicinal, Grenades).' },
  { title: 'Drones', desc: 'Invoquez de petits robots automatisés pour soigner, protéger ou attaquer.' },
  { title: 'Élixirs', desc: 'Consommez des substances chimiques pour obtenir des bonus de combat aléatoires.' },
  { title: 'Gadgets', desc: 'Utilisez des dispositifs mécaniques pour vous propulser ou immobiliser l\'ennemi.' },
  { title: 'Gyroïdes', desc: 'Unités mobiles déployées par le Scrapper pour le soutien ou la démolition.' },
  { title: 'Amalgames Énergétiques', desc: 'Fusionnez plusieurs types de composants pour créer des effets instables et puissants.' }
];

const eliteSpecs = [
  { 
    name: 'Scrapper', 
    desc: 'Un bagarreur au marteau qui utilise des gyroïdes pour le contrôle de zone.', 
    weapon: 'Marteau',
    mechanic: 'Gyroïdes & Barrières'
  },
  { 
    name: 'Holographiste', 
    desc: 'Maîtrise la puissance du soleil pour créer des armes de lumière solide.', 
    weapon: 'Épée',
    mechanic: 'Forge à Photons'
  },
  { 
    name: 'Méchamancien', 
    desc: 'Commande un Golem de Jade surpuissant pour combattre à ses côtés.', 
    weapon: 'Masse',
    mechanic: 'Mech de Jade CJ-1'
  },
  { 
    name: 'Amalgame', 
    desc: 'Fusionne la technologie et les énergies brutes via une lance conductrice pour surcharger la réalité.', 
    weapon: 'Lance',
    mechanic: 'Surcharge Moléculaire'
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
h1 { text-shadow: 0 0 30px rgba(249, 115, 22, 0.4); }
</style>