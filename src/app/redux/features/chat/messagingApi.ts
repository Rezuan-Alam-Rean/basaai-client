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
  }),
});

export const { 
  useGetConversationsQuery, 
  useGetConversationWithQuery, 
  useLazyGetConversationWithQuery,
  useGetMessagesQuery, 
  useSendMessageMutation 
} = messagingApi;
