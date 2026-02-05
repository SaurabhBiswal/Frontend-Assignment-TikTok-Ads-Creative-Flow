import React, { useState, useEffect } from 'react';
import type { AdPayload, AdObjective, ApiError } from '../types';
import { MusicSelector } from './MusicSelector';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../services/api';
import { Send, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';

interface AdFormProps {
    onUpdatePreview?: (data: AdPayload) => void;
}

export const AdForm: React.FC<AdFormProps> = ({ onUpdatePreview }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState<AdPayload>({
        campaignName: '',
        objective: 'TRAFFIC',
        adText: '',
        cta: 'Learn More',
        music: { type: 'NONE' }
    });

    useEffect(() => {
        onUpdatePreview?.(formData);
    }, [formData, onUpdatePreview]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; adId?: string } | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof AdPayload | 'global', string>>>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (formData.campaignName.length < 3) {
            newErrors.campaignName = 'Campaign name must be at least 3 characters';
        }

        if (!formData.adText) {
            newErrors.adText = 'Ad text is required';
        } else if (formData.adText.length > 100) {
            newErrors.adText = 'Ad text exceeds 100 characters';
        }

        if (!formData.cta) {
            newErrors.cta = 'CTA selection is required';
        }

        if (formData.objective === 'CONVERSIONS' && formData.music.type === 'NONE') {
            newErrors.music = 'Music is required for Conversion ads';
        }

        if (formData.music.type === 'EXISTING' && !formData.music.id) {
            newErrors.music = 'Please provide and validate a Music ID';
        }

        if (formData.music.type === 'UPLOAD' && !formData.music.id) {
            newErrors.music = 'Please upload a music track';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitResult(null);

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const result = await mockApi.submitAd(formData, token);
            setSubmitResult({
                success: true,
                message: 'Successfully created ad! View in Ads Manager.',
                adId: result.adId
            });
        } catch (err: any) {
            const apiError = err as ApiError;
            setSubmitResult({
                success: false,
                message: apiError.message
            });
            setErrors(prev => ({ ...prev, global: apiError.message }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitResult?.success) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Ad Creative Created!</h3>
                <p className="text-zinc-400 mb-6">{submitResult.message}</p>
                <div className="p-4 bg-zinc-950 rounded-lg w-full mb-8">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Generated Ad ID</p>
                    <code className="text-tiktok-cyan font-mono font-bold">{submitResult.adId}</code>
                </div>
                <button
                    onClick={() => setSubmitResult(null)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Create Another Ad
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 lg:p-8">
            {errors.global && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-red-400 font-bold text-sm">Action Required</p>
                        <p className="text-red-400/80 text-xs mt-1">{errors.global}</p>
                    </div>
                </div>
            )}

            {/* Basic Setup */}
            <section className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center">1</span>
                    Campaign Setup
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="name">Campaign Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="e.g. Summer Sale 2024"
                            className={cn("w-full", errors.campaignName && "border-red-500 focus:ring-red-500")}
                            value={formData.campaignName}
                            onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                        />
                        {errors.campaignName && <p className="text-[10px] text-red-500">{errors.campaignName}</p>}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="objective">Ad Objective</label>
                        <select
                            id="objective"
                            className="w-full"
                            value={formData.objective}
                            onChange={(e) => {
                                const newObjective = e.target.value as AdObjective;
                                setFormData({
                                    ...formData,
                                    objective: newObjective,
                                    // Clear music if it becomes invalid for the objective
                                    music: newObjective === 'CONVERSIONS' && formData.music.type === 'NONE'
                                        ? { type: 'EXISTING' }
                                        : formData.music
                                });
                            }}
                        >
                            <option value="TRAFFIC">Traffic (Link Clicks)</option>
                            <option value="CONVERSIONS">Conversions (Purchases)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Creative Details */}
            <section className="space-y-6 pt-6 border-t border-zinc-800/50">
                <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center">2</span>
                    Ad Creative
                </h3>

                <div className="space-y-1">
                    <label htmlFor="adText">Ad Text (Max 100)</label>
                    <textarea
                        id="adText"
                        rows={3}
                        placeholder="Tell your story..."
                        className={cn("w-full resize-none", errors.adText && "border-red-500 focus:ring-red-500")}
                        value={formData.adText}
                        onChange={(e) => setFormData({ ...formData, adText: e.target.value })}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.adText ? (
                            <p className="text-[10px] text-red-500">{errors.adText}</p>
                        ) : (
                            <span></span>
                        )}
                        <span className={cn(
                            "text-[10px] font-mono",
                            formData.adText.length > 90 ? "text-tiktok-pink" : "text-zinc-500"
                        )}>
                            {formData.adText.length}/100
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <label htmlFor="cta">Call to Action</label>
                    <select
                        id="cta"
                        className="w-full"
                        value={formData.cta}
                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    >
                        <option>Learn More</option>
                        <option>Shop Now</option>
                        <option>Sign Up</option>
                        <option>Book Now</option>
                        <option>Download</option>
                    </select>
                </div>
            </section>

            {/* Music Selector */}
            <section className="pt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-bold">3</span>
                    <h3 className="text-lg font-bold text-zinc-200">Audio Experience</h3>
                </div>
                <MusicSelector
                    objective={formData.objective}
                    value={formData.music}
                    onChange={(music) => setFormData({ ...formData, music })}
                    error={errors.music}
                />
            </section>

            <div className="pt-6 flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-extrabold text-lg rounded-xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.01]"
                >
                    {isSubmitting ? (
                        <>
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span>Submitting to TikTok...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-6 h-6" />
                            <span>Publish Ad Creative</span>
                        </>
                    )}
                </button>
                <p className="text-[10px] text-zinc-500 text-center">
                    Ad submission might take a few seconds to process via TikTok Ads API
                </p>
            </div>
        </form>
    );
};
