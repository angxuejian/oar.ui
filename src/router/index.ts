import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,

      children: [
        {
          path: '/button',
          name: 'OarButton',
          component: () => import('@/views/button.vue'),
        },
      ],
    },
  ],
})

export default router
