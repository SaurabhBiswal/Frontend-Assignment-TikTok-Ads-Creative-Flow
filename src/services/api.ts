import type { User, AdPayload, ApiError } from '../types';

const SLEEP_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
    login: async (clientId: string, clientSecret: string): Promise<{ token: string; user: User }> => {
        await sleep(SLEEP_MS);

        if (clientId === 'invalid' || clientSecret === 'invalid') {
            throw {
                message: 'Invalid client ID or secret. Please check your TikTok Developer credentials.',
                code: 'INVALID_CLIENT',
                status: 401
            } as ApiError;
        }

        if (clientId === 'restricted') {
            throw {
                message: 'Your account is geo-restricted from accessing TikTok Ads APIs in this region.',
                code: 'GEO_RESTRICTED',
                status: 403
            } as ApiError;
        }

        return {
            token: 'mock_tiktok_ads_token_' + Math.random().toString(36).substring(7),
            user: {
                id: 'user_123',
                name: 'TikTok Advertiser',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok'
            }
        };
    },
    validateMusicId: async (musicId: string): Promise<boolean> => {
        await sleep(800);
        if (musicId.toLowerCase().includes('error')) {
            throw {
                message: 'The Music ID provided is invalid or does not exist in the TikTok library.',
                code: 'INVALID_MUSIC_ID',
                status: 400
            } as ApiError;
        }

        if (musicId === '403') {
            throw {
                message: 'You do not have permission to use this music track.',
                code: 'PERMISSION_DENIED',
                status: 403
            } as ApiError;
        }

        return true;
    },
    submitAd: async (payload: AdPayload, token: string | null): Promise<{ success: boolean; adId: string }> => {
        await sleep(1500);

        if (!token) {
            throw {
                message: 'Your session has expired. Please reconnect your TikTok Ads account.',
                code: 'AUTH_EXPIRED',
                status: 401
            } as ApiError;
        }
        if (payload.objective === 'CONVERSIONS' && payload.music.type === 'NONE') {
            throw {
                message: 'Music is required for Conversion ads. Please select or upload a track.',
                code: 'VALIDATION_ERROR',
                status: 400
            } as ApiError;
        }
        if (Math.random() < 0.1) {
            throw {
                message: 'An unexpected TikTok API error occurred. Please try again later.',
                code: 'INTERNAL_ERROR',
                status: 500
            } as ApiError;
        }

        return {
            success: true,
            adId: 'ad_' + Math.random().toString(36).substring(7)
        };
    }
};
