import {createSlice} from "@reduxjs/toolkit";

class Lending {
  lendingId: string;
  itemId: string;
  startDate?: Date;
  endDate?: Date;

  constructor(lendingId: string, itemId: string) {
    this.lendingId = lendingId;
    this.itemId = itemId;
  }
}

export class LendingForEvent extends Lending {
  eventId: string;

  constructor(lendingId: string, itemId: string, eventId: string) {
    super(lendingId, itemId);
    this.eventId = eventId;
  }
}

export class LendingPrivate extends Lending {
  userId: string;
  startDate: Date;
  endDate: Date;

  constructor(lendingId: string, itemId: string, userId: string, startDate: Date, endDate: Date);
  constructor(lendingId: string, itemId: string, userId: string, startDate: string, endDate: string);
  constructor(lendingId: string, itemId: string, userId: string, startDate: string | Date, endDate: string | Date) {
    super(lendingId, itemId);
    this.userId = userId;

    if (typeof startDate === 'string' && typeof endDate === 'string') {
      this.startDate = new Date(startDate);
      this.endDate = new Date(endDate);
    } else if (startDate instanceof Date && endDate instanceof Date) {
      this.startDate = startDate;
      this.endDate = endDate;
    } else {
      this.startDate = new Date();
      this.endDate = new Date();
    }
  }
}

export const eventsSlice = createSlice({
  name: 'lendings',
  initialState: {
    lendings: new Map<string, LendingPrivate | LendingForEvent>([
      ["c1544eea-b3a0-4680-ad62-4778fc3c1893", new LendingForEvent(
        "c1544eea-b3a0-4680-ad62-4778fc3c1893",
        "90f9f31a-ae21-49be-9ea9-74366f722c1f",
        "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
      )],
      ["65c50cf0-390a-484f-9c3a-efb073a50dfc", new LendingPrivate(
        "65c50cf0-390a-484f-9c3a-efb073a50dfc",
        "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
        "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        new Date(2022, 8 - 1, 30, 0),
        new Date(2022, 8 - 1, 30, 24),
      )],
      ["65c50cf0-390a-484f-9c3a-efb073a50dfc", new LendingPrivate(
        "65c50cf0-390a-484f-9c3a-efb073a50dfc",
        "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
        "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
        new Date(2022, 8 - 1, 30, 10),
        new Date(2022, 8 - 1, 31, 20),
      )],
    ])
  },
  reducers: {
    addLending: (state, action) => {
      if (!state.lendings.has(action.payload.lending.lendingId)) {
        state.lendings.set(action.payload.lending.lendingId, action.payload.lending);
      }
    },
    removeLending: (state, action) => {
      state.lendings.delete(action.payload.lendingId);
    },
  },
});

export const addLending = eventsSlice.actions.addLending;
export const removeLending = eventsSlice.actions.removeLending;
export default eventsSlice.reducer;