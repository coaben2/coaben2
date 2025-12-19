<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-black to-emerald-950/50 p-8 md:p-12 border border-emerald-900/40 backdrop-blur-xl">
      <div class="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-emerald-500 uppercase tracking-tighter leading-none">Nécromant</h1>
            <div class="h-1 flex-1 bg-slate-700/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-slate-300 font-light leading-relaxed">
            Gardien des reliques et des âmes égarées, le nécromant manipule la <span class="text-emerald-400 font-bold text-shadow-sm">Force Vitale</span> et les cendres du passé.
          </p>
        </div>
        <div class="bg-black/80 p-5 rounded-2xl border border-emerald-900/30 self-center shadow-2xl">
          <span class="text-emerald-600 text-xs font-black italic uppercase tracking-widest">Armure Légère</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-slate-200 uppercase tracking-tight">Mécanique : Le Linceul de Cendre</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-emerald-900/60 to-transparent"></div>
          </div>
          <div class="bg-emerald-950/20 p-8 rounded-3xl border border-white/5 space-y-6 backdrop-blur-sm">
            <p class="text-slate-300 leading-relaxed">
              Le nécromant accumule l'énergie des défunts pour alimenter son <span class="text-emerald-500 font-bold">Linceul</span>, une forme spectrale où la chair laisse place à la puissance pure des Brumes.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="stat in necroStats" :key="stat.label" class="p-4 bg-black/40 rounded-xl border border-slate-800 text-center">
                <h4 class="text-emerald-500 font-bold text-xs uppercase">{{ stat.label }}</h4>
                <p class="text-[10px] text-slate-500 mt-1 italic">{{ stat.desc }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-slate-200 uppercase tracking-tight">Arsenal des Ancêtres</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-emerald-900/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-black/60 p-6 rounded-2xl border border-slate-800">
              <h3 class="text-emerald-600 font-bold mb-4 uppercase text-xs">Deux mains</h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Lance</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Espadon</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bâton</span></li>
              </ul>
            </div>
            <div class="bg-black/60 p-6 rounded-2xl border border-slate-800">
              <h3 class="text-emerald-600 font-bold mb-4 uppercase text-xs">Main Droite / Gauche</h3>
              <ul class="space-y-2 text-sm text-slate-300">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>epée / Hache / Dague / Pistolet / Sceptre</span><span class="text-emerald-600">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>epée / Dague / Cor / Focus / Torche</span><span class="text-emerald-600">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-slate-200 uppercase tracking-tight">Arts Rituels</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-emerald-900/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-black/40 rounded-2xl border border-emerald-900/20 hover:border-emerald-500/50 transition-all group">
              <h4 class="font-bold text-emerald-500 mb-1 italic group-hover:text-emerald-400">{{ skill.title }}</h4>
              <p class="text-xs text-slate-400 leading-relaxed">{{ skill.desc }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-6">
          <h3 class="text-2xl font-black text-slate-400 uppercase tracking-widest px-2 italic">Lignées d'Élite</h3>
          
          <div v-for="elite in eliteSpecs" :key="elite.name" 
               :class="['relative group overflow-hidden rounded-2xl border p-5 transition-all', 
                        elite.name === 'Ritualiste' ? 'border-emerald-500 bg-emerald-950/40 shadow-xl shadow-emerald-900/20' : 'border-slate-800 bg-black/60']">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-black text-white uppercase">{{ elite.name }}</h4>
              <span class="text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded font-bold">{{ elite.weapon }}</span>
            </div>
            <p class="text-slate-400 text-xs italic mb-4">{{ elite.desc }}</p>
            <div class="pt-3 border-t border-white/5 flex items-center gap-2">
              <span class="text-[9px] text-emerald-600 uppercase font-bold">Essence :</span>
              <span class="text-[10px] text-slate-200 font-mono">{{ elite.mechanic }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
const necroStats = [
  { label: 'Transfert', desc: 'Déplace les maux vers l\'ennemi.' },
  { label: 'Vampire', desc: 'Se soigne en frappant.' },
  { label: 'Cendres', desc: 'Invoque des protections.' },
  { label: 'Terreur', desc: 'Fait fuir les vivants.' }
];

const skillTypes = [
  { title: 'Urnes Sacrées', desc: 'Portez des reliques de cendres ancestrales pour modifier vos capacités et purifier vos alliés.' },
  { title: 'Serviteurs d\'Os', desc: 'Levez une armée pour servir de bouclier de chair et exploser au contact.' },
  { title: 'Signets de Mort', desc: 'Canalisez des runes anciennes pour des effets passifs durables sur votre force vitale.' },
  { title: 'Puys de Corruption', desc: 'Créez des zones où la réalité se flétrit, transformant les avantages ennemis en malus.' }
];

const eliteSpecs = [
  { name: 'Faucheur', desc: 'Un chevalier de la mort terrifiant qui fauche ses ennemis à l\'espadon.', weapon: 'Espadon', mechanic: 'Linceul de Givre' },
  { name: 'Fléau', desc: 'Maître du désert capable de manifester des ombres de sable punitives.', weapon: 'Torche', mechanic: 'Lien de Sable' },
  { name: 'Augure', desc: 'Prend des risques mortels avec des élixirs pour gagner une puissance brute.', weapon: 'Pistolet', mechanic: 'Blight (Flétrissure)' },
  { name: 'Ritualiste', desc: 'Communique avec les défunts via la lance pour manifester des urnes et des cendres sacrées.', weapon: 'Lance', mechanic: 'Communion Spectrale' }
];
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
h1 { text-shadow: 0 0 30px rgba(16, 185, 129, 0.3); }
</style>