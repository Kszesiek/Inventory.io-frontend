import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WarehouseTemplate {
  name: string
  // longitude: number
  // latitude: number
  country?: string
  city?: string
  postal_code?: string
  street?: string
  street_number?: string
}

export interface Warehouse {
  id: number
  name: string
  // longitude: number
  // latitude: number
  country?: string
  city?: string
  postalCode?: string
  street?: string
  streetNumber?: string
}

export function isWarehouse(object: any): object is Warehouse {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['id'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['country'] === 'string' &&
    typeof object['city'] === 'string' &&
    typeof object['postalCode'] === 'string' &&
    typeof object['street'] === 'string' &&
    typeof object['streetNumber'] === 'string'
  );
}

export function warehouseFromTemplate(warehouseTemplate: WarehouseTemplate, warehouseId: number | undefined = undefined): Warehouse {
  return {
    id: warehouseId || Math.random(),
    name: warehouseTemplate.name,
    country: warehouseTemplate.country,
    city: warehouseTemplate.city,
    postalCode: warehouseTemplate.postal_code,
    street: warehouseTemplate.street,
    streetNumber: warehouseTemplate.street_number,
  }
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
    removeWarehouse: (state, action: PayloadAction<number>) => {
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
    loadWarehouses: (state, action: PayloadAction<Warehouse[]>) => {
      state.warehouses = action.payload;
    },
    loadWarehouse: (state, action: PayloadAction<Warehouse>) => {
      const index = state.warehouses.findIndex(warehouse => warehouse.id === action.payload.id);
      if (index >= 0)
        state.warehouses[index] = action.payload;
      else
        state.warehouses.push(action.payload);
    },
    wipeWarehouses: (state) => {
      state.warehouses = [];
    }
  },
});

export const warehousesActions = warehousesSlice.actions;
export default warehousesSlice.reducer;