import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Item {
  itemId: string
  name: string
  description?: string,
  categoryId: number
  warehouseId?: number
  values?: Value[]
}

export interface Value {
  value: string
  property_id: number
}

export function isValue(object: any): object is Value {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['value'] === 'string' &&
    typeof object['property_id'] === 'number'
  )
}

export function isItem(object: any): object is Item {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['itemId'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['description'] === 'string' &&
    typeof object['categoryId'] === 'number' &&
    typeof object['warehouseId'] === ('number' || undefined) &&
    (
      typeof object['properties'] === undefined ||
      (
        Array.isArray(object['values']) &&
        object["values"].every(item => isValue(item))
      )
    )
  );
}

export interface ItemTemplate {
  name: string
  description: string
  status_id: number
  group_id: number
  values: Value[]
  warehouse_id?: number
}

export function itemFromTemplate(itemTemplate: ItemTemplate, itemId?: string): Item {
  return {
    itemId: itemId || Math.random().toString(),
    name: itemTemplate.name,
    description: itemTemplate.description,
    categoryId: itemTemplate.group_id,
    warehouseId: itemTemplate.warehouse_id,
    values: itemTemplate.values,
  } as Item;
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: new Array<Item>(),
  },
  reducers: {
    addItem: (state, action: PayloadAction<{item: Item}>) => {
      if (!state.items.some(item => item.itemId === action.payload.item.itemId)) {
        state.items.push(action.payload.item);
      }
    },
    removeItem: (state, action: PayloadAction<{itemId: string}>) => {
      if (state.items.find(item => item.itemId === action.payload.itemId)) {
        state.items = state.items.filter(item => item.itemId !== action.payload.itemId);
      }
    },
    modifyItem: (state, action: PayloadAction<{item: Item}>) => {
      const index = state.items.findIndex(item => item.itemId === action.payload.item.itemId);
      if (index >= 0) {
        state.items[index] = action.payload.item;
      }
    },
    loadItems: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((item: Item) => {
        const index = state.items.findIndex(item_ => item_.itemId === item.itemId);
        if (index >= 0)
          state.items[index] = item;
        else
          state.items.push(item);
      })
    },
    loadItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item_ => item_.itemId === action.payload.itemId);
      if (index >= 0)
        state.items[index] = action.payload;
      else
        state.items.push(action.payload);
    },
    wipeItems: (state) => {
      state.items = [];
    },
  },
});

export const itemActions = itemsSlice.actions;
export default itemsSlice.reducer;