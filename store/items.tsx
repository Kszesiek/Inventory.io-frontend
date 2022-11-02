import {createSlice} from "@reduxjs/toolkit";

export interface Item{
  itemId: string
  name: string
  categoryId: string
}

export function isItem(object: any): object is Item {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['itemId'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['categoryId'] === 'string'
  );
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: new Array<Item>(),
  },
  reducers: {
    addItem: (state, action) => {
      if (!state.items.some(item => item.itemId === action.payload.item.itemId)) {
        state.items.push(action.payload.item);
      }
    },
    removeItem: (state, action) => {
      if (state.items.find(item => item.itemId === action.payload.itemId)) {
        state.items = state.items.filter(item => item.itemId !== action.payload.itemId);
      }
    },
    modifyItem: (state, action) => {
      const index = state.items.findIndex(item => item.itemId === action.payload.item.itemId);
      if (index >= 0) {
        state.items[index] = action.payload.item;
      }
    },
    loadItems: (state, action) => {
      state.items = action.payload;
    },
    wipeItems: (state) => {
      state.items = [];
    },
  },
});

export const itemActions = itemsSlice.actions;
export default itemsSlice.reducer;