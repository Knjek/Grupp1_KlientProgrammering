import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import ThreeErrorsView from "../views/ThreeErrorsView.vue"
import TwoPlayerView from "../views/TwoPlayerView.vue"
import TimerView from "../views/TimerView.vue"
import NameAnagram from "../views/AnagramView.vue"
import AboutView from "../views/AboutView.vue"
import QuizView from "../views/QuizView.vue"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/:gamemode", alias: '/', name: "home", component: HomeView, children: [
      { path: "", name: "quiz", component: QuizView},
      { path: "/max3", name: "max3", component: ThreeErrorsView},
      { path: "/2player", name: "2player", component: TwoPlayerView},
      { path: "/timer", name: "timer", component: TimerView},
      { path: "/anagram", name: "anagram", component: NameAnagram},
    ]},
    { path: "/about", name: "about", component: AboutView},
  ]
})

export default router
