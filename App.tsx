import { SafeAreaProvider } from 'react-native-safe-area-context';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {StatusBar} from "./components/Themed/StatusBar";

import {injectDispatch as injectDispatchCategories, injectStore as injectStoreCategories} from "./endpoints/categories";
import {injectDispatch as injectDispatchProperties, injectStore as injectStoreProperties} from "./endpoints/properties";
import {AnyAction, Dispatch} from "@reduxjs/toolkit";

function injectStoreEverywhere(): void {
  injectStoreCategories(store);
  injectStoreProperties(store)
}

function injectDispatchEverywhere(dispatch: Dispatch<AnyAction>): void {
  injectDispatchCategories(dispatch);
  injectDispatchProperties(dispatch);
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

