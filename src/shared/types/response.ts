// API Response types

import type { PaginationMeta } from './common';
import type {
  User,
  WebsiteResult,
  ImageResult,
  VideoResult,
  PlaceResult,
  PlaceDetail,
  SearchHistory,
  MessageSource,
  ChatMessage,
  ChatSession,
  ChatSessionDetail,
  Folder,
  FolderDetail,
  FolderItem,
  Favorite,
} from './models';

// ==================== Auth ====================

export interface AuthResponse {
  token: string;
  user: User;
}

// ==================== Search ====================

export interface GeneralSearchResponse {
  query: string;
  type: string;
  results: (WebsiteResult | ImageResult | VideoResult | PlaceResult)[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface WebsiteSearchResponse {
  query: string;
  results: WebsiteResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ImageSearchResponse {
  query: string;
  results: ImageResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface VideoSearchResponse {
  query: string;
  results: VideoResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PlaceSearchResponse {
  query: string;
  results: PlaceResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchHistoryListResponse {
  histories: SearchHistory[];
  meta: PaginationMeta;
}

// ==================== AI ====================

export interface AISearchResponse {
  query: string;
  summary: string;
  sources: MessageSource[];
  keywords?: string[];
}

export interface ChatSessionListResponse {
  sessions: ChatSession[];
  meta: PaginationMeta;
}

// Re-export for convenience
export type { ChatSessionDetail, ChatMessage };

// ==================== Folders ====================

export interface FolderListResponse {
  folders: Folder[];
  meta: PaginationMeta;
}

export interface FolderItemListResponse {
  items: FolderItem[];
  meta: PaginationMeta;
}

export interface ShareFolderResponse {
  folderId: string;
  isPublic: boolean;
  shareUrl?: string;
}

export interface CheckItemInFoldersResponse {
  isSaved: boolean;
  folderIds: string[];
  folders: FolderSummary[];
}

export interface FolderSummary {
  id: string;
  name: string;
}

// Re-export for convenience
export type { FolderDetail, Folder, FolderItem };

// ==================== Favorites ====================

export interface FavoriteListResponse {
  favorites: Favorite[];
  meta: PaginationMeta;
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
  favoriteId?: string;
}

// Re-export for convenience
export type { Favorite };

// ==================== Utility ====================

export interface TranslateResponse {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedLang?: string;
}

export interface DetectLanguageResponse {
  text: string;
  language: string;
  confidence: number;
}

export interface GenerateQRResponse {
  content: string;
  qrCodeUrl: string;
  size: number;
  format: string;
}

export interface CalculateDistanceResponse {
  distanceMeters: number;
  distanceKm: number;
  distanceText: string;
}
