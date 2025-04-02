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
      path: '/guildwars2',
      children: [
        {
          path: 'lexique',
          name: 'GuildWarsLexique',
          component: () => import('../views/GuildWars/LexiqueView.vue'),
        },
        {
          path: 'api',
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
              path: 'Collectibles',
              name: 'GuildWarsApiCollectibles',
              component: () => import('../views/GuildWars/Api/Collectibles.vue'),
            },
            {
              path: 'monnais',
              name: 'GuildWarsApiMoney',
              component: () => import('../views/GuildWars/Api/MoneyViews.vue'),
            },
            {
              path: 'Unlocks',
              name: 'GuildWarsApiUnlocks',
              component: () => import('../views/GuildWars/Api/Unlocks.vue'),
            },
            {
              path: 'vide-ton-sac',
              name: 'GuildWarsInventoryManager',
              component: () => import('../views/GuildWars/Api/InventoryManagerView.vue'),
            },
            {
              path: 'Don',
              name: 'GuildWarsDON',
              component: () => import('../views/GuildWars/Api/DonView.vue'),
            },
            {
              path: 'Légendaire MCM',
              name: 'LEG_MCM',
              component: () => import('../views/GuildWars/Api/Leg_MCM.vue'),
            },
          ],
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
      path: '/blog/Louvpirates',
      name: 'BlogPostLouvpirates',
      component: () => import('../views/Blog/Louvpirates.vue'),
    },
    {
      path: '/blog/path-of-exile',
      name: 'BlogPathOfExile',
      component: () => import('../views/Blog/Path-of-exile.vue')
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: () => import('../views/PortfolioView.vue'),
    },
    {
      path: '/instagram',
      name: 'Contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: () => import('@/components/404.vue'),
    },
  ],
});

export default router;
