import { configureStore } from "@reduxjs/toolkit";

import eventsReducer from './events';
import itemsReducer from './items';
import usersReducer from './users';
import lendingsReducer from './lendings';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    items: itemsReducer,
    users: usersReducer,
    lendings: lendingsReducer,
  }
});