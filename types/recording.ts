// Local recording stored in IndexedDB
export interface LocalRecording {
  id: number;
  title: string;
  blob: Blob;
  duration: number; // seconds
  size: number; // bytes
  createdAt: string; // ISO string
}

// STAGE 2: Cloud recording type
export interface CloudRecording {
  id: string;
  user_id: string;
  title: string;
  file_path: string;
  duration: number;
  file_size: number;
  created_at: string;
}
