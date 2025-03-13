<script setup lang="ts">
import { ref } from 'vue'
import ScreenRecorder from './components/ScreenRecorder.vue'

const eventLogs = ref<string[]>([])

const addLog = (message: string) => {
  eventLogs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
}

const onStart = () => {
  addLog('Recording started')
}

const onStop = (blob: Blob) => {
  addLog(`Recording stopped - Size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`)
}

const onPause = () => {
  addLog('Recording paused')
}

const onResume = () => {
  addLog('Recording resumed')
}

const onError = (error: Error) => {
  addLog(`Error: ${error.message}`)
}
</script>

<template>
  <div class="app">
    <h1>Vue Screen Recorder Demo</h1>
    <div class="demo-container">
      <ScreenRecorder
        :options="{
          mimeType: 'video/webm',
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000,
          frameRate: 30,
          audio: true
        }"
        @start="onStart"
        @stop="onStop"
        @pause="onPause"
        @resume="onResume"
        @error="onError"
      />
    </div>
    <div class="events-log">
      <h2>Events Log</h2>
      <div class="log-container">
        <div v-for="(log, index) in eventLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.demo-container {
  margin-bottom: 2rem;
}

.events-log {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  padding: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  font-family: monospace;
}

.log-entry:last-child {
  border-bottom: none;
}
</style>
