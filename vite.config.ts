import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// Check if we're building the library or the demo
const isLib = process.env.BUILD_MODE === 'lib'

export default defineConfig({
  plugins: [
    vue(),
    // Only generate types when building the library
    isLib && dts({
      include: ['src/components/**/*.vue', 'src/types/**/*.ts'],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace(/src/, ''),
        content
      })
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: isLib ? 'dist' : 'demo-dist',
    ...(isLib ? {
      lib: {
        entry: resolve(__dirname, 'src/components/ScreenRecorder.vue'),
        name: 'VueAdvancedScreenRecorder',
        fileName: 'vue-advanced-screen-recorder'
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    } : {})
  },
  server: {
    port: 3000,
    host: true
  }
}) 