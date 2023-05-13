import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import ThreeErrorsView from "../views/ThreeErrorsView.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView},
    { path: "/max3", name: "max3", component: ThreeErrorsView}
  ]
})

export default router
