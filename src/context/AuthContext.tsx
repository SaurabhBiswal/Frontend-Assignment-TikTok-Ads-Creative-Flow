import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, ApiError } from '../types';
import { mockApi } from '../services/api';

interface AuthContextType extends AuthState {
    login: (clientId: string, clientSecret: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'tiktok_ads_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setState(prev => ({
                    ...prev,
                    token: parsed.token,
                    user: parsed.user,
                    isAuthenticated: true,
                    isLoading: false,
                }));
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (clientId: string, clientSecret: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const { token, user } = await mockApi.login(clientId, clientSecret);
            const newState = {
                token,
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
            setState(newState);
        } catch (err) {
            const apiError = err as ApiError;
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: apiError.message || 'Failed to connect TikTok Ads account',
            }));
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
