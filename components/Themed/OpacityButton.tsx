import {Text, TouchableOpacity, TextProps, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent, StyleProp, ViewStyle} from "react-native";

export function OpacityButton({children, onPress, style, props = {}, textProps = {}}: {children: string, onPress?: ((event: GestureResponderEvent) => void) | undefined, style?: StyleProp<ViewStyle>, props?: TouchableOpacityProps, textProps?: TextProps}) {
  const { lightColor, darkColor, ...otherProps } = props;
  const {style: textStyle, lightColor: textLightColor, darkColor: textDarkColor, ...otherTextProps } = textProps;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');
  const color = useThemeColor({ light: textLightColor, dark: textDarkColor }, 'buttonText');

  return (
    <TouchableOpacity {...otherProps} onPress={onPress} style={[{ backgroundColor }, style]} >
      <Text style={[{ color }, textStyle]} {...otherTextProps}>{children}</Text>
    </TouchableOpacity>
  )
}