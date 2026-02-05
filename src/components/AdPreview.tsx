import type { AdPayload } from '../types';
import { Play, Music, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface AdPreviewProps {
    data: AdPayload;
}

export const AdPreview: React.FC<AdPreviewProps> = ({ data }) => {

    const bgClass = data.objective === 'TRAFFIC'
        ? 'bg-gradient-to-b from-zinc-800 to-indigo-950'
        : 'bg-gradient-to-b from-zinc-800 to-rose-950';

    return (
        <div className="aspect-[9/16] w-full max-w-[320px] mx-auto bg-black rounded-[2.5rem] p-3 shadow-2xl border-[8px] border-zinc-800 relative overflow-hidden group">
            {/* Screen Content */}
            <div className={cn("w-full h-full rounded-[1.8rem] overflow-hidden relative", bgClass)}>
                {/* Mock Video UI */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 pb-12 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
                    <div className="space-y-2 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/20"></div>
                            <span className="text-sm font-bold shadow-sm">@tiktok_advertiser</span>
                        </div>

                        <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed">
                            {data.adText || "Your ad text will appear here. Hook your audience in the first 3 seconds!"}
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                            <Music className="w-3 h-3 text-zinc-400" />
                            <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">
                                {data.music.type === 'NONE'
                                    ? "Original Audio"
                                    : (data.music.fileName || "Commercial Music - " + (data.music.id?.substring(0, 8) || "TikTok"))
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="h-10 bg-tiktok-pink rounded-md flex items-center justify-between px-4 shadow-[0_4px_10px_rgba(254,44,85,0.3)]">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{data.cta}</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </div>

                {/* Side Icons */}
                <div className="absolute right-2 bottom-20 space-y-4 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                        <div className="w-6 h-6 text-white bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">♥</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                        <div className="w-5 h-5 text-white bg-zinc-600 rounded flex items-center justify-center text-[8px] font-bold">💬</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center overflow-hidden animate-spin-slow">
                        <Music className="w-6 h-6 text-zinc-400" />
                    </div>
                </div>

                {/* Play Overlay (Desktop) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all cursor-pointer">
                    <Play className="w-12 h-12 text-white/0 group-hover:text-white/60 transition-all" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
        </div>
    );
};
