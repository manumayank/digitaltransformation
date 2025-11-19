import { apiClient } from '../api-client';
import type { User } from '@shared/types';

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountInput {
  password: string;
}

export interface UserStats {
  totalAssessments: number;
  completedAssessments: number;
  inProgressAssessments: number;
  businessProfiles: number;
  latestAssessment: {
    id: string;
    digitalScore: number;
    legacyScore: number;
    overallScore: number;
    completedAt: Date;
  } | null;
}

export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get<{ data: User }>('/users/profile');
    return response.data.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileInput) => {
    const response = await apiClient.put<{ data: User }>('/users/profile', data);
    return response.data.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordInput) => {
    await apiClient.put('/users/password', data);
  },

  /**
   * Get user statistics
   */
  getStats: async () => {
    const response = await apiClient.get<{ data: UserStats }>('/users/stats');
    return response.data.data;
  },

  /**
   * Delete/deactivate account
   */
  deleteAccount: async (data: DeleteAccountInput) => {
    await apiClient.delete('/users/account', { data });
  },
};
