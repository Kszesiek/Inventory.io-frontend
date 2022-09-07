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
    users: new Array<User>(
      {
        userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
        username: "itsmejohndoe",
        name: "John",
        surname: "Doe",
      },
      {
        userId: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
        username: "JustClarence",
        name: "Clarence",
        surname: "Walter",
      },{
        userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        username: "YourGuyRoy",
        name: "Roy",
        surname: "Whitings",
      },{
        userId: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
        username: "TheRealGlobetrotterGrover",
        name: "Grover",
        surname: "Globetrotter",
      },
    )
  },
  reducers: {
    addUser: (state, action) => {
      if (!state.users.some(user => user.userId === action.payload.user.userId)) {
        state.users.push(action.payload.user);
      }
    },
    removeUser: (state, action) => {
      if (state.users.find(user => user.userId === action.payload.userId)) {
        state.users = state.users.filter(user => user.userId !== action.payload.userId);
      }
    },

    modifyUser: (state, action) => {
      const index = state.users.findIndex(user => user.userId === action.payload.user.userId);
      if (index >= 0) {
        state.users[index] = action.payload.user;
      }
    },
  },
});

export const userActions = usersSlice.actions;
export default usersSlice.reducer;