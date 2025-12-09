import { apiClient } from '@/shared/lib/api';
import { AUTH_API, USER_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '@/shared/types/request';
import type { AuthResponse } from '@/shared/types/response';
import type { User } from '@/shared/types/models';

export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      AUTH_API.LOGIN,
      credentials
    );
    return data;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      AUTH_API.REGISTER,
      userData
    );
    return data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.get<ApiResponse<User>>(USER_API.PROFILE);
    return data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.put<ApiResponse<User>>(
      USER_API.PROFILE,
      profileData
    );
    return data;
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(USER_API.PROFILE);
    return data;
  },
};
