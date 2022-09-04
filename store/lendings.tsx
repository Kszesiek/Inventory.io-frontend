import {createSlice} from "@reduxjs/toolkit";

class Lending {
  lendingId: string;
  itemNames: string[];
  startDate: Date;
  endDate: Date;

  constructor(lendingId: string, itemNames: string[], startDate: Date, endDate: Date) {
    this.lendingId = lendingId;
    this.itemNames = itemNames;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class LendingForEvent extends Lending {
  eventName: string;

  constructor(lendingId: string, itemNames: string[], startDate: Date, endDate: Date, eventName: string) {
    super(lendingId, itemNames, startDate, endDate);
    this.eventName = eventName;
  }
}

export class LendingPrivate extends Lending {
  username: string;

  constructor(lendingId: string, itemNames: string[], username: string, startDate: Date, endDate: Date);
  constructor(lendingId: string, itemNames: string[], username: string, startDate: string, endDate: string);
  constructor(lendingId: string, itemNames: string[], username: string, startDate: string | Date, endDate: string | Date) {
    if (typeof startDate === 'string' && typeof endDate === 'string') {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    } else if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      startDate = new Date();
      endDate = new Date();
    }

    super(lendingId, itemNames, startDate, endDate);
    this.username = username;
  }
}

export const lendingsSlice = createSlice({
  name: 'lendings',
  initialState: {
    lendings: new Map<string, LendingPrivate | LendingForEvent>([
      ["c1544eea-b3a0-4680-ad62-4778fc3c1893", new LendingForEvent(
        "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        ["mic stand"],
        new Date(2022, 8 - 1, 3),
        new Date(2022, 8 - 1, 3),
        "Open Doors at Amplitron",
      )],
      ["65c50cf0-390a-484f-9c3a-efb073a50dfc", new LendingPrivate(
        "65c50cf0-390a-484f-9c3a-efb073a50dfc",
        ["metal box", "rozdzielnica", "kabel trójfazowy 10m", "drabina"],
        "YourGuyRoy",
        new Date(2022, 8 - 1, 30, 0),
        new Date(2022, 8 - 1, 30, 24),
      )],
      ["b4b10fb9-35db-45b7-9729-c07152c57e4a", new LendingPrivate(
        "b4b10fb9-35db-45b7-9729-c07152c57e4a",
        ["półka", "zmiotka", "lutownica"],
        "TheRealGlobetrotterGrover",
        new Date(2022, 7 - 1, 12),
        new Date(2022, 7 - 1, 22),
      )],
      ["b4b10fb9-35db-45b7-9729-c07152c57e4a", new LendingPrivate(
        "b4b10fb9-35db-45b7-9729-c07152c57e4a",
        ["subwoofer", "tweeter x4", "instrukcja montażu zestawu 5.1", "mikrofon strojeniowy Shure", "mikser", "kabel XLR 10m x2", "kabel XLR 5m x4"],
        "itsmejohndoe",
        new Date(2022, 7 - 1, 12),
        new Date(2022, 7 - 1, 22),
      )],
      ["4a172d51-06ca-4495-8c8a-b4dce974c630", new LendingPrivate(
        "4a172d51-06ca-4495-8c8a-b4dce974c630",
        ["głośnik bluetooth", "słuchawki bluetooth", "kabel minijack 2m"],
        "JustClarence",
        new Date(2022, 9 - 1, 1, 9),
        new Date(2022, 9 - 1, 1, 20, 15),
      )],
    ]),
    total: 4,
  },
  reducers: {
    addLending: (state, action) => {
      if (!state.lendings.has(action.payload.lending.lendingId)) {
        state.lendings.set(action.payload.lending.lendingId, action.payload.lending);
        state.total += 1;
      }
    },
    removeLending: (state, action) => {
      state.lendings.delete(action.payload.lendingId);
      state.total -= 1;
    },
  },
});

export const addLending = lendingsSlice.actions.addLending;
export const removeLending = lendingsSlice.actions.removeLending;
export default lendingsSlice.reducer;