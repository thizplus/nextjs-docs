import { apiClient } from '@/shared/lib/api';
import { FAVORITE_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common';
import type {
  AddFavoriteRequest,
  GetFavoritesRequest,
  CheckFavoriteRequest,
} from '@/shared/types/request';
import type {
  FavoriteListResponse,
  Favorite,
  CheckFavoriteResponse,
} from '@/shared/types/response';

export const favoritesService = {
  /**
   * Add to favorites
   */
  add: async (request: AddFavoriteRequest): Promise<ApiResponse<Favorite>> => {
    const { data } = await apiClient.post<ApiResponse<Favorite>>(
      FAVORITE_API.CREATE,
      request
    );
    return data;
  },

  /**
   * Get all favorites
   */
  list: async (
    params?: GetFavoritesRequest
  ): Promise<PaginatedResponse<FavoriteListResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<FavoriteListResponse>>(
      FAVORITE_API.LIST,
      { params }
    );
    return data;
  },

  /**
   * Remove from favorites
   */
  remove: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      FAVORITE_API.DELETE(id)
    );
    return data;
  },

  /**
   * Check if item is favorited
   */
  check: async (
    params: CheckFavoriteRequest
  ): Promise<ApiResponse<CheckFavoriteResponse>> => {
    const { data } = await apiClient.get<ApiResponse<CheckFavoriteResponse>>(
      FAVORITE_API.CHECK,
      { params }
    );
    return data;
  },

  /**
   * Toggle favorite status
   * - If not favorited: adds to favorites
   * - If favorited: removes from favorites
   */
  toggle: async (
    request: AddFavoriteRequest
  ): Promise<ApiResponse<Favorite | null>> => {
    const { data } = await apiClient.post<ApiResponse<Favorite | null>>(
      FAVORITE_API.TOGGLE,
      request
    );
    return data;
  },
};
