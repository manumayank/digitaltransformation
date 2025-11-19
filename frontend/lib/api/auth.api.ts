import { apiClient } from '../api-client';
import type { User, AuthResponse } from '@shared/types';

export interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: RegisterInput) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginInput) => {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<{
      data: { accessToken: string; refreshToken: string };
    }>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  /**
   * Logout user
   */
  logout: async (refreshToken?: string) => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordInput) => {
    await apiClient.post('/auth/change-password', data);
  },
};
