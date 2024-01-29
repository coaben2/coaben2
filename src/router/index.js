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
          component: () => import('../views/GuildWars/Api/HomeView.vue'),
          children: [
            {
              path: '',
              name: 'GuildWarsApiCharacters',
              component: () => import('../views/GuildWars/Api/CharactersView.vue'),
            },
            {
              path: 'banque',
              name: 'GuildWarsApiBank',
              component: () => import('../views/GuildWars/Api/BankView.vue'),
            },
          ],
        },
        {
          path: 'vide-ton-sac',
          name: 'GuildWarsInventoryManager',
          component: () => import('../views/GuildWars/InventoryManagerView.vue'),
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
      component: () => import('../views/blog/DivinityReachView.vue'),
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
  ],
});

export default router;