import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WarehouseTemplate {
  name: string
  // longitude: number
  // latitude: number
  country?: string | undefined
  city: string
  postalCode?: string | undefined
  street: string
  streetNumber: string
}

export interface Warehouse extends WarehouseTemplate {
  id: string
}

export function isWarehouse(object: any): object is Warehouse {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['id'] === 'string' &&
    typeof object['name'] === 'string' &&
    // typeof object['longitude'] === 'number' &&
    // typeof object['latitude'] === 'number' &&
    typeof object['country'] === 'string' &&
    typeof object['city'] === 'string' &&
    typeof object['postalCode'] === 'string' &&
    typeof object['street'] === 'string' &&
    typeof object['streetNumber'] === 'string'
  );
}

export const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState: {
    warehouses: new Array<Warehouse>(),
  },
  reducers: {
    addWarehouse: (state, action: PayloadAction<Warehouse>) => {
      if (!state.warehouses.some(warehouse => warehouse.id === action.payload.id)) {
        state.warehouses.push(action.payload);
      }
    },
    removeWarehouse: (state, action: PayloadAction<string>) => {
      if (state.warehouses.find(warehouse => warehouse.id === action.payload)) {
        state.warehouses = state.warehouses.filter(member => member.id !== action.payload);
      }
    },
    modifyWarehouse: (state, action: PayloadAction<Warehouse>) => {
      const index = state.warehouses.findIndex(warehouse => warehouse.id === action.payload.id);
      if (index >= 0) {
        state.warehouses[index] = action.payload;
      }
    },
    loadWarehouses: (state, action) => {
      state.warehouses = action.payload;
    },
    wipeWarehouses: (state) => {
      state.warehouses = [];
    }
  },
});

export const warehousesActions = warehousesSlice.actions;
export default warehousesSlice.reducer;