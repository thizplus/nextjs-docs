import { useQuery } from '@tanstack/react-query';
import { utilityService, PublicConfig } from '@/services/backend/utility.service';

export const configKeys = {
  all: ['config'] as const,
  public: () => [...configKeys.all, 'public'] as const,
};

/**
 * Hook to get public config from backend
 * Caches the config for 1 hour
 */
export function usePublicConfig() {
  return useQuery({
    queryKey: configKeys.public(),
    queryFn: async () => {
      const response = await utilityService.getPublicConfig();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 2,
  });
}

/**
 * Get Google Maps API Key from config
 */
export function useGoogleMapsApiKey() {
  const { data: config, isLoading, error } = usePublicConfig();
  return {
    apiKey: config?.googleMapsApiKey || '',
    isLoading,
    error,
  };
}
