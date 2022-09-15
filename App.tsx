import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {StatusBar} from "./components/Themed/StatusBar";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <StatusBar />
        <SafeAreaProvider>
            <Navigation colorScheme={colorScheme}/>
        </SafeAreaProvider>
      </Provider>
    );
  }
}
