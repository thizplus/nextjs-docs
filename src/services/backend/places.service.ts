import { apiClient } from '@/shared/lib/api';
import { SEARCH_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type {
  PlaceSearchRequest,
  NearbySearchRequest,
} from '@/shared/types/request';
import type { PlaceSearchResponse } from '@/shared/types/response';
import type { PlaceDetail } from '@/shared/types/models';

export const placesService = {
  /**
   * Search places (Text Search or Nearby Search)
   * - Without lat/lng: Text Search
   * - With lat/lng: Nearby Search
   */
  searchPlaces: async (
    params: PlaceSearchRequest
  ): Promise<ApiResponse<PlaceSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PlaceSearchResponse>>(
      SEARCH_API.PLACES,
      { params }
    );
    return data;
  },

  /**
   * Get place details by Google Place ID
   */
  getPlaceDetail: async (placeId: string): Promise<ApiResponse<PlaceDetail>> => {
    const { data } = await apiClient.get<ApiResponse<PlaceDetail>>(
      SEARCH_API.PLACE_DETAIL(placeId)
    );
    return data;
  },

  /**
   * Search nearby places
   */
  searchNearby: async (
    params: NearbySearchRequest
  ): Promise<ApiResponse<PlaceSearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<PlaceSearchResponse>>(
      SEARCH_API.NEARBY,
      { params }
    );
    return data;
  },
};
