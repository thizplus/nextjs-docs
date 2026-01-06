import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { placesService } from '@/services';
import type { PlaceSearchRequest, NearbySearchRequest } from '@/shared/types/request';

// Query Keys
export const placesKeys = {
  all: ['places'] as const,
  search: (params?: PlaceSearchRequest) => [...placesKeys.all, 'search', params] as const,
  nearby: (params?: NearbySearchRequest) => [...placesKeys.all, 'nearby', params] as const,
  detail: (placeId: string) => [...placesKeys.all, 'detail', placeId] as const,
  detailEnhanced: (placeId: string, lat?: number, lng?: number) =>
    [...placesKeys.all, 'detail-enhanced', placeId, lat, lng] as const,
};

/**
 * Place search hook (Text Search or Nearby Search)
 */
export function usePlaceSearch(params: PlaceSearchRequest, enabled = true) {
  return useQuery({
    queryKey: placesKeys.search(params),
    queryFn: async () => {
      const response = await placesService.searchPlaces(params);
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
 * Infinite place search hook for Load More functionality
 */
export function useInfinitePlaceSearch(
  params: Omit<PlaceSearchRequest, 'page'>,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: [...placesKeys.search(params), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await placesService.searchPlaces({
        ...params,
        page: pageParam,
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: enabled && !!params.q,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Nearby places search hook
 */
export function useNearbyPlaces(params: NearbySearchRequest, enabled = true) {
  return useQuery({
    queryKey: placesKeys.nearby(params),
    queryFn: async () => {
      const response = await placesService.searchNearby(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.lat && !!params.lng,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Place detail hook
 */
export function usePlaceDetail(placeId: string, enabled = true) {
  return useQuery({
    queryKey: placesKeys.detail(placeId),
    queryFn: async () => {
      const response = await placesService.getPlaceDetail(placeId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!placeId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Enhanced place detail hook with AI-generated content
 * AI content only available for authenticated users
 */
export function usePlaceDetailEnhanced(
  placeId: string,
  options?: { lat?: number; lng?: number; enabled?: boolean }
) {
  const { lat, lng, enabled = true } = options || {};

  return useQuery({
    queryKey: placesKeys.detailEnhanced(placeId, lat, lng),
    queryFn: async () => {
      const response = await placesService.getPlaceDetailEnhanced(placeId, { lat, lng });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!placeId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - AI content is cached on backend
  });
}
