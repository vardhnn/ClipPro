import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { VideoUploader } from './components/VideoUploader';
import { ClipSettings } from './components/ClipSettings';
import { OverlayEditor } from './components/OverlayEditor';
import { ProcessingModal } from './components/ProcessingModal';
import { ExportSection } from './components/ExportSection';
import { ShortcutsModal } from './components/ShortcutsModal';

import { ClipConfig, ExportSummary, ProcessingState, TextLayer, VideoMetadata } from './types';
import { extractVideoMetadata } from './utils/videoUtils';
import { getClipDurationSeconds, processVideoClips } from './utils/clipProcessor';
import { Film } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);

  // Clip Config State
  const [clipConfig, setClipConfig] = useState<ClipConfig>({
    preset: '1m',
    customDurationSeconds: 60,
    filenamePrefix: 'Clip_',
    quality: 'original',
    enableTextOverlay: true,
  });

  // Text Layers State
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: 'layer_default',
      text: 'Part - 01',
      xPercent: 50,
      yPercent: 85,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 52,
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
      backgroundColor: 'rgba(0,0,0,0.6)',
      bgPadding: 12,
      letterSpacing: 1,
      rotation: 0,
      animation: 'fade',
      autoIncrement: true,
      startNumber: 1,
      paddingDigits: 2,
    },
  ]);

  // Processing & Export State
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    isPaused: false,
    currentClipIndex: 0,
    totalClips: 0,
    percentage: 0,
    currentClipFilename: '',
    estimatedSecondsRemaining: 0,
    statusMessage: '',
  });

  const [exportSummary, setExportSummary] = useState<ExportSummary | null>(null);

  // Cancel & Pause Controls Refs
  const cancelProcessingRef = useRef<boolean>(false);
  const pauseProcessingRef = useRef<boolean>(false);

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Select video handler
  const handleVideoSelect = async (file: File | Blob) => {
    setIsLoadingMetadata(true);
    try {
      const meta = await extractVideoMetadata(file);
      setVideoMetadata(meta);
      setExportSummary(null);
    } catch (err) {
      alert((err as Error).message || 'Failed to load video file.');
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  // Reset project handler
  const handleReset = () => {
    setVideoMetadata(null);
    setExportSummary(null);
    setProcessingState({
      isProcessing: false,
      isPaused: false,
      currentClipIndex: 0,
      totalClips: 0,
      percentage: 0,
      currentClipFilename: '',
      estimatedSecondsRemaining: 0,
      statusMessage: '',
    });
  };

  // Start clip generation
  const handleGenerateClips = async () => {
    if (!videoMetadata) return;

    cancelProcessingRef.current = false;
    pauseProcessingRef.current = false;

    setProcessingState({
      isProcessing: true,
      isPaused: false,
      currentClipIndex: 1,
      totalClips: 1,
      percentage: 0,
      currentClipFilename: '',
      estimatedSecondsRemaining: 0,
      statusMessage: 'Preparing video render pipeline...',
    });

    try {
      const summary = await processVideoClips({
        videoMetadata,
        clipConfig,
        textLayers,
        onProgress: (state) => {
          setProcessingState(state);
        },
        checkIsPausedOrCancelled: () => ({
          isPaused: pauseProcessingRef.current,
          isCancelled: cancelProcessingRef.current,
        }),
      });

      setExportSummary(summary);
    } catch (err) {
      if ((err as Error).message !== 'Processing cancelled by user.') {
        setProcessingState((prev) => ({
          ...prev,
          isProcessing: false,
          error: (err as Error).message || 'An error occurred during clip rendering.',
        }));
      } else {
        setProcessingState({
          isProcessing: false,
          isPaused: false,
          currentClipIndex: 0,
          totalClips: 0,
          percentage: 0,
          currentClipFilename: '',
          estimatedSecondsRemaining: 0,
          statusMessage: '',
        });
      }
    }
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (videoMetadata && !processingState.isProcessing) {
          handleGenerateClips();
        }
      } else if (e.key === 'Escape') {
        if (processingState.isProcessing) {
          cancelProcessingRef.current = true;
        }
        setShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoMetadata, processingState.isProcessing, clipConfig, textLayers]);

  const durationPerClip = getClipDurationSeconds(clipConfig);

  const totalClipsCalculated = videoMetadata
    ? Math.max(1, Math.ceil(videoMetadata.duration / durationPerClip))
    : 1;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans antialiased transition-colors duration-200 flex flex-col bg-grid-pattern">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onReset={handleReset}
        hasVideo={!!videoMetadata}
      />

      {/* Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step Indicator Workflow Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          <div
            className={`p-3 rounded border transition flex items-center gap-3 ${
              videoMetadata
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                : 'bg-blue-950/40 border-blue-800/50 text-blue-400'
            }`}
          >
            <div className="w-6 h-6 rounded bg-current/20 flex items-center justify-center font-bold text-xs">1</div>
            <div>
              <p className="font-bold uppercase tracking-wider">1. Upload Video</p>
              <p className="text-[10px] opacity-80">{videoMetadata ? 'Video loaded' : 'Select MP4/WebM file'}</p>
            </div>
          </div>

          <div
            className={`p-3 rounded border transition flex items-center gap-3 ${
              videoMetadata
                ? 'bg-blue-950/40 border-blue-800/50 text-blue-400'
                : 'bg-[#16161a] border-[#222] text-gray-500'
            }`}
          >
            <div className="w-6 h-6 rounded bg-current/20 flex items-center justify-center font-bold text-xs">2</div>
            <div>
              <p className="font-bold uppercase tracking-wider">2. Clip & Overlay</p>
              <p className="text-[10px] opacity-80">Duration & auto-increment text</p>
            </div>
          </div>

          <div
            className={`p-3 rounded border transition flex items-center gap-3 ${
              exportSummary
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                : 'bg-[#16161a] border-[#222] text-gray-500'
            }`}
          >
            <div className="w-6 h-6 rounded bg-current/20 flex items-center justify-center font-bold text-xs">3</div>
            <div>
              <p className="font-bold uppercase tracking-wider">3. Export ZIP</p>
              <p className="text-[10px] opacity-80">{exportSummary ? 'Ready for download' : 'Package clips in ZIP'}</p>
            </div>
          </div>
        </div>

        {/* Export Section if Clips Generated */}
        {exportSummary ? (
          <ExportSection summary={exportSummary} onReset={handleReset} />
        ) : (
          /* Editor Workflow */
          <div className="space-y-6">
            {/* 1. Video Upload Section */}
            <VideoUploader
              videoMetadata={videoMetadata}
              onVideoSelect={handleVideoSelect}
              isLoading={isLoadingMetadata}
              onClearVideo={handleReset}
            />

            {videoMetadata && (
              <>
                {/* 2. Clip Settings Component */}
                <ClipSettings
                  videoMetadata={videoMetadata}
                  config={clipConfig}
                  onChangeConfig={setClipConfig}
                />

                {/* 3. Text Overlay & Auto Increment Editor */}
                <OverlayEditor
                  videoMetadata={videoMetadata}
                  textLayers={textLayers}
                  onChangeLayers={setTextLayers}
                  totalClipsCount={totalClipsCalculated}
                  enableTextOverlay={clipConfig.enableTextOverlay !== false}
                  onToggleEnableOverlay={(enabled) =>
                    setClipConfig((prev) => ({ ...prev, enableTextOverlay: enabled }))
                  }
                  clipDuration={durationPerClip}
                />

                {/* Generate Clips Big CTA Button */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleGenerateClips}
                    type="button"
                    disabled={processingState.isProcessing}
                    className="w-full sm:w-auto px-8 py-3.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Film className="w-4 h-4" />
                    Generate {totalClipsCalculated} Video {totalClipsCalculated === 1 ? 'Clip' : 'Clips'} & Download ZIP
                    <span className="text-[10px] font-mono font-semibold bg-black/30 border border-white/10 px-2 py-0.5 rounded">
                      Ctrl + G
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Processing Modal Overlay */}
      <ProcessingModal
        state={processingState}
        onPauseToggle={() => {
          pauseProcessingRef.current = !pauseProcessingRef.current;
          setProcessingState((prev) => ({ ...prev, isPaused: pauseProcessingRef.current }));
        }}
        onCancel={() => {
          cancelProcessingRef.current = true;
          setProcessingState({
            isProcessing: false,
            isPaused: false,
            currentClipIndex: 0,
            totalClips: 0,
            percentage: 0,
            currentClipFilename: '',
            estimatedSecondsRemaining: 0,
            statusMessage: '',
          });
        }}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#222] py-4 bg-[#0d0d10] text-center text-xs text-gray-400 font-mono">
        <p>© 2026 CLIPPRO Engine — Automatic Video Clip Splitter & Sequential Overlay Engine</p>
      </footer>
    </div>
  );
}

