// Admin Statistics Hooks

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../service';
import type { PageAnalyticsRequest, FavoriteAnalyticsRequest } from '../types';

// Query Key Factory
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  pages: (params?: PageAnalyticsRequest) => [...adminKeys.all, 'pages', params] as const,
  folders: () => [...adminKeys.all, 'folders'] as const,
  favorites: (params?: FavoriteAnalyticsRequest) => [...adminKeys.all, 'favorites', params] as const,
};

/**
 * Hook สำหรับดึงข้อมูล Dashboard Overview
 */
export function useAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const response = await adminService.getDashboardStats();
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook สำหรับดึงข้อมูล Page Analytics
 */
export function usePageAnalytics(params?: PageAnalyticsRequest, enabled = true) {
  return useQuery({
    queryKey: adminKeys.pages(params),
    queryFn: async () => {
      const response = await adminService.getPageAnalytics(params);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook สำหรับดึงข้อมูล Folder Analytics
 */
export function useFolderAnalytics(enabled = true) {
  return useQuery({
    queryKey: adminKeys.folders(),
    queryFn: async () => {
      const response = await adminService.getFolderAnalytics();
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook สำหรับดึงข้อมูล Favorite Analytics
 */
export function useFavoriteAnalytics(params?: FavoriteAnalyticsRequest, enabled = true) {
  return useQuery({
    queryKey: adminKeys.favorites(params),
    queryFn: async () => {
      const response = await adminService.getFavoriteAnalytics(params);
      return response.data;
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook สำหรับ Cleanup Page Views
 */
export function useCleanupPageViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (days?: number) => adminService.cleanupPageViews(days),
    onSuccess: () => {
      // Invalidate all admin queries
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Hook สำหรับ Track Page View
 */
export function useTrackPageView() {
  return useMutation({
    mutationFn: adminService.trackPageView,
  });
}
