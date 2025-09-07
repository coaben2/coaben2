import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/guildwars2/lexique',
      name: 'GuildWarsLexique',
      component: () => import('../views/GuildWars/LexiqueView.vue'),
    },
    {
      path: '/guildwars2/combo',
      name: 'combo_GW2',
      component: () => import('../views/GuildWars/ComboView.vue'),
    },
    {
      path: '/guildwars2/groupe-mcm',
      name: 'Groupe_MCM',
      component: () => import('../views/GuildWars/MCMgroupeView.vue'),
    },
    {
      path: '/guildwars2/api',
      name: 'GuildWarsAPI',
      component: () => import('../views/GuildWars/Api/HomeView.vue'),
      children: [
        {
          path: 'about-api',
          name: 'GuildWarsApiAbout',
          component: () => import('../views/GuildWars/Api/APIView.vue'),
        },
        {
          path: 'characters',
          name: 'GuildWarsApiCharacters',
          component: () => import('../views/GuildWars/Api/CharactersView.vue'),
        },
        {
          path: 'banque',
          name: 'GuildWarsApiBank',
          component: () => import('../views/GuildWars/Api/BankView.vue'),
        },
        {
          path: 'collectibles',
          name: 'GuildWarsApiCollectibles',
          component: () => import('../views/GuildWars/Api/Collectibles.vue'),
        },
        {
          path: 'monnaie',
          name: 'GuildWarsApiMoney',
          component: () => import('../views/GuildWars/Api/MoneyViews.vue'),
        },
        {
          path: 'unlocks',
          name: 'GuildWarsApiUnlocks',
          component: () => import('../views/GuildWars/Api/Unlocks.vue'),
        },
        {
          path: 'inventory-manager',
          name: 'GuildWarsInventoryManager',
          component: () => import('../views/GuildWars/Api/InventoryManagerView.vue'),
        },
        {
          path: 'don',
          name: 'GuildWarsDON',
          component: () => import('../views/GuildWars/Api/DonView.vue'),
        },
        {
          path: 'legendaire-mcm',
          name: 'LEG_MCM',
          component: () => import('../views/GuildWars/Api/Leg_MCM.vue'),
        },
        {
          path: 'mcm',
          name: 'MCM',
          component: () => import('../views/GuildWars/Api/MCM.vue'),
        },
      ],
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/BlogHomeView.vue'),
    },
    {
      path: '/blog/divinity-s-reach',
      name: 'BlogPostDivinitysReach',
      component: () => import('../views/Blog/DivinityReachView.vue'),
    },
    {
      path: '/blog/heart-of-stone',
      name: 'BlogPostHeartOfStone',
      component: () => import('../views/Blog/HeartOfStoneView.vue'),
    },
    {
      path: '/blog/louv-et-les-mysteres-de-la-foret',
      name: 'BlogPostLouvEtLesMysteresDeLaForet',
      component: () => import('../views/Blog/LouvEtLesMysteresDeLaForetView.vue'),
    },
    {
      path: '/blog/le-lierre-et-la-rose',
      name: 'BlogPostLeLierreEtLaRose',
      component: () => import('../views/Blog/LeLierreEtLaRoseView.vue'),
    },
    {
      path: '/blog/louvpirates',
      name: 'BlogPostLouvpirates',
      component: () => import('../views/Blog/Louvpirates.vue'),
    },
    {
      path: '/blog/path-of-fire',
      name: 'BlogPathOfFire',
      component: () => import('../views/Blog/Path-of-Fire.vue'),
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: () => import('../views/PortfolioView.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/magic',
      name: 'Magic',
      component: () => import('../views/Magic/MagicView.vue'),
    },
    {
      path: '/magic/deck-builder',
      name: 'DeckBuilder',
      component: () => import('../views/Magic/DeckBuilderHome.vue'),
    },
    {
      path: '/magic/deck-builder-old',
      name: 'DeckBuilderOld',
      component: () => import('../views/Magic/DeckBuilderView.vue'),
    },
    {
      path: '/magic/deck-analysis',
      name: 'DeckAnalysis',
      component: () => import('../views/Magic/DeckAnalysis.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('../components/404.vue'),
    },
  ],
});

export default router;
