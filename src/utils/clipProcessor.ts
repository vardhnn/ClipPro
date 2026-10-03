import { ClipConfig, ExportSummary, GeneratedClip, ProcessingState, TextLayer, VideoMetadata } from '../types';

import { createClipsZipArchive } from './zipUtils';
import { drawTextLayerOnCanvas, formatTime, getAutoIncrementedText } from './videoUtils';

/** Duration in seconds for each built-in clip preset. */
const PRESET_DURATION_SECONDS: Record<Exclude<ClipConfig['preset'], 'custom'>, number> = {
  '30s': 30,
  '1m': 60,
  '2m': 120,
  '3m': 180,
};

export const DEFAULT_CLIP_DURATION_SECONDS = 30;

/**
 * Single source of truth for "how long is one clip?", shared by the UI previews
 * and the render engine so they can never disagree.
 */
export function getClipDurationSeconds(config: ClipConfig): number {
  if (config.preset === 'custom') {
    return Math.max(1, config.customDurationSeconds || DEFAULT_CLIP_DURATION_SECONDS);
  }
  return PRESET_DURATION_SECONDS[config.preset] ?? DEFAULT_CLIP_DURATION_SECONDS;
}

interface ProcessOptions {
  videoMetadata: VideoMetadata;
  clipConfig: ClipConfig;
  textLayers: TextLayer[];
  onProgress: (state: ProcessingState) => void;
  checkIsPausedOrCancelled: () => { isPaused: boolean; isCancelled: boolean };
}

export async function processVideoClips({
  videoMetadata,
  clipConfig,
  textLayers,
  onProgress,
  checkIsPausedOrCancelled,
}: ProcessOptions): Promise<ExportSummary> {
  const startTimeMs = Date.now();
  const totalDuration = videoMetadata.duration;

  const durationPerClip = getClipDurationSeconds(clipConfig);

  const totalClips = Math.max(1, Math.ceil(totalDuration / durationPerClip));
  const padDigits = Math.max(2, String(totalClips).length);
  const prefix = clipConfig.filenamePrefix || 'Clip_';
  const isOverlayEnabled = clipConfig.enableTextOverlay !== false;

  // Scale resolution according to quality preference
  let qualityScale = 1.0;
  if (clipConfig.quality === 'high') qualityScale = 0.85;
  else if (clipConfig.quality === 'medium') qualityScale = 0.65;
  else if (clipConfig.quality === 'low') qualityScale = 0.45;

  const canvasWidth = Math.round(videoMetadata.width * qualityScale);
  const canvasHeight = Math.round(videoMetadata.height * qualityScale);

  // Setup offscreen canvas & video elements
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });

  if (!ctx) {
    throw new Error('Failed to create canvas rendering context');
  }

  const video = document.createElement('video');
  video.src = videoMetadata.url;
  video.crossOrigin = 'anonymous';
  video.playsInline = true;

  await new Promise<void>((resolve, reject) => {
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error('Failed to initialize video element for clip rendering.'));
  });

  // Audio routing via Web Audio API so NO sound plays through speakers while processing!
  let audioCtx: AudioContext | null = null;
  let audioTrack: MediaStreamTrack | null = null;

  try {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const sourceNode = audioCtx.createMediaElementSource(video);
    const audioDest = audioCtx.createMediaStreamDestination();
    sourceNode.connect(audioDest);
    // Crucial: sourceNode is NOT connected to audioCtx.destination, so speakers remain silent!
    if (audioDest.stream.getAudioTracks().length > 0) {
      audioTrack = audioDest.stream.getAudioTracks()[0];
    }
  } catch {
    // Fallback if WebAudio is restricted
    try {
      const videoStream = (video as unknown as { captureStream?: () => MediaStream }).captureStream
        ? (video as unknown as { captureStream: () => MediaStream }).captureStream()
        : null;
      if (videoStream && videoStream.getAudioTracks().length > 0) {
        audioTrack = videoStream.getAudioTracks()[0];
      }
    } catch {}
  }

  const generatedClips: GeneratedClip[] = [];

  // Determine browser supported MediaRecorder mimeType
  const mimeTypeCandidates = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  let selectedMimeType = 'video/webm';
  for (const candidate of mimeTypeCandidates) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      selectedMimeType = candidate;
      break;
    }
  }

  // Name clips after what MediaRecorder actually produced: browsers without an
  // H.264 encoder (Firefox) hand us WebM, so a hardcoded ".mp4" would mislabel them.
  const fileExtension = selectedMimeType.includes('mp4') ? 'mp4' : 'webm';

  // Helper to wait for seek
  const seekVideoTo = (timeSec: number): Promise<void> => {
    return new Promise((resolve) => {
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        resolve();
      };
      video.addEventListener('seeked', handleSeeked);
      video.currentTime = Math.min(timeSec, totalDuration);
    });
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Loop through all clips
  try {
    for (let i = 0; i < totalClips; i++) {
      // Check pause/cancel status
      let check = checkIsPausedOrCancelled();
      while (check.isPaused && !check.isCancelled) {
        await delay(200);
        check = checkIsPausedOrCancelled();
      }
      if (check.isCancelled) {
        throw new Error('Processing cancelled by user.');
      }

      const clipStart = i * durationPerClip;
      const clipEnd = Math.min((i + 1) * durationPerClip, totalDuration);
      const clipDurationSec = clipEnd - clipStart;

      const clipNumStr = String(i + 1).padStart(padDigits, '0');
      const filename = `${prefix}${clipNumStr}.${fileExtension}`;

      await seekVideoTo(clipStart);

      const canvasStream = canvas.captureStream(30);
      const tracksToCombine = [...canvasStream.getVideoTracks()];
      if (audioTrack) {
        tracksToCombine.push(audioTrack);
      }
      const combinedStream = new MediaStream(tracksToCombine);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: clipConfig.quality === 'original' ? 8000000 : clipConfig.quality === 'high' ? 5000000 : 2500000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const recordPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: selectedMimeType });
          resolve(finalBlob);
        };
      });

      recorder.start();
      video.play().catch(() => {});

      // Fast render loop using requestAnimationFrame
      let lastReportTime = 0;

      await new Promise<void>((resolve, reject) => {
        let animId: number;

        const renderFrame = () => {
          const innerCheck = checkIsPausedOrCancelled();
          if (innerCheck.isCancelled) {
            cancelAnimationFrame(animId);
            video.pause();
            recorder.stop();
            return reject(new Error('Processing cancelled by user.'));
          }

          if (innerCheck.isPaused) {
            video.pause();
            setTimeout(renderFrame, 150);
            return;
          }

          if (video.paused && video.currentTime < clipEnd) {
            video.play().catch(() => {});
          }

          if (video.currentTime >= clipEnd || video.ended) {
            cancelAnimationFrame(animId);
            video.pause();
            recorder.stop();
            return resolve();
          }

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

          // Draw text layers if overlay enabled
          if (isOverlayEnabled && textLayers.length > 0) {
            const currentProgressInClip = (video.currentTime - clipStart) / clipDurationSec;
            for (const layer of textLayers) {
              drawTextLayerOnCanvas(ctx, layer, i, canvasWidth, canvasHeight, Math.max(0, Math.min(1, currentProgressInClip)));
            }
          }

          // Report dynamic progress & remaining time estimate frequently
          const now = Date.now();
          if (now - lastReportTime > 300) {
            lastReportTime = now;
            const progressInCurrentClip = Math.min(1, Math.max(0, (video.currentTime - clipStart) / clipDurationSec));
            const fractionalClipsDone = i + progressInCurrentClip;
            const currentPercent = Math.min(99, Math.round((fractionalClipsDone / totalClips) * 100));

            const elapsedSec = (now - startTimeMs) / 1000;
            const estTotalSec = fractionalClipsDone > 0 ? (elapsedSec / fractionalClipsDone) * totalClips : totalClips * 10;
            const estRemainingSec = Math.max(0, Math.round(estTotalSec - elapsedSec));

            onProgress({
              isProcessing: true,
              isPaused: false,
              currentClipIndex: i + 1,
              totalClips,
              percentage: currentPercent,
              currentClipFilename: filename,
              estimatedSecondsRemaining: estRemainingSec,
              statusMessage: `Rendering ${filename} (${formatTime(video.currentTime - clipStart)} / ${formatTime(clipDurationSec)})...`,
            });
          }

          animId = requestAnimationFrame(renderFrame);
        };

        animId = requestAnimationFrame(renderFrame);
      });

      const clipBlob = await recordPromise;
      const clipUrl = URL.createObjectURL(clipBlob);

      const textUsed = isOverlayEnabled && textLayers.length > 0 ? getAutoIncrementedText(textLayers[0], i) : 'None';

      generatedClips.push({
        index: i + 1,
        filename,
        blob: clipBlob,
        url: clipUrl,
        startTime: clipStart,
        endTime: clipEnd,
        duration: clipDurationSec,
        size: clipBlob.size,
        textOverlayUsed: textUsed,
      });
    }
  } finally {
    if (audioCtx) {
      audioCtx.close().catch(() => {});
    }
  }

  // Create final ZIP archive
  const zipFilename = `${prefix}All_Clips.zip`;
  const { zipBlob, totalSize } = await createClipsZipArchive(generatedClips);
  const totalProcessingTimeMs = Date.now() - startTimeMs;

  onProgress({
    isProcessing: false,
    isPaused: false,
    currentClipIndex: totalClips,
    totalClips,
    percentage: 100,
    currentClipFilename: zipFilename,
    estimatedSecondsRemaining: 0,
    statusMessage: 'Completed generating all clips!',
  });

  return {
    zipFilename,
    zipBlob,
    totalClips,
    totalSize,
    processingTimeMs: totalProcessingTimeMs,
    clips: generatedClips,
  };
}
