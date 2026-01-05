'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUser, useIsAuthenticated, useAuthLoading, useHasHydrated } from '@/features/auth/stores/authStore';

export function useAuth() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const hasHydrated = useHasHydrated();
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated,
    isLoading,
    hasHydrated,
    isGuest: !isAuthenticated,
    logout,
  };
}

export function useRequireAuth(featureName?: string) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectTo', window.location.pathname);
      }
      router.push('/login');
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  return { requireAuth, isAuthenticated };
}
