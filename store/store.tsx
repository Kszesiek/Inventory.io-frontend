import {combineReducers, configureStore} from "@reduxjs/toolkit";

import eventsReducer from './events';
import itemsReducer from './items';
import rentalsReducer from './rentals';
import organizationsReducer from './organizations';
import categoriesReducer from './categories';
import propertiesReducer from './properties';
import membersReducer from './members';
import appWideReducer from './appWide';
import warehousesReducer from './warehouses';

const rootReducer = combineReducers({
  events: eventsReducer,
  items: itemsReducer,
  rentals: rentalsReducer,
  organizations: organizationsReducer,
  categories: categoriesReducer,
  properties: propertiesReducer,
  members: membersReducer,
  warehouses: warehousesReducer,
  appWide: appWideReducer,
})

export type IRootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer
});
