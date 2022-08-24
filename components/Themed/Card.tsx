import React from 'react';
import {StyleSheet} from 'react-native';
import {useThemeColor, View, ViewProps} from "./index";


function Card (props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground');

  return <View
    style={[{backgroundColor}, styles.card, style]}
    {...otherProps}
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

