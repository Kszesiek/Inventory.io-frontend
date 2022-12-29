import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface PropertyTemplate {
  name: string;
  description: string;
  property_type_id?: string;
  unit_id: string;
}

export interface Property extends PropertyTemplate{
  id: string;
}

export interface PropertyUnit {
  id: string,
  name: string,
  shortcut: string,
}

export interface PropertyType {
  id: string,
  name: string,
  shortcut: string,
}


export function isProperty(object: any): object is Property {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    typeof object['short_name'] === 'string' &&
    typeof object['id'] === 'string' &&
    // Array.isArray(object['filters']) &&
    // object['filters'].every(item =>
    //   typeof item === 'object' &&
    //   typeof item['name'] === 'string'
    // ) &&
    (
      typeof object['parent_category_id'] === 'string' ||
      typeof object['parent_category_id'] === undefined
    )
  );
}

export interface CategoryTemplate {
  name: string;
  short_name: string;
  parent_group_id?: string;
}


export const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    properties: new Array<Property>(),
  },
  reducers: {
    loadProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    wipeProperties: (state) => {
      state.properties = new Array<Property>();
    },
    removeProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter((property) => property.id !== action.payload);
    },
  },
});

export const propertyActions = propertiesSlice.actions;
export default propertiesSlice.reducer;