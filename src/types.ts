export interface VideoMetadata {
  file: File | Blob;
  name: string;
  size: number;
  type: string;
  url: string;
  duration: number; // in seconds
  width: number;
  height: number;
  thumbnailUrl: string;
}

export type PresetDuration = '30s' | '1m' | '2m' | '3m' | 'custom';

export interface ClipConfig {
  preset: PresetDuration;
  customDurationSeconds: number; // in seconds
  filenamePrefix: string; // e.g. "Clip_"
  quality: 'original' | 'high' | 'medium' | 'low';
  enableTextOverlay?: boolean;
}

export interface TextLayer {
  id: string;
  text: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  fontFamily: string;
  fontSize: number; // px at 1080p scale
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  strokeColor: string;
  strokeWidth: number; // 0 to 10
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  opacity: number; // 0 to 1
  backgroundColor: string; // rgba or hex
  bgPadding: number;
  letterSpacing: number;
  rotation: number; // degrees
  animation: 'none' | 'fade' | 'slide' | 'zoom' | 'pop';
  
  // Auto Increment Settings
  autoIncrement: boolean;
  startNumber?: number;
  paddingDigits?: number;
  customPrefix?: string;
  customSuffix?: string;
}

export interface GeneratedClip {
  index: number; // 1-based index
  filename: string;
  blob: Blob;
  url: string;
  startTime: number; // seconds
  endTime: number; // seconds
  duration: number; // seconds
  size: number; // bytes
  textOverlayUsed: string;
}

export interface ExportSummary {
  zipFilename: string;
  zipBlob: Blob;
  totalClips: number;
  totalSize: number;
  processingTimeMs: number;
  clips: GeneratedClip[];
}

export interface ProcessingState {
  isProcessing: boolean;
  isPaused: boolean;
  currentClipIndex: number;
  totalClips: number;
  percentage: number;
  currentClipFilename: string;
  estimatedSecondsRemaining: number;
  statusMessage: string;
  error?: string;
}
