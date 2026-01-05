import { apiClient } from '@/shared/lib/api';
import { USER_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type { User } from '@/shared/types/models';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  studentId?: string;
  language?: 'th' | 'en';
  theme?: 'light' | 'dark';
}

export interface UpdateAvatarResponse {
  avatarUrl: string;
}

export const userService = {
  /**
   * Update user profile information
   */
  updateProfile: async (request: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      USER_API.UPDATE_PROFILE,
      request
    );
    return data;
  },

  /**
   * Upload new avatar
   */
  updateAvatar: async (file: File): Promise<ApiResponse<UpdateAvatarResponse>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await apiClient.post<ApiResponse<UpdateAvatarResponse>>(
      USER_API.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  /**
   * Delete avatar
   */
  deleteAvatar: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(USER_API.AVATAR);
    return data;
  },
};
