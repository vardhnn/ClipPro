import React from 'react';
import { Film, Moon, Sun, Sparkles, HelpCircle, RefreshCw, Cpu } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLoadSample: () => void;
  onOpenShortcuts: () => void;
  onReset: () => void;
  hasVideo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onLoadSample,
  onOpenShortcuts,
  onReset,
  hasVideo,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#222] bg-[#0f0f12]/95 backdrop-blur-md transition-colors h-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo and Brand Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold tracking-tight text-base text-white">
              CLIP<span className="text-blue-500">PRO</span>
            </h1>
            <span className="px-2 py-0.5 rounded bg-[#1a1a1f] border border-[#333] text-[10px] text-gray-400 font-mono uppercase tracking-widest">
              v2.4.0 Engine
            </span>
          </div>
        </div>

        {/* Center/Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161a] border border-[#222]">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase flex items-center gap-1">
            <Cpu className="w-3 h-3 text-emerald-400" /> GPU Acceleration Active
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a1f] hover:bg-[#25252b] border border-[#333] text-xs font-semibold text-gray-200 transition"
            title="Load 15s test sample video"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Try Sample Video</span>
          </button>

          {hasVideo && (
            <button
              onClick={onReset}
              type="button"
              className="p-1.5 rounded bg-[#1a1a1f] hover:bg-[#25252b] border border-[#333] text-gray-400 hover:text-white transition"
              title="Reset Project"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenShortcuts}
            type="button"
            className="p-1.5 rounded bg-[#1a1a1f] hover:bg-[#25252b] border border-[#333] text-gray-400 hover:text-white transition"
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            className="p-1.5 rounded bg-[#1a1a1f] hover:bg-[#25252b] border border-[#333] text-gray-400 hover:text-white transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};

