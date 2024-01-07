import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: () => import('@/views/Accueil.vue') },
  { path: '/GuildWars', component: () => import('@/views/GuildWars.vue') },
  { path: '/blog', component: () => import('@/views/Blog.vue') },
  { path: '/Portofolio', component: () => import('@/views/Portofolio.vue') },
  { path: '/Contact', component: () => import('@/views/Contact.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
];

const router = new VueRouter({
  routes,
});

export default router;
