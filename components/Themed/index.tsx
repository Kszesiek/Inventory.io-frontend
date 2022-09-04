/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TouchableOpacity as DefaultTouchableOpacity,
  TextStyle,
} from 'react-native';

import Colors, {CSSColorToHex} from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];
export type TouchableOpacityProps = ThemeProps & DefaultTouchableOpacity['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const defaultTextStyle: TextStyle = {
    fontFamily: 'Source Sans',
    color,
  }

  return <DefaultText style={[defaultTextStyle, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const defaultStyle: TextStyle = {
    fontFamily: 'Source Sans',
    color: color,
  }

  let placeholderColor: string = CSSColorToHex(color);
  if (placeholderColor[0] !== "#") {
    console.warn("Unsupported color!")
  }
  switch (placeholderColor.length) {
    case 4:
      placeholderColor += '8';
      break;
    case 7:
      placeholderColor += '80';
      break;
  }

  return <DefaultTextInput style={[defaultStyle, style]} placeholderTextColor={placeholderColor} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'transparent');

  return <DefaultTouchableOpacity style={[{ backgroundColor }, style]} {...otherProps} />;
}