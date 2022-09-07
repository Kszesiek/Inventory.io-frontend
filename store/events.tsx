import {createSlice} from "@reduxjs/toolkit";

export interface Event {
  eventId: string
  name: string
  startDate: string
  endDate: string
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: new Array<Event>(
      {
        eventId: "a2b114f3-0b2c-4fb3-98a8-762d87c161ee",
        name: "Annual Garage Band Competition",
        startDate: new Date(2022, 9 - 1, 2, 14).toISOString(),
        endDate: new Date(2022, 9 - 1, 2, 22).toISOString(),
      },
      {
        eventId: "e97982f8-7dd1-49cb-b207-60957aadb7d3",
        name: "Elka Country Music Festival",
        startDate: new Date(2022, 9 - 1, 8, 10).toISOString(),
        endDate: new Date(2022, 9 - 1, 11, 2).toISOString(),
      },
      {
        eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
        name: "Open Doors at Amplitron",
        startDate: new Date(2022, 8 - 1, 3).toISOString(),
        endDate: new Date(2022, 8 - 1, 3).toISOString(),
      },
      {
        eventId: "ca70b980-157e-47d2-8f0c-9e884e5291c7",
        name: "AmpliGranie 2k22 - otwarcie roku akademickiego",
        startDate: new Date(2022, 10 - 1, 23, 18).toISOString(),
        endDate: new Date(2022, 10 - 1, 23, 22).toISOString(),
      },
    )
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
  },
});

export const eventActions = eventsSlice.actions;
export default eventsSlice.reducer;