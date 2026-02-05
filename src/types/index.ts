export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export type AdObjective = 'TRAFFIC' | 'CONVERSIONS';

export interface MusicOption {
    type: 'EXISTING' | 'UPLOAD' | 'NONE';
    id?: string;
    fileName?: string;
}

export interface AdPayload {
    campaignName: string;
    objective: AdObjective;
    adText: string;
    cta: string;
    music: MusicOption;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
}
