import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@renderer/views/home.vue')
  },
  {
    path: '/updater',
    name: 'Updater',
    component: () => import('@renderer/views/updater.vue')
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
