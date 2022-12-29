import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface MemberTemplate {
  username: string
  name: string
  surname: string
}

export interface Member extends MemberTemplate {
  id: string
}

export function isMember(object: any): object is Member {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['id'] === 'string' &&
    typeof object['username'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['surname'] === 'string'
  );
}

export const membersSlice = createSlice({
  name: 'members',
  initialState: {
    members: new Array<Member>(),
  },
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      if (!state.members.some(member => member.id === action.payload.id)) {
        state.members.push(action.payload);
      }
    },
    removeMember: (state, action: PayloadAction<string>) => {
      if (state.members.find(member => member.id === action.payload)) {
        state.members = state.members.filter(member => member.id !== action.payload);
      }
    },
    modifyMember: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index >= 0) {
        state.members[index] = action.payload;
      }
    },
    loadMembers: (state, action) => {
      state.members = action.payload;
    },
    wipeMembers: (state) => {
      state.members = [];
    }
  },
});

export const membersActions = membersSlice.actions;
export default membersSlice.reducer;