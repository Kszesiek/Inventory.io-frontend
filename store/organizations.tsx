import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Organization {
  id: string;
  name: string;
  short_name: string;
  description: string;
}

export interface OrganizationTemplate {
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
    currentOrganization: undefined as Organization | undefined,

  },
  reducers: {
    signOut: (state) => {
      state.organizations = [];
      state.currentOrganization = undefined;
    },
    setCurrentOrganization: (state, action: PayloadAction<Organization>) => {
      state.currentOrganization = action.payload;
    },
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
      if (action.payload.length > 0) {
        state.currentOrganization = action.payload[0];
      }
    },
    addOrganization: (state, action: PayloadAction<Organization>) => {
      if (!state.organizations.some(organization => organization.id === action.payload.id)) {
        state.organizations = state.organizations.concat([action.payload]);
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      if (state.organizations.find(organization => organization.id === action.payload)) {
        state.organizations = state.organizations.filter(organization => organization.id !== action.payload);
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