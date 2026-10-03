import { TextLayer, VideoMetadata } from '../types';

/**
 * Parses numeric sequences in a string and increments for clipIndex (0-based)
 * e.g., baseText "Part - 01", clipIndex 0 => "Part - 01"
 * e.g., baseText "Part - 01", clipIndex 1 => "Part - 02"
 * e.g., baseText "Episode 001", clipIndex 2 => "Episode 003"
 */
export function getAutoIncrementedText(
  layer: TextLayer,
  clipIndex: number // 0-based
): string {
  const baseText = layer.text;
  if (!layer.autoIncrement || !baseText) {
    return baseText;
  }

  const startNum = layer.startNumber !== undefined ? layer.startNumber : undefined;

  // Find all numeric groups in baseText
  const matches = Array.from(baseText.matchAll(/\d+/g));

  if (matches.length === 0) {
    // If no numbers in string, but start number is configured
    const startVal = (startNum ?? 1) + clipIndex;
    const pad = layer.paddingDigits ?? 2;
    const numStr = String(startVal).padStart(pad, '0');
    const prefix = layer.customPrefix ?? '';
    const suffix = layer.customSuffix ?? '';
    return `${baseText} ${prefix}${numStr}${suffix}`.trim();
  }

  // Use the last numeric match by default (e.g., "Part - 01" -> "01")
  const lastMatch = matches[matches.length - 1];
  const matchedStr = lastMatch[0];
  const matchIndex = lastMatch.index ?? 0;

  const originalStartVal = parseInt(matchedStr, 10);
  const baseStart = startNum !== undefined ? startNum : originalStartVal;
  const currentVal = baseStart + clipIndex;

  const paddingLength = layer.paddingDigits !== undefined ? layer.paddingDigits : matchedStr.length;
  const newNumStr = String(currentVal).padStart(paddingLength, '0');

  const before = baseText.substring(0, matchIndex);
  const after = baseText.substring(matchIndex + matchedStr.length);

  return `${before}${newNumStr}${after}`;
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format bytes to readable size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Extract video metadata and generate thumbnail
 */
export function extractVideoMetadata(file: File | Blob): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.playsInline = true;
    video.muted = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const fileName = file instanceof File ? file.name : 'sample_video.mp4';
    const fileSize = file.size;
    const fileType = file.type || 'video/mp4';

    video.onloadedmetadata = () => {
      const duration = video.duration || 0;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      // Seek to 1s or 10% duration for thumbnail
      const seekTime = Math.min(1.0, duration * 0.1);
      video.currentTime = seekTime;

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(width, 640);
          canvas.height = Math.round((canvas.width / width) * height);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve({
              file,
              name: fileName,
              size: fileSize,
              type: fileType,
              url: objectUrl,
              duration,
              width,
              height,
              thumbnailUrl,
            });
          } else {
            resolve({
              file,
              name: fileName,
              size: fileSize,
              type: fileType,
              url: objectUrl,
              duration,
              width,
              height,
              thumbnailUrl: '',
            });
          }
        } catch {
          resolve({
            file,
            name: fileName,
            size: fileSize,
            type: fileType,
            url: objectUrl,
            duration,
            width,
            height,
            thumbnailUrl: '',
          });
        }
      };
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata. Please ensure valid video format.'));
    };
  });
}

/**
 * Render text layer onto 2D canvas context with responsiveness and animation
 */
export function drawTextLayerOnCanvas(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  clipIndex: number,
  canvasWidth: number,
  canvasHeight: number,
  clipTimeProgress: number = 0.5 // 0 to 1 fraction inside clip for animations
) {
  const textToDraw = getAutoIncrementedText(layer, clipIndex);
  if (!textToDraw) return;

  ctx.save();

  // Reference scale relative to 1080p
  const scale = canvasWidth / 1080;
  const scaledFontSize = Math.max(12, layer.fontSize * scale);

  // Position calculation
  const x = (layer.xPercent / 100) * canvasWidth;
  const y = (layer.yPercent / 100) * canvasHeight;

  // Animation transforms
  let animOpacity = layer.opacity;
  let animScale = 1;
  let animOffsetY = 0;

  if (layer.animation === 'fade') {
    // Fade in over first 0.2s of clip
    animOpacity = layer.opacity * Math.min(1, clipTimeProgress * 4);
  } else if (layer.animation === 'slide') {
    // Slide up from bottom
    const progress = Math.min(1, clipTimeProgress * 4);
    animOffsetY = (1 - progress) * 40 * scale;
    animOpacity = layer.opacity * progress;
  } else if (layer.animation === 'zoom') {
    const progress = Math.min(1, clipTimeProgress * 4);
    animScale = 0.5 + progress * 0.5;
    animOpacity = layer.opacity * progress;
  } else if (layer.animation === 'pop') {
    const progress = Math.min(1, clipTimeProgress * 4);
    animScale = progress < 0.7 ? progress * 1.2 : 1 + (1 - progress) * 0.5;
    animOpacity = layer.opacity * Math.min(1, clipTimeProgress * 5);
  }

  ctx.globalAlpha = animOpacity;

  // Translate to position
  ctx.translate(x, y + animOffsetY);

  if (layer.rotation !== 0) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  if (animScale !== 1) {
    ctx.scale(animScale, animScale);
  }

  // Construct font string
  const fontStyle = layer.fontStyle === 'italic' ? 'italic ' : '';
  const fontWeight = layer.fontWeight === 'bold' ? 'bold ' : '';
  const fontFamily = layer.fontFamily || 'sans-serif';
  ctx.font = `${fontStyle}${fontWeight}${scaledFontSize}px ${fontFamily}`;
  ctx.textAlign = layer.textAlign;
  ctx.textBaseline = 'middle';

  // Measure text
  const metrics = ctx.measureText(textToDraw);
  const textWidth = metrics.width;
  const textHeight = scaledFontSize * 1.2;

  // Draw background box if specified
  if (layer.backgroundColor && layer.backgroundColor !== 'transparent') {
    const padding = (layer.bgPadding || 10) * scale;
    let bgX = -padding;
    if (layer.textAlign === 'center') {
      bgX = -textWidth / 2 - padding;
    } else if (layer.textAlign === 'right') {
      bgX = -textWidth - padding;
    }

    const bgY = -textHeight / 2 - padding / 2;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = textHeight + padding;

    ctx.fillStyle = layer.backgroundColor;
    // Rounded rect for bg
    const cornerRadius = Math.min(8 * scale, bgHeight / 4);
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(bgX, bgY, bgWidth, bgHeight, cornerRadius)
      : ctx.rect(bgX, bgY, bgWidth, bgHeight);
    ctx.fill();
  }

  // Shadow settings
  if (layer.shadowColor && layer.shadowColor !== 'transparent' && layer.shadowBlur > 0) {
    ctx.shadowColor = layer.shadowColor;
    ctx.shadowBlur = layer.shadowBlur * scale;
    ctx.shadowOffsetX = layer.shadowOffsetX * scale;
    ctx.shadowOffsetY = layer.shadowOffsetY * scale;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Stroke/Outline
  if (layer.strokeWidth > 0 && layer.strokeColor) {
    ctx.strokeStyle = layer.strokeColor;
    ctx.lineWidth = layer.strokeWidth * scale * 2;
    ctx.strokeText(textToDraw, 0, 0);
  }

  // Fill text
  ctx.fillStyle = layer.color || '#ffffff';
  ctx.fillText(textToDraw, 0, 0);

  ctx.restore();
}

/**
 * Creates a sample demo video file directly in the browser using HTML5 Canvas & MediaRecorder.
 * Generates a colorful 15-second 1080p sample video with audio, ideal for fast testing!
 */
export async function generateSampleDemoVideo(): Promise<File> {
  return new Promise((resolve, reject) => {
    const width = 1280;
    const height = 720;
    const fps = 30;
    const durationSec = 15;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject(new Error('Canvas 2D context not supported'));
    }

    // WebAudio synthetic tone generator
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();

    const canvasStream = canvas.captureStream(fps);
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
      ? 'video/mp4;codecs=avc1,mp4a.40.2'
      : MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : 'video/webm';

    const recorder = new MediaRecorder(combinedStream, { mimeType });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      osc.stop();
      audioCtx.close();
      const blob = new Blob(chunks, { type: mimeType.includes('mp4') ? 'video/mp4' : 'video/webm' });
      const filename = `Sample_15s_Demo.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`;
      const file = new File([blob], filename, { type: blob.type });
      resolve(file);
    };

    recorder.start();

    let frameCount = 0;
    const totalFrames = durationSec * fps;

    const renderLoop = () => {
      if (frameCount >= totalFrames) {
        recorder.stop();
        return;
      }

      const t = frameCount / fps;
      // Draw dynamic gradient background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      const hue1 = (t * 30) % 360;
      const hue2 = (hue1 + 120) % 360;
      grad.addColorStop(0, `hsl(${hue1}, 70%, 20%)`);
      grad.addColorStop(1, `hsl(${hue2}, 70%, 15%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animated pulsing graphics
      const circleR = 120 + Math.sin(t * 3) * 30;
      const circleX = width / 2 + Math.cos(t * 1.5) * 200;
      const circleY = height / 2 + Math.sin(t * 2) * 100;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(hue1 + 180) % 360}, 90%, 60%, 0.4)`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Audio waveform animation visualizer
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 20; i++) {
        const barH = 20 + Math.abs(Math.sin(t * 5 + i * 0.5)) * 100;
        ctx.fillRect(100 + i * 25, height - 120 - barH, 18, barH);
      }

      // Time code overlay
      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(`TIME: ${formatTime(t)} / ${formatTime(durationSec)}`, width - 50, 80);

      ctx.textAlign = 'left';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('⚡ DEMO VIDEO FOR CLIP GENERATOR', 50, 80);

      frameCount++;
      setTimeout(renderLoop, 1000 / fps);
    };

    renderLoop();
  });
}
