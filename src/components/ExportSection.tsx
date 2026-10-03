import React from 'react';
import { Download, CheckCircle, Film } from 'lucide-react';
import { ExportSummary, GeneratedClip } from '../types';
import { formatFileSize, formatTime } from '../utils/videoUtils';
import { triggerDownload } from '../utils/zipUtils';

interface ExportSectionProps {
  summary: ExportSummary;
  onReset: () => void;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ summary, onReset }) => {
  const handleDownloadZip = () => {
    triggerDownload(summary.zipBlob, summary.zipFilename);
  };

  const handleDownloadSingleClip = (clip: GeneratedClip) => {
    triggerDownload(clip.blob, clip.filename);
  };

  return (
    <div className="space-y-6">
      {/* Prominent ZIP Download Header Banner */}
      <div className="bg-[#16161a] border border-blue-600/40 text-white rounded p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Clips Ready for Download!</h2>
              <p className="text-xs text-gray-400">
                All {summary.totalClips} video clips have been processed & packaged into a downloadable ZIP archive.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download ZIP Archive ({formatFileSize(summary.totalSize)})
          </button>
        </div>

        {/* Processing Stats Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#222] text-xs font-mono">
          <div className="bg-[#0d0d10] rounded p-2.5 border border-[#222] space-y-0.5">
            <span className="text-gray-400 text-[10px] block">ZIP Filename</span>
            <span className="font-bold text-white truncate block">{summary.zipFilename}</span>
          </div>

          <div className="bg-[#0d0d10] rounded p-2.5 border border-[#222] space-y-0.5">
            <span className="text-gray-400 text-[10px] block">Total Clips</span>
            <span className="font-bold text-white block">{summary.totalClips} Clips</span>
          </div>

          <div className="bg-[#0d0d10] rounded p-2.5 border border-[#222] space-y-0.5">
            <span className="text-gray-400 text-[10px] block">Total Size</span>
            <span className="font-bold text-white block">{formatFileSize(summary.totalSize)}</span>
          </div>

          <div className="bg-[#0d0d10] rounded p-2.5 border border-[#222] space-y-0.5">
            <span className="text-gray-400 text-[10px] block">Processing Time</span>
            <span className="font-bold text-white block">{(summary.processingTimeMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Individual Generated Clips List / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-blue-400" /> Individual Clips Preview ({summary.clips.length})
          </h3>
          <span className="text-xs text-gray-400">Preview or download clips individually</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {summary.clips.map((clip) => (
            <div
              key={clip.index}
              className="bg-[#16161a] border border-[#222] rounded p-3 shadow-sm hover:border-blue-500/50 transition flex flex-col justify-between space-y-3"
            >
              {/* Card Video Player */}
              <div className="relative aspect-video rounded overflow-hidden bg-[#0d0d10] border border-[#222]">
                <video
                  src={clip.url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Clip Details */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold font-mono text-white">
                  <span className="truncate max-w-[180px]">{clip.filename}</span>
                  <span className="text-[10px] text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded">
                    {formatTime(clip.duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-400 font-mono text-[10px]">
                  <span>Interval: {formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
                  <span>{formatFileSize(clip.size)}</span>
                </div>

                {clip.textOverlayUsed && clip.textOverlayUsed !== 'None' && (
                  <div className="text-[10px] text-indigo-300 bg-indigo-950/40 border border-indigo-900/50 px-2 py-0.5 rounded font-mono truncate">
                    Overlay: "{clip.textOverlayUsed}"
                  </div>
                )}
              </div>

              {/* Single Clip Download Button */}
              <button
                onClick={() => handleDownloadSingleClip(clip)}
                type="button"
                className="w-full py-1.5 rounded bg-[#22222a] hover:bg-[#2c2c36] border border-[#333] text-gray-200 font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" /> Download MP4
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

