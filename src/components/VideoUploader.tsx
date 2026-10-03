import React, { useState, useRef } from 'react';
import { Upload, Video, Film, X, Clock, Maximize2, HardDrive, CheckCircle2 } from 'lucide-react';
import { VideoMetadata } from '../types';
import { formatFileSize, formatTime } from '../utils/videoUtils';

interface VideoUploaderProps {
  videoMetadata: VideoMetadata | null;
  onVideoSelect: (file: File | Blob) => void;
  isLoading: boolean;
  onClearVideo: () => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  videoMetadata,
  onVideoSelect,
  isLoading,
  onClearVideo,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || /\.(mp4|mov|mkv|avi|webm)$/i.test(file.name)) {
        onVideoSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onVideoSelect(e.target.files[0]);
    }
  };

  if (videoMetadata) {
    return (
      <div className="bg-[#16161a] border border-[#222] rounded p-4 shadow-sm transition">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Thumbnail & Video Info */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-24 h-16 rounded overflow-hidden bg-[#0d0d10] border border-[#333] flex-shrink-0 group">
              {videoMetadata.thumbnailUrl ? (
                <img
                  src={videoMetadata.thumbnailUrl}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Video className="w-6 h-6" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Film className="w-5 h-5 text-white/90" />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-[240px] sm:max-w-md font-mono">
                  {videoMetadata.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50 uppercase">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {formatTime(videoMetadata.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                  {videoMetadata.width} × {videoMetadata.height}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                  {formatFileSize(videoMetadata.size)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="px-3 py-1.5 rounded text-xs font-semibold text-gray-200 bg-[#22222a] hover:bg-[#2c2c36] border border-[#333] transition"
            >
              Change Video
            </button>
            <button
              onClick={onClearVideo}
              type="button"
              className="p-1.5 rounded text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition"
              title="Remove Video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,.mp4,.mov,.mkv,.avi,.webm"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="bg-[#16161a] border border-[#222] rounded p-5 shadow-sm transition">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.mp4,.mov,.mkv,.avi,.webm"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-[#333] hover:border-blue-500/60 bg-[#0d0d10]'
        }`}
      >
        <div className="w-12 h-12 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Drag & drop video file, or <span className="text-blue-400 underline decoration-1">browse file</span>
          </h3>
          <p className="text-xs text-gray-400">
            Supports MP4, MOV, MKV, AVI, WebM and other common video formats
          </p>
        </div>

        {/* Formats badges */}
        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
          {['MP4', 'MOV', 'MKV', 'AVI', 'WebM'].map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] font-mono uppercase font-semibold text-gray-400 bg-[#1a1a1f] border border-[#2e2e38] px-2 py-0.5 rounded"
            >
              {fmt}
            </span>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="mt-3 rounded bg-[#0d0d10] border border-[#222] p-3 text-center text-xs text-gray-400 font-mono">
          Reading video metadata...
        </p>
      )}
    </div>
  );
};

