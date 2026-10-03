import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type,
  Plus,
  Move,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Sparkles,
  X,
  ChevronDown,
  Sliders,
  Play,
  Pause,
} from 'lucide-react';
import { TextLayer, VideoMetadata } from '../types';
import { drawTextLayerOnCanvas, getAutoIncrementedText, formatTime } from '../utils/videoUtils';

interface OverlayEditorProps {
  videoMetadata: VideoMetadata | null;
  textLayers: TextLayer[];
  onChangeLayers: (layers: TextLayer[]) => void;
  totalClipsCount: number;
  enableTextOverlay: boolean;
  onToggleEnableOverlay: (enabled: boolean) => void;
  clipDuration?: number;
}

export const OverlayEditor: React.FC<OverlayEditorProps> = ({
  videoMetadata,
  textLayers,
  onChangeLayers,
  totalClipsCount,
  enableTextOverlay,
  onToggleEnableOverlay,
  clipDuration = 60,
}) => {
  const [activeLayerId, setActiveLayerId] = useState<string | null>(
    textLayers.length > 0 ? textLayers[0].id : null
  );
  const [previewClipIndex, setPreviewClipIndex] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [isFontOptionsOpen, setIsFontOptionsOpen] = useState<boolean>(false);
  const [currentClipProgress, setCurrentClipProgress] = useState<number>(0); // 0 to 1 inside current clip

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeLayer = textLayers.find((l) => l.id === activeLayerId) || textLayers[0];

  const fontFamilies = [
    { label: 'Sans-Serif', value: 'sans-serif' },
    { label: 'Bebas Neue', value: 'Bebas Neue, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
    { label: 'Oswald', value: 'Oswald, sans-serif' },
    { label: 'Pacifico', value: 'Pacifico, cursive' },
    { label: 'Monospace', value: 'monospace' },
  ];

  const colorSwatches = ['#ffffff', '#facc15', '#4ade80', '#38bdf8', '#f43f5e', '#a855f7', '#000000'];

  // Master frame rendering function onto canvas
  const drawCanvasFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = videoRef.current;
    const width = videoMetadata?.width || (video ? video.videoWidth : 1280) || 1280;
    const height = videoMetadata?.height || (video ? video.videoHeight : 720) || 720;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    if (video && video.readyState >= 2) {
      try {
        ctx.drawImage(video, 0, 0, width, height);
      } catch {
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#33333f';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading Video Frame...', width / 2, height / 2);
    }

    if (enableTextOverlay) {
      const clipStart = previewClipIndex * clipDuration;
      const currentVideoTime = video ? video.currentTime : clipStart;
      const progressInClip = Math.max(0, Math.min(1, (currentVideoTime - clipStart) / clipDuration));

      for (const layer of textLayers) {
        drawTextLayerOnCanvas(ctx, layer, previewClipIndex, width, height, progressInClip);
      }
    }
  }, [videoMetadata, enableTextOverlay, textLayers, previewClipIndex, clipDuration]);

  // When preview clip index or clip duration changes, seek video to clip start
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const targetTime = previewClipIndex * clipDuration;
    if (Math.abs(video.currentTime - targetTime) > 0.3) {
      video.currentTime = targetTime;
    } else {
      drawCanvasFrame();
    }
  }, [previewClipIndex, clipDuration, videoMetadata, drawCanvasFrame]);

  // Handle animation playback loop when previewing clip in real time
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      const video = videoRef.current;
      const clipStart = previewClipIndex * clipDuration;
      const clipEnd = clipStart + clipDuration;

      if (video) {
        if (video.currentTime >= clipEnd || video.ended) {
          video.currentTime = clipStart;
        }
        if (isPlayingPreview && video.paused) {
          video.play().catch(() => {});
        }

        const prog = Math.max(0, Math.min(1, (video.currentTime - clipStart) / clipDuration));
        setCurrentClipProgress(prog);
      }

      drawCanvasFrame();

      if (isPlayingPreview) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    if (isPlayingPreview) {
      renderLoop();
    } else {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
      drawCanvasFrame();
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlayingPreview, previewClipIndex, clipDuration, drawCanvasFrame]);

  // Scrubbing handler inside active clip
  const handleScrubClip = (progressFraction: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clipStart = previewClipIndex * clipDuration;
    const targetTime = clipStart + progressFraction * clipDuration;
    video.currentTime = Math.min(video.duration || targetTime, Math.max(0, targetTime));
    setCurrentClipProgress(progressFraction);
    drawCanvasFrame();
  };

  const handleAddLayer = () => {
    const newId = `layer_${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      text: `Part - 01`,
      xPercent: 50,
      yPercent: 85,
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: 54,
      color: '#ffffff',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'center',
      strokeColor: '#000000',
      strokeWidth: 3,
      shadowColor: 'rgba(0,0,0,0.8)',
      shadowBlur: 8,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      opacity: 1.0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      bgPadding: 12,
      letterSpacing: 1,
      rotation: 0,
      animation: 'fade',
      autoIncrement: true,
      startNumber: 1,
      paddingDigits: 2,
    };

    onChangeLayers([...textLayers, newLayer]);
    setActiveLayerId(newId);
  };

  const handleRemoveLayer = (id: string) => {
    const updated = textLayers.filter((l) => l.id !== id);
    onChangeLayers(updated);
    if (activeLayerId === id) {
      setActiveLayerId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const updateActiveLayer = (updates: Partial<TextLayer>) => {
    if (!activeLayer) return;
    const updated = textLayers.map((l) => (l.id === activeLayer.id ? { ...l, ...updates } : l));
    onChangeLayers(updated);
  };

  // Dragging handlers for direct manual coordinate placement on preview canvas
  const updatePositionFromPointer = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!activeLayer || !enableTextOverlay) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const xPx = clientX - rect.left;
    const yPx = clientY - rect.top;

    const xPercent = Math.max(0, Math.min(100, Math.round((xPx / rect.width) * 100)));
    const yPercent = Math.max(0, Math.min(100, Math.round((yPx / rect.height) * 100)));

    updateActiveLayer({ xPercent, yPercent });
  };

  // Render preview canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = videoMetadata?.width || 1280;
    const height = videoMetadata?.height || 720;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#22222a';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Video Preview Frame', width / 2, height / 2);
    }

    if (enableTextOverlay) {
      for (const layer of textLayers) {
        drawTextLayerOnCanvas(ctx, layer, previewClipIndex, width, height, 0.5);
      }
    }
  }, [textLayers, previewClipIndex, videoMetadata, activeLayer, enableTextOverlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = videoMetadata?.width || 1280;
      const height = videoMetadata?.height || 720;
      ctx.drawImage(video, 0, 0, width, height);

      if (enableTextOverlay) {
        const progressInClip = (video.currentTime % 30) / 30;
        for (const layer of textLayers) {
          drawTextLayerOnCanvas(ctx, layer, previewClipIndex, width, height, progressInClip);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [textLayers, previewClipIndex, videoMetadata, enableTextOverlay]);

  return (
    <div className="bg-[#16161a] border border-[#222] rounded p-4 sm:p-5 shadow-sm transition space-y-5">
      {/* Top Banner: Master Toggle for Optional Text Overlay */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0d0d10] border border-[#222] p-3.5 rounded">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${enableTextOverlay ? 'bg-blue-950/60 border border-blue-800/50 text-blue-400' : 'bg-gray-900 border border-gray-800 text-gray-500'}`}>
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Enable Text Overlay Feature</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${enableTextOverlay ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 'bg-gray-900 text-gray-400 border border-gray-800'}`}>
                {enableTextOverlay ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {enableTextOverlay
                ? 'Text overlays and auto-increment numbers will be rendered onto every clip'
                : 'Text overlays are disabled. Video clips will be split cleanly without text'}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            checked={enableTextOverlay}
            onChange={(e) => onToggleEnableOverlay(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {enableTextOverlay ? (
        <>
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white">Smart Overlay Editor</h3>
              <span className="text-[10px] text-gray-400 font-mono">
                ({textLayers.length} Layer{textLayers.length > 1 ? 's' : ''})
              </span>
            </div>

            {/* Clip Preview Switcher */}
            <div className="flex items-center gap-2 bg-[#0d0d10] border border-[#222] px-2.5 py-1 rounded text-xs font-mono">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-gray-400">Previewing:</span>
              <select
                value={previewClipIndex}
                onChange={(e) => setPreviewClipIndex(parseInt(e.target.value, 10))}
                className="bg-[#16161a] text-white px-2 py-0.5 rounded border border-[#333] text-xs font-mono font-bold focus:outline-none"
              >
                {Array.from({ length: Math.min(totalClipsCount, 20) }).map((_, idx) => {
                  const numStr = String(idx + 1).padStart(2, '0');
                  return (
                    <option key={idx} value={idx}>
                      Clip #{numStr} {activeLayer ? `(${getAutoIncrementedText(activeLayer, idx)})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Interactive Canvas Preview with Drag & Quick Position Controls */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-video rounded overflow-hidden bg-[#0d0d10] border border-[#222] shadow-inner group">
                <video
                  ref={videoRef}
                  src={videoMetadata?.url}
                  crossOrigin="anonymous"
                  playsInline
                  muted
                  preload="auto"
                  onLoadedData={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = previewClipIndex * clipDuration;
                    }
                    drawCanvasFrame();
                  }}
                  onSeeked={() => {
                    drawCanvasFrame();
                  }}
                  onTimeUpdate={() => {
                    if (!isPlayingPreview) {
                      drawCanvasFrame();
                    }
                  }}
                  className="fixed pointer-events-none opacity-0 -z-50 w-1 h-1"
                />

                <canvas
                  ref={canvasRef}
                  onMouseDown={(e) => {
                    setIsDraggingCanvas(true);
                    updatePositionFromPointer(e);
                  }}
                  onMouseMove={(e) => {
                    if (isDraggingCanvas) updatePositionFromPointer(e);
                  }}
                  onMouseUp={() => setIsDraggingCanvas(false)}
                  onMouseLeave={() => setIsDraggingCanvas(false)}
                  onTouchStart={(e) => {
                    setIsDraggingCanvas(true);
                    updatePositionFromPointer(e);
                  }}
                  onTouchMove={(e) => {
                    if (isDraggingCanvas) updatePositionFromPointer(e);
                  }}
                  onTouchEnd={() => setIsDraggingCanvas(false)}
                  className="w-full h-full object-contain cursor-move"
                />

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-gray-300 text-[10px] font-mono border border-white/10 pointer-events-none flex items-center gap-1">
                  <Move className="w-3 h-3 text-blue-400" />
                  Drag text directly on preview
                </div>

                {/* Live Play / Pause Overlay */}
                <button
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  type="button"
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 hover:bg-black text-white text-[11px] font-mono transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  {isPlayingPreview ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-400 fill-amber-400" /> Pause Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-blue-400 fill-blue-400" /> Play Preview
                    </>
                  )}
                </button>
              </div>

              {/* Clip Scrubber & Time Bar */}
              <div className="p-2.5 rounded bg-[#0d0d10] border border-[#222] flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  type="button"
                  className="p-1.5 rounded bg-[#1f1f26] hover:bg-[#2b2b36] text-white border border-[#333] transition flex-shrink-0"
                  title={isPlayingPreview ? 'Pause' : 'Play'}
                >
                  {isPlayingPreview ? (
                    <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span>Clip #{String(previewClipIndex + 1).padStart(2, '0')} Timeline</span>
                    <span>
                      {formatTime(currentClipProgress * clipDuration)} / {formatTime(clipDuration)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={currentClipProgress}
                    onChange={(e) => handleScrubClip(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-[#222] rounded overflow-hidden"
                  />
                </div>
              </div>

              {/* MANUAL POSITIONING & COORDINATES INPUTS */}
              {activeLayer && (
                <div className="p-3 rounded bg-[#0d0d10] border border-[#222] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-gray-300 font-bold flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-blue-400" /> Manual Coordinates Positioning
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateActiveLayer({ xPercent: 50, yPercent: 15 })}
                        className="px-2 py-0.5 rounded bg-[#1f1f26] border border-[#333] text-gray-300 hover:text-white text-[11px] font-mono"
                      >
                        Top Preset
                      </button>
                      <button
                        onClick={() => updateActiveLayer({ xPercent: 50, yPercent: 50 })}
                        className="px-2 py-0.5 rounded bg-[#1f1f26] border border-[#333] text-gray-300 hover:text-white text-[11px] font-mono"
                      >
                        Center Preset
                      </button>
                      <button
                        onClick={() => updateActiveLayer({ xPercent: 50, yPercent: 85 })}
                        className="px-2 py-0.5 rounded bg-[#1f1f26] border border-[#333] text-gray-300 hover:text-white text-[11px] font-mono"
                      >
                        Bottom Preset
                      </button>
                    </div>
                  </div>

                  {/* Fine Manual X / Y Sliders & Inputs */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#222]">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>X Coordinate (Horizontal)</span>
                        <span className="text-blue-400 font-bold">{activeLayer.xPercent}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={activeLayer.xPercent}
                          onChange={(e) => updateActiveLayer({ xPercent: parseInt(e.target.value, 10) || 0 })}
                          className="w-full accent-blue-500"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={activeLayer.xPercent}
                          onChange={(e) =>
                            updateActiveLayer({
                              xPercent: Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)),
                            })
                          }
                          className="w-12 px-1 py-0.5 rounded bg-[#16161a] border border-[#333] text-center font-mono text-xs font-bold text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span>Y Coordinate (Vertical)</span>
                        <span className="text-blue-400 font-bold">{activeLayer.yPercent}%</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={activeLayer.yPercent}
                          onChange={(e) => updateActiveLayer({ yPercent: parseInt(e.target.value, 10) || 0 })}
                          className="w-full accent-blue-500"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={activeLayer.yPercent}
                          onChange={(e) =>
                            updateActiveLayer({
                              yPercent: Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)),
                            })
                          }
                          className="w-12 px-1 py-0.5 rounded bg-[#16161a] border border-[#333] text-center font-mono text-xs font-bold text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Text Content, Auto-Increment & Hidden Font Styling Accordion Dropdown */}
            <div className="lg:col-span-5 space-y-3.5">
              {/* Layer Tabs Header */}
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  Layers ({textLayers.length})
                </label>
                <button
                  onClick={handleAddLayer}
                  type="button"
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" /> Add Text
                </button>
              </div>

              {/* Layer selection tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {textLayers.map((layer, idx) => {
                  const isSelected = layer.id === activeLayerId;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayerId(layer.id)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-semibold cursor-pointer transition flex items-center gap-1.5 flex-shrink-0 border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-[#0d0d10] text-gray-300 border-[#2b2b34]'
                      }`}
                    >
                      <span>Text #{idx + 1}</span>
                      {textLayers.length > 1 && (
                        <X
                          className="w-3 h-3 hover:text-rose-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLayer(layer.id);
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {activeLayer && (
                <div className="space-y-3">
                  {/* Text Content Input */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-gray-400">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={activeLayer.text}
                      onChange={(e) => updateActiveLayer({ text: e.target.value })}
                      placeholder="e.g. Part - 01, Episode 001"
                      className="w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* AUTO INCREMENT SETTINGS CARD */}
                  <div className="rounded p-3 bg-[#0d0d10] border border-[#222] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <h4 className="text-xs font-bold text-white">Auto Increment Text</h4>
                          <p className="text-[10px] text-gray-400">
                            Increment numbers for every generated clip
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeLayer.autoIncrement}
                        onChange={(e) => updateActiveLayer({ autoIncrement: e.target.checked })}
                        className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
                      />
                    </div>

                    {activeLayer.autoIncrement && (
                      <div className="pt-2 border-t border-[#222] grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-gray-400">Start Number</label>
                          <input
                            type="number"
                            min={0}
                            value={activeLayer.startNumber ?? 1}
                            onChange={(e) => updateActiveLayer({ startNumber: parseInt(e.target.value, 10) || 0 })}
                            className="w-full px-2 py-1 rounded bg-[#16161a] border border-[#333] font-mono text-xs font-semibold text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-400">Padding Digits</label>
                          <select
                            value={activeLayer.paddingDigits ?? 2}
                            onChange={(e) => updateActiveLayer({ paddingDigits: parseInt(e.target.value, 10) })}
                            className="w-full px-2 py-1 rounded bg-[#16161a] border border-[#333] font-mono text-xs font-semibold text-white"
                          >
                            <option value={1}>1 (1, 2, 3)</option>
                            <option value={2}>2 (01, 02, 03)</option>
                            <option value={3}>3 (001, 002, 003)</option>
                            <option value={4}>4 (0001, 0002)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* HIDDEN DROPDOWN ACCORDION MENU FOR FONT DESIGNING */}
                  <div className="border border-[#222] rounded overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsFontOptionsOpen(!isFontOptionsOpen)}
                      className="w-full px-3 py-2 bg-[#0d0d10] hover:bg-[#1f1f28] text-xs font-bold text-gray-200 flex items-center justify-between transition focus:outline-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-400" />
                        Advanced Font & Style Options
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isFontOptionsOpen ? 'rotate-180 text-blue-400' : ''
                        }`}
                      />
                    </button>

                    {isFontOptionsOpen && (
                      <div className="p-3 bg-[#16161a] border-t border-[#222] space-y-3.5 text-xs">
                        {/* Typography Options */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Font Family */}
                          <div>
                            <label className="text-[10px] font-mono text-gray-400">Font Family</label>
                            <select
                              value={activeLayer.fontFamily}
                              onChange={(e) => updateActiveLayer({ fontFamily: e.target.value })}
                              className="w-full px-2 py-1 rounded border border-[#333] bg-[#0d0d10] text-xs font-semibold text-white"
                            >
                              {fontFamilies.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Font Size */}
                          <div>
                            <label className="text-[10px] font-mono text-gray-400">
                              Font Size ({activeLayer.fontSize}px)
                            </label>
                            <input
                              type="range"
                              min={18}
                              max={120}
                              value={activeLayer.fontSize}
                              onChange={(e) => updateActiveLayer({ fontSize: parseInt(e.target.value, 10) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                        </div>

                        {/* Color & Style Controls */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400">Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeLayer.color}
                              onChange={(e) => updateActiveLayer({ color: e.target.value })}
                              className="w-7 h-7 rounded border border-[#333] cursor-pointer p-0 bg-transparent"
                            />
                            <div className="flex items-center gap-1.5">
                              {colorSwatches.map((hex) => (
                                <button
                                  key={hex}
                                  type="button"
                                  onClick={() => updateActiveLayer({ color: hex })}
                                  style={{ backgroundColor: hex }}
                                  className="w-4 h-4 rounded-full border border-[#444] shadow-sm transition hover:scale-110"
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Formatting buttons */}
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-[#0d0d10] border border-[#222]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveLayer({
                                  fontWeight: activeLayer.fontWeight === 'bold' ? 'normal' : 'bold',
                                })
                              }
                              className={`p-1 rounded ${
                                activeLayer.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'hover:bg-[#1a1a1f] text-gray-400'
                              }`}
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveLayer({
                                  fontStyle: activeLayer.fontStyle === 'italic' ? 'normal' : 'italic',
                                })
                              }
                              className={`p-1 rounded ${
                                activeLayer.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'hover:bg-[#1a1a1f] text-gray-400'
                              }`}
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Alignment */}
                          <div className="flex items-center gap-1">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <button
                                key={align}
                                type="button"
                                onClick={() => updateActiveLayer({ textAlign: align })}
                                className={`p-1 rounded ${
                                  activeLayer.textAlign === align ? 'bg-blue-600 text-white' : 'hover:bg-[#1a1a1f] text-gray-400'
                                }`}
                              >
                                {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                                {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                                {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Background Box & Animation */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400">Background Box</label>
                            <select
                              value={activeLayer.backgroundColor}
                              onChange={(e) => updateActiveLayer({ backgroundColor: e.target.value })}
                              className="w-full px-2 py-1 rounded border border-[#333] bg-[#0d0d10] text-xs font-semibold text-white"
                            >
                              <option value="transparent">None (Transparent)</option>
                              <option value="rgba(0,0,0,0.6)">Black (60% Fade)</option>
                              <option value="rgba(0,0,0,0.9)">Solid Black</option>
                              <option value="rgba(255,255,255,0.85)">White Box</option>
                              <option value="rgba(14,165,233,0.85)">Blue Box</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-gray-400">
                              Text Animation
                            </label>
                            <select
                              value={activeLayer.animation}
                              onChange={(e) => updateActiveLayer({ animation: e.target.value as TextLayer['animation'] })}
                              className="w-full px-2 py-1 rounded border border-[#333] bg-[#0d0d10] text-xs font-semibold text-white"
                            >
                              <option value="none">Static (No Anim)</option>
                              <option value="fade">Fade In</option>
                              <option value="slide">Slide Up</option>
                              <option value="zoom">Zoom In</option>
                              <option value="pop">Pop Bounce</option>
                            </select>
                          </div>
                        </div>

                        {/* Stroke / Outline Width & Color */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-gray-400">
                              Outline Width ({activeLayer.strokeWidth}px)
                            </label>
                            <input
                              type="range"
                              min={0}
                              max={10}
                              value={activeLayer.strokeWidth}
                              onChange={(e) => updateActiveLayer({ strokeWidth: parseInt(e.target.value, 10) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-400">Outline Color</label>
                            <input
                              type="color"
                              value={activeLayer.strokeColor || '#000000'}
                              onChange={(e) => updateActiveLayer({ strokeColor: e.target.value })}
                              className="w-full h-6 rounded border border-[#333] cursor-pointer p-0 bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Disabled Text Overlay Placeholder State */
        <div className="p-6 rounded bg-[#0d0d10] border border-[#222] text-center space-y-2">
          <Type className="w-8 h-8 text-gray-600 mx-auto opacity-50" />
          <h4 className="text-xs font-bold text-gray-300">Text Overlay Feature Disabled</h4>
          <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
            Your video clips will be generated cleanly without any text overlays or sequential numbers. Toggle ON above if you want to add text overlays.
          </p>
        </div>
      )}
    </div>
  );
};
