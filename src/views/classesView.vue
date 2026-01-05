<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { computed } from 'vue';

const classes = [
    {
    name: 'GlobalClasse',
    label: 'Global',
    category: 'global',
    color: 'bg-gray-500',
    text: 'text-gray-500',
    desc: 'Vue globale des professions.',
  },
  {
    name: 'Guerrier',
    label: 'Guerrier',
    category: 'soldier',
    color: 'bg-orange-500',
    text: 'text-orange-500',
    desc: 'Maître des armes utilisant sa force brute et son adrénaline.',
  },
  {
    name: 'Gardien',
    label: 'Gardien',
    category: 'soldier',
    color: 'bg-blue-400',
    text: 'text-blue-400',
    desc: 'Protecteur dévoué utilisant la magie pour défendre ses alliés.',
  },
  {
    name: 'Revenant',
    label: 'Revenant',
    category: 'soldier',
    color: 'bg-red-600',
    text: 'text-red-600',
    desc: 'Canalise les héros légendaires depuis les Brumes.',
  },
  {
    name: 'Voleur',
    label: 'Voleur',
    category: 'adventurer',
    color: 'bg-neutral-600',
    text: 'text-neutral-400',
    desc: 'Expert de la furtivité et des attaques surprises.',
  },
  {
    name: 'Rodeur',
    label: 'Rôdeur',
    category: 'adventurer',
    color: 'bg-green-500',
    text: 'text-green-500',
    desc: "Archer d'élite accompagné d'un fidèle familier.",
  },
  {
    name: 'Ingenieur',
    label: 'Ingénieur',
    category: 'adventurer',
    color: 'bg-amber-600',
    text: 'text-amber-600',
    desc: 'Maître de la technologie et des explosifs.',
  },
  {
    name: 'Necromant',
    label: 'Nécromancien',
    category: 'scholar',
    color: 'bg-teal-600',
    text: 'text-teal-600',
    desc: 'Praticien des arts sombres utilisant la force vitale.',
  },
  {
    name: 'Envouteur',
    label: 'Envoûteur',
    category: 'scholar',
    color: 'bg-purple-500',
    text: 'text-purple-500',
    desc: 'Maître des illusions et des mirages.',
  },
  {
    name: 'Elementaliste',
    label: 'Élémentaliste',
    category: 'scholar',
    color: 'bg-rose-500',
    text: 'text-rose-500',
    desc: 'Manipule les quatre éléments fondamentaux.',
  },
];

const soldiers = computed(() => classes.filter((c) => c.category === 'soldier'));
const adventurers = computed(() => classes.filter((c) => c.category === 'adventurer'));
const scholars = computed(() => classes.filter((c) => c.category === 'scholar'));
</script>

<template>
  <div class="min-h-screen text-white font-sans">
    <header class="bg-black/90 border-b border-white/10 sticky top-0">
      <nav class="container mx-auto px-4">
        <ul
          class="flex space-x-2 py-3 overflow-x-auto no-scrollbar justify-start md:justify-center"
        >
          <li v-for="cls in classes" :key="cls.name">
            <RouterLink :to="{ name: cls.name }" custom v-slot="{ navigate, isActive }">
              <button
                @click="navigate"
                :class="[
                  'px-3 py-1 rounded-md text-xs font-bold transition-all duration-300 border uppercase tracking-tighter md:tracking-wider whitespace-nowrap',
                  isActive
                    ? `${cls.color} text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                    : `bg-transparent text-gray-400 border-transparent hover:text-white`,
                ]"
              >
                {{ cls.label }}
              </button>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <div class="max-w-6xl mx-auto p-6">
      <header class="mb-10 text-center border-b border-amber-500/30 pb-6">
        <h1 class="text-4xl font-bold text-amber-500 mb-2 uppercase tracking-widest">
          Professions
        </h1>
        <p class="text-gray-400 italic text-sm">Répertoire des archétypes de Guild Wars 2</p>
      </header>

      <div
        v-if="$route.name === 'ProfessionsHome'"
        class="grid md:grid-cols-3 gap-8 mb-12 animate-fadeIn"
      >
        <section class="space-y-4">
          <div class="flex items-center border-b-2 border-red-700 pb-2 mb-4">
            <h2 class="text-xl font-bold text-red-500 uppercase">Soldats</h2>
            <span
              class="ml-auto text-[10px] bg-red-900/50 text-red-200 px-2 py-1 rounded border border-red-700/50"
              >LOURD</span
            >
          </div>
          <div
            v-for="prof in soldiers"
            :key="prof.name"
            class="p-4 bg-gray-900 border border-white/5 rounded-lg hover:border-red-500/50 transition-colors group"
          >
            <h3 :class="['font-bold text-lg mb-1', prof.text]">{{ prof.label }}</h3>
            <p class="text-xs text-gray-400 leading-relaxed">{{ prof.desc }}</p>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center border-b-2 border-green-700 pb-2 mb-4">
            <h2 class="text-xl font-bold text-green-500 uppercase">Aventuriers</h2>
            <span
              class="ml-auto text-[10px] bg-green-900/50 text-green-200 px-2 py-1 rounded border border-green-700/50"
              >MOYEN</span
            >
          </div>
          <div
            v-for="prof in adventurers"
            :key="prof.name"
            class="p-4 bg-gray-900 border border-white/5 rounded-lg hover:border-green-500/50 transition-colors group"
          >
            <h3 :class="['font-bold text-lg mb-1', prof.text]">{{ prof.label }}</h3>
            <p class="text-xs text-gray-400 leading-relaxed">{{ prof.desc }}</p>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center border-b-2 border-blue-700 pb-2 mb-4">
            <h2 class="text-xl font-bold text-blue-500 uppercase">Savants</h2>
            <span
              class="ml-auto text-[10px] bg-blue-900/50 text-blue-200 px-2 py-1 rounded border border-blue-700/50"
              >LÉGER</span
            >
          </div>
          <div
            v-for="prof in scholars"
            :key="prof.name"
            class="p-4 bg-gray-900 border border-white/5 rounded-lg hover:border-blue-500/50 transition-colors group"
          >
            <h3 :class="['font-bold text-lg mb-1', prof.text]">{{ prof.label }}</h3>
            <p class="text-xs text-gray-400 leading-relaxed">{{ prof.desc }}</p>
          </div>
        </section>
      </div>

      <main class="transition-all duration-500">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.gw2-stats-guide {
  background-color: #1a1a1a;
  color: #e0e0e0;
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}
</style>