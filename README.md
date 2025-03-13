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

## Installation

```bash
npm install vue-screen-recorder
```

## Usage

```vue
<template>
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
</template>

<script setup lang="ts">
import { ScreenRecorder } from 'vue-screen-recorder'

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
  audio: true
}
```

## Events

- `start`: Emitted when recording starts
- `stop`: Emitted when recording stops, includes the recorded blob
- `pause`: Emitted when recording is paused
- `resume`: Emitted when recording is resumed
- `error`: Emitted when an error occurs, includes the error object

## License

MIT
