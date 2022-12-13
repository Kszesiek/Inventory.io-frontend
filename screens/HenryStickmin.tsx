import {View} from "../components/Themed";
import {Image} from "react-native";
import * as React from "react";
import { Audio } from 'expo-av';
import {useEffect} from "react";

export default function HenryStickmin() {
  const soundRef = React.useRef<Audio.Sound | undefined>(undefined);

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../assets/HenryStickmin/henry_stickmin_distraction_dance.mp3'));
    soundRef.current = sound;

    soundRef.current?.setIsLoopingAsync(true);

    console.log('Playing Sound');
    soundRef.current ?
      soundRef.current.replayAsync()
    :
      console.log("How come we don't have the sound file ready?");
  }

  useEffect(() => {
    playSound();

    return () => {
      console.log("Returning from the screen, stopping the music");
      soundRef.current?.stopAsync();
      soundRef.current?.unloadAsync();
    }
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{flex: 1}} />
      <Image
        source={require("../assets/HenryStickmin/Henry_Stickmin_text.gif")}
        style={{width: '100%', resizeMode: 'stretch'}}
      />
      <Image
        source={require("../assets/HenryStickmin/Distraction_Dance_text.gif")}
        style={{width: '100%', resizeMode: 'stretch'}}
      />
      <View style={{flex: 1}} />
      <View style={{alignItems: 'flex-end', backgroundColor: 'transparent'}}>
        <Image
          source={require("../assets/HenryStickmin/Henry_Stickmin_dancing.gif")}
          style={{width: '90%', aspectRatio: 0.83, resizeMode: 'contain'}}
        />
      </View>
    </View>
  );
}