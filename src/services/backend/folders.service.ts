import { apiClient } from '@/shared/lib/api';
import { FOLDER_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common';
import type {
  CreateFolderRequest,
  UpdateFolderRequest,
  GetFoldersRequest,
  AddFolderItemRequest,
  UpdateFolderItemRequest,
  GetFolderItemsRequest,
  ReorderItemsRequest,
  ShareFolderRequest,
} from '@/shared/types/request';
import type {
  FolderListResponse,
  FolderDetail,
  Folder,
  FolderItem,
  FolderItemListResponse,
  ShareFolderResponse,
  CheckItemInFoldersResponse,
} from '@/shared/types/response';

export const foldersService = {
  // ==================== Folder CRUD ====================

  /**
   * Create new folder
   */
  create: async (request: CreateFolderRequest): Promise<ApiResponse<Folder>> => {
    const { data } = await apiClient.post<ApiResponse<Folder>>(
      FOLDER_API.CREATE,
      request
    );
    return data;
  },

  /**
   * Get all folders
   */
  list: async (
    params?: GetFoldersRequest
  ): Promise<PaginatedResponse<FolderListResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<FolderListResponse>>(
      FOLDER_API.LIST,
      { params }
    );
    return data;
  },

  /**
   * Get folder detail with items
   */
  getDetail: async (id: string): Promise<ApiResponse<FolderDetail>> => {
    const { data } = await apiClient.get<ApiResponse<FolderDetail>>(
      FOLDER_API.DETAIL(id)
    );
    return data;
  },

  /**
   * Update folder
   */
  update: async (
    id: string,
    request: UpdateFolderRequest
  ): Promise<ApiResponse<Folder>> => {
    const { data } = await apiClient.put<ApiResponse<Folder>>(
      FOLDER_API.UPDATE(id),
      request
    );
    return data;
  },

  /**
   * Delete folder
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      FOLDER_API.DELETE(id)
    );
    return data;
  },

  // ==================== Sharing ====================

  /**
   * Share/unshare folder
   */
  share: async (
    id: string,
    request: ShareFolderRequest
  ): Promise<ApiResponse<ShareFolderResponse>> => {
    const { data } = await apiClient.post<ApiResponse<ShareFolderResponse>>(
      FOLDER_API.SHARE(id),
      request
    );
    return data;
  },

  /**
   * Get public folder (no auth required)
   */
  getPublic: async (id: string): Promise<ApiResponse<FolderDetail>> => {
    const { data } = await apiClient.get<ApiResponse<FolderDetail>>(
      FOLDER_API.PUBLIC(id)
    );
    return data;
  },

  // ==================== Folder Items ====================

  /**
   * Add item to folder
   */
  addItem: async (
    folderId: string,
    request: AddFolderItemRequest
  ): Promise<ApiResponse<FolderItem>> => {
    const { data } = await apiClient.post<ApiResponse<FolderItem>>(
      FOLDER_API.ITEMS(folderId),
      request
    );
    return data;
  },

  /**
   * Get folder items
   */
  getItems: async (
    folderId: string,
    params?: GetFolderItemsRequest
  ): Promise<PaginatedResponse<FolderItemListResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<FolderItemListResponse>>(
      FOLDER_API.ITEMS(folderId),
      { params }
    );
    return data;
  },

  /**
   * Update folder item
   */
  updateItem: async (
    itemId: string,
    request: UpdateFolderItemRequest
  ): Promise<ApiResponse<FolderItem>> => {
    const { data } = await apiClient.put<ApiResponse<FolderItem>>(
      FOLDER_API.ITEM_UPDATE(itemId),
      request
    );
    return data;
  },

  /**
   * Delete folder item
   */
  deleteItem: async (itemId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      FOLDER_API.ITEM_DELETE(itemId)
    );
    return data;
  },

  /**
   * Reorder folder items
   */
  reorderItems: async (
    folderId: string,
    request: ReorderItemsRequest
  ): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.put<ApiResponse<null>>(
      FOLDER_API.ITEMS_REORDER(folderId),
      request
    );
    return data;
  },

  /**
   * Check if item is saved in any folder
   */
  checkItem: async (url: string): Promise<ApiResponse<CheckItemInFoldersResponse>> => {
    const { data } = await apiClient.get<ApiResponse<CheckItemInFoldersResponse>>(
      FOLDER_API.ITEMS_CHECK,
      { params: { url } }
    );
    return data;
  },
};
