'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/types';
import { LoginInput, RegisterInput } from '@/lib/validators';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Load user on mount
    useEffect(() => {
        async function loadUser() {
            try {
                const { data } = await apiClient.get<{ user: User | null }>('/auth/me');
                setUser(data.user);
            } catch (error) {
                console.error('Failed to load user', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = async (input: LoginInput) => {
        queryClient.clear(); // Clear cache from previous user
        const { data } = await apiClient.post('/auth/login', input);
        setUser(data.user);
        router.push('/projects');
    };

    const register = async (input: RegisterInput) => {
        queryClient.clear(); // Clear cache from previous user
        const { data } = await apiClient.post('/auth/register', input);
        setUser(data.user);
        router.push('/projects');
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (_e) {
            console.error('Failed to logout', _e);
            // Ignore errors
        } finally {
            setUser(null);
            queryClient.clear();
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
