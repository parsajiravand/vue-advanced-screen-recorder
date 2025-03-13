import type { App } from 'vue'
import ScreenRecorder from './components/ScreenRecorder.vue'
export * from './types'

export { ScreenRecorder }

export default {
  install: (app: App): void => {
    app.component('ScreenRecorder', ScreenRecorder)
  }
} 