<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-black p-8 md:p-12 border border-white/10 backdrop-blur-xl">
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1 class="text-7xl font-black text-white uppercase tracking-tighter leading-none">Voleur</h1>
            <div class="h-1 flex-1 bg-white/20 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-neutral-400 font-light leading-relaxed">
            Maître de l'opportunisme, le voleur utilise l'<span class="text-white font-bold">Initiative</span> pour enchaîner ses attaques et manipuler les ombres à son avantage.
          </p>
        </div>
        <div class="bg-white/5 p-5 rounded-2xl border border-white/10 self-center">
          <span class="text-white text-xs font-black italic uppercase tracking-widest">Armure intermédiaire</span>
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <div class="lg:col-span-8 space-y-12">
        
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Mécanique : Initiative</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent"></div>
          </div>
          <div class="bg-neutral-900/50 p-8 rounded-3xl border border-white/10 space-y-4">
            <p class="text-neutral-300 leading-relaxed">
              Contrairement aux autres classes, le voleur n'a pas de temps de recharge sur ses compétences d'armes. Il utilise une barre d'Initiative qui se recharge avec le temps, permettant de lancer la même compétence plusieurs fois de suite.
            </p>
            <div class="flex gap-4">
              <div class="px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white font-mono text-sm">
                Compétence 3 : Double Maniement (Varie selon l'arme en main gauche)
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Arsenal</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div class="bg-black/60 p-6 rounded-2xl border border-white/5">
              <h3 class="text-neutral-400 font-bold mb-4 uppercase text-xs tracking-widest">Armes Lourdes & Distance</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Bâton / Fusil / Lance</span> <span class="text-neutral-500 italic">2 Mains</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Arc Court</span> <span class="text-neutral-500 italic">2 Mains</span></li>
              </ul>
            </div>
            <div class="bg-black/60 p-6 rounded-2xl border border-white/5">
              <h3 class="text-neutral-400 font-bold mb-4 uppercase text-xs tracking-widest">Maniement Rapide</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Dague / Pistolet / Épée / Hache / Sceptre</span> <span class="text-neutral-500 italic">Main Droite</span></li>
                <li class="flex justify-between border-b border-white/5 pb-1"><span>Dague / Pistolet</span> <span class="text-neutral-500 italic">Main Gauche</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Arts de l'Invisible</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div v-for="skill in skillTypes" :key="skill.title" class="p-5 bg-neutral-900/80 rounded-2xl border border-white/10 hover:border-white/40 transition-all">
                <h4 class="font-bold text-white mb-1 italic">{{ skill.title }}</h4>
                <p class="text-xs text-neutral-400 leading-relaxed">{{ skill.desc }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-6">
          <h3 class="text-2xl font-black text-white uppercase tracking-widest px-2 italic underline decoration-white/20">Spécialisations</h3>
          
          <div v-for="elite in eliteSpecs" :key="elite.name" 
               class="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 transition-all hover:bg-neutral-900">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-black text-white uppercase">{{ elite.name }}</h4>
              <span class="text-[10px] bg-white text-black px-2 py-0.5 rounded font-bold uppercase">{{ elite.weapon }}</span>
            </div>
            
            <div class="space-y-3">
              <p class="text-neutral-300 text-xs leading-tight">
                {{ elite.desc }}
              </p>
              <div class="pt-3 border-t border-white/10 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-[9px] text-white/50 uppercase font-bold">Mécanique :</span>
                  <span class="text-[10px] text-white font-mono uppercase">{{ elite.mechanic }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[9px] text-white/50 uppercase font-bold">Sorts :</span>
                  <span class="text-[10px] text-white italic">{{ elite.skills }}</span>
                </div>
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
  { title: 'Physiques', desc: 'Attaques de contrôle au corps-à-corps pour projeter ou étourdir.' },
  { title: 'Sorts de zone', desc: 'Techniques d\'esquive et de survie instantanées (Cantrips).' },
  { title: 'Puits', desc: 'Zones d\'ombre magiques soignant les alliés ou affaiblissant les ennemis.' },
  { title: 'Artefacts', desc: 'Objets anciens activables offrant des bonus variés et imprévisibles.' },
  { title: 'Double Tranchant', desc: 'Puissantes capacités de l\'Antiquaire aux effets risqués mais dévastateurs.' },
  { title: 'Refuges', desc: 'Zones de furtivité tactiques pour dissimuler l\'ensemble du groupe.' }
];

const eliteSpecs = [
  { 
    name: 'Fracasseur', 
    desc: 'Un combattant agile qui utilise le bâton pour enchaîner les esquives offensives.', 
    weapon: 'Bâton',
    mechanic: 'Endurance accrue & 3 esquives',
    skills: 'Compétences Physiques'
  },
  { 
    name: 'Sniper', 
    desc: 'Un assassin à distance qui marque ses proies pour les exécuter au fusil.', 
    weapon: 'Fusil',
    mechanic: 'Marquage (Remplace Vol)',
    skills: 'Sorts de zone (Cantrips)'
  },
  { 
    name: 'Spectre', 
    desc: 'Un protecteur sombre qui lie son âme à ses alliés via le linceul d\'ombre.', 
    weapon: 'Sceptre',
    mechanic: 'Siphon & Linceul d\'Ombre',
    skills: 'Puits'
  },
  { 
    name: 'Antiquaire', 
    desc: 'Un collectionneur excentrique utilisant la lance et des artefacts trouvés dans les Brumes.', 
    weapon: 'Lance',
    mechanic: 'Coup de Skritt (Remplace Vol)',
    skills: 'Artefacts & Double Tranchant'
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
h1 { text-shadow: 0 0 40px rgba(255, 255, 255, 0.1); }
</style>