import {combineReducers, configureStore} from "@reduxjs/toolkit";

import eventsReducer from './events';
import itemsReducer from './items';
import usersReducer from './users';
import lendingsReducer from './lendings';
import organizationsReducer from './organizations';
import appWideReducer from './appWide';

const rootReducer = combineReducers({
  events: eventsReducer,
  items: itemsReducer,
  users: usersReducer,
  lendings: lendingsReducer,
  organizations: organizationsReducer,
  appWide: appWideReducer,
})

export type IRootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer
});

