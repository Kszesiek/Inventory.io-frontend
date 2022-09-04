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
    items: new Map<string, Item>([
      ["90f9f31a-ae21-49be-9ea9-74366f722c1f", new Item(
        "90f9f31a-ae21-49be-9ea9-74366f722c1f",
        "shelf",
      )],
      ["b60f7689-8251-4a06-aae9-984c1cf78e01", new Item(
        "b60f7689-8251-4a06-aae9-984c1cf78e01",
        "subwoofer",
      )],
      ["6158bfc4-a8b2-4eae-9320-c2a77474fb2c", new Item(
        "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
        "metal box",
      )],
      ["c1544eea-b3a0-4680-ad62-4778fc3c1893", new Item(
        "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        "mic stand",
      )],
      ["1b6746ea-adf6-4cd4-9247-f60cd6de2223", new Item(
        "1b6746ea-adf6-4cd4-9247-f60cd6de2223",
        "bluetooth speaker",
      )],
    ])
  },
  reducers: {
    addItem: (state, action) => {
      if (!state.items.has(action.payload.items.itemId)) {
        state.items.set(action.payload.items.itemId, action.payload.item);
      }
    },
    removeItem: (state, action) => {
      state.items.delete(action.payload.itemId);
    },
  },
});

export const addItem = itemsSlice.actions.addItem;
export const removeItem = itemsSlice.actions.removeItem;
export default itemsSlice.reducer;