<template>
    <div class="screen-recorder">
      <div class="controls">
        <button
          @click="startRecording"
          :disabled="state.isRecording"
          class="control-btn start"
        >
          Start Recording
        </button>
        <button
          @click="stopRecording"
          :disabled="!state.isRecording"
          class="control-btn stop"
        >
          Stop Recording
        </button>
        <button
          @click="pauseRecording"
          :disabled="!state.isRecording || state.isPaused"
          class="control-btn pause"
        >
          Pause
        </button>
        <button
          @click="resumeRecording"
          :disabled="!state.isRecording || !state.isPaused"
          class="control-btn resume"
        >
          Resume
        </button>
      </div>
  
      <div v-if="state.recordedUrl" class="preview">
        <video :src="state.recordedUrl" controls></video>
        <div class="actions">
          <button @click="downloadRecording" class="action-btn">
            Download Recording
          </button>
        </div>
      </div>
  
      <div class="status" v-if="state.isRecording">
        Recording: {{ formatDuration(state.duration) }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onUnmounted } from 'vue'
  import type { RecordingOptions, RecordingState } from '../types'
  
  const props = withDefaults(defineProps<{
    options?: RecordingOptions
  }>(), {
    options: () => ({
      mimeType: 'video/webm',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
      frameRate: 30,
      audio: true
    })
  })
  
  const emit = defineEmits<{
    (e: 'start'): void
    (e: 'stop', blob: Blob): void
    (e: 'pause'): void
    (e: 'resume'): void
    (e: 'error', error: Error): void
  }>()
  
  const state = reactive<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    stream: null,
    mediaRecorder: null,
    chunks: [],
    recordedBlob: null,
    recordedUrl: null
  })
  
  let durationInterval: number | null = null
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: props.options.width,
          height: props.options.height,
          frameRate: props.options.frameRate
        },
        audio: props.options.audio
      })
  
      state.stream = stream
      state.mediaRecorder = new MediaRecorder(stream, {
        mimeType: props.options.mimeType,
        videoBitsPerSecond: props.options.videoBitsPerSecond,
        audioBitsPerSecond: props.options.audioBitsPerSecond
      })
  
      state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          state.chunks.push(event.data)
        }
      }
  
      state.mediaRecorder.onstop = () => {
        const blob = new Blob(state.chunks, { type: props.options.mimeType })
        state.recordedBlob = blob
        state.recordedUrl = URL.createObjectURL(blob)
        emit('stop', blob)
        stopDurationCounter()
      }
  
      state.mediaRecorder.start()
      state.isRecording = true
      startDurationCounter()
      emit('start')
    } catch (error) {
      emit('error', error as Error)
    }
  }
  
  const stopRecording = () => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop()
      state.stream?.getTracks().forEach(track => track.stop())
      state.isRecording = false
      state.isPaused = false
    }
  }
  
  const pauseRecording = () => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.pause()
      state.isPaused = true
      stopDurationCounter()
      emit('pause')
    }
  }
  
  const resumeRecording = () => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.resume()
      state.isPaused = false
      startDurationCounter()
      emit('resume')
    }
  }
  
  const downloadRecording = () => {
    if (state.recordedBlob) {
      const url = window.URL.createObjectURL(state.recordedBlob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `screen-recording-${new Date().toISOString()}.webm`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  }
  
  const startDurationCounter = () => {
    durationInterval = window.setInterval(() => {
      state.duration += 1
    }, 1000)
  }
  
  const stopDurationCounter = () => {
    if (durationInterval) {
      clearInterval(durationInterval)
      durationInterval = null
    }
  }
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  onUnmounted(() => {
    stopRecording()
    stopDurationCounter()
  })
  </script>
  
  <style scoped>
  .screen-recorder {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f8f9fa;
  }
  
  .controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .control-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .start { background-color: #28a745; color: white; }
  .stop { background-color: #dc3545; color: white; }
  .pause { background-color: #ffc107; color: black; }
  .resume { background-color: #17a2b8; color: white; }
  
  .preview {
    margin-top: 1rem;
  }
  
  .preview video {
    width: 100%;
    max-width: 800px;
    border-radius: 4px;
  }
  
  .actions {
    margin-top: 1rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .status {
    margin-top: 1rem;
    font-weight: 600;
    color: #dc3545;
  }
  </style>