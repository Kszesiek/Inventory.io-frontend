import {createSlice} from "@reduxjs/toolkit";

export interface Event {
  eventId: string
  name: string
  startDate: string
  endDate: string
  country?: string
  city?: string
  postalCode?: string
  street?: string
  streetNumber?: string
}

export function isEvent(object: any): object is Event {
  return (
    object &&
    typeof object === 'object' &&
    typeof object['eventId'] === 'string' &&
    typeof object['name'] === 'string' &&
    typeof object['startDate'] === 'string' &&
    typeof object['endDate'] === 'string' &&
    (
      typeof object['country'] === 'string' &&
      typeof object['city'] === 'string' &&
      typeof object['postalCode'] === 'string' &&
      typeof object['street'] === 'string' &&
      typeof object['streetNumber'] === 'string'
    ) || (
      typeof object['country'] === undefined &&
      typeof object['city'] === undefined &&
      typeof object['postalCode'] === undefined &&
      typeof object['street'] === undefined &&
      typeof object['streetNumber'] === undefined
    )
  );
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: new Array<Event>(),
  },
  reducers: {
    addEvent: (state, action) => {
      if (!state.events.some(event => event.eventId === action.payload.event.eventId)) {
        state.events.push(action.payload.event);
      }
    },
    removeEvent: (state, action) => {
      if (state.events.find(event => event.eventId === action.payload.eventId)) {
        state.events = state.events.filter(event => event.eventId !== action.payload.eventId);
      }
    },

    modifyEvent: (state, action) => {
      const index = state.events.findIndex(event => event.eventId === action.payload.event.eventId);
      if (index >= 0) {
        state.events[index] = action.payload.event;
      }
    },
    loadEvents: (state, action) => {
      state.events = action.payload;
    },
    wipeEvents: (state) => {
      state.events = [];
    }
  },
});

export const eventActions = eventsSlice.actions;
export default eventsSlice.reducer;