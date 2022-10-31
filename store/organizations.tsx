import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Organization {
  id: string;
  name: string;
  short_name: string;
  description: string;
}

export function isOrganization(object: any): object is Organization {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['id'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['short_name'] === 'string' &&
    typeof object['description'] === 'string'
  );
}

export const organizationsSlice = createSlice({
  name: 'organizations',
  initialState: {
    organizations: new Array<Organization>(),
  },
  reducers: {
    signOut: (state) => {
      state.organizations = [];
    },
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    addOrganization: (state, action) => {
      if (!state.organizations.some(organization => organization.id === action.payload.id)) {
        state.organizations.push(action.payload);
      }
    },
    removeOrganization: (state, action: PayloadAction<{id: Organization["id"]}>) => {
      if (state.organizations.find(organization => organization.id === action.payload.id)) {
        state.organizations = state.organizations.filter(organization => organization.id !== action.payload.id);
      }
    },
    modifyOrganization: (state, action) => {
      const index = state.organizations.findIndex(organization => organization.id === action.payload.organization.id);
      if (index >= 0) {
        state.organizations[index] = action.payload.organization;
      }
    },
    wipeOrganizations: (state) => {
      state.organizations = [];
    }
  },
});

export const organizationsActions = organizationsSlice.actions;
export default organizationsSlice.reducer;