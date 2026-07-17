import { baseApi } from "../../baseApi";

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<any, void>({
      query: () => "/messages/conversations",
      providesTags: ["Chat"],
    }),
    getConversationWith: builder.query<any, string>({
      query: (ownerId) => `/messages/conversations/with/${ownerId}`,
      providesTags: ["Chat"],
    }),
    getMessages: builder.query<any, string>({
      query: (convoId) => `/messages/conversations/${convoId}/messages`,
      providesTags: ["Chat"],
    }),
    sendMessage: builder.mutation<any, FormData | { recipientId: string; text: string }>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
    updateMessage: builder.mutation<any, { messageId: string; text: string }>({
      query: ({ messageId, text }) => ({
        url: `/messages/${messageId}`,
        method: "PATCH",
        body: { text },
      }),
    }),
    deleteMessage: builder.mutation<any, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    deleteConversation: builder.mutation<any, string>({
      query: (convoId) => ({
        url: `/messages/conversations/${convoId}`,
        method: "DELETE",
      }),
    }),
    markConversationRead: builder.mutation<any, string>({
      query: (convoId) => ({
        url: `/messages/conversations/${convoId}/read`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { 
  useGetConversationsQuery, 
  useGetConversationWithQuery,
  useLazyGetConversationWithQuery,
  useGetMessagesQuery, 
  useSendMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useDeleteConversationMutation,
  useMarkConversationReadMutation,
} = messagingApi;
