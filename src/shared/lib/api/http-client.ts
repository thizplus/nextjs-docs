import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './constants/api';

// Get token from auth store (will be set up later)
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try to get from Zustand persisted store
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed?.state?.token || null;
    }
  } catch {
    // Fallback to simple token storage
    return localStorage.getItem('token');
  }
  return null;
};

// Clear auth on 401
const clearAuth = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('auth-storage');
  localStorage.removeItem('token');

  // Redirect to login
  window.location.href = '/login';
};

/**
 * Main API Client
 * Used for all API requests to the backend
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request Interceptor - Add Authorization header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const errorMessage = (error.response?.data as { message?: string })?.message;

      // Check if token expired or unauthorized
      if (errorMessage?.includes('Token expired') || errorMessage?.includes('Unauthorized')) {
        clearAuth();
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string };
    return data?.message || data?.error || error.message || 'เกิดข้อผิดพลาด';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
};

/**
 * Helper to set auth token manually (for initial setup)
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;
