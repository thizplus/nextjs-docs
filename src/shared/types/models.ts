// Data models - represent entities from the API

import type { ItemType, ChatRole, UserRole } from './common';

// ==================== User ====================

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: UserRole;
  isActive: boolean;
  studentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Search Results ====================

export interface WebsiteResult {
  title: string;
  url: string;
  snippet: string;
  displayLink: string;
  formattedAt?: string;
}

export interface ImageResult {
  title: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  source: string;
  contextLink: string;
}

export interface VideoResult {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: number;
  likeCount?: number;
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceLevel?: number;
  types: string[];
  photoUrl?: string;
  isOpen?: boolean;
  distance?: number;
  distanceText?: string;
}

// ==================== Place Detail ====================

export interface PlaceReview {
  author: string;
  rating: number;
  text: string;
  time: string;
  photoUrl?: string;
}

export interface PlacePhoto {
  url: string;
  width: number;
  height: number;
}

export interface PlaceDetail {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceLevel?: number;
  types: string[];
  phone?: string;
  website?: string;
  googleMapsUrl: string;
  openingHours?: string[];
  reviews?: PlaceReview[];
  photos?: PlacePhoto[];
  distance?: number;
  distanceText?: string;
}

// ==================== Search History ====================

export interface SearchHistory {
  id: string;
  query: string;
  searchType: string;
  resultCount: number;
  createdAt: string;
}

// ==================== AI ====================

export interface MessageSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  sources?: MessageSource[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  initialQuery: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

// ==================== Folders ====================

export interface Folder {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  isPublic: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FolderItem {
  id: string;
  folderId: string;
  type: ItemType;
  title: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  sortOrder: number;
  createdAt: string;
}

export interface FolderDetail extends Folder {
  items: FolderItem[];
}

// ==================== Favorites ====================

export interface Favorite {
  id: string;
  type: ItemType;
  externalId?: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ==================== Metadata Types ====================

export interface PlaceMetadata {
  placeId: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  address?: string;
  types?: string[];
}

export interface VideoMetadata {
  videoId: string;
  channelTitle?: string;
  duration?: string;
  viewCount?: number;
}

export interface WebsiteMetadata {
  displayLink?: string;
  snippet?: string;
}

export interface ImageMetadata {
  width?: number;
  height?: number;
  source?: string;
}
