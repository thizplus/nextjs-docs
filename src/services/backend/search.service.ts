import { apiClient } from '@/shared/lib/api';
import { SEARCH_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common';
import type {
  GeneralSearchRequest,
  WebsiteSearchRequest,
  ImageSearchRequest,
  VideoSearchRequest,
  GetSearchHistoryRequest,
} from '@/shared/types/request';
import type {
  GeneralSearchResponse,
  WebsiteSearchResponse,
  ImageSearchResponse,
  VideoSearchResponse,
  SearchHistoryListResponse,
} from '@/shared/types/response';
import type { VideoResult } from '@/shared/types/models';

export const searchService = {
  /**
   * General search (all types)
   */
  search: async (
    params: GeneralSearchRequest
  ): Promise<ApiResponse<GeneralSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<GeneralSearchResponse>>(
      SEARCH_API.GENERAL,
      { params }
    );
    return data;
  },

  /**
   * Search websites
   */
  searchWebsites: async (
    params: WebsiteSearchRequest
  ): Promise<ApiResponse<WebsiteSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<WebsiteSearchResponse>>(
      SEARCH_API.WEBSITES,
      { params }
    );
    return data;
  },

  /**
   * Search images
   */
  searchImages: async (
    params: ImageSearchRequest
  ): Promise<ApiResponse<ImageSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<ImageSearchResponse>>(
      SEARCH_API.IMAGES,
      { params }
    );
    return data;
  },

  /**
   * Search videos (YouTube)
   */
  searchVideos: async (
    params: VideoSearchRequest
  ): Promise<ApiResponse<VideoSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<VideoSearchResponse>>(
      SEARCH_API.VIDEOS,
      { params }
    );
    return data;
  },

  /**
   * Get video details
   */
  getVideoDetail: async (videoId: string): Promise<ApiResponse<VideoResult>> => {
    const { data } = await apiClient.get<ApiResponse<VideoResult>>(
      SEARCH_API.VIDEO_DETAIL(videoId)
    );
    return data;
  },

  /**
   * Get search history
   */
  getHistory: async (
    params?: GetSearchHistoryRequest
  ): Promise<PaginatedResponse<SearchHistoryListResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<SearchHistoryListResponse>>(
      SEARCH_API.HISTORY,
      { params }
    );
    return data;
  },

  /**
   * Clear all search history
   */
  clearHistory: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(SEARCH_API.HISTORY);
    return data;
  },

  /**
   * Delete single history item
   */
  deleteHistoryItem: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      SEARCH_API.HISTORY_DELETE(id)
    );
    return data;
  },
};
