import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {appWideActions} from "../store/appWide";
import {useDispatch} from "react-redux";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const dispatch = useDispatch();

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

        const username = await AsyncStorage.getItem("username");
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (username && userId && token) {
           await dispatch(appWideActions.signIn({
            username,
            userId,
            token,
          }));
          console.log(`signIn called with values:\nusername: ${username}\nuserId: ${userId}\ntoken: ${token}`) // .slice(0, 10)
        }

        const demoMode = await AsyncStorage.getItem('demoMode');
        if (demoMode === "false" || demoMode == "true") {
          await dispatch(appWideActions.setDemoMode(demoMode === "true"));
        }

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
