import React from 'react';
import { Moon, Sun, HelpCircle, RefreshCw } from 'lucide-react';
import { Brand } from './Brand';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenShortcuts: () => void;
  onReset: () => void;
  hasVideo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenShortcuts,
  onReset,
  hasVideo,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#222] bg-[#0f0f12]/95 backdrop-blur-md transition-colors h-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
        {/* Logo and Brand Title */}
        <button type="button" onClick={onReset} className="cursor-pointer flex-shrink-0">
          <Brand version="v2.4.0 Engine" />
        </button>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
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