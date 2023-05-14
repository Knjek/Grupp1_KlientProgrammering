import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import ThreeErrorsView from "../views/ThreeErrorsView.vue"
import TwoPlayerView from "../views/TwoPlayerView.vue"
import TimerView from "../views/TimerView.vue"
import NameAnagram from "../views/AnagramView.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView},
    { path: "/max3", name: "max3", component: ThreeErrorsView},
    { path: "/2player", name: "2player", component: TwoPlayerView},
    { path: "/timer", name: "timer", component: TimerView},
    { path: "/anagram", name: "anagram", component: NameAnagram}
  ]
})

export default router
