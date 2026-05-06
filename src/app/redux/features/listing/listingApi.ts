import { baseApi } from "../../baseApi";

export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyListings: builder.query<any, void>({
      query: () => "/listings/me",
      providesTags: ["Listing"],
    }),
    getListing: builder.query<any, string>({
      query: (id) => `/listings/${id}`,
      providesTags: (result, error, id) => [{ type: "Listing", id }],
    }),
    getListings: builder.query<any, any>({
      query: (params) => ({
        url: "/listings",
        params,
      }),
      providesTags: ["Listing"],
    }),
    toggleListing: builder.mutation<any, string>({
      query: (id) => ({
        url: `/listings/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Listing"],
    }),
    deleteListing: builder.mutation<any, string>({
      query: (id) => ({
        url: `/listings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Listing"],
    }),
    addListing: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/listings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Listing"],
    }),
    updateListing: builder.mutation<any, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/listings/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Listing"],
    }),
    saveListing: builder.mutation<any, string>({
      query: (id) => ({ url: `/listings/${id}/save`, method: "POST" }),
      invalidatesTags: ["Listing"],
    }),
    getSavedListings: builder.query<any, void>({
      query: () => ({ url: "/listings/saved" }),
      providesTags: ["Listing"],
    }),
  }),
});

export const { 
  useGetMyListingsQuery, 
  useGetListingQuery,
  useGetListingsQuery,
  useGetSavedListingsQuery,
  useToggleListingMutation, 
  useDeleteListingMutation,
  useAddListingMutation,
  useUpdateListingMutation
  , useSaveListingMutation
} = listingApi;
