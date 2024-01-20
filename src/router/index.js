import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/guildwars2',
      children: [
        {
          path: 'lexique',
          name: 'GuildWarsLexique',
          component: () => import('../views/GuildWars/LexiqueView.vue')
        },
        {
          path: 'api',
          component: () => import('../views/GuildWars/Api/HomeView.vue'),
          children: [
            {
              path: '',
              name: 'GuildWarsApiCharacters',
              component: () => import('../views/GuildWars/Api/CharactersView.vue')
            },
            {
              path: 'banque',
              name: 'GuildWarsApiBank',
              component: () => import('../views/GuildWars/Api/BankView.vue')
            }
          ]
        },
        {
          path: 'vide-ton-sac',
          name: 'GuildWarsInventoryManager',
          component: () => import('../views/GuildWars/InventoryManagerView.vue')
        },
      ]
    },
    {
      path: '/Blog',
      name: 'Blog',
      children: [
        {
          path: 'Hounoana',
          name: 'BlogH1Hounoana',
          component: () => import('../views/Blog/BlogH1Hounoana.vue')
        },
        {
          path: 'H2S2',
          name: 'BlogH2S2',
          component: () => import('../views/Blog/BlogH2S2.vue')
        },
        {
          path: 'Kan',
          name: 'BlogKan',
          component: () => import('../views/Blog/BlogKan.vue')
        },
        {
          path: 'L&R',
          name: 'BlogLetR',
          component: () => import('../views/Blog/BlogLetR.vue')
        },
      ]
    },
    {
      path: '/portfolio',
      name: 'Portfolio',
      component: () => import('../views/PortfolioView.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

export default router;
