import { apiClient } from '@/shared/lib/api';
import { UTILITY_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse } from '@/shared/types/common';
import type {
  TranslateRequest,
  DetectLanguageRequest,
  GenerateQRRequest,
  CalculateDistanceRequest,
} from '@/shared/types/request';
import type {
  TranslateResponse,
  DetectLanguageResponse,
  GenerateQRResponse,
  CalculateDistanceResponse,
} from '@/shared/types/response';

export interface PublicConfig {
  googleMapsApiKey: string;
  appName: string;
}

export const utilityService = {
  /**
   * Get public config from backend
   */
  getPublicConfig: async (): Promise<ApiResponse<PublicConfig>> => {
    const { data } = await apiClient.get<ApiResponse<PublicConfig>>(
      UTILITY_API.CONFIG
    );
    return data;
  },
  /**
   * Translate text
   */
  translate: async (
    request: TranslateRequest
  ): Promise<ApiResponse<TranslateResponse>> => {
    const { data } = await apiClient.post<ApiResponse<TranslateResponse>>(
      UTILITY_API.TRANSLATE,
      request
    );
    return data;
  },

  /**
   * Detect language of text
   */
  detectLanguage: async (
    request: DetectLanguageRequest
  ): Promise<ApiResponse<DetectLanguageResponse>> => {
    const { data } = await apiClient.post<ApiResponse<DetectLanguageResponse>>(
      UTILITY_API.DETECT_LANGUAGE,
      request
    );
    return data;
  },

  /**
   * Generate QR Code
   */
  generateQRCode: async (
    request: GenerateQRRequest
  ): Promise<ApiResponse<GenerateQRResponse>> => {
    const { data } = await apiClient.post<ApiResponse<GenerateQRResponse>>(
      UTILITY_API.QR_CODE,
      request
    );
    return data;
  },

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance: async (
    params: CalculateDistanceRequest
  ): Promise<ApiResponse<CalculateDistanceResponse>> => {
    const { data } = await apiClient.get<ApiResponse<CalculateDistanceResponse>>(
      UTILITY_API.DISTANCE,
      { params }
    );
    return data;
  },
};

// ==================== Helper Functions ====================

/**
 * Format distance in meters to human readable text
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Calculate distance locally using Haversine formula
 */
export function calculateDistanceLocal(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
