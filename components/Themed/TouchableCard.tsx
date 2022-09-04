import {TouchableOpacity, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent, StyleProp, StyleSheet, ViewStyle} from "react-native";

type propsType = {
  children: any,
  onPress?: ((event: GestureResponderEvent) => void) | undefined,
  style?: StyleProp<ViewStyle>,
  props?: TouchableOpacityProps,
}

export function TouchableCard({children, onPress, style = {}, props = {}}: propsType) {
  const { lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground');

  return (
    <TouchableOpacity {...otherProps} onPress={onPress} style={[styles.defaultStyle, { backgroundColor }, style]} >
      {children}
    </TouchableOpacity>
  )
}

export function IconCard({children, onPress, style = {}, props = {}}: propsType) {

  return (
    <TouchableCard props={props} onPress={onPress} style={[styles.iconCardStyle, style]} >
      {children}
    </TouchableCard>
  )
}

const styles = StyleSheet.create({
  defaultStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
},
  iconCardStyle: {
    width: '100%',
    aspectRatio: 1,
  },
  defaultTextStyle: {
    textAlign: 'center',
  },
})