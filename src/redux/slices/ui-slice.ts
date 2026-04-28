import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isHydrated: boolean;
}

const initialState: UiState = {
  isHydrated: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.isHydrated = action.payload;
    },
  },
});

export const { setHydrated } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
