import { baseApi } from "../../baseApi";
import { setUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: "/users/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          dispatch(setUser(data.user || data));
        } catch (error) {}
      },
    }),
    register: builder.mutation<any, Record<string, unknown>>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),
    googleAuth: builder.mutation<any, { idToken: string }>({
      query: (body) => ({ url: "/users/google", method: "POST", body }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem("token", data.token);
          }
          dispatch(setUser(data.user || data));
        } catch (error) {}
      },
    }),
    getMe: builder.query<any, void>({
      query: () => "/users/me",
      providesTags: ["Auth"],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user || data));
        } catch (error) {}
      },
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGoogleAuthMutation, 
  useGetMeQuery 
} = authApi;
