import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/services';
import type {
  AISearchRequest,
  CreateChatRequest,
  SendMessageRequest,
  GetChatSessionsRequest,
} from '@/shared/types/request';

// Query Keys
export const aiKeys = {
  all: ['ai'] as const,
  search: (params?: AISearchRequest) => [...aiKeys.all, 'search', params] as const,
  sessions: (params?: GetChatSessionsRequest) => [...aiKeys.all, 'sessions', params] as const,
  session: (sessionId: string) => [...aiKeys.all, 'session', sessionId] as const,
};

/**
 * AI Search hook
 */
export function useAISearch(params: AISearchRequest, enabled = true) {
  return useQuery({
    queryKey: aiKeys.search(params),
    queryFn: async () => {
      const response = await aiService.search(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!params.q,
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });
}

/**
 * Get chat sessions hook
 */
export function useChatSessions(params?: GetChatSessionsRequest) {
  return useQuery({
    queryKey: aiKeys.sessions(params),
    queryFn: async () => {
      const response = await aiService.getChatSessions(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
  });
}

/**
 * Get chat session detail hook
 */
export function useChatSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: aiKeys.session(sessionId),
    queryFn: async () => {
      const response = await aiService.getChatDetail(sessionId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    enabled: enabled && !!sessionId,
  });
}

/**
 * Create chat session mutation
 */
export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateChatRequest) => {
      const response = await aiService.createChat(request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.sessions() });
    },
  });
}

/**
 * Send message mutation
 */
export function useSendMessage(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      const response = await aiService.sendMessage(sessionId, request);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.session(sessionId) });
    },
  });
}

/**
 * Delete chat session mutation
 */
export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await aiService.deleteChat(sessionId);
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.sessions() });
    },
  });
}

/**
 * Clear all chat sessions mutation
 */
export function useClearAllChats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await aiService.clearAllChats();
      if (!response.success) {
        throw new Error(response.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiKeys.sessions() });
    },
  });
}
