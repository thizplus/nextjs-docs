import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/shared/types/request';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

/**
 * Hook for login
 */
export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
  });
}

/**
 * Hook for registration
 */
export function useRegister() {
  const register = useAuthStore((state) => state.register);

  return useMutation({
    mutationFn: (userData: RegisterRequest) => register(userData),
  });
}

/**
 * Hook for fetching profile
 */
export function useProfile() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (profileData: UpdateProfileRequest) => {
      const response = await authService.updateProfile(profileData);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

/**
 * Hook for deleting account
 */
export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const response = await authService.deleteAccount();
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      logout();
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
}
