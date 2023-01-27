import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface MemberTemplate {
  username: string
  name: string
  surname: string
  email: string
}

export interface Member {
  id: string
  username: string
  name: string
  surname: string
  email: string
}

export function isMember(object: any): object is Member {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['id'] === 'string' &&
    typeof object['username'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['surname'] === 'string' &&
    typeof object['email'] === 'string'
  );
}

export function memberFromTemplate(memberTemplate: MemberTemplate, memberId?: string): Member {
  return {
    id: memberId || Math.random().toString(),
    username: memberTemplate.username,
    name: memberTemplate.name,
    surname: memberTemplate.surname,
    email: memberTemplate.email,
  }
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
    updateOrAddMember: (state, action: PayloadAction<Member>) => {
      const newMembers: typeof state.members = state.members.filter((member) => member.id !== action.payload.id);
      newMembers.push(action.payload);
      state.members = newMembers;
    },
    updateOrAddMembers: (state, action: PayloadAction<Member[]>) => {
      const memberIndexes: string[] = action.payload.map((member) => member.id);
      const newMembers: typeof state.members = state.members.filter((member) => !memberIndexes.includes(member.id));
      newMembers.push(...action.payload);
      state.members = newMembers;
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