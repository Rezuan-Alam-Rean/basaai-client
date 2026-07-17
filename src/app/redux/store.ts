import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import notificationReducer from "./features/notifications/notificationSlice";
import { baseApi } from "./baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
