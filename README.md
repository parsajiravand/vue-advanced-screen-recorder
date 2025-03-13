# Vue Screen Recorder

A powerful and flexible screen recording component for Vue 3 applications with TypeScript support.

## Features

- 🎥 Screen recording with audio support
- ⏯️ Pause and resume functionality
- 📊 Recording duration display
- 💾 Download recordings
- 🎛️ Configurable recording options
- 🔧 TypeScript support
- 🎨 Customizable styling
- 🔤 Customizable button labels
- 🎯 Flexible slots for custom UI

## Installation

```bash
npm install vue-advanced-screen-recorder
```

## Usage

### Basic Usage

```vue
<template>
  <ScreenRecorder
    :options="{
      mimeType: 'video/webm',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
      frameRate: 30,
      audio: true,
      buttonLabels: {
        start: 'Start Recording',
        stop: 'Stop Recording',
        pause: 'Pause',
        resume: 'Resume',
        download: 'Download Recording'
      }
    }"
    @start="onStart"
    @stop="onStop"
    @pause="onPause"
    @resume="onResume"
    @error="onError"
  />
</template>

<script setup lang="ts">
import { ScreenRecorder } from 'vue-advanced-screen-recorder'

const onStart = () => {
  console.log('Recording started')
}

const onStop = (blob: Blob) => {
  console.log('Recording stopped', blob)
}

const onPause = () => {
  console.log('Recording paused')
}

const onResume = () => {
  console.log('Recording resumed')
}

const onError = (error: Error) => {
  console.error('Recording error:', error)
}
</script>
```

### Custom UI with Slots

```vue
<template>
  <ScreenRecorder>
    <!-- Custom controls -->
    <template #controls="{ isRecording, isPaused, startRecording, stopRecording, pauseRecording, resumeRecording }">
      <div class="my-custom-controls">
        <button @click="startRecording" :disabled="isRecording">
          {{ isRecording ? 'Recording...' : 'Start' }}
        </button>
        <!-- Add other custom controls -->
      </div>
    </template>

    <!-- Custom actions for recorded video -->
    <template #actions="{ downloadRecording, recordedBlob, recordedUrl }">
      <div class="my-custom-actions">
        <button @click="downloadRecording">Save Recording</button>
        <button @click="customHandleVideo(recordedBlob)">Process Video</button>
      </div>
    </template>

    <!-- Custom recording status -->
    <template #status="{ isRecording, duration, formattedDuration }">
      <div class="my-custom-status">
        Recording time: {{ formattedDuration }}
      </div>
    </template>
  </ScreenRecorder>
</template>
```

## Props

### options

- Type: `Object`
- Optional: Yes
- Default:
```typescript
{
  mimeType: 'video/webm',
  videoBitsPerSecond: 2500000,
  audioBitsPerSecond: 128000,
  frameRate: 30,
  audio: true,
  buttonLabels: {
    start: 'Start Recording',
    stop: 'Stop Recording',
    pause: 'Pause',
    resume: 'Resume',
    download: 'Download Recording'
  }
}
```

## Slots

### controls

Slot for custom control buttons with the following props:
- `isRecording`: boolean
- `isPaused`: boolean
- `startRecording`: () => Promise<void>
- `stopRecording`: () => void
- `pauseRecording`: () => void
- `resumeRecording`: () => void

### actions

Slot for custom actions after recording with the following props:
- `downloadRecording`: () => void
- `recordedBlob`: Blob | null
- `recordedUrl`: string | null

### status

Slot for custom recording status with the following props:
- `isRecording`: boolean
- `duration`: number
- `formattedDuration`: string

## Events

- `start`: Emitted when recording starts
- `stop`: Emitted when recording stops, includes the recorded blob
- `pause`: Emitted when recording is paused
- `resume`: Emitted when recording is resumed
- `error`: Emitted when an error occurs, includes the error object

## License

MIT
