// 游戏音效和动画管理
export class GameEffects {
  private static instance: GameEffects
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()

  static getInstance(): GameEffects {
    if (!GameEffects.instance) {
      GameEffects.instance = new GameEffects()
    }
    return GameEffects.instance
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      await this.loadSounds()
    } catch (error) {
      console.warn('音频初始化失败:', error)
    }
  }

  private async loadSounds() {
    if (!this.audioContext) return

    // 生成简单的音效
    const sounds = {
      click: this.generateTone(800, 0.1, 'square'),
      complete: this.generateTone(1200, 0.2, 'sine'),
      idle: this.generateTone(400, 0.15, 'triangle'),
      warning: this.generateTone(300, 0.3, 'sawtooth'),
      success: this.generateTone(600, 0.2, 'sine'),
      fail: this.generateTone(200, 0.4, 'square')
    }

    for (const [name, buffer] of Object.entries(sounds)) {
      this.sounds.set(name, buffer)
    }
  }

  private generateTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized')

    const sampleRate = this.audioContext.sampleRate
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
          break
        case 'triangle':
          value = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1
          break
        case 'sawtooth':
          value = 2 * (frequency * t - Math.floor(frequency * t + 0.5))
          break
      }

      // 添加衰减
      const envelope = Math.exp(-t * 3)
      data[i] = value * envelope * 0.3
    }

    return buffer
  }

  playSound(soundName: string) {
    if (!this.audioContext || !this.sounds.has(soundName)) return

    const source = this.audioContext.createBufferSource()
    source.buffer = this.sounds.get(soundName)!
    source.connect(this.audioContext.destination)
    source.start()
  }

  // 播放点击音效
  playClick() {
    this.playSound('click')
  }

  // 播放完成任务音效
  playComplete() {
    this.playSound('complete')
  }

  // 播放摸鱼音效
  playIdle() {
    this.playSound('idle')
  }

  // 播放警告音效
  playWarning() {
    this.playSound('warning')
  }

  // 播放成功音效
  playSuccess() {
    this.playSound('success')
  }

  // 播放失败音效
  playFail() {
    this.playSound('fail')
  }
}

// 动画工具类
export class GameAnimations {
  // 创建粒子效果
  static createParticleEffect(element: HTMLElement, type: 'success' | 'warning' | 'danger') {
    const colors = {
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336'
    }

    const color = colors[type]
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div')
      particle.style.position = 'fixed'
      particle.style.left = centerX + 'px'
      particle.style.top = centerY + 'px'
      particle.style.width = '4px'
      particle.style.height = '4px'
      particle.style.backgroundColor = color
      particle.style.borderRadius = '50%'
      particle.style.pointerEvents = 'none'
      particle.style.zIndex = '9999'

      document.body.appendChild(particle)

      const angle = (i / 8) * Math.PI * 2
      const distance = 50 + Math.random() * 30
      const endX = centerX + Math.cos(angle) * distance
      const endY = centerY + Math.sin(angle) * distance

      particle.animate([
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1
        },
        {
          transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => {
        document.body.removeChild(particle)
      }
    }
  }

  // 创建数字跳动效果
  static createNumberBounce(element: HTMLElement) {
    element.style.animation = 'none'
    element.offsetHeight // 触发重排
    element.style.animation = 'pixel-bounce 0.6s ease-in-out'
  }

  // 创建闪烁效果
  static createBlink(element: HTMLElement, duration: number = 1000) {
    const originalColor = element.style.color
    let isVisible = true
    
    const interval = setInterval(() => {
      element.style.color = isVisible ? 'transparent' : originalColor
      isVisible = !isVisible
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      element.style.color = originalColor
    }, duration)
  }

  // 创建进度条填充效果
  static createProgressFill(element: HTMLElement, targetWidth: string, duration: number = 1000) {
    element.style.width = '0%'
    element.style.transition = `width ${duration}ms ease-out`
    
    setTimeout(() => {
      element.style.width = targetWidth
    }, 50)
  }

  // 创建打字机效果
  static createTypewriter(element: HTMLElement, text: string, speed: number = 50) {
    element.textContent = ''
    let i = 0
    
    const timer = setInterval(() => {
      element.textContent += text[i]
      i++
      
      if (i >= text.length) {
        clearInterval(timer)
      }
    }, speed)
  }

  // 创建屏幕震动效果
  static createScreenShake(intensity: number = 5, duration: number = 500) {
    const body = document.body
    const originalTransform = body.style.transform
    
    let startTime = Date.now()
    
    const shake = () => {
      const elapsed = Date.now() - startTime
      if (elapsed >= duration) {
        body.style.transform = originalTransform
        return
      }
      
      const x = (Math.random() - 0.5) * intensity
      const y = (Math.random() - 0.5) * intensity
      body.style.transform = `translate(${x}px, ${y}px)`
      
      requestAnimationFrame(shake)
    }
    
    shake()
  }
}

// 游戏状态指示器
export class GameStatusIndicator {
  private element: HTMLElement
  private currentValue: number = 0
  private targetValue: number = 0
  private animationFrame: number | null = null

  constructor(element: HTMLElement) {
    this.element = element
  }

  updateValue(newValue: number, animate: boolean = true) {
    this.targetValue = newValue
    
    if (!animate) {
      this.currentValue = newValue
      this.updateDisplay()
      return
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }

    this.animate()
  }

  private animate() {
    const diff = this.targetValue - this.currentValue
    if (Math.abs(diff) < 0.1) {
      this.currentValue = this.targetValue
      this.updateDisplay()
      return
    }

    this.currentValue += diff * 0.1
    this.updateDisplay()
    
    this.animationFrame = requestAnimationFrame(() => this.animate())
  }

  private updateDisplay() {
    this.element.textContent = Math.round(this.currentValue).toString()
    
    // 根据数值改变颜色
    if (this.currentValue >= 60) {
      this.element.className = 'status-good'
    } else if (this.currentValue >= 40) {
      this.element.className = 'status-warning'
    } else {
      this.element.className = 'status-danger'
    }
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
  }
}
