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
    users: new Array<User>(),
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
    loadUsers: (state, action) => {
      state.users = action.payload;
    },
    wipeUsers: (state) => {
      state.users = [];
    }
  },
});

export const userActions = usersSlice.actions;
export default usersSlice.reducer;