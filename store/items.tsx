import {createSlice} from "@reduxjs/toolkit";

export class Item{
  itemId: string
  name: string

  constructor(itemId: string, name: string) {
    this.itemId = itemId;
    this.name = name;
  }
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: new Array<Item>(),
  },
  reducers: {
    addItem: (state, action) => {
      if (!state.items.some(item => item.itemId === action.payload.event.itemId)) {
        state.items.push(action.payload.item);
      }
    },
    removeItem: (state, action) => {
      if (state.items.find(item => item.itemId === action.payload.itemId)) {
        state.items = state.items.filter(item => item.itemId !== action.payload.itemId);
      }
    },
    modifyItem: (state, action) => {
      const index = state.items.findIndex(item => item.itemId === action.payload.event.itemId);
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