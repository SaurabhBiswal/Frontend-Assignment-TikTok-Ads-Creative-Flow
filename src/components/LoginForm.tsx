import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock, AlertCircle } from 'lucide-react';

export const LoginForm: React.FC = () => {
    const { login, isLoading, error, clearError } = useAuth();
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(clientId, clientSecret);
        } catch (err) {
            // Error handled by context
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-tiktok-pink rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(254,44,85,0.4)]">
                    <Lock className="text-white w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-white">Connect TikTok Ads</h1>
                <p className="text-zinc-500 text-sm mt-1">Authorization required to manage creatives</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="clientId">Client ID</label>
                    <input
                        id="clientId"
                        type="text"
                        className="w-full"
                        placeholder="Enter your TikTok App Client ID"
                        value={clientId}
                        onChange={(e) => {
                            setClientId(e.target.value);
                            if (error) clearError();
                        }}
                        required
                    />
                    <p className="text-[10px] text-zinc-600 mt-1 italic">Try 'restricted' or 'invalid' to test error handling</p>
                </div>

                <div>
                    <label htmlFor="clientSecret">Client Secret</label>
                    <input
                        id="clientSecret"
                        type="password"
                        className="w-full"
                        placeholder="••••••••••••••••"
                        value={clientSecret}
                        onChange={(e) => {
                            setClientSecret(e.target.value);
                            if (error) clearError();
                        }}
                        required
                    />
                </div>

                {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-tiktok-pink hover:bg-[#E0244D] text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Connect Account'
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                <p className="text-xs text-zinc-600">
                    By connecting, you agree to our terms of service and allow TikTok Ads Manager access.
                </p>
            </div>
        </div>
    );
};
