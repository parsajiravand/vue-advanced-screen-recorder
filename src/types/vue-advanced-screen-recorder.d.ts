declare module 'vue-advanced-screen-recorder' {
  import { DefineComponent } from 'vue'

  interface RecorderOptions {
    mimeType?: string
    videoBitsPerSecond?: number
    audioBitsPerSecond?: number
    frameRate?: number
    audio?: boolean
    buttonLabels?: {
      start?: string
      stop?: string
      pause?: string
      resume?: string
      download?: string
    }
  }

  interface RecorderSlotProps {
    isRecording: boolean
    isPaused: boolean
    startRecording: () => void
    stopRecording: () => void
    pauseRecording: () => void
    resumeRecording: () => void
    downloadRecording: () => void
    recordedBlob: Blob | null
    formattedDuration: string
  }

  const VueAdvancedScreenRecorder: DefineComponent<{
    options?: RecorderOptions
  }, {}, RecorderSlotProps>

  export default VueAdvancedScreenRecorder
} 