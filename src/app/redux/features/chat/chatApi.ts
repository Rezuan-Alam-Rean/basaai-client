import { baseApi } from "../../baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatHistory: builder.query<any, void>({
      query: () => "/ai/history",
      providesTags: ["Chat"],
    }),
    secureChat: builder.mutation<any, { message: string }>({
      query: (body) => ({ url: "/ai/secure-chat", method: "POST", body }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const { useGetChatHistoryQuery, useSecureChatMutation } = chatApi;
