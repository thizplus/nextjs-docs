import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { searchService } from '@/services';
import type {
  GeneralSearchRequest,
  WebsiteSearchRequest,
  ImageSearchRequest,
  VideoSearchRequest,
  GetSearchHistoryRequest,
} from '@/shared/types/request';

// Query Keys
export const searchKeys = {
  all: ['search'] as const,
  general: (params?: GeneralSearchRequest) => [...searchKeys.all, 'general', params] as const,
  websites: (params?: WebsiteSearchRequest) => [...searchKeys.all, 'websites', params] as const,
  images: (params?: ImageSearchRequest) => [...searchKeys.all, 'images', params] as const,
  videos: (params?: VideoSearchRequest) => [...searchKeys.all, 'videos', params] as const,
  videoDetail: (videoId: string) => [...searchKeys.all, 'video', videoId] as const,
  history: (params?: GetSearchHistoryRequest) => [...searchKeys.all, 'history', params] as const,
};

/**
 * General search hook
 */
export function useSearch(params: GeneralSearchRequest, enabled = true) {
  return useQuery({
    queryKey: searchKeys.general(params),
    queryFn: async () => {
      const response = await searchService.search(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.q,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Website search hook
 */
export function useWebsiteSearch(params: WebsiteSearchRequest, enabled = true) {
  return useQuery({
    queryKey: searchKeys.websites(params),
    queryFn: async () => {
      const response = await searchService.searchWebsites(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.q,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Image search hook
 */
export function useImageSearch(params: ImageSearchRequest, enabled = true) {
  return useQuery({
    queryKey: searchKeys.images(params),
    queryFn: async () => {
      const response = await searchService.searchImages(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.q,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Infinite image search hook for "Load More" functionality
 */
export function useInfiniteImageSearch(params: Omit<ImageSearchRequest, 'page'>, enabled = true) {
  return useInfiniteQuery({
    queryKey: [...searchKeys.images(params as ImageSearchRequest), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await searchService.searchImages({ ...params, page: pageParam });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.results.length, 0);
      // Google Custom Search API มีข้อจำกัดที่ 100 results
      if (totalLoaded >= 100 || lastPage.results.length < (params.pageSize || 10)) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: enabled && !!params.q,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Video search hook
 */
export function useVideoSearch(params: VideoSearchRequest, enabled = true) {
  return useQuery({
    queryKey: searchKeys.videos(params),
    queryFn: async () => {
      const response = await searchService.searchVideos(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.q,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
}

/**
 * Video detail hook
 */
export function useVideoDetail(videoId: string, enabled = true) {
  return useQuery({
    queryKey: searchKeys.videoDetail(videoId),
    queryFn: async () => {
      const response = await searchService.getVideoDetail(videoId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!videoId,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
}

/**
 * Search history hook
 */
export function useSearchHistory(params?: GetSearchHistoryRequest) {
  return useQuery({
    queryKey: searchKeys.history(params),
    queryFn: async () => {
      const response = await searchService.getHistory(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Clear search history mutation
 */
export function useClearSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await searchService.clearHistory();
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.history() });
    },
  });
}

/**
 * Delete single history item mutation
 */
export function useDeleteHistoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await searchService.deleteHistoryItem(id);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchKeys.history() });
    },
  });
}
