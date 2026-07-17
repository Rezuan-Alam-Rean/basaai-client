import { baseApi } from "../../baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAiHistory: builder.query<any, void>({
      query: () => "/ai/history",
      providesTags: ["AI"],
    }),
    secureChat: builder.mutation<any, { message: string }>({
      query: (body) => ({
        url: "/ai/secure-chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AI"],
    }),
    clearAiHistory: builder.mutation<any, void>({
      query: () => ({
        url: "/ai/history",
        method: "DELETE",
      }),
      invalidatesTags: ["AI"],
    }),
  }),
});

export const { useClearAiHistoryMutation, useGetAiHistoryQuery, useSecureChatMutation } = aiApi;
