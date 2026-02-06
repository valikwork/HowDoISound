export const APP_NAME = "How Do I Sound?";
export const APP_DESCRIPTION =
  "Record, store, and manage your audio recordings";

export const AUDIO_CONFIG = {
  mimeType: "audio/webm;codecs=opus",
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
} as const;

export const INDEXEDDB_CONFIG = {
  dbName: "HowDoISoundDB",
  storeName: "recordings",
  version: 1,
} as const;

export const MAX_RECORDING_DURATION = 60; // 1 minutes in seconds
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const VISUALIZER_CONFIG = {
  barWidth: 2,
  barGap: 1,
  barColor: "#3b82f6",
  backgroundColor: "#f3f4f6",
} as const;

// STAGE 2: Supabase constants
export const SUPABASE_CONFIG = {
  bucketName: "recordings",
  maxFileSize: 50 * 1024 * 1024,
  allowedMimeTypes: ["audio/webm", "audio/wav", "audio/mpeg"],
} as const;
