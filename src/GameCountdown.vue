<script setup lang="ts">
import { useCountdown } from './composables/useCountdown'

const props = defineProps({
  minutes: {
    type: Number,
    required: true,
    validator: (value: number) => value > 0
  }
})

const { currentTimeLeft, startCountdown, resetCountdown, formatTime } = useCountdown(props.minutes)
</script>

<template>
  <div class="timer">
    <time class="display" aria-live="polite">{{ formatTime(currentTimeLeft) }}</time>
    <button
      class="control"
      @click="startCountdown"
      title="Start or pause countdown"
    >⏱️</button>
    <button
      class="control"
      @click="resetCountdown"
      title="Reset countdown"
    >🔄️</button>
  </div>
</template>

<style scoped>
.timer {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.display {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-right: 1px solid #e0e0e0;
}

.control {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-right: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.control:last-child {
  border-right: none;
}

.control:hover {
  background-color: #f5f5f5;
}

.control:active {
  background-color: #eeeeee;
}
</style>
