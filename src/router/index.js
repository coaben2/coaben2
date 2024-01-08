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
      path: '/guildwars',
      name: 'GuildWars',
      component: () => import('../views/GuildWarsView.vue')
    },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/BlogView.vue')
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

export default router
