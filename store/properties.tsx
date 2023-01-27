import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface PropertyTemplate {
  name: string;
  description?: string;
  property_type_id: number;
  unit_id?: number;
}

export interface Property {
  id: number;
  name: string;
  description?: string;
  property_type_id: number;
  unit_id?: number;
}

export interface PropertyUnit {
  id: number,
  name: string,
  shortcut: string,
}

export interface PropertyType {
  id: string,
  name: string,
  shortcut: string,
}

export function propertyFromTemplate(propertyTemplate: PropertyTemplate, propertyId: number | undefined = undefined): Property {
  return {
    id: propertyId || Math.random(),
    name: propertyTemplate.name,
    description: propertyTemplate.description,
    property_type_id: propertyTemplate.property_type_id,
    unit_id: propertyTemplate.unit_id,
  }
}

export function defaultValue(property: Property): string | number | boolean { // | Date
  if (property.property_type_id === 1)
    return "";
  if (property.property_type_id === 2)
    return "";
  if (property.property_type_id === 3)
    return false;
  // if (property.property_type_id === 4)
  //   return new Date();
  return "";
}

export function mapPropertyType(propertyType: number): string {
  if (propertyType === 1)
    return "napis";
  if (propertyType === 2)
    return "liczba";
  if (propertyType === 3)
    return "wartość logiczna (tak/nie)";
  if (propertyType === 4)
    return "data";
  return "nieznany typ właściwości";
}

export function isProperty(object: any): object is Property {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['name'] === 'string' &&
    ('description' in object ? (
      object['description'] === undefined ||
      object['description'] === null ||
      typeof object['description'] === 'string'
    ) : true) &&
    typeof object['id'] === 'number' &&
    typeof object['property_type_id'] === 'number' &&
    ('unit_id' in object ? (
      object['unit_id'] === undefined ||
      object['unit_id'] === null ||
      typeof object['unit_id'] === 'number'
    ) : true)
  )
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
    removeProperty: (state, action: PayloadAction<number>) => {
      state.properties = state.properties.filter((property) => property.id !== action.payload);
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      if (!state.properties.some(property => property.id === action.payload.id)) {
        state.properties.push(action.payload);
      }
    },
    modifyProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(property => property.id === action.payload.id);
      if (index >= 0) {
        state.properties[index] = action.payload;
      }
    },
  },
});

export const propertyActions = propertiesSlice.actions;
export default propertiesSlice.reducer;