import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Video Preview' },
    { key: 'Ctrl + G', desc: 'Start Clip Generation' },
    { key: 'Ctrl + S', desc: 'Save Current Project Settings' },
    { key: 'Esc', desc: 'Close Modals or Cancel Processing' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#16161a] border border-[#222] rounded p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#22222a] text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded bg-[#0d0d10] border border-[#222] text-xs"
            >
              <span className="text-gray-300 font-medium">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#1a1a1f] border border-[#333] font-mono text-[10px] font-bold text-gray-200">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

