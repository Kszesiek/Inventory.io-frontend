import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {View} from "./Themed";

type propsType = {
  style: ViewStyle,
  lightColor?: string,
  darkColor?: string,
  children: any,
}

function Card (props: propsType) {
  return <View
    style={[styles.card, props.style]}
    lightColor={props.lightColor}
    darkColor={props.darkColor}
  >
    {props.children}
  </View>;
}

export default Card;

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 15,
  }
});

