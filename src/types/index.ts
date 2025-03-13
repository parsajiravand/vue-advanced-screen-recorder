export interface RecordingOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  width?: number;
  height?: number;
  frameRate?: number;
  audio?: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  stream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  chunks: Blob[];
  recordedBlob: Blob | null;
  recordedUrl: string | null;
}

export type RecordingFormat = 'webm' | 'mp4'; 