// Application constants

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
  SEARCH_LIMIT: 10,
  HISTORY_LIMIT: 20,
} as const;

export const FORM_LIMITS = {
  SEARCH: {
    QUERY_MAX: 500,
  },
  AUTH: {
    USERNAME_MIN: 3,
    USERNAME_MAX: 20,
    PASSWORD_MIN: 8,
    PASSWORD_MAX: 72,
    NAME_MAX: 50,
    EMAIL_MAX: 255,
  },
  FOLDER: {
    NAME_MAX: 255,
    DESCRIPTION_MAX: 1000,
    COVER_URL_MAX: 500,
  },
  ITEM: {
    TITLE_MAX: 255,
    URL_MAX: 2000,
    DESCRIPTION_MAX: 1000,
  },
  AI: {
    MESSAGE_MAX: 2000,
    QUERY_MAX: 500,
  },
  TRANSLATE: {
    TEXT_MAX: 5000,
    DETECT_MAX: 1000,
  },
  QR: {
    CONTENT_MAX: 2000,
    SIZE_MIN: 100,
    SIZE_MAX: 1000,
    SIZE_DEFAULT: 200,
  },
} as const;

export const UI = {
  TOAST_DURATION: 3000,
  DEBOUNCE_MS: 300,
  ANIMATION_DURATION: 200,
} as const;

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  SEARCH: '/dashboard/search',
  AI: '/dashboard/ai',
  FOLDERS: '/dashboard/my-folder',
  FOLDER_DETAIL: (id: string) => `/dashboard/my-folder/${id}`,
  FAVORITES: '/dashboard/favorites',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  HELP: '/dashboard/help',
  QR_CODE: '/dashboard/qr-code',

  // Place routes
  PLACE: (placeId: string) => `/dashboard/place/${placeId}`,

  // Public folder
  PUBLIC_FOLDER: (id: string) => `/folders/public/${id}`,
} as const;

export const SEARCH_TYPES = {
  ALL: 'all',
  WEBSITE: 'website',
  IMAGE: 'image',
  VIDEO: 'video',
  MAP: 'map',
  AI: 'ai',
} as const;

export const ITEM_TYPES = {
  PLACE: 'place',
  WEBSITE: 'website',
  IMAGE: 'image',
  VIDEO: 'video',
  LINK: 'link',
} as const;

export const VIDEO_ORDER = {
  RELEVANCE: 'relevance',
  DATE: 'date',
  VIEW_COUNT: 'viewCount',
  RATING: 'rating',
} as const;

export const PLACE_TYPES = [
  // Tourism
  'tourist_attraction',
  'museum',
  'park',
  'zoo',
  'aquarium',
  'amusement_park',
  // Food
  'restaurant',
  'cafe',
  'bar',
  'bakery',
  // Accommodation
  'lodging',
  'hotel',
  // Shopping
  'shopping_mall',
  'store',
  // Transport
  'airport',
  'train_station',
  'bus_station',
  'transit_station',
  // Landmarks
  'church',
  'hindu_temple',
  'mosque',
  'place_of_worship',
  'city_hall',
  // Other
  'hospital',
  'pharmacy',
  'bank',
  'atm',
  'gas_station',
] as const;

export const CACHE_TIMES = {
  WEBSITE_SEARCH: 60 * 60 * 1000, // 1 hour
  IMAGE_SEARCH: 60 * 60 * 1000, // 1 hour
  VIDEO_SEARCH: 6 * 60 * 60 * 1000, // 6 hours
  PLACE_SEARCH: 60 * 60 * 1000, // 1 hour
  PLACE_DETAIL: 24 * 60 * 60 * 1000, // 24 hours
  AI_SEARCH: 6 * 60 * 60 * 1000, // 6 hours
  TRANSLATION: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
