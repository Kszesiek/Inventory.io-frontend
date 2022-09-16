import {Text, TouchableOpacity, TextProps, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent, StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";

export function OpacityButton({children, onPress, style, textStyle, props = {}, textProps = {}}: {children: string, onPress?: ((event: GestureResponderEvent) => void) | undefined, style?: StyleProp<ViewStyle>, textStyle?: StyleProp<TextStyle>, props?: TouchableOpacityProps, textProps?: TextProps}) {
  const { lightColor, darkColor, ...otherProps } = props;
  const {lightColor: textLightColor, darkColor: textDarkColor, ...otherTextProps } = textProps;
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
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  defaultTextStyle: {
    textAlign: 'center',
    fontSize: 18,
  },
})