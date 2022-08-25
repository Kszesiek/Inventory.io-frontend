import {Text, TouchableOpacity, TextProps, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent, StyleProp, StyleSheet, ViewStyle} from "react-native";

export function OpacityButton({children, onPress, style, props = {}, textProps = {}}: {children: string, onPress?: ((event: GestureResponderEvent) => void) | undefined, style?: StyleProp<ViewStyle>, props?: TouchableOpacityProps, textProps?: TextProps}) {
  const { lightColor, darkColor, ...otherProps } = props;
  const {style: textStyle, lightColor: textLightColor, darkColor: textDarkColor, ...otherTextProps } = textProps;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const color = useThemeColor({ light: textLightColor, dark: textDarkColor }, 'buttonText');

  return (
    <TouchableOpacity {...otherProps} onPress={onPress} style={[styles.defaultStyle, { backgroundColor }, style]} >
      <Text style={[styles.defaultTextStyle, { color }, textStyle]} {...otherTextProps}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  defaultStyle: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  defaultTextStyle: {
    textAlign: 'center',
  },
})