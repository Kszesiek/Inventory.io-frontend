import {createSlice} from "@reduxjs/toolkit";

export class User {
  userId: string
  username: string
  name: string
  surname: string

  constructor(userId: string, username: string, name: string, surname: string) {
    this.userId = userId;
    this.username = username;
    this.name = name;
    this.surname = surname;
  }
}

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: new Map<string, User>([
      ["eed0be02-f83e-46c8-a4aa-2dcae02dc12f", new User(
        "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        "itsmejohndoe",
        "John",
        "Doe",
      )],
      ["b517ed77-5ce5-4457-ba1e-b8a1fba4d376", new User(
        "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        "JustClarence",
        "Clarence",
        "Walter",
      )],
      ["f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab", new User(
        "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        "YourGuyRoy",
        "Roy",
        "Whitings",
      )],
      ["7f7feb57-d63d-4fc4-b60c-8281c5c8109c", new User(
        "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        "TheRealGlobetrotterGrover",
        "Grover",
        "Globetrotter",
      )],
    ])
  },
  reducers: {
    addUser: (state, action) => {
      if (!state.users.has(action.payload.user.userId)) {
        state.users.set(action.payload.user.userId, action.payload.user);
      }
    },
    removeUser: (state, action) => {
      state.users.delete(action.payload.userId);
    },
  },
});

export const addUser = usersSlice.actions.addUser;
export const removeUser = usersSlice.actions.removeUser;
export default usersSlice.reducer;