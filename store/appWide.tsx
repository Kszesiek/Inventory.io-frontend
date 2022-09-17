import {createSlice} from "@reduxjs/toolkit";

export const appWideSlice = createSlice({
  name: 'appWide',
  initialState: {
    theme: 'auto' as 'auto' | 'light' | 'dark',
    demoMode: true,
    username: undefined as string | undefined,
    userId: undefined as string | undefined,
  },
  reducers: {
    setTheme: (state, action: {payload: 'auto' | 'light' | 'dark'}) => {
      state.theme = action.payload;
    },
    setDemoMode: (state, action: {payload: boolean}) => {
      state.demoMode = action.payload;
    },
    signOut: (state) => {
      state.username = undefined;
      state.userId = undefined;
    },
    signIn: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
  },
});

export const appWideActions = appWideSlice.actions;
export default appWideSlice.reducer;