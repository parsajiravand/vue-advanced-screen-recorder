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

const shareRecording = async (blob: Blob | null) => {
  if (!blob) return
  
  try {
    if (navigator.share) {
      const file = new File([blob], 'screen-recording.webm', { type: blob.type })
      await navigator.share({
        title: 'Screen Recording',
        text: 'Check out my screen recording!',
        files: [file]
      })
      addLog('Recording shared successfully')
    } else {
      addLog('Web Share API not supported')
    }
  } catch (error) {
    addLog(`Share error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
</script>

<template>
  <div class="app">
    <h1>Vue Screen Recorder Demo</h1>

    <div class="demo-section">
      <h2>Basic Usage</h2>
      <ScreenRecorder
        :options="{
          mimeType: 'video/webm',
          videoBitsPerSecond: 2500000,
          audioBitsPerSecond: 128000,
          frameRate: 30,
          audio: true,
          buttonLabels: {
            start: '🎥 Start',
            stop: '⏹ Stop',
            pause: '⏸ Pause',
            resume: '▶️ Resume',
            download: '💾 Save'
          }
        }"
        @start="onStart"
        @stop="onStop"
        @pause="onPause"
        @resume="onResume"
        @error="onError"
      />
    </div>

    <div class="demo-section">
      <h2>Custom UI with Slots</h2>
      <ScreenRecorder>
        <template #controls="{ isRecording, isPaused, startRecording, stopRecording, pauseRecording, resumeRecording }">
          <div class="custom-controls">
            <button 
              @click="startRecording" 
              :disabled="isRecording"
              class="custom-btn primary"
            >
              {{ isRecording ? '📹 Recording...' : '🎥 Start Recording' }}
            </button>
            
            <div class="control-group" v-if="isRecording">
              <button 
                @click="pauseRecording"
                :disabled="isPaused"
                class="custom-btn warning"
              >
                ⏸ Pause
              </button>
              <button 
                @click="resumeRecording"
                :disabled="!isPaused"
                class="custom-btn info"
              >
                ▶️ Resume
              </button>
              <button 
                @click="stopRecording"
                class="custom-btn danger"
              >
                ⏹ Stop
              </button>
            </div>
          </div>
        </template>

        <template #actions="{ downloadRecording, recordedBlob }">
          <div class="custom-actions">
            <button 
              @click="downloadRecording"
              class="custom-btn success"
            >
              💾 Download Recording
            </button>
            <button 
              @click="shareRecording(recordedBlob)"
              class="custom-btn info"
            >
              📤 Share Recording
            </button>
          </div>
        </template>

        <template #status="{ isRecording, formattedDuration }">
          <div class="custom-status" v-if="isRecording">
            🔴 Recording in progress: {{ formattedDuration }}
          </div>
        </template>
      </ScreenRecorder>
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

h1, h2 {
  color: #2c3e50;
  text-align: center;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.custom-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.control-group {
  display: flex;
  gap: 1rem;
}

.custom-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-btn.primary { background-color: #4CAF50; color: white; }
.custom-btn.danger { background-color: #f44336; color: white; }
.custom-btn.warning { background-color: #ff9800; color: white; }
.custom-btn.info { background-color: #2196F3; color: white; }
.custom-btn.success { background-color: #4CAF50; color: white; }

.custom-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.custom-status {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  color: #f44336;
  font-size: 1.1rem;
}

.events-log {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
}

.log-entry {
  padding: 0.5rem;
  border-bottom: 1px solid #dee2e6;
  font-family: monospace;
  color: #2c3e50; 
}

.log-entry:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .control-group {
    flex-direction: column;
  }

  .custom-actions {
    flex-direction: column;
  }

  .custom-btn {
    width: 100%;
  }
}
</style>
