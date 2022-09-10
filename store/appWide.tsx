import {createSlice} from "@reduxjs/toolkit";

export const appWideSlice = createSlice({
  name: 'appWide',
  initialState: {
    theme: 'auto' as 'auto' | 'light' | 'dark',
    demoMode: false,
  },
  reducers: {
    setTheme: (state, action: {payload: 'auto' | 'light' | 'dark'}) => {
      state.theme = action.payload;
    },
    setAutoTheme: (state) => {
      state.theme = 'auto';
    },
    setLightTheme: (state) => {
      state.theme = 'light';
    },
    setDarkTheme: (state) => {
      state.theme = 'dark';
    },
    enableDemoMode: (state) => {
      state.demoMode = true;
    },
    disableDemoMode: (state) => {
      state.demoMode = false;
    },
  },
});

export const appWideActions = appWideSlice.actions;
export default appWideSlice.reducer;