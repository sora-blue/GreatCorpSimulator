<template>
  <div class="home-page">
    <div class="logo-container">
      <h1 class="game-logo">大厂模拟器</h1>
      <div class="logo-subtitle">Great Corp Simulator</div>
    </div>
    
    <div class="menu-buttons">
      <button class="menu-btn primary" @click="startNewGame">
        <span class="btn-icon">🎮</span>
        新游戏
      </button>
      
      <button class="menu-btn secondary" @click="goToLeaderboard">
        <span class="btn-icon">🏆</span>
        排行榜
      </button>
      
      <button class="menu-btn tertiary" @click="goToAbout">
        <span class="btn-icon">ℹ️</span>
        关于
      </button>
    </div>
    
    <div class="footer">
      <div class="pixel-decoration">◆ ◆ ◆</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { GameEffects } from '../utils/gameEffects'

const router = useRouter()
const gameStore = useGameStore()
const gameEffects = GameEffects.getInstance()

const startNewGame = () => {
  gameStore.startNewGame()
  gameEffects.playClick()
  router.push('/game')
}

const goToLeaderboard = () => {
  gameEffects.playClick()
  router.push('/leaderboard')
}

const goToAbout = () => {
  gameEffects.playClick()
  router.push('/about')
}

onMounted(() => {
  gameEffects.init()
})
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.home-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px, 40px 40px;
  pointer-events: none;
}

.logo-container {
  text-align: center;
  margin-top: 3rem;
  z-index: 1;
}

.game-logo {
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 
    2px 2px 0px #ff6b35,
    4px 4px 0px #ff1744,
    6px 6px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 0.9rem;
  color: #b0b0b0;
  font-style: italic;
  letter-spacing: 1px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 300px;
  z-index: 1;
}

.menu-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Courier New', monospace;
  position: relative;
  overflow: hidden;
}

.menu-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.menu-btn:hover::before {
  left: 100%;
}

.menu-btn.primary {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.menu-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
}

.menu-btn.secondary {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
}

.menu-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.6);
}

.menu-btn.tertiary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.menu-btn.tertiary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-icon {
  font-size: 1.2rem;
}

.footer {
  z-index: 1;
}

.pixel-decoration {
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35;
  letter-spacing: 1rem;
}

@media (max-width: 480px) {
  .game-logo {
    font-size: 2.5rem;
  }
  
  .menu-buttons {
    max-width: 280px;
  }
  
  .menu-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
