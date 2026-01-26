// Admin Service - API calls for admin dashboard

import { apiClient } from '@/shared/lib/api';
import { ADMIN_API, ANALYTICS_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type {
  AdminDashboardStats,
  PageAnalyticsResponse,
  PageAnalyticsRequest,
  FolderAnalyticsResponse,
  FavoriteAnalyticsResponse,
  FavoriteAnalyticsRequest,
  TrackPageViewRequest,
  CleanupResponse,
} from './types';

export const adminService = {
  /**
   * Get dashboard overview statistics
   */
  async getDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>(ADMIN_API.DASHBOARD);
    return response.data;
  },

  /**
   * Get page analytics
   */
  async getPageAnalytics(params?: PageAnalyticsRequest): Promise<ApiResponse<PageAnalyticsResponse>> {
    const response = await apiClient.get<ApiResponse<PageAnalyticsResponse>>(ADMIN_API.PAGES, {
      params,
    });
    return response.data;
  },

  /**
   * Get folder analytics
   */
  async getFolderAnalytics(): Promise<ApiResponse<FolderAnalyticsResponse>> {
    const response = await apiClient.get<ApiResponse<FolderAnalyticsResponse>>(ADMIN_API.FOLDERS);
    return response.data;
  },

  /**
   * Get favorite analytics
   */
  async getFavoriteAnalytics(params?: FavoriteAnalyticsRequest): Promise<ApiResponse<FavoriteAnalyticsResponse>> {
    const response = await apiClient.get<ApiResponse<FavoriteAnalyticsResponse>>(ADMIN_API.FAVORITES, {
      params,
    });
    return response.data;
  },

  /**
   * Cleanup old page views
   */
  async cleanupPageViews(days?: number): Promise<ApiResponse<CleanupResponse>> {
    const response = await apiClient.delete<ApiResponse<CleanupResponse>>(ADMIN_API.CLEANUP, {
      params: { days },
    });
    return response.data;
  },

  /**
   * Track page view (public endpoint)
   */
  async trackPageView(data: TrackPageViewRequest): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(ANALYTICS_API.TRACK, data);
    return response.data;
  },
};
