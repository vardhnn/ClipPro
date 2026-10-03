import React from 'react';
import { Pause, Play, XCircle, Film, AlertTriangle } from 'lucide-react';
import { ProcessingState } from '../types';
import { formatTime } from '../utils/videoUtils';

interface ProcessingModalProps {
  state: ProcessingState;
  onPauseToggle: () => void;
  onCancel: () => void;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  state,
  onPauseToggle,
  onCancel,
}) => {
  const [displayEstSeconds, setDisplayEstSeconds] = React.useState<number>(state.estimatedSecondsRemaining);

  // Sync state when new estimates arrive from parent processor
  React.useEffect(() => {
    setDisplayEstSeconds(state.estimatedSecondsRemaining);
  }, [state.estimatedSecondsRemaining, state.currentClipIndex]);

  // Continuously reduce estimated remaining time every second dynamically
  React.useEffect(() => {
    if (!state.isProcessing || state.isPaused || !!state.error) return;

    const timer = setInterval(() => {
      setDisplayEstSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.isProcessing, state.isPaused, state.error]);

  if (!state.isProcessing && !state.error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#16161a] border border-[#222] rounded p-6 shadow-2xl space-y-5">
        {/* Error View */}
        {state.error ? (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded bg-rose-950/40 border border-rose-800/50 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Processing Error</h3>
            <p className="text-xs text-rose-400 bg-rose-950/30 p-3 rounded border border-rose-900/40 font-mono">
              {state.error}
            </p>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-[#22222a] hover:bg-[#2c2c36] text-white font-semibold text-xs border border-[#333] transition"
            >
              Close & Retry
            </button>
          </div>
        ) : (
          /* Active Processing View */
          <div className="space-y-5 text-center">
            {/* Animated Processing Header */}
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
              <div className="w-12 h-12 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center">
                <Film className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Generating Clips & Overlays
              </h3>
              <p className="text-xs text-gray-400">
                {state.isPaused ? 'Processing Paused' : state.statusMessage}
              </p>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
                <span>
                  Clip {state.currentClipIndex} of {state.totalClips}
                </span>
                <span className="text-blue-400 text-sm">{state.percentage}%</span>
              </div>

              <div className="w-full h-2.5 bg-[#0d0d10] rounded-full overflow-hidden border border-[#333]">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${state.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                <span>File: {state.currentClipFilename}</span>
                <span>Est. Remaining: {formatTime(displayEstSeconds)}</span>
              </div>
            </div>

            {/* Control buttons: Pause / Resume & Cancel */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={onPauseToggle}
                type="button"
                className="px-3.5 py-1.5 rounded border border-[#333] bg-[#0d0d10] hover:bg-[#1a1a1f] text-gray-200 text-xs font-semibold transition flex items-center gap-1.5"
              >
                {state.isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                type="button"
                className="px-3.5 py-1.5 rounded bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border border-rose-900/50 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

