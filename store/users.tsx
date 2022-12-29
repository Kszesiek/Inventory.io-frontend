import {createSlice} from "@reduxjs/toolkit";

export interface UserTemplate {
  username: string
  name: string
  surname: string
}

export interface User extends UserTemplate{
  id: string
}

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: new Array<User>(),
  },
  reducers: {
    addUser: (state, action) => {
      if (!state.users.some(user => user.id === action.payload.user.id)) {
        state.users.push(action.payload.user);
      }
    },
    removeUser: (state, action) => {
      if (state.users.find(user => user.id === action.payload.id)) {
        state.users = state.users.filter(user => user.id !== action.payload.id);
      }
    },

    modifyUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.user.id);
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