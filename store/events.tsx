import {createSlice} from "@reduxjs/toolkit";

export class Event {
  eventId: string
  name: string
  startDate: Date
  endDate: Date

  constructor(eventId: string, name: string, startDate: Date, endDate: Date) {
    this.eventId = eventId;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: new Map<string, Event>([
      ["a2b114f3-0b2c-4fb3-98a8-762d87c161ee", new Event(
         "a2b114f3-0b2c-4fb3-98a8-762d87c161ee",
         "Annual Garage Band Competition",
         new Date(2022, 9 - 1, 2, 14),
         new Date(2022, 9 - 1, 2, 22),
      )],
      ["e97982f8-7dd1-49cb-b207-60957aadb7d3", new Event(
        "e97982f8-7dd1-49cb-b207-60957aadb7d3",
        "Elka Country Music Festival",
        new Date(2022, 9 - 1, 8, 10),
        new Date(2022, 9 - 1, 11, 2),
      )],
      ["5e509adc-dd63-4312-9db8-e4c02f5a4bbb", new Event(
        "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
        "Open Doors at Amplitron",
        new Date(2022, 8 - 1, 3),
        new Date(2022, 8 - 1, 3),
        )],
    ])
  },
  reducers: {
    addEvent: (state, action) => {
      if (!state.events.has(action.payload.event.eventId)) {
        state.events.set(action.payload.event.eventId, action.payload.event);
      }
    },
    removeEvent: (state, action) => {
      state.events.delete(action.payload.eventId);
    },
  },
});

export const addEvent = eventsSlice.actions.addEvent;
export const removeEvent = eventsSlice.actions.removeEvent;
export default eventsSlice.reducer;