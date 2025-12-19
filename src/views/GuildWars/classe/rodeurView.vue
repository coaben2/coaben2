<template>
  <div class="max-w-6xl mx-auto space-y-10 pb-20 animate-fade-in">
    <section
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-black/90 to-black p-8 md:p-12 border border-emerald-600/40 backdrop-blur-xl"
    >
      <div class="relative z-10 flex flex-col lg:flex-row justify-between gap-10">
        <div class="space-y-6 max-w-2xl">
          <div class="flex items-center gap-4">
            <h1
              class="text-7xl font-black text-emerald-500 uppercase tracking-tighter leading-none"
            >
              Rôdeur
            </h1>
            <div class="h-1 flex-1 bg-emerald-500/40 rounded-full hidden md:block"></div>
          </div>
          <p class="text-2xl text-white font-light leading-relaxed">
            Maître de la survie et de la nature, le rôdeur combat aux côtés de son
            <span class="text-emerald-400 font-bold">Familier</span> pour traquer ses proies.
          </p>
        </div>
        <div class="bg-black/80 p-5 rounded-2xl border border-emerald-600/30 self-center shadow-xl">
          <span class="text-emerald-500 text-xs font-black italic uppercase tracking-widest"
            >Armure Intermédiaire</span
          >
        </div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-12">
        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">
              Mécanique : Familiers
            </h2>
            <div class="h-px flex-1 bg-gradient-to-r from-emerald-600/60 to-transparent"></div>
          </div>
          <div class="bg-white/10 p-8 rounded-3xl border border-white/20 space-y-6">
            <p class="text-white leading-relaxed">
              Le rôdeur est accompagné d'un familier qu'il peut commander (<kbd
                class="px-2 py-0.5 bg-emerald-800 rounded text-xs text-white border border-emerald-500"
                >F1-F3</kbd
              >). Il peut dresser des dizaines d'espèces allant des félins aux créatures des Brumes.
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="p-4 bg-emerald-900/40 rounded-xl border border-emerald-600 text-center">
                <h4 class="text-emerald-400 font-bold text-sm uppercase">Attaque</h4>
                <p class="text-[10px] text-white">Ordre d'assaut direct.</p>
              </div>
              <div class="p-4 bg-emerald-900/40 rounded-xl border border-emerald-600 text-center">
                <h4 class="text-emerald-400 font-bold text-sm uppercase">Capacité</h4>
                <p class="text-[10px] text-white">Technique propre à l'espèce.</p>
              </div>
              <div class="p-4 bg-emerald-900/40 rounded-xl border border-emerald-600 text-center">
                <h4 class="text-emerald-400 font-bold text-sm uppercase">Rappel</h4>
                <p class="text-[10px] text-white">Position défensive.</p>
              </div>
              <div class="p-4 bg-emerald-900/40 rounded-xl border border-emerald-600 text-center">
                <h4 class="text-emerald-400 font-bold text-sm uppercase">Échange</h4>
                <p class="text-[10px] text-white">Alterner entre 2 familiers.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">Arsenal Sauvage</h2>
            <div class="h-px flex-1 bg-gradient-to-r from-emerald-600/60 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
            <div class="bg-black/60 p-6 rounded-2xl border border-emerald-600/20">
              <h3 class="text-emerald-500 font-bold mb-4 uppercase text-xs">Distance & Portée</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex justify-between border-b border-white/5 pb-1">
                  <span>Arc Long / Arc Court</span> <span class="text-emerald-400">2 Mains</span>
                </li>
                <li class="flex justify-between border-b border-white/5 pb-1">
                  <span>Lance / Bâton</span> <span class="text-emerald-400">2 Mains</span>
                </li>
              </ul>
            </div>
            <div class="bg-black/60 p-6 rounded-2xl border border-emerald-600/20">
              <h3 class="text-emerald-500 font-bold mb-4 uppercase text-xs">Corps-à-corps</h3>
              <ul class="space-y-2 text-sm">
                <li class="flex justify-between border-b border-white/5 pb-1">
                  <span>Espadon / Marteau</span> <span class="text-emerald-400">2 Mains</span>
                </li>
                <li class="flex justify-between border-b border-white/5 pb-1">
                  <span>Épée / Hache / Dague / Masse</span> <span class="text-emerald-400">Main Droite</span>
                </li>
                <li class="flex justify-between border-b border-white/5 pb-1">
                  <span>Hache / Dague / Masse / Torche / cor</span> <span class="text-emerald-400">Main Gauche</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl font-bold text-white uppercase tracking-tight">
              Capacités de Survie
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div
                v-for="skill in skillTypes"
                :key="skill.title"
                class="p-5 bg-emerald-900/20 rounded-2xl border border-emerald-600/30 hover:bg-emerald-900/40 transition-all"
              >
                <h4 class="font-bold text-emerald-400 mb-1 italic">{{ skill.title }}</h4>
                <p class="text-xs text-white/80 leading-relaxed">{{ skill.desc }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="lg:col-span-4 space-y-8">
        <div class="sticky top-24 space-y-6">
          <h3 class="text-2xl font-black text-white uppercase tracking-widest px-2 italic">
            Élites
          </h3>

          <div
            v-for="elite in eliteSpecs"
            :key="elite.name"
            class="relative group overflow-hidden rounded-2xl border border-emerald-600/30 bg-black/60 p-5 transition-all hover:border-emerald-400 shadow-lg"
          >
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-xl font-black text-white uppercase">{{ elite.name }}</h4>
              <span
                class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase"
                >{{ elite.weapon }}</span
              >
            </div>
            <p class="text-white/80 text-xs italic mb-4 leading-tight">{{ elite.desc }}</p>
            <div class="pt-3 border-t border-emerald-600/20">
              <div class="flex items-center gap-2">
                <span class="text-[9px] text-emerald-500 uppercase font-bold italic"
                  >Mécanique :</span
                >
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
  {
    title: 'Esprits',
    desc: 'Invoquez des entités de la nature qui confèrent des bonus passifs aux alliés proches.',
  },
  {
    title: 'Glyphes',
    desc: 'Sorts dont les effets changent selon si vous êtes en forme céleste ou non.',
  },
  {
    title: 'Cris',
    desc: 'Commandez votre familier pour infliger des dégâts ou soigner le groupe.',
  },
  { title: 'Pièges', desc: "Dispositifs cachés au sol qui s'activent au passage de l'ennemi." },
  {
    title: 'Postures',
    desc: 'Améliorations physiques temporaires augmentant la résistance ou les dégâts.',
  },
  {
    title: 'Floraisons',
    desc: 'Nouvelles compétences du Sylvestre créant des zones de croissance végétale mortelles.',
  },
];

const eliteSpecs = [
  {
    name: 'Druide',
    desc: "Un soigneur mystique capable d'entrer en forme de Petit Avatar Céleste.",
    weapon: 'Bâton',
    mechanic: 'Avatar Céleste',
  },
  {
    name: 'Animorphe',
    desc: 'Fusionnez avec votre familier pour acquérir ses statistiques et ses capacités.',
    weapon: 'Dague (Main Droite)',
    mechanic: 'Mode Bête (Fusion)',
  },
  {
    name: 'Indomptable',
    desc: 'Partagez un lien primal avec votre familier pour déchaîner des attaques coordonnées.',
    weapon: 'Marteau',
    mechanic: 'Déchaînement (Alterné)',
  },
  {
    name: 'Ventireur',
    desc: "Maître de la lance portée par les courants ascendants, frappant avec la force d'un ouragan.",
    weapon: 'Lance',
    mechanic: 'Trajectoire de Vent',
  },
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
h1 {
  text-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
}
</style>
