// 游戏相关类型定义
export interface Task {
  id: string
  name: string
  type: 'white' | 'orange' | 'purple'
  timeCost: number
  bossReward: number
  mentalReward: number
  completed: boolean
  isTimed: boolean
  deadline?: number
  dependencies: string[]
  isOverdue: boolean
}

export interface GameState {
  day: number
  timeLeft: number
  bossSatisfaction: number
  mentalHealth: number
  completedTasks: number
  isGameActive: boolean
  gameEndReason?: string
}

export interface GameResult {
  title: string
  subtitle: string
  description: string
}

export interface LeaderboardRecord {
  id: string
  title: string
  days: number
  bossSatisfaction: number
  mentalHealth: number
  completedTasks: number
  date: Date
}

export type GameEndReason = '见好就收' | '扫地出门' | '精神崩溃'

// 技能卡相关类型定义
export interface SkillCard {
  id: string
  name: string
  description: string
  icon: string
  effect: 'transfer' | 'vacation' | 'promotion'
  count: number
}

export interface SkillCardEffect {
  type: 'transfer' | 'vacation' | 'promotion'
  duration?: number // 效果持续时间（天数）
  value?: number // 效果数值
}