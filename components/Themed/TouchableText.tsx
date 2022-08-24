import {Text, TouchableOpacity, TextProps, TouchableOpacityProps, useThemeColor} from "./index";
import {GestureResponderEvent} from "react-native";

export function TouchableText({children, onPress, props = {}, textProps = {}}: {children: string, onPress?: ((event: GestureResponderEvent) => void) | undefined, props?: TouchableOpacityProps, textProps?: TextProps}) {
  const { style, ...otherProps } = props;
  const {style: textStyle, lightColor, darkColor, ...otherTextProps } = textProps;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <TouchableOpacity style={[{ backgroundColor: 'transparent', padding: 5 }, style]} {...otherProps} onPress={onPress} >
      <Text style={[{ color }, textStyle]} {...otherTextProps}>{children}</Text>
    </TouchableOpacity>
  )
}
