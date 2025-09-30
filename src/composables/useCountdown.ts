import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'

const MS_PER_MINUTE = 60_000
const UPDATE_INTERVAL = 100

interface CountdownState {
  currentTimeLeft: Ref<number>
  startCountdown: () => void
  resetCountdown: () => void
  formatTime: (ms: number) => string
}

export function useCountdown(minutes: number, onComplete?: () => void): CountdownState {
  const duration = minutes * MS_PER_MINUTE
  const currentTimeLeft = ref(duration)
  const isRunning = ref(false)
  let intervalId: number | null = null
  let pausedTimeLeft = duration

  // Cleanup function to prevent memory leaks
  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  })

  const stopCountdown = (): void => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  const startCountdown = (): void => {
    if (isRunning.value) {
      // Pause
      pausedTimeLeft = currentTimeLeft.value
      stopCountdown()
      return
    }

    // Start or Resume
    isRunning.value = true
    const startTime = Date.now() - (duration - pausedTimeLeft)

    intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      currentTimeLeft.value = Math.max(0, duration - elapsed)

      if (currentTimeLeft.value <= 0) {
        stopCountdown()
        onComplete?.()
      }
    }, UPDATE_INTERVAL)
  }

  const resetCountdown = (): void => {
    stopCountdown()
    pausedTimeLeft = duration
    currentTimeLeft.value = duration
  }

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(Math.max(0, ms) / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return {
    currentTimeLeft,
    startCountdown,
    resetCountdown,
    formatTime
  }
}
