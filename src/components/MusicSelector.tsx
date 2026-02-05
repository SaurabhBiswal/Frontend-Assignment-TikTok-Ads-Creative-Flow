import React, { useState } from 'react';
import type { AdObjective, MusicOption } from '../types';
import { mockApi } from '../services/api';
import { Music, Upload, Slash, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface MusicSelectorProps {
    objective: AdObjective;
    value: MusicOption;
    onChange: (value: MusicOption) => void;
    error?: string;
}

export const MusicSelector: React.FC<MusicSelectorProps> = ({ objective, value, onChange, error }) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState<'none' | 'success' | 'error'>('none');
    const [localMusicId, setLocalMusicId] = useState(value.id || '');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleValidateId = async () => {
        if (!localMusicId) return;

        setIsValidating(true);
        setValidationError(null);
        setValidationStatus('none');

        try {
            await mockApi.validateMusicId(localMusicId);
            setValidationStatus('success');
            onChange({ type: 'EXISTING', id: localMusicId });
        } catch (err: any) {
            setValidationStatus('error');
            setValidationError(err.message);
        } finally {
            setIsValidating(false);
        }
    };

    const handleUpload = async () => {
        setIsValidating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockId = 'music_up_' + Math.random().toString(36).substring(7);
        setValidationStatus('success');
        setLocalMusicId(mockId);
        onChange({ type: 'UPLOAD', id: mockId, fileName: 'my_awesome_track.mp3' });
        setIsValidating(false);
    };

    const isNoMusicAllowed = objective === 'TRAFFIC';

    return (
        <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400">Music Configuration</label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Option A: Existing */}
                <button
                    type="button"
                    onClick={() => onChange({ ...value, type: 'EXISTING' })}
                    className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all",
                        value.type === 'EXISTING'
                            ? "bg-tiktok-pink/10 border-tiktok-pink text-tiktok-pink shadow-[0_0_15px_rgba(254,44,85,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    )}
                >
                    <Music className="w-6 h-6" />
                    <span className="text-xs font-bold">Existing ID</span>
                </button>

                {/* Option B: Upload */}
                <button
                    type="button"
                    onClick={() => onChange({ ...value, type: 'UPLOAD' })}
                    className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all",
                        value.type === 'UPLOAD'
                            ? "bg-tiktok-pink/10 border-tiktok-pink text-tiktok-pink shadow-[0_0_15px_rgba(254,44,85,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                    )}
                >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-bold">Upload Music</span>
                </button>

                {/* Option C: None */}
                <button
                    type="button"
                    disabled={!isNoMusicAllowed}
                    onClick={() => onChange({ type: 'NONE' })}
                    className={cn(
                        "p-4 border rounded-xl flex flex-col items-center gap-2 transition-all relative",
                        value.type === 'NONE'
                            ? "bg-tiktok-pink/10 border-tiktok-pink text-tiktok-pink shadow-[0_0_15px_rgba(254,44,85,0.1)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700",
                        !isNoMusicAllowed && "opacity-40 grayscale cursor-not-allowed group"
                    )}
                >
                    <Slash className="w-6 h-6" />
                    <span className="text-xs font-bold">No Music</span>
                    {!isNoMusicAllowed && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-[10px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Only allowed for Traffic objective
                        </div>
                    )}
                </button>
            </div>

            {/* Conditional Inputs */}
            <div className="mt-4 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                {value.type === 'EXISTING' && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Music ID (e.g. 712394...)"
                                className="flex-1 bg-zinc-900"
                                value={localMusicId}
                                onChange={(e) => {
                                    setLocalMusicId(e.target.value);
                                    setValidationStatus('none');
                                    setValidationError(null);
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleValidateId}
                                disabled={!localMusicId || isValidating}
                                className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
                            </button>
                        </div>
                        {validationStatus === 'success' && (
                            <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Music found and authorized!
                            </div>
                        )}
                        {(validationStatus === 'error' || validationError) && (
                            <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
                                <XCircle className="w-4 h-4" />
                                {validationError || 'Invalid music identifier'}
                            </div>
                        )}
                    </div>
                )}

                {value.type === 'UPLOAD' && (
                    <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-zinc-800 rounded-lg">
                        {value.id ? (
                            <div className="text-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-white">{value.fileName}</p>
                                <p className="text-xs text-zinc-500 mt-1 italic">Mock ID: {value.id}</p>
                                <button
                                    type="button"
                                    onClick={() => onChange({ type: 'UPLOAD' })}
                                    className="mt-3 text-xs text-tiktok-pink hover:underline"
                                >
                                    Change file
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={isValidating}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm font-medium flex items-center gap-2"
                                >
                                    {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simulate Upload'}
                                </button>
                                <p className="text-[10px] text-zinc-600 mt-2">MP3, WAV up to 10MB</p>
                            </div>
                        )}
                    </div>
                )}

                {value.type === 'NONE' && (objective === 'TRAFFIC' ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-zinc-400">Using video's original audio or no sound.</p>
                        <p className="text-[10px] text-zinc-600 mt-1 italic">Allowed because Objective is Traffic</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-400 p-2 bg-red-500/10 rounded-md text-xs">
                        <Slash className="w-4 h-4" />
                        Conversion ads require a music track.
                    </div>
                ))}
            </div>

            {error && !validationError && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};
