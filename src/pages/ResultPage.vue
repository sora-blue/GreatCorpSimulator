<template>
  <div class="result-page">
    <div class="result-container">
      <div class="result-header">
        <h1 class="result-title">{{ gameResult.title }}</h1>
        <div class="result-subtitle">{{ gameResult.subtitle }}</div>
      </div>
      
      <div class="result-stats">
        <div class="stat-item">
          <span class="stat-label">存活天数</span>
          <span class="stat-value">{{ gameState.day }}天</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">最终老板满意度</span>
          <span class="stat-value" :class="getSatisfactionClass(gameState.bossSatisfaction)">
            {{ gameState.bossSatisfaction }}
          </span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">最终心理健康度</span>
          <span class="stat-value" :class="getMentalHealthClass(gameState.mentalHealth)">
            {{ gameState.mentalHealth }}
          </span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">完成任务数</span>
          <span class="stat-value">{{ gameState.completedTasks }}</span>
        </div>
      </div>
      
      <div class="result-description">
        <p>{{ gameResult.description }}</p>
      </div>
      
      <div class="result-actions">
        <button class="action-btn primary" @click="playAgain">
          <span class="btn-icon">🔄</span>
          再来一局
        </button>
        
        <button class="action-btn secondary" @click="viewLeaderboard">
          <span class="btn-icon">🏆</span>
          查看排行榜
        </button>
        
        <button class="action-btn tertiary" @click="goHome">
          <span class="btn-icon">🏠</span>
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const gameState = computed(() => gameStore.gameState)
const gameResult = computed(() => gameStore.gameResult)

const getSatisfactionClass = (value: number): string => {
  if (value >= 60) return 'stat-good'
  if (value >= 40) return 'stat-warning'
  return 'stat-danger'
}

const getMentalHealthClass = (value: number): string => {
  if (value >= 60) return 'stat-good'
  if (value >= 40) return 'stat-warning'
  return 'stat-danger'
}

const playAgain = () => {
  gameStore.startNewGame()
  router.push('/game')
}

const viewLeaderboard = () => {
  router.push('/leaderboard')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.result-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.result-container {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.result-header {
  margin-bottom: 2rem;
}

.result-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35;
  margin-bottom: 0.5rem;
}

.result-subtitle {
  font-size: 1rem;
  color: #b0b0b0;
  font-style: italic;
}

.result-stats {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #b0b0b0;
  font-weight: bold;
}

.stat-value {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
}

.stat-good {
  color: #4caf50 !important;
}

.stat-warning {
  color: #ff9800 !important;
}

.stat-danger {
  color: #f44336 !important;
}

.result-description {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.result-description p {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
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

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.primary {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
}

.action-btn.secondary {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
}

.action-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.6);
}

.action-btn.tertiary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.tertiary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 480px) {
  .result-container {
    padding: 1.5rem;
  }
  
  .result-title {
    font-size: 1.5rem;
  }
  
  .result-stats {
    padding: 1rem;
  }
  
  .action-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
