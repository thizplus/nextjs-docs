import { apiClient } from '@/shared/lib/api';
import { AI_API } from '@/shared/lib/api/constants/api';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common';
import type {
  AISearchRequest,
  CreateChatRequest,
  SendMessageRequest,
  GetChatSessionsRequest,
} from '@/shared/types/request';
import type {
  AISearchResponse,
  ChatSessionListResponse,
  ChatSessionDetail,
  ChatMessage,
} from '@/shared/types/response';

export const aiService = {
  /**
   * AI Search - Quick AI-powered search with summary
   */
  search: async (
    params: AISearchRequest
  ): Promise<ApiResponse<AISearchResponse>> => {
    const { data } = await apiClient.get<ApiResponse<AISearchResponse>>(
      AI_API.SEARCH,
      { params }
    );
    return data;
  },

  /**
   * Create new chat session
   */
  createChat: async (
    request: CreateChatRequest
  ): Promise<ApiResponse<ChatSessionDetail>> => {
    const { data } = await apiClient.post<ApiResponse<ChatSessionDetail>>(
      AI_API.CHAT,
      request
    );
    return data;
  },

  /**
   * Get all chat sessions
   */
  getChatSessions: async (
    params?: GetChatSessionsRequest
  ): Promise<PaginatedResponse<ChatSessionListResponse>> => {
    const { data } = await apiClient.get<PaginatedResponse<ChatSessionListResponse>>(
      AI_API.CHAT,
      { params }
    );
    return data;
  },

  /**
   * Get chat session detail
   */
  getChatDetail: async (
    sessionId: string
  ): Promise<ApiResponse<ChatSessionDetail>> => {
    const { data } = await apiClient.get<ApiResponse<ChatSessionDetail>>(
      AI_API.CHAT_DETAIL(sessionId)
    );
    return data;
  },

  /**
   * Send message to chat session
   */
  sendMessage: async (
    sessionId: string,
    request: SendMessageRequest
  ): Promise<ApiResponse<ChatMessage>> => {
    const { data } = await apiClient.post<ApiResponse<ChatMessage>>(
      AI_API.CHAT_MESSAGES(sessionId),
      request
    );
    return data;
  },

  /**
   * Delete chat session
   */
  deleteChat: async (sessionId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      AI_API.CHAT_DETAIL(sessionId)
    );
    return data;
  },

  /**
   * Clear all chat sessions
   */
  clearAllChats: async (): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(AI_API.CHAT);
    return data;
  },
};
