export interface RecordingOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  frameRate?: number;
  width?: number;
  height?: number;
  audio?: boolean;
  customDownloadName?: string;
  customDownloadExtension?: string;
  buttonLabels?: {
    start?: string;
    stop?: string;
    pause?: string;
    resume?: string;
    download?: string;
  };
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