import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services';
import type {
  AddFavoriteRequest,
  GetFavoritesRequest,
  CheckFavoriteRequest,
} from '@/shared/types/request';
import type { PlaceResult, VideoResult, WebsiteResult, ImageResult } from '@/shared/types/models';

// Query Keys
export const favoritesKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoritesKeys.all, 'list'] as const,
  list: (params?: GetFavoritesRequest) => [...favoritesKeys.lists(), params] as const,
  check: (params: CheckFavoriteRequest) => [...favoritesKeys.all, 'check', params] as const,
};

/**
 * Get favorites list hook
 */
export function useFavorites(params?: GetFavoritesRequest) {
  return useQuery({
    queryKey: favoritesKeys.list(params),
    queryFn: async () => {
      const response = await favoritesService.list(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Check if item is favorited hook
 */
export function useCheckFavorite(params: CheckFavoriteRequest, enabled = true) {
  return useQuery({
    queryKey: favoritesKeys.check(params),
    queryFn: async () => {
      const response = await favoritesService.check(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!(params.url || params.externalId),
  });
}

/**
 * Add to favorites mutation
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AddFavoriteRequest) => {
      const response = await favoritesService.add(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.lists() });
    },
  });
}

/**
 * Remove from favorites mutation
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await favoritesService.remove(id);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.lists() });
    },
  });
}

/**
 * Toggle favorite mutation
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: AddFavoriteRequest) => {
      const response = await favoritesService.toggle(request);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoritesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...favoritesKeys.all, 'check'] });
    },
  });
}

// ==================== Helper Functions ====================

/**
 * Create favorite request from PlaceResult
 */
export function createPlaceFavoriteRequest(place: PlaceResult): AddFavoriteRequest {
  return {
    type: 'place',
    externalId: place.placeId,
    title: place.name,
    url: `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
    thumbnailUrl: place.photoUrl,
    rating: place.rating,
    reviewCount: place.reviewCount,
    address: place.address,
    metadata: {
      lat: place.lat,
      lng: place.lng,
      types: place.types,
    },
  };
}

/**
 * Create favorite request from VideoResult
 */
export function createVideoFavoriteRequest(video: VideoResult): AddFavoriteRequest {
  return {
    type: 'video',
    externalId: video.videoId,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.videoId}`,
    thumbnailUrl: video.thumbnailUrl,
    metadata: {
      channelTitle: video.channelTitle,
      viewCount: video.viewCount,
      duration: video.duration,
    },
  };
}

/**
 * Create favorite request from WebsiteResult
 */
export function createWebsiteFavoriteRequest(website: WebsiteResult): AddFavoriteRequest {
  return {
    type: 'website',
    title: website.title,
    url: website.url,
    metadata: {
      displayLink: website.displayLink,
      snippet: website.snippet,
    },
  };
}

/**
 * Create favorite request from ImageResult
 */
export function createImageFavoriteRequest(image: ImageResult): AddFavoriteRequest {
  return {
    type: 'image',
    title: image.title,
    url: image.url,
    thumbnailUrl: image.thumbnailUrl,
    metadata: {
      width: image.width,
      height: image.height,
      source: image.source,
    },
  };
}
