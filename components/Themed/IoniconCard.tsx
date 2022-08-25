import {TouchableOpacity, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent, StyleProp, StyleSheet, ViewStyle} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type propsType = {
  iconName: keyof typeof Ionicons.glyphMap,
  iconSize?: number,
  onPress?: ((event: GestureResponderEvent) => void) | undefined,
  style?: StyleProp<ViewStyle>,
  props?: TouchableOpacityProps,
}

export function IoniconCard({onPress, iconName, iconSize=32, style = {}, props = {}}: propsType) {
  const { lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground');
  const iconColor = useThemeColor({}, 'buttonText');

  return (
    <TouchableOpacity {...otherProps} onPress={onPress} style={[styles.defaultStyle, { backgroundColor }, style]} >
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  defaultStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
},
  defaultTextStyle: {
    textAlign: 'center',
  },
})