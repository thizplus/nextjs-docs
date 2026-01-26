// Admin Dashboard Types

// =====================
// Dashboard Overview
// =====================

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalFavorites: number;
  totalFolders: number;
  totalPageViews: number;
}

// =====================
// Page Analytics
// =====================

export interface PageViewStats {
  pageName: string;
  pagePath: string;
  viewCount: number;
  uniqueUsers: number;
}

export interface PopularSearchStats {
  query: string;
  searchType: string;
  count: number;
}

export interface PageAnalyticsResponse {
  topPages: PageViewStats[];
  popularSearches: PopularSearchStats[];
  viewTrend: TrendData[];
  totalViews: number;
  totalSearches: number;
}

// =====================
// Folder Statistics
// =====================

export interface FolderStats {
  totalFolders: number;
  publicFolders: number;
  privateFolders: number;
  totalItems: number;
  avgItemsPerFolder: number;
}

export interface TopFolderStats {
  folderId: string;
  folderName: string;
  ownerName: string;
  ownerEmail: string;
  itemCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface FolderAnalyticsResponse {
  stats: FolderStats;
  topFolders: TopFolderStats[];
  creationTrend: TrendData[];
}

// =====================
// Favorite Statistics
// =====================

export interface FavoriteStats {
  totalFavorites: number;
  byType: Record<string, number>;
}

export interface TopFavoritedItem {
  externalId: string;
  title: string;
  type: string;
  thumbnailUrl: string;
  favoriteCount: number;
}

export interface TypeBreakdown {
  type: string;
  count: number;
  percentage: number;
}

export interface FavoriteAnalyticsResponse {
  stats: FavoriteStats;
  topItems: TopFavoritedItem[];
  favoriteTrend: TrendData[];
  typeBreakdown: TypeBreakdown[];
}

// =====================
// Common Types
// =====================

export interface TrendData {
  date: string;
  count: number;
}

// =====================
// Request Types
// =====================

export interface PageAnalyticsRequest {
  days?: number;
  limit?: number;
}

export interface FavoriteAnalyticsRequest {
  days?: number;
  limit?: number;
  itemType?: string;
}

export interface TrackPageViewRequest {
  pagePath: string;
  pageName?: string;
  metadata?: Record<string, string>;
  sessionId?: string;
}

// =====================
// Cleanup Response
// =====================

export interface CleanupResponse {
  deletedCount: number;
  retentionDays: number;
}
