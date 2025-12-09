// API Request types

import type {
  SearchType,
  ItemType,
  LanguageCode,
  QRCodeFormat,
  VideoOrderType,
  ImageSizeType,
} from './common';

// ==================== Auth ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// ==================== Search ====================

export interface GeneralSearchRequest {
  q: string;
  type?: SearchType;
  page?: number;
  pageSize?: number;
  lang?: string;
}

export interface WebsiteSearchRequest {
  q: string;
  page?: number;
  pageSize?: number;
}

export interface ImageSearchRequest {
  q: string;
  page?: number;
  pageSize?: number;
  size?: ImageSizeType;
}

export interface VideoSearchRequest {
  q: string;
  page?: number;
  pageSize?: number;
  order?: VideoOrderType;
}

export interface GetSearchHistoryRequest {
  type?: SearchType;
  page?: number;
  pageSize?: number;
}

// ==================== Places ====================

export interface PlaceSearchRequest {
  q: string;
  lat?: number;
  lng?: number;
  radius?: number;
  type?: string;
  page?: number;
  pageSize?: number;
}

export interface NearbySearchRequest {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

// ==================== AI ====================

export interface AISearchRequest {
  q: string;
  lang?: string;
}

export interface CreateChatRequest {
  query: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface GetChatSessionsRequest {
  page?: number;
  pageSize?: number;
}

// ==================== Folders ====================

export interface CreateFolderRequest {
  name: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}

export interface UpdateFolderRequest {
  name?: string;
  description?: string;
  coverImageUrl?: string;
  isPublic?: boolean;
}

export interface GetFoldersRequest {
  page?: number;
  pageSize?: number;
  isPublic?: boolean;
}

export interface AddFolderItemRequest {
  type: ItemType;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateFolderItemRequest {
  title?: string;
  description?: string;
  sortOrder?: number;
}

export interface GetFolderItemsRequest {
  type?: ItemType;
  page?: number;
  pageSize?: number;
}

export interface ReorderItemsRequest {
  itemOrders: {
    itemId: string;
    sortOrder: number;
  }[];
}

export interface ShareFolderRequest {
  isPublic: boolean;
}

// ==================== Favorites ====================

export interface AddFavoriteRequest {
  type: ItemType;
  externalId?: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  metadata?: Record<string, unknown>;
}

export interface GetFavoritesRequest {
  type?: ItemType;
  page?: number;
  pageSize?: number;
}

export interface CheckFavoriteRequest {
  type: ItemType;
  url?: string;
  externalId?: string;
}

// ==================== Utility ====================

export interface TranslateRequest {
  text: string;
  sourceLang?: LanguageCode;
  targetLang: LanguageCode;
}

export interface DetectLanguageRequest {
  text: string;
}

export interface GenerateQRRequest {
  content: string;
  size?: number;
  format?: QRCodeFormat;
}

export interface CalculateDistanceRequest {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
}
