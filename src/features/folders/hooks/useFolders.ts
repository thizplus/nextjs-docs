import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foldersService } from '@/services';
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

// Query Keys
export const foldersKeys = {
  all: ['folders'] as const,
  lists: () => [...foldersKeys.all, 'list'] as const,
  list: (params?: GetFoldersRequest) => [...foldersKeys.lists(), params] as const,
  details: () => [...foldersKeys.all, 'detail'] as const,
  detail: (id: string) => [...foldersKeys.details(), id] as const,
  public: (id: string) => [...foldersKeys.all, 'public', id] as const,
  items: (folderId: string, params?: GetFolderItemsRequest) =>
    [...foldersKeys.all, 'items', folderId, params] as const,
};

// ==================== Folder CRUD ====================

/**
 * Get folders list hook
 */
export function useFolders(params?: GetFoldersRequest) {
  return useQuery({
    queryKey: foldersKeys.list(params),
    queryFn: async () => {
      const response = await foldersService.list(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Get folder detail hook
 */
export function useFolderDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: foldersKeys.detail(id),
    queryFn: async () => {
      const response = await foldersService.getDetail(id);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!id,
  });
}

/**
 * Get public folder hook
 */
export function usePublicFolder(id: string, enabled = true) {
  return useQuery({
    queryKey: foldersKeys.public(id),
    queryFn: async () => {
      const response = await foldersService.getPublic(id);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!id,
  });
}

/**
 * Create folder mutation
 */
export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateFolderRequest) => {
      const response = await foldersService.create(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
    },
  });
}

/**
 * Update folder mutation
 */
export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...request }: UpdateFolderRequest & { id: string }) => {
      const response = await foldersService.update(id, request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(variables.id) });
    },
  });
}

/**
 * Delete folder mutation
 */
export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await foldersService.delete(id);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
    },
  });
}

/**
 * Share folder mutation
 */
export function useShareFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...request }: ShareFolderRequest & { id: string }) => {
      const response = await foldersService.share(id, request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
    },
  });
}

// ==================== Folder Items ====================

/**
 * Get folder items hook
 */
export function useFolderItems(folderId: string, params?: GetFolderItemsRequest, enabled = true) {
  return useQuery({
    queryKey: foldersKeys.items(folderId, params),
    queryFn: async () => {
      const response = await foldersService.getItems(folderId, params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!folderId,
  });
}

/**
 * Add item to folder mutation
 */
export function useAddFolderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      ...request
    }: AddFolderItemRequest & { folderId: string }) => {
      const response = await foldersService.addItem(folderId, request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(variables.folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.items(variables.folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
      // Invalidate check query to update heart icon
      queryClient.invalidateQueries({ queryKey: [...foldersKeys.all, 'check'] });
    },
  });
}

/**
 * Update folder item mutation
 */
export function useUpdateFolderItem(folderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      ...request
    }: UpdateFolderItemRequest & { itemId: string }) => {
      const response = await foldersService.updateItem(itemId, request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.items(folderId) });
    },
  });
}

/**
 * Delete folder item mutation
 */
export function useDeleteFolderItem(folderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await foldersService.deleteItem(itemId);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.items(folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.lists() });
      // Invalidate check query to update heart icon
      queryClient.invalidateQueries({ queryKey: [...foldersKeys.all, 'check'] });
    },
  });
}

/**
 * Reorder folder items mutation
 */
export function useReorderFolderItems(folderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: ReorderItemsRequest) => {
      const response = await foldersService.reorderItems(folderId, request);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersKeys.detail(folderId) });
      queryClient.invalidateQueries({ queryKey: foldersKeys.items(folderId) });
    },
  });
}

/**
 * Check if item is saved in any folder
 */
export function useCheckItemInFolders(url: string, enabled = true) {
  return useQuery({
    queryKey: [...foldersKeys.all, 'check', url] as const,
    queryFn: async () => {
      const response = await foldersService.checkItem(url);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!url,
  });
}
