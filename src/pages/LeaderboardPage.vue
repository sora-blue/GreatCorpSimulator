<template>
  <div class="leaderboard-page">
    <div class="leaderboard-container">
      <div class="leaderboard-header">
        <h1 class="leaderboard-title">🏆 排行榜</h1>
        <div class="leaderboard-subtitle">大厂生存记录</div>
      </div>
      
      <div class="leaderboard-content">
        <div v-if="leaderboard.length === 0" class="empty-state">
          <div class="empty-icon">📊</div>
          <div class="empty-text">暂无记录</div>
          <div class="empty-subtext">完成一局游戏后即可上榜</div>
        </div>
        
        <div v-else class="leaderboard-list">
          <div 
            v-for="(record, index) in leaderboard" 
            :key="record.id"
            class="leaderboard-item"
            :class="{ 'top-three': index < 3 }"
          >
            <div class="rank">
              <span v-if="index === 0" class="rank-icon">🥇</span>
              <span v-else-if="index === 1" class="rank-icon">🥈</span>
              <span v-else-if="index === 2" class="rank-icon">🥉</span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </div>
            
            <div class="record-info">
              <div class="record-title">{{ record.title }}</div>
              <div class="record-details">
                <span class="record-days">{{ record.days }}天</span>
                <span class="record-date">{{ formatDate(record.date) }}</span>
              </div>
            </div>
            
            <div class="record-stats">
              <div class="stat-item">
                <span class="stat-label">老板满意度</span>
                <span class="stat-value" :class="getSatisfactionClass(record.bossSatisfaction)">
                  {{ record.bossSatisfaction }}
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-label">心理健康度</span>
                <span class="stat-value" :class="getMentalHealthClass(record.mentalHealth)">
                  {{ record.mentalHealth }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="leaderboard-actions">
        <button class="action-btn primary" @click="goHome">
          <span class="btn-icon">🏠</span>
          返回首页
        </button>
        
        <button class="action-btn secondary" @click="clearRecords" v-if="leaderboard.length > 0">
          <span class="btn-icon">🗑️</span>
          清空记录
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

const leaderboard = computed(() => gameStore.leaderboard)

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goHome = () => {
  router.push('/')
}

const clearRecords = () => {
  if (confirm('确定要清空所有记录吗？此操作不可恢复。')) {
    gameStore.clearLeaderboard()
  }
}
</script>

<style scoped>
.leaderboard-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.leaderboard-container {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  font-family: 'Courier New', monospace;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.leaderboard-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35;
  margin-bottom: 0.5rem;
}

.leaderboard-subtitle {
  font-size: 1rem;
  color: #b0b0b0;
  font-style: italic;
}

.leaderboard-content {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #b0b0b0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.9rem;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.leaderboard-item {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #333;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.leaderboard-item.top-three {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
}

.rank-icon {
  font-size: 1.5rem;
}

.rank-number {
  color: #fff;
}

.record-info {
  flex: 1;
}

.record-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.3rem;
}

.record-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.record-days {
  color: #ffd700;
  font-weight: bold;
}

.record-stats {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  color: #b0b0b0;
}

.stat-value {
  font-weight: bold;
  color: #fff;
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

.leaderboard-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  flex: 1;
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
  background: linear-gradient(45deg, #f44336, #d32f2f);
  color: white;
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.4);
}

.action-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.6);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 480px) {
  .leaderboard-container {
    padding: 1.5rem;
  }
  
  .leaderboard-title {
    font-size: 1.5rem;
  }
  
  .leaderboard-item {
    padding: 0.8rem;
    gap: 0.8rem;
  }
  
  .rank {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .record-title {
    font-size: 1rem;
  }
  
  .record-details {
    font-size: 0.8rem;
  }
  
  .record-stats {
    font-size: 0.7rem;
  }
  
  .action-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
