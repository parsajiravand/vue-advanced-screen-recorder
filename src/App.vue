<script setup lang="ts">
import { ref } from "vue";
import VueAdvancedScreenRecorder from "./components/ScreenRecorder.vue"

const eventLogs = ref<string[]>([]);


const addLog = (message: string) => {
  eventLogs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`);
};

const onStart = () => {
  addLog("Recording started");
};

const onStop = (blob: Blob) => {
  addLog(`Recording stopped - Size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
};

const onPause = () => {
  addLog("Recording paused");
};

const onResume = () => {
  addLog("Recording resumed");
};

const onError = (error: Error) => {
  addLog(`Error: ${error.message}`);
};

const shareRecording = async (blob: Blob | null) => {
  if (!blob) return;

  try {
    if (navigator.share) {
      const file = new File([blob], "screen-recording.webm", {
        type: blob.type,
      });
      await navigator.share({
        title: "Screen Recording",
        text: "Check out my screen recording!",
        files: [file],
      });
      addLog("Recording shared successfully");
    } else {
      addLog("Web Share API not supported");
    }
  } catch (error) {
    addLog(
      `Share error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Vue Screen Recorder Demo</h1>
      <div class="header-links">
        <a
          href="https://github.com/parsajiravand/vue-advanced-screen-recorder"
          target="_blank"
          class="header-link"
        >
          <svg height="24" viewBox="0 0 16 16" width="24" class="github-icon">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/vue-advanced-screen-recorder"
          target="_blank"
          class="header-link"
        >
          <svg height="24" viewBox="0 0 24 24" width="24" class="npm-icon">
            <path
              fill="currentColor"
              d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"
            ></path>
          </svg>
          npm
        </a>
      </div>
    </header>

    <div class="demo-section">
      <div class="section-header">
        <h2>Basic Usage</h2>
        <a
          href="https://github.com/parsajiravand/vue-advanced-screen-recorder?tab=readme-ov-file#basic-usage"
          class="code-toggle-btn"
          target="_blank"
        >
          Show Code
        </a>
      </div>

      <VueAdvancedScreenRecorder
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
            download: '💾 Save',
          },
        }"
        @start="onStart"
        @stop="onStop"
        @pause="onPause"
        @resume="onResume"
        @error="onError"
      />
      <div class="events-log">
        <h2>Events Log</h2>
        <div class="log-container">
          <div v-for="(log, index) in eventLogs" :key="index" class="log-entry">
            {{ log }}
          </div>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-header">
        <h2>Custom UI with Slots</h2>
        <a
          href="https://github.com/parsajiravand/vue-advanced-screen-recorder?tab=readme-ov-file#custom-ui-with-slots"
          target="_blank"
          class="code-toggle-btn"
        >
          Show Code
        </a>
      </div>

      <VueAdvancedScreenRecorder>
        <template
          #controls="{
            isRecording,
            isPaused,
            startRecording,
            stopRecording,
            pauseRecording,
            resumeRecording,
          }"
        >
          <div class="custom-controls">
            <button
              @click="startRecording"
              :disabled="isRecording"
              class="custom-btn primary"
            >
              {{ isRecording ? "📹 Recording..." : "🎥 Start Recording" }}
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
              <button @click="stopRecording" class="custom-btn danger">
                ⏹ Stop
              </button>
            </div>
          </div>
        </template>

        <template #actions="{ downloadRecording, recordedBlob }">
          <div class="custom-actions">
            <button @click="downloadRecording" class="custom-btn success">
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
      </VueAdvancedScreenRecorder>
    </div>
  </div>
</template>

<style>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.header h1 {
  background: linear-gradient(45deg, #41b883, #34495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-links {
  display: flex;
  gap: 1rem;
}

.header-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

.header-link:hover {
  background-color: #41b883;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(65, 184, 131, 0.2);
}

.github-icon,
.npm-icon {
  transition: all 0.2s ease;
}

.header-link:hover .github-icon,
.header-link:hover .npm-icon {
  color: white;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  font-weight: 600;
}

.code-toggle-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #41b883;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.code-toggle-btn:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(65, 184, 131, 0.2);
}

.code-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: #1a1a1a;
  border-radius: 12px;
  overflow-x: auto;
  position: relative;
  border: 1px solid #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.code-section::before {
  content: "Vue";
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: #41b883;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.code-section pre {
  margin: 0;
  padding: 0;
}

.code-section code {
  color: #e4e4e4;
  font-family: "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  display: block;
  counter-reset: line;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 2rem;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.custom-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-btn.primary {
  background-color: #4caf50;
  color: white;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}
.custom-btn.danger {
  background-color: #f44336;
  color: white;
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.2);
}
.custom-btn.warning {
  background-color: #ff9800;
  color: white;
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.2);
}
.custom-btn.info {
  background-color: #2196f3;
  color: white;
  box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}
.custom-btn.success {
  background-color: #4caf50;
  color: white;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
}

.custom-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.custom-status {
  margin-top: 1.5rem;
  text-align: center;
  font-weight: 600;
  color: #f44336;
  font-size: 1.1rem;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 8px;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.events-log {
  margin-top: 3rem;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.events-log h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.log-entry {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-family: "Fira Code", monospace;
  color: #2c3e50;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-entry:hover {
  background-color: #f1f5f9;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header-links {
    flex-direction: column;
    width: 100%;
  }

  .header-link {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .control-group {
    flex-direction: column;
    width: 100%;
  }

  .custom-actions {
    flex-direction: column;
  }

  .custom-btn {
    width: 100%;
    justify-content: center;
  }

  .demo-section {
    padding: 1rem;
  }

  .events-log {
    padding: 1rem;
  }
}

/* Add smooth scrolling to the whole page */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #41b883;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #3aa876;
}
</style>
