import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/csv.vue')
  },
  // {
  //   path: '/down',
  //   name: 'down',
  //   component: () => import('../views/wrightData.vue')
  // },
  {
    path: '/results',
    name: 'results',
    component: () => import('../views/Results.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
