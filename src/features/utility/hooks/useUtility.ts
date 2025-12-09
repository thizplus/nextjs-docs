import { useQuery, useMutation } from '@tanstack/react-query';
import { utilityService } from '@/services';
import type {
  TranslateRequest,
  DetectLanguageRequest,
  GenerateQRRequest,
  CalculateDistanceRequest,
} from '@/shared/types/request';

// Query Keys
export const utilityKeys = {
  all: ['utility'] as const,
  translate: (request: TranslateRequest) => [...utilityKeys.all, 'translate', request] as const,
  detectLanguage: (text: string) => [...utilityKeys.all, 'detectLanguage', text] as const,
  distance: (params: CalculateDistanceRequest) => [...utilityKeys.all, 'distance', params] as const,
};

/**
 * Translate text hook (for queries)
 */
export function useTranslate(request: TranslateRequest, enabled = true) {
  return useQuery({
    queryKey: utilityKeys.translate(request),
    queryFn: async () => {
      const response = await utilityService.translate(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!request.text && !!request.targetLang,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Translate text mutation (for on-demand translation)
 */
export function useTranslateMutation() {
  return useMutation({
    mutationFn: async (request: TranslateRequest) => {
      const response = await utilityService.translate(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Detect language hook
 */
export function useDetectLanguage(text: string, enabled = true) {
  return useQuery({
    queryKey: utilityKeys.detectLanguage(text),
    queryFn: async () => {
      const response = await utilityService.detectLanguage({ text });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!text,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

/**
 * Generate QR Code mutation
 */
export function useGenerateQRCode() {
  return useMutation({
    mutationFn: async (request: GenerateQRRequest) => {
      const response = await utilityService.generateQRCode(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Calculate distance hook
 */
export function useCalculateDistance(params: CalculateDistanceRequest, enabled = true) {
  return useQuery({
    queryKey: utilityKeys.distance(params),
    queryFn: async () => {
      const response = await utilityService.calculateDistance(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled:
      enabled &&
      !!params.originLat &&
      !!params.originLng &&
      !!params.destinationLat &&
      !!params.destinationLng,
  });
}
