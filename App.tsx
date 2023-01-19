import { SafeAreaProvider } from 'react-native-safe-area-context';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {StatusBar} from "./components/Themed/StatusBar";

import {injectDispatch as injectDispatchCategories, injectStore as injectStoreCategories} from "./endpoints/categories";
import {injectDispatch as injectDispatchProperties, injectStore as injectStoreProperties} from "./endpoints/properties";
import {injectDispatch as injectDispatchEvents,     injectStore as injectStoreEvents    } from "./endpoints/events";
import {injectDispatch as injectDispatchLendings,   injectStore as injectStoreLendings  } from "./endpoints/lendings";
import {injectDispatch as injectDispatchItems,      injectStore as injectStoreItems     } from "./endpoints/items";
import {injectDispatch as injectDispatchWarehouses, injectStore as injectStoreWarehouses} from "./endpoints/warehouses";
import {injectDispatch as injectDispatchMembers,    injectStore as injectStoreMembers   } from "./endpoints/members";
import {AnyAction, Dispatch} from "@reduxjs/toolkit";

function injectStoreEverywhere(): void {
  injectStoreCategories(store);
  injectStoreProperties(store);
  injectStoreEvents    (store);
  injectStoreLendings  (store);
  injectStoreItems     (store);
  injectStoreWarehouses(store);
  injectStoreMembers   (store);
}

function injectDispatchEverywhere(dispatch: Dispatch<AnyAction>): void {
  injectDispatchCategories(dispatch);
  injectDispatchProperties(dispatch);
  injectDispatchEvents    (dispatch);
  injectDispatchLendings  (dispatch);
  injectDispatchItems     (dispatch);
  injectDispatchWarehouses(dispatch);
  injectDispatchMembers   (dispatch);
}

export default function App() {
  const colorScheme = useColorScheme();
  injectStoreEverywhere();

  return (
    <Provider store={store}>
      <StatusBar />
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme}/>
      </SafeAreaProvider>
    </Provider>
  );
}

