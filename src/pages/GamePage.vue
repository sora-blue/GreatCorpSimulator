<template>
  <div class="game-page">
    <!-- 状态栏 -->
    <div class="status-bar">
      <div class="status-item">
        <span class="status-label">目标:</span>
        <span class="status-value">活过尽可能多的天数</span>
      </div>
      
      <div class="status-item">
        <span class="status-label">日期:</span>
        <span class="status-value">第{{ gameState.day }}日</span>
      </div>
      
      <div class="status-item">
        <span class="status-label">时间:</span>
        <span class="status-value">{{ formatTime(gameState.timeLeft) }}PD</span>
      </div>
      
      <div class="status-item">
        <span class="status-label">老板满意度:</span>
        <span class="status-value" :class="getSatisfactionClass(gameState.bossSatisfaction)">
          {{ gameState.bossSatisfaction }}
        </span>
      </div>
      
      <div class="status-item">
        <span class="status-label">心理健康度:</span>
        <span class="status-value" :class="getMentalHealthClass(gameState.mentalHealth)">
          {{ gameState.mentalHealth }}
        </span>
      </div>
    </div>
    
    <!-- DAG依赖图区域 -->
    <div class="dag-container">
      <div class="dag-title">工作任务</div>
      <div class="dag-content">
        <div 
          v-for="task in allTasks" 
          :key="task.id"
          :data-task-id="task.id"
          class="task-node"
          :class="[
            `task-${task.type}`,
            { 'task-completed': task.completed },
            { 'task-timed': task.isTimed },
            { 'task-overdue': task.isOverdue },
            { 'task-blocked': task.dependencies.length > 0 && !isTaskAvailable(task) }
          ]"
          @click="completeTask(task)"
        >
          <div class="task-header">
            <span class="task-name">{{ task.name }}</span>
            <span v-if="task.isTimed" class="task-deadline">
              第{{ task.deadline }}日
            </span>
          </div>
          <div class="task-details">
            <div class="task-cost">消耗: {{ task.timeCost }}PD</div>
            <div class="task-rewards">
              <span v-if="task.bossReward > 0" class="reward boss">老板+{{ task.bossReward }}</span>
              <span v-if="task.mentalReward !== 0" class="reward mental" :class="{ negative: task.mentalReward < 0 }">
                心理{{ task.mentalReward > 0 ? '+' : '' }}{{ task.mentalReward }}
              </span>
            </div>
            <div v-if="task.dependencies.length > 0" class="task-dependencies">
              <span class="dependency-label">依赖:</span>
              <span class="dependency-count">{{ task.dependencies.length }}个前置任务</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button class="action-btn idle" @click="idle">
        <span class="btn-icon">😴</span>
        摸鱼
      </button>
      <button class="action-btn quit" @click="quitGame">
        <span class="btn-icon">🚪</span>
        见好就收
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { GameEffects, GameAnimations } from '../utils/gameEffects'
import type { Task } from '../types/game'

const router = useRouter()
const gameStore = useGameStore()

const gameState = computed(() => gameStore.gameState)
const availableTasks = computed(() => gameStore.availableTasks)
const allTasks = computed(() => gameStore.tasks)

let gameTimer: number | null = null
const gameEffects = GameEffects.getInstance()
const statusElements = ref<Map<string, HTMLElement>>(new Map())

const formatTime = (time: number): string => {
  return time.toFixed(2)
}

const getSatisfactionClass = (value: number): string => {
  if (value >= 60) return 'status-good'
  if (value >= 40) return 'status-warning'
  return 'status-danger'
}

const getMentalHealthClass = (value: number): string => {
  if (value >= 60) return 'status-good'
  if (value >= 40) return 'status-warning'
  return 'status-danger'
}

const isTaskAvailable = (task: Task): boolean => {
  if (task.completed) return false
  
  // 检查依赖是否完成
  const dependenciesCompleted = task.dependencies.every((depId: string) => 
    gameStore.tasks.find((t: Task) => t.id === depId)?.completed
  )
  
  if (!dependenciesCompleted) return false
  
  // 检查时间是否足够
  if (gameState.value.timeLeft < task.timeCost) return false
  
  return true
}

const completeTask = (task: Task) => {
  if (task.completed || !isTaskAvailable(task)) return
  
  gameStore.completeTask(task.id)
  gameEffects.playComplete()
  
  // 创建粒子效果
  const taskElement = document.querySelector(`[data-task-id="${task.id}"]`) as HTMLElement
  if (taskElement) {
    GameAnimations.createParticleEffect(taskElement, 'success')
  }
}

const idle = () => {
  gameStore.idle()
  gameEffects.playIdle()
}

const quitGame = () => {
  gameStore.endGame('见好就收')
  gameEffects.playSuccess()
  router.push('/result')
}

const startGameLoop = () => {
  gameTimer = window.setInterval(() => {
    gameStore.tick()
    
    // 检查游戏结束条件
    if (gameState.value.bossSatisfaction < 40) {
      gameStore.endGame('扫地出门')
      gameEffects.playFail()
      GameAnimations.createScreenShake(10, 800)
      router.push('/result')
    } else if (gameState.value.mentalHealth < 40) {
      gameStore.endGame('精神崩溃')
      gameEffects.playFail()
      GameAnimations.createScreenShake(8, 600)
      router.push('/result')
    }
    
    // 检查警告状态
    if (gameState.value.bossSatisfaction < 50 || gameState.value.mentalHealth < 50) {
      gameEffects.playWarning()
    }
  }, 1000) // 每秒更新一次
}

onMounted(() => {
  if (!gameStore.isGameActive) {
    router.push('/')
    return
  }
  
  // 初始化音效
  gameEffects.init()
  startGameLoop()
})

onUnmounted(() => {
  if (gameTimer) {
    clearInterval(gameTimer)
  }
})
</script>

<style scoped>
.game-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.status-bar {
  background: rgba(0, 0, 0, 0.8);
  padding: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 2px solid #ffd700;
  font-family: 'Courier New', monospace;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.status-label {
  color: #b0b0b0;
  font-weight: bold;
}

.status-value {
  color: white;
  font-weight: bold;
}

.status-good {
  background-color: #4caf50 !important;
}

.status-warning {
  background-color: #ff9800 !important;
}

.status-danger {
  background-color: #f44336 !important;
}

.dag-container {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.dag-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
}

.dag-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-node {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #333;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.task-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.task-white {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.task-orange {
  border-color: #ff9800;
  background: rgba(255, 152, 0, 0.1);
}

.task-purple {
  border-color: #9c27b0;
  background: rgba(156, 39, 176, 0.1);
}

.task-completed {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-timed {
  border-color: #f44336;
  position: relative;
}

.task-timed::before {
  content: '限时';
  position: absolute;
  top: -8px;
  right: 8px;
  background: #f44336;
  color: white;
  padding: 2px 6px;
  font-size: 0.7rem;
  border-radius: 4px;
}

.task-overdue {
  border-color: #d32f2f;
  background: rgba(211, 47, 47, 0.2);
  animation: pulse 1s infinite;
}

.task-blocked {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #666;
  background: rgba(100, 100, 100, 0.1);
}

.task-blocked:hover {
  transform: none;
  box-shadow: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.task-name {
  font-weight: bold;
  color: #fff;
}

.task-deadline {
  color: #f44336;
  font-size: 0.8rem;
  font-weight: bold;
}

.task-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
}

.task-cost {
  color: #b0b0b0;
}

.task-rewards {
  display: flex;
  gap: 0.5rem;
}

.task-dependencies {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  color: #888;
}

.dependency-label {
  color: #666;
}

.dependency-count {
  color: #ff9800;
  font-weight: bold;
}

.reward {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.reward.boss {
  background: #4caf50;
  color: white;
}

.reward.mental {
  background: #2196f3;
  color: white;
}

.reward.negative {
  background: #f44336;
}

.action-buttons {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.8);
}

.action-btn {
  flex: 1;
  padding: 1rem;
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
}

.action-btn.idle {
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
}

.action-btn.quit {
  background: linear-gradient(45deg, #ff9800, #f57c00);
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 480px) {
  .status-bar {
    padding: 0.6rem;
    gap: 0.5rem;
  }
  
  .status-item {
    font-size: 0.8rem;
  }
  
  .task-node {
    padding: 0.8rem;
  }
  
  .action-buttons {
    padding: 0.8rem;
  }
}
</style>
