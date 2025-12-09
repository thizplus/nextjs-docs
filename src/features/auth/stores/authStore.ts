import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/shared/types/models';
import type { LoginRequest, RegisterRequest } from '@/shared/types/request';
import { authService } from '@/services';
import { setAuthToken } from '@/shared/lib/api';

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;

  // Async Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      // Sync actions
      setAuth: (token, user) => {
        setAuthToken(token);
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () => {
        setAuthToken(null);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Async actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);

          if (response.success && response.data) {
            const { token, user } = response.data;
            get().setAuth(token, user);
          } else {
            throw new Error(response.message || 'เข้าสู่ระบบไม่สำเร็จ');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);

          if (response.success && response.data) {
            const { token, user } = response.data;
            get().setAuth(token, user);
          } else {
            throw new Error(response.message || 'ลงทะเบียนไม่สำเร็จ');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await authService.getProfile();

          if (response.success && response.data) {
            set({ user: response.data });
          } else {
            // Token invalid, clear auth
            get().clearAuth();
          }
        } catch {
          get().clearAuth();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        get().clearAuth();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);

        // Re-set auth token after hydration
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);

// Selector hooks (prevent unnecessary re-renders)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useHasHydrated = () => useAuthStore((state) => state._hasHydrated);
