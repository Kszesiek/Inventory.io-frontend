import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Organization {
  organizationId: string;
  name: string;
}

export function isOrganization(object: any): object is Organization {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['organizationId'] === 'string' &&
    typeof object['name'] === 'string'
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
      if (!state.organizations.some(organization => organization.organizationId === action.payload.organizationId)) {
        state.organizations.push(action.payload);
      }
    },
    removeOrganization: (state, action: PayloadAction<{organizationId: Organization["organizationId"]}>) => {
      if (state.organizations.find(organization => organization.organizationId === action.payload.organizationId)) {
        state.organizations = state.organizations.filter(organization => organization.organizationId !== action.payload.organizationId);
      }
    },
    modifyOrganization: (state, action) => {
      const index = state.organizations.findIndex(organization => organization.organizationId === action.payload.organization.organizationId);
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