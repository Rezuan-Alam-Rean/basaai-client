import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  unreadMessages: number;
}

const initialState: NotificationState = {
  unreadMessages: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setUnreadMessages: (state, action: PayloadAction<number>) => {
      state.unreadMessages = Math.max(0, action.payload);
    },
    incrementUnreadMessages: (state, action: PayloadAction<number | undefined>) => {
      state.unreadMessages += action.payload ?? 1;
    },
    decrementUnreadMessages: (state, action: PayloadAction<number | undefined>) => {
      state.unreadMessages = Math.max(0, state.unreadMessages - (action.payload ?? 1));
    },
    clearUnreadMessages: (state) => {
      state.unreadMessages = 0;
    },
  },
});

export const {
  setUnreadMessages,
  incrementUnreadMessages,
  decrementUnreadMessages,
  clearUnreadMessages,
} = notificationSlice.actions;

export default notificationSlice.reducer;
