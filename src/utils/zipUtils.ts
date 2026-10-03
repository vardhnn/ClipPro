import JSZip from 'jszip';
import { GeneratedClip } from '../types';

export async function createClipsZipArchive(
  clips: GeneratedClip[]
): Promise<{ zipBlob: Blob; totalSize: number }> {
  const zip = new JSZip();

  let totalSize = 0;

  for (const clip of clips) {
    zip.file(clip.filename, clip.blob);
    totalSize += clip.size;
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'STORE', // Store without extra re-compression since MP4/WebM are already compressed
  });

  return {
    zipBlob,
    totalSize,
  };
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
