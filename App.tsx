import { SafeAreaProvider } from 'react-native-safe-area-context';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {StatusBar} from "./components/Themed/StatusBar";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <StatusBar />
      <SafeAreaProvider>
          <Navigation colorScheme={colorScheme}/>
      </SafeAreaProvider>
    </Provider>
  );
}

