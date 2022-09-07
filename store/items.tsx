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
    items: new Array<Item>(
      {
        itemId: "90f9f31a-ae21-49be-9ea9-74366f722c1f",
        name: "shelf",
      },
      {
        itemId: "b60f7689-8251-4a06-aae9-984c1cf78e01",
        name: "subwoofer",
      },
      {
        itemId: "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
        name: "metal box",
      },
      {
        itemId: "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        name: "mic stand",
      },
      {
        itemId: "1b6746ea-adf6-4cd4-9247-f60cd6de2223",
        name: "bluetooth speaker",
      },
    )
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
  },
});

export const itemActions = itemsSlice.actions;
export default itemsSlice.reducer;