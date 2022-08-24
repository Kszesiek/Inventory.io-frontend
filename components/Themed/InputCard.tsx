import {TextInputProps, TouchableOpacityProps, useThemeColor, TextInput} from "./index";
import {StyleSheet} from "react-native";
import Card from "./Card";

export function InputCard({cardProps = {}, textInputProps = {}}: {cardProps?: TouchableOpacityProps, textInputProps?: TextInputProps}) {
  const { style: cardStyle, lightColor, darkColor, ...otherCardProps } = cardProps;
  const { style: textStyle, lightColor: textLightColor, darkColor: textDarkColor, ...otherTextProps } = textInputProps;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'textInput');
  const color = useThemeColor({ light: textLightColor, dark: textDarkColor }, 'text');

  return (
    <Card {...otherCardProps} style={[{backgroundColor}, cardStyle]} >
      <TextInput
        {...otherTextProps}
        style={[{color}, styles.textInput, textStyle]}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    textAlign: 'center',
  },
})