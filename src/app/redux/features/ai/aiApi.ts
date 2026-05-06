import { baseApi } from "../../baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiHistory: builder.query<any, void>({
      query: () => "/ai/history",
    }),
    secureChat: builder.mutation<any, { message: string }>({
      query: (body) => ({
        url: "/ai/secure-chat",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetAiHistoryQuery, useSecureChatMutation } = aiApi;
