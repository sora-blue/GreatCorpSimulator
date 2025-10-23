import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './pages/HomePage.vue'
import GamePage from './pages/GamePage.vue'
import ResultPage from './pages/ResultPage.vue'
import LeaderboardPage from './pages/LeaderboardPage.vue'
import AboutPage from './pages/AboutPage.vue'
import './styles/pixel.css'

const routes = [
  { path: '/', component: HomePage },
  { path: '/game', component: GamePage },
  { path: '/result', component: ResultPage },
  { path: '/leaderboard', component: LeaderboardPage },
  { path: '/about', component: AboutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
