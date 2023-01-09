import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Item{
  itemId: string
  name: string
  categoryId: string
  warehouseId?: string
}

export function isItem(object: any): object is Item {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['itemId'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['categoryId'] === 'string' &&
    typeof object['warehouseId'] === ('string' || undefined)
  );
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
      state.items = action.payload;
    },
    wipeItems: (state) => {
      state.items = [];
    },
  },
});

export const itemActions = itemsSlice.actions;
export default itemsSlice.reducer;