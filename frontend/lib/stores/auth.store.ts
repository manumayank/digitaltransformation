import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api-client';
import type { User, AuthResponse } from '@shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', {
            email,
            password,
          });

          const { user, token, refreshToken } = response.data.data;

          // Store tokens
          apiClient.setToken(token);
          apiClient.setRefreshToken(refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });

          const response = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);

          const { user, token, refreshToken } = response.data.data;

          // Store tokens
          apiClient.setToken(token);
          apiClient.setRefreshToken(refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Registration failed. Please try again.';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = apiClient.getRefreshToken();

          // Call logout endpoint if we have a refresh token
          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        } catch (error) {
          // Ignore logout errors, we'll clear local state anyway
          console.error('Logout error:', error);
        } finally {
          // Clear tokens and state
          apiClient.clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const refreshToken = apiClient.getRefreshToken();

          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await apiClient.post<{
            data: { accessToken: string; refreshToken: string };
          }>('/auth/refresh', { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens
          apiClient.setToken(accessToken);
          apiClient.setRefreshToken(newRefreshToken);
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      getCurrentUser: async () => {
        try {
          set({ isLoading: true });

          const response = await apiClient.get<{ data: User }>('/auth/me');

          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
