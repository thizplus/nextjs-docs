// API Endpoints Configuration

// Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// ==================== Auth Endpoints ====================
export const AUTH_API = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
} as const;

// ==================== User Endpoints ====================
export const USER_API = {
  PROFILE: '/users/profile',
} as const;

// ==================== Search Endpoints ====================
export const SEARCH_API = {
  GENERAL: '/search',
  WEBSITES: '/search/websites',
  IMAGES: '/search/images',
  VIDEOS: '/search/videos',
  VIDEO_DETAIL: (videoId: string) => `/search/videos/${videoId}`,
  PLACES: '/search/places',
  PLACE_DETAIL: (placeId: string) => `/search/places/${placeId}`,
  NEARBY: '/search/nearby',
  HISTORY: '/search/history',
  HISTORY_DELETE: (id: string) => `/search/history/${id}`,
} as const;

// ==================== AI Endpoints ====================
export const AI_API = {
  SEARCH: '/ai/search',
  CHAT: '/ai/chat',
  CHAT_DETAIL: (sessionId: string) => `/ai/chat/${sessionId}`,
  CHAT_MESSAGES: (sessionId: string) => `/ai/chat/${sessionId}/messages`,
} as const;

// ==================== Folder Endpoints ====================
export const FOLDER_API = {
  LIST: '/folders',
  CREATE: '/folders',
  DETAIL: (id: string) => `/folders/${id}`,
  UPDATE: (id: string) => `/folders/${id}`,
  DELETE: (id: string) => `/folders/${id}`,
  SHARE: (id: string) => `/folders/${id}/share`,
  PUBLIC: (id: string) => `/folders/public/${id}`,
  ITEMS: (id: string) => `/folders/${id}/items`,
  ITEMS_REORDER: (id: string) => `/folders/${id}/items/reorder`,
  ITEMS_CHECK: '/folders/items/check',
  ITEM_UPDATE: (itemId: string) => `/folders/items/${itemId}`,
  ITEM_DELETE: (itemId: string) => `/folders/items/${itemId}`,
} as const;

// ==================== Favorite Endpoints ====================
export const FAVORITE_API = {
  LIST: '/favorites',
  CREATE: '/favorites',
  DELETE: (id: string) => `/favorites/${id}`,
  CHECK: '/favorites/check',
  TOGGLE: '/favorites/toggle',
} as const;

// ==================== Utility Endpoints ====================
export const UTILITY_API = {
  CONFIG: '/utils/config',
  TRANSLATE: '/utils/translate',
  DETECT_LANGUAGE: '/utils/detect-language',
  QR_CODE: '/utils/qrcode',
  DISTANCE: '/utils/distance',
} as const;
