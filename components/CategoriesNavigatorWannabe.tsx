import * as React from "react";
import {Animated, Button, StyleSheet, useWindowDimensions} from "react-native";
import {useRef, useState} from "react";
import {View, Text} from "./Themed";

export default function CategoriesNavigatorWannabe() {
  const screen = useWindowDimensions();

  const [currentWindow, setCurrentWindow] = useState<1|2>(1);
  const firstWindow = useRef(new Animated.Value(0)).current;
  const secondWindow = useRef(new Animated.Value(screen.width)).current;

  const animDuration: number = 300;

  function changeScreen(direction: 'forwards' | 'backwards') {
    if (currentWindow === 1 && direction === 'forwards')
      secondWindow.setValue(-screen.width)
    else if (currentWindow === 1 && direction === 'backwards')
      secondWindow.setValue(screen.width)
    else if (currentWindow === 2 && direction === 'forwards')
      firstWindow.setValue(-screen.width)
    else if (currentWindow === 2 && direction === 'backwards')
      firstWindow.setValue(screen.width)

    setCurrentWindow(currentWindow === 1 ? 2 : 1);

    Animated.parallel([
      Animated.timing(currentWindow === 1 ? firstWindow : secondWindow, {
        toValue: direction === 'forwards' ? screen.width / 2 : -screen.width / 2,
        duration: animDuration,
        useNativeDriver: false,
      }),
      Animated.timing(currentWindow === 1 ? secondWindow : firstWindow, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function previousScreen() {
    changeScreen('backwards');
  }

  function nextScreen() {
    changeScreen('forwards');
  }

  return (
    <View style={{flexGrow: 1, justifyContent: 'flex-end',}}>
      <Animated.View style={{...styles.container, backgroundColor: 'red', right: firstWindow, zIndex: currentWindow === 1 ? -1 : -2}}>
        <Text>WINDOW 1.{"\n"}Current: {currentWindow}</Text>
      </Animated.View>
      <Animated.View style={{...styles.container,  backgroundColor: 'blue', right: secondWindow, zIndex: currentWindow === 2 ? -1 : -2}}>
        <Text>WINDOW 2.{"\n"}Current: {currentWindow}</Text>
      </Animated.View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button title="Back" onPress={previousScreen} />
        <Button title="Forward" onPress={nextScreen} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
})