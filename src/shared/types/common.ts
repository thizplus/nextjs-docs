// Common types shared across the application

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  offset: number;
  limit: number;
}

/**
 * Location coordinates
 */
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Search types
 */
export type SearchType = 'all' | 'website' | 'image' | 'video' | 'map' | 'ai';

/**
 * Favorite/Folder item types
 */
export type ItemType = 'place' | 'website' | 'image' | 'video' | 'link';

/**
 * User roles
 */
export type UserRole = 'user' | 'admin';

/**
 * Language codes
 */
export type LanguageCode =
  | 'th' | 'en' | 'ja' | 'ko' | 'zh'
  | 'vi' | 'de' | 'fr' | 'es' | 'pt'
  | 'it' | 'ru' | 'ar' | 'hi' | 'id';

/**
 * Language names mapping
 */
export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  th: 'ไทย',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  vi: 'Tiếng Việt',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  ru: 'Русский',
  ar: 'العربية',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
};

/**
 * QR Code format
 */
export type QRCodeFormat = 'png' | 'svg';

/**
 * Video order options
 */
export type VideoOrderType = 'relevance' | 'date' | 'viewCount' | 'rating';

/**
 * Image size options
 */
export type ImageSizeType = 'small' | 'medium' | 'large';

/**
 * Chat message role
 */
export type ChatRole = 'user' | 'assistant';
