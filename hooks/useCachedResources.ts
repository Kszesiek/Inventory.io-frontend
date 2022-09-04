import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          'Source Sans ExtraLight': require('../assets/fonts/SourceSansPro-ExtraLight-275.ttf'),
          'Source Sans Light': require('../assets/fonts/SourceSansPro-Light-300.ttf'),
          'Source Sans': require('../assets/fonts/SourceSansPro-Regular-400.ttf'),
          'Source Sans SemiBold': require('../assets/fonts/SourceSansPro-SemiBold-600.ttf'),
          'Source Sans Bold': require('../assets/fonts/SourceSansPro-Bold-700.ttf'),
          'Source Sans Black': require('../assets/fonts/SourceSansPro-Black-900.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
