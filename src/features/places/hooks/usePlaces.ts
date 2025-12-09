import { useQuery } from '@tanstack/react-query';
import { placesService } from '@/services';
import type { PlaceSearchRequest, NearbySearchRequest } from '@/shared/types/request';

// Query Keys
export const placesKeys = {
  all: ['places'] as const,
  search: (params?: PlaceSearchRequest) => [...placesKeys.all, 'search', params] as const,
  nearby: (params?: NearbySearchRequest) => [...placesKeys.all, 'nearby', params] as const,
  detail: (placeId: string) => [...placesKeys.all, 'detail', placeId] as const,
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
