import {createSlice} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const appWideSlice = createSlice({
  name: 'appWide',
  initialState: {
    theme: 'auto' as 'auto' | 'light' | 'dark',
    demoMode: true,
    username: undefined as string | undefined,
    userId: undefined as string | undefined,
    token: undefined as string | undefined,
  },
  reducers: {
    setTheme: (state, action: {payload: 'auto' | 'light' | 'dark'}) => {
      state.theme = action.payload;
    },
    setDemoMode: (state, action: {payload: boolean}) => {
      state.demoMode = action.payload;
      AsyncStorage.setItem("demoMode", action.payload ? "true" : "false");
    },
    signOut: (state) => {
      state.username = undefined;
      state.userId = undefined;
      state.token = undefined;

      AsyncStorage.removeItem("username");
      AsyncStorage.removeItem("userId");
      AsyncStorage.removeItem("token");
    },
    signIn: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
      state.token = action.payload.token;

      AsyncStorage.setItem("username", action.payload.username);
      AsyncStorage.setItem("userId", action.payload.userId);
      AsyncStorage.setItem("token", action.payload.token);
    },
  },
});

export const appWideActions = appWideSlice.actions;
export default appWideSlice.reducer;