import { Film } from 'lucide-react';

/**
 * The CLIPPRO wordmark. Shared by the app header and the landing page so the
 * two can never render the brand differently.
 */
export function Brand({
  version,
  className = '',
}: {
  version?: string;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 flex-shrink-0">
        <Film className="w-4 h-4" />
      </span>
      <span className="flex items-center gap-2">
        <span className="font-bold tracking-tight text-base text-white">
          CLIP<span className="text-blue-500">PRO</span>
        </span>
        {version && (
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-[#1a1a1f] border border-[#333] text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            {version}
          </span>
        )}
      </span>
    </span>
  );
}