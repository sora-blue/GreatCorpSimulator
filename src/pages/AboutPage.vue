<template>
  <div class="about-page">
    <div class="about-container">
      <div class="about-header">
        <h1 class="about-title">ℹ️ 关于游戏</h1>
        <div class="about-subtitle">大厂模拟器 Great Corp Simulator</div>
      </div>
      
      <div class="about-content">
        <div class="about-section">
          <h2 class="section-title">🎯 游戏目标</h2>
          <p class="section-text">
            在保持心理健康度不低于40分和老板满意度不低于40分的情况下，活过尽可能多的天数。
            体验大厂生活的酸甜苦辣，在高压环境中寻找生存之道。
          </p>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">🎮 游戏玩法</h2>
          <div class="gameplay-list">
            <div class="gameplay-item">
              <span class="item-icon">📅</span>
              <div class="item-content">
                <div class="item-title">时间管理</div>
                <div class="item-desc">每天只有50秒操作时间，合理分配任务优先级</div>
              </div>
            </div>
            
            <div class="gameplay-item">
              <span class="item-icon">📋</span>
              <div class="item-content">
                <div class="item-title">任务系统</div>
                <div class="item-desc">完成DAG依赖图中的任务，注意限时任务的截止日期</div>
              </div>
            </div>
            
            <div class="gameplay-item">
              <span class="item-icon">⚖️</span>
              <div class="item-content">
                <div class="item-title">平衡机制</div>
                <div class="item-desc">在老板满意度和心理健康度之间找到平衡点</div>
              </div>
            </div>
            
            <div class="gameplay-item">
              <span class="item-icon">😴</span>
              <div class="item-content">
                <div class="item-title">摸鱼策略</div>
                <div class="item-desc">适当摸鱼可以恢复心理健康，但会降低老板满意度</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">🏆 结局类型</h2>
          <div class="ending-list">
            <div class="ending-item">
              <span class="ending-icon">🎉</span>
              <div class="ending-content">
                <div class="ending-title">见好就收</div>
                <div class="ending-desc">主动退出游戏，明智的选择</div>
              </div>
            </div>
            
            <div class="ending-item">
              <span class="ending-icon">🚪</span>
              <div class="ending-content">
                <div class="ending-title">扫地出门</div>
                <div class="ending-desc">老板满意度过低，被公司开除</div>
              </div>
            </div>
            
            <div class="ending-item">
              <span class="ending-icon">💔</span>
              <div class="ending-content">
                <div class="ending-title">精神崩溃</div>
                <div class="ending-desc">心理健康度过低，无法继续工作</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="about-section">
          <h2 class="section-title">💡 游戏技巧</h2>
          <ul class="tips-list">
            <li>优先完成限时任务，避免老板满意度大幅下降</li>
            <li>合理分配时间，不要贪图高收益任务而忽略时间成本</li>
            <li>适当摸鱼可以恢复心理健康，但要控制频率</li>
            <li>关注两个关键指标，及时调整策略</li>
            <li>在合适的时机选择见好就收，避免风险</li>
          </ul>
        </div>
      </div>
      
      <div class="about-actions">
        <button class="action-btn primary" @click="goHome">
          <span class="btn-icon">🏠</span>
          返回首页
        </button>
        
        <button class="action-btn secondary" @click="startGame">
          <span class="btn-icon">🎮</span>
          开始游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const goHome = () => {
  router.push('/')
}

const startGame = () => {
  gameStore.startNewGame()
  router.push('/game')
}
</script>

<style scoped>
.about-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
}

.about-container {
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  max-height: 80%;
  overflow-y: scroll;
  font-family: 'Courier New', monospace;
}

.about-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35;
  margin-bottom: 0.5rem;
}

.about-subtitle {
  font-size: 1rem;
  color: #b0b0b0;
  font-style: italic;
}

.about-content {
  margin-bottom: 2rem;
}

.about-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ffd700;
  padding-bottom: 0.5rem;
}

.section-text {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.gameplay-list, .ending-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gameplay-item, .ending-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.item-icon, .ending-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-content, .ending-content {
  flex: 1;
}

.item-title, .ending-title {
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.3rem;
}

.item-desc, .ending-desc {
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.tips-list {
  color: #e0e0e0;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.tips-list li {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.about-actions {
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
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
}

.action-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(78, 205, 196, 0.6);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 480px) {
  .about-container {
    padding: 1.5rem;
  }
  
  .about-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .gameplay-item, .ending-item {
    padding: 0.8rem;
    gap: 0.8rem;
  }
  
  .item-icon, .ending-icon {
    font-size: 1.2rem;
  }
  
  .action-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
