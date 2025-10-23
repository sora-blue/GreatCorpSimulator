import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, GameState, GameResult, LeaderboardRecord, GameEndReason } from '../types/game'

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const gameState = ref<GameState>({
    day: 1,
    timeLeft: 1.0,
    bossSatisfaction: 80,
    mentalHealth: 80,
    completedTasks: 0,
    isGameActive: false,
    gameEndReason: undefined
  })

  // 任务列表
  const tasks = ref<Task[]>([])
  const taskIdCounter = ref(0)

  // 排行榜
  const leaderboard = ref<LeaderboardRecord[]>([])

  // 计算属性
  const availableTasks = computed(() => {
    const available = tasks.value.filter((task: Task) => {
      if (task.completed) return false
      
      // 检查依赖是否完成
      const dependenciesCompleted = task.dependencies.every((depId: string) => 
        tasks.value.find((t: Task) => t.id === depId)?.completed
      )
      
      if (!dependenciesCompleted) return false
      
      // 检查时间是否足够
      if (gameState.value.timeLeft < task.timeCost) return false
      
      return true
    })
    
    // 如果可用任务少于8个，自动添加新任务
    if (available.length < 8) {
      for (let i = 0; i < 3; i++) {
        addNewTask()
      }
    }
    
    return available
  })

  const isGameActive = computed(() => gameState.value.isGameActive)

  const gameResult = computed((): GameResult => {
    const reason = gameState.value.gameEndReason || '见好就收'
    const days = gameState.value.day
    
    switch (reason) {
      case '见好就收':
        return {
          title: '见好就收',
          subtitle: '明智的选择',
          description: `你在第${days}天选择了主动退出，这是一个明智的决定。在高压的工作环境中，知道何时收手是一种智慧。你成功保持了心理平衡，避免了过度消耗。`
        }
      case '扫地出门':
        return {
          title: '扫地出门',
          subtitle: '老板不满意',
          description: `你在第${days}天被公司开除了。老板对你的表现非常不满意，认为你没有达到公司的期望。也许你需要更好地平衡工作质量和效率。`
        }
      case '精神崩溃':
        return {
          title: '精神崩溃',
          subtitle: '心理压力过大',
          description: `你在第${days}天精神崩溃了。长期的高压工作环境让你的心理健康状况急剧恶化，无法继续正常工作。记住，健康比工作更重要。`
        }
      default:
        return {
          title: '游戏结束',
          subtitle: '未知原因',
          description: '游戏以未知原因结束。'
        }
    }
  })

  // 生成随机任务
  const generateRandomTask = (): Task => {
    const types: Array<'white' | 'orange' | 'purple'> = ['white', 'orange', 'purple']
    const type = types[Math.floor(Math.random() * types.length)]
    
    let timeCost: number
    let bossReward: number
    let mentalReward: number
    
    switch (type) {
      case 'white':
        timeCost = Math.random() * (0.80 - 0.02) + 0.02
        bossReward = Math.floor(Math.random() * 5) + 1
        mentalReward = -(Math.floor(Math.random() * 20) + 1)
        break
      case 'orange':
        timeCost = Math.random() * (0.60 - 0.10) + 0.10
        bossReward = Math.floor(Math.random() * 15) + 6
        mentalReward = -(Math.floor(Math.random() * 5) + 1)
        break
      case 'purple':
        timeCost = Math.random() * (0.30 - 0.02) + 0.02
        bossReward = Math.floor(Math.random() * 21) + 10
        mentalReward = Math.random() > 0.5 ? 
          (Math.floor(Math.random() * 6)) : 
          -(Math.floor(Math.random() * 5) + 1)
        break
    }
    
    const taskNames = {
      white: ['整理文档', '回复邮件', '参加会议', '更新进度', '代码审查'],
      orange: ['功能开发', '系统优化', '需求分析', '测试用例', '架构设计'],
      purple: ['技术调研', '性能调优', '安全加固', '创新方案', '技术分享']
    }
    
    const name = taskNames[type][Math.floor(Math.random() * taskNames[type].length)]
    const isTimed = Math.random() < 0.3 // 30%概率是限时任务
    const deadline = isTimed ? gameState.value.day + Math.floor(Math.random() * 3) + 1 : undefined
    
    return {
      id: `task_${taskIdCounter.value++}`,
      name,
      type,
      timeCost: Math.round(timeCost * 100) / 100,
      bossReward,
      mentalReward,
      completed: false,
      isTimed,
      deadline,
      dependencies: [],
      isOverdue: false
    }
  }

  // 初始化任务
  const initializeTasks = () => {
    tasks.value = []
    taskIdCounter.value = 0
    
    // 生成更多初始任务来填满屏幕（大约15-20个任务）
    for (let i = 0; i < 18; i++) {
      const task = generateRandomTask()
      tasks.value.push(task)
    }
    
    // 设置任务依赖关系 - 创建更复杂的DAG结构
    // 前3个任务没有依赖，可以立即开始
    // 后续任务依赖前面的任务
    for (let i = 3; i < tasks.value.length; i++) {
      const task = tasks.value[i]
      // 每个任务随机依赖前面1-3个任务中的一些
      const dependencyCount = Math.floor(Math.random() * 3) + 1
      const availableDependencies = tasks.value.slice(0, i)
      
      for (let j = 0; j < dependencyCount && j < availableDependencies.length; j++) {
        const randomIndex = Math.floor(Math.random() * availableDependencies.length)
        const dependency = availableDependencies[randomIndex]
        if (!task.dependencies.includes(dependency.id)) {
          task.dependencies.push(dependency.id)
        }
      }
    }
  }

  // 添加新任务
  const addNewTask = () => {
    const newTask = generateRandomTask()
    const lastTask = tasks.value[tasks.value.length - 1]
    
    if (lastTask) {
      newTask.dependencies.push(lastTask.id)
    }
    
    tasks.value.push(newTask)
  }

  // 开始新游戏
  const startNewGame = () => {
    gameState.value = {
      day: 1,
      timeLeft: 1.0,
      bossSatisfaction: 80,
      mentalHealth: 80,
      completedTasks: 0,
      isGameActive: true,
      gameEndReason: undefined
    }
    
    initializeTasks()
  }

  // 完成任务
  const completeTask = (taskId: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task || task.completed) return
    
    task.completed = true
    gameState.value.timeLeft -= task.timeCost
    gameState.value.bossSatisfaction += task.bossReward
    gameState.value.mentalHealth += task.mentalReward
    gameState.value.completedTasks++
    
    // 确保数值在合理范围内
    gameState.value.bossSatisfaction = Math.max(0, Math.min(100, gameState.value.bossSatisfaction))
    gameState.value.mentalHealth = Math.max(0, Math.min(100, gameState.value.mentalHealth))
    
    // 添加新任务
    addNewTask()
  }

  // 摸鱼
  const idle = () => {
    // 检查时间是否足够摸鱼
    if (gameState.value.timeLeft >= 0.04) {
      gameState.value.timeLeft -= 0.04
      gameState.value.bossSatisfaction -= 1
      gameState.value.mentalHealth += 1
      
      // 确保数值在合理范围内
      gameState.value.bossSatisfaction = Math.max(0, Math.min(100, gameState.value.bossSatisfaction))
      gameState.value.mentalHealth = Math.max(0, Math.min(100, gameState.value.mentalHealth))
    }
  }

  // 游戏时间流逝
  const tick = () => {
    if (!gameState.value.isGameActive) return
    
    gameState.value.timeLeft -= 0.02
    
    // 检查限时任务是否过期
    tasks.value.forEach((task: Task) => {
      if (task.isTimed && !task.completed && task.deadline && gameState.value.day > task.deadline) {
        task.isOverdue = true
      }
    })
    
    // 时间用完，进入下一天
    if (gameState.value.timeLeft <= 0) {
      gameState.value.timeLeft = 1.0
      gameState.value.day++
      
      // 检查游戏结束条件
      if (gameState.value.bossSatisfaction < 40) {
        endGame('扫地出门')
      } else if (gameState.value.mentalHealth < 40) {
        endGame('精神崩溃')
      }
    }
  }

  // 结束游戏
  const endGame = (reason: GameEndReason) => {
    gameState.value.isGameActive = false
    gameState.value.gameEndReason = reason
    
    // 添加到排行榜
    const record: LeaderboardRecord = {
      id: `record_${Date.now()}`,
      title: gameResult.value.title,
      days: gameState.value.day,
      bossSatisfaction: gameState.value.bossSatisfaction,
      mentalHealth: gameState.value.mentalHealth,
      completedTasks: gameState.value.completedTasks,
      date: new Date()
    }
    
    leaderboard.value.push(record)
    leaderboard.value.sort((a: LeaderboardRecord, b: LeaderboardRecord) => {
      if (a.days !== b.days) return b.days - a.days
      return b.date.getTime() - a.date.getTime()
    })
    
    // 保存到本地存储
    saveLeaderboard()
  }

  // 保存排行榜到本地存储
  const saveLeaderboard = () => {
    try {
      localStorage.setItem('greatCorpSimulator_leaderboard', JSON.stringify(leaderboard.value))
    } catch (error) {
      console.error('保存排行榜失败:', error)
    }
  }

  // 从本地存储加载排行榜
  const loadLeaderboard = () => {
    try {
      const saved = localStorage.getItem('greatCorpSimulator_leaderboard')
      if (saved) {
        const parsed = JSON.parse(saved)
        leaderboard.value = parsed.map((record: any) => ({
          ...record,
          date: new Date(record.date)
        }))
      }
    } catch (error) {
      console.error('加载排行榜失败:', error)
    }
  }

  // 清空排行榜
  const clearLeaderboard = () => {
    leaderboard.value = []
    localStorage.removeItem('greatCorpSimulator_leaderboard')
  }

  // 初始化时加载排行榜
  loadLeaderboard()

  return {
    gameState,
    tasks,
    leaderboard,
    availableTasks,
    isGameActive,
    gameResult,
    startNewGame,
    completeTask,
    idle,
    tick,
    endGame,
    clearLeaderboard
  }
})
