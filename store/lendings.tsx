import {createSlice} from "@reduxjs/toolkit";

interface Lending {
  lendingId: string;
  items: {itemId: string, name: string}[];
  startDate: string;
  endDate: string;
  notes?: string;
}

export function isLending(object: any): object is Lending {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['lendingId'] === 'string' &&
    typeof object['startDate'] === 'string' &&
    typeof object['endDate'] === 'string' &&
    (typeof object['notes'] === 'string' || typeof object['notes'] === 'undefined') &&
    Array.isArray(object['items']) &&
    object['items'].every(item =>
      typeof item === 'object' &&
      typeof item['itemId'] === 'string' &&
      typeof item['name'] === 'string'
    )
  );
}

export interface LendingPrivate extends Lending {
  userId: string;
}

export function isLendingPrivate(object: any): object is LendingPrivate {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['userId'] === 'string' &&
    isLending(object)
  );
}

export interface LendingForEvent extends Lending {
  eventName: string;
  eventId: string;
}

export function isLendingForEvent(object: any): object is LendingForEvent {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['eventName'] === 'string' &&
    typeof object['eventId'] === 'string' &&
    isLending(object)
  );
}

export const lendingsSlice = createSlice({
  name: 'lendings',
  initialState: {
    lendings: new Array<LendingPrivate | LendingForEvent>(),
    total: 0,
  },
  reducers: {
    addLending: (state, action) => {
      if (!state.lendings.some(item => item.lendingId === action.payload.lending.lendingId)) {
        state.lendings.push(action.payload.lending);
        state.total += 1;
      }
    },
    removeLending: (state, action) => {
      if (state.lendings.find(item => item.lendingId === action.payload.lendingId)) {
        state.lendings = state.lendings.filter(item => item.lendingId !== action.payload.lendingId);
        state.total -= 1;
      }
    },
    modifyLending: (state, action) => {
      const index = state.lendings.findIndex(item => item.lendingId === action.payload.lending.lendingId);
      if (index >= 0) {
        state.lendings[index] = action.payload.lending;
      }
    },
    loadLendings: (state, action) => {
      state.lendings = action.payload;
      state.total = action.payload.length;  // TO MA ROBIĆ CO INNEGO W PRZYSZŁOŚCI
    },
    wipeLendings: (state) => {
      state.lendings = [];
      state.total = 0;
    },
  },
});


export const lendingActions = lendingsSlice.actions;
export default lendingsSlice.reducer;