import React from 'react';
import { Scissors, Settings2, Layers, FileVideo } from 'lucide-react';
import { ClipConfig, PresetDuration, VideoMetadata } from '../types';
import { getClipDurationSeconds } from '../utils/clipProcessor';
import { formatTime } from '../utils/videoUtils';

interface ClipSettingsProps {
  videoMetadata: VideoMetadata | null;
  config: ClipConfig;
  onChangeConfig: (newConfig: ClipConfig) => void;
}

export const ClipSettings: React.FC<ClipSettingsProps> = ({
  videoMetadata,
  config,
  onChangeConfig,
}) => {
  const videoDurationSec = videoMetadata ? videoMetadata.duration : 600; // default 10m for preview

  const selectedDurationSec = getClipDurationSeconds(config);

  const calculatedTotalClips = Math.max(1, Math.ceil(videoDurationSec / selectedDurationSec));
  const padLength = Math.max(2, String(calculatedTotalClips).length);
  const prefix = config.filenamePrefix || 'Clip_';

  const handlePresetChange = (preset: PresetDuration) => {
    onChangeConfig({
      ...config,
      preset,
    });
  };

  return (
    <div className="bg-[#16161a] border border-[#222] rounded p-4 sm:p-5 shadow-sm transition space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Scissors className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Clip Duration & Export Settings</h3>
            <p className="text-xs text-gray-400">Choose how your video should be divided into clips</p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#0d0d10] border border-[#333] text-gray-300">
          Total Duration: {formatTime(videoDurationSec)}
        </span>
      </div>

      {/* Preset Duration Selector */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
          1. Select Clip Duration
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: '30s', label: '30 Seconds' },
            { id: '1m', label: '1 Minute' },
            { id: '2m', label: '2 Minutes' },
            { id: '3m', label: '3 Minutes' },
            { id: 'custom', label: 'Custom' },
          ].map((item) => {
            const isSelected = config.preset === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePresetChange(item.id as PresetDuration)}
                type="button"
                className={`px-3 py-2 rounded text-xs font-semibold transition flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                    : 'bg-[#0d0d10] text-gray-300 border-[#2b2b34] hover:bg-[#1f1f26]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Duration Input */}
        {config.preset === 'custom' && (
          <div className="pt-1 flex items-center gap-3">
            <label className="text-xs text-gray-400 font-medium">Custom Length (Seconds):</label>
            <input
              type="number"
              min={1}
              max={Math.ceil(videoDurationSec)}
              value={config.customDurationSeconds}
              onChange={(e) =>
                onChangeConfig({
                  ...config,
                  customDurationSeconds: Math.max(1, parseInt(e.target.value, 10) || 1),
                })
              }
              className="w-24 px-2.5 py-1 rounded border border-[#333] bg-[#0d0d10] text-xs font-mono font-semibold text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Output Filename Prefix & Quality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Filename Prefix */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <FileVideo className="w-3.5 h-3.5 text-blue-400" /> Output Filename Prefix
          </label>
          <input
            type="text"
            value={config.filenamePrefix}
            onChange={(e) =>
              onChangeConfig({
                ...config,
                filenamePrefix: e.target.value,
              })
            }
            placeholder="e.g. Clip_, Part_, Episode_"
            className="w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs font-mono text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Export Quality */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-blue-400" /> Render Quality
          </label>
          <select
            value={config.quality}
            onChange={(e) =>
              onChangeConfig({
                ...config,
                quality: e.target.value as ClipConfig['quality'],
              })
            }
            className="w-full px-3 py-1.5 rounded border border-[#333] bg-[#0d0d10] text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="original">Original Quality (100% Native)</option>
            <option value="high">High Quality (85% Resolution)</option>
            <option value="medium">Medium Quality (Fast Processing)</option>
            <option value="low">Low Quality (Smallest Size)</option>
          </select>
        </div>
      </div>

      {/* Output Calculation Card */}
      <div className="rounded bg-[#0d0d10] border border-[#222] p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-gray-300">
          <span className="flex items-center gap-1.5 font-mono text-gray-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Output Summary:
          </span>
          <span className="text-blue-400 font-mono font-bold">
            {calculatedTotalClips} {calculatedTotalClips === 1 ? 'Clip' : 'Clips'} Total
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400">Sample filenames:</span>
          <span className="font-mono text-gray-200 bg-[#1a1a1f] px-2 py-0.5 rounded border border-[#333]">
            {prefix}{String(1).padStart(padLength, '0')}.mp4
          </span>
          {calculatedTotalClips > 1 && (
            <>
              <span className="text-gray-500">…</span>
              <span className="font-mono text-gray-200 bg-[#1a1a1f] px-2 py-0.5 rounded border border-[#333]">
                {prefix}{String(calculatedTotalClips).padStart(padLength, '0')}.mp4
              </span>
            </>
          )}
        </div>

        <p className="text-[11px] text-gray-500 leading-normal">
          * Note: If the final remaining video segment is shorter than {formatTime(selectedDurationSec)}, it will be generated as the final clip instead of being discarded.
        </p>
      </div>
    </div>
  );
};

