import {createSlice} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {possibleAccents, possibleThemes} from "../constants/Colors";

export const appWideSlice = createSlice({
  name: 'appWide',
  initialState: {
    theme: 'auto' as 'auto' | typeof possibleThemes[number],
    accent: 'OG Frozen Gold' as typeof possibleAccents[number],
    demoMode: true,
    username: undefined as string | undefined,
    name: undefined as string | undefined,
    surname: undefined as string | undefined,
    email: undefined as string | undefined,
    organizationName: undefined as string | undefined,
  },
  reducers: {
    setTheme: (state, action: {payload: 'auto' | typeof possibleThemes[number]}) => {
      state.theme = action.payload;
    },
    setAccent: (state, action: {payload: typeof possibleAccents[number]}) => {
      state.accent = action.payload;
    },
    setDemoMode: (state, action: {payload: boolean}) => {
      state.demoMode = action.payload;
      AsyncStorage.setItem("demoMode", action.payload ? "true" : "false");
    },
    signOut: (state) => {
      state.username = undefined;
      state.name = undefined;
      state.surname = undefined;
      state.email = undefined;
      state.organizationName = undefined;

      AsyncStorage.multiRemove([
        "username",
        "name",
        "surname",
        "email",
        "organizationName",
      ]);
    },
    signIn: (state, action) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.email = action.payload.email;

      AsyncStorage.multiSet([
        ["username", action.payload.username],
        ["name", action.payload.name],
        ["surname", action.payload.surname],
        ["email", action.payload.email],
      ]);
    },
  },
});

export const appWideActions = appWideSlice.actions;
export default appWideSlice.reducer;