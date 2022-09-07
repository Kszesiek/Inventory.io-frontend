import {StyleSheet, TextStyle, ViewStyle} from "react-native";
import {Text, View, TextInput, TextInputProps, useThemeColor} from "./Themed";

type props = {
  label: string
  textInputProps?: TextInputProps
  isInvalid: boolean
  // onErrorText: string
  style?: ViewStyle
}

export default function Input({label, textInputProps, style, isInvalid}: props) {
  const cardBackground = useThemeColor({}, "cardBackground");
  const errorColor = useThemeColor({}, "delete");

  const inputStyle: TextStyle[] = [styles.card, {backgroundColor: cardBackground}, styles.input]

  if (textInputProps?.multiline) {
    inputStyle.push(styles.multilineInput);
  }
  if (isInvalid) {
    inputStyle.push({backgroundColor: errorColor});
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, isInvalid && {color: errorColor}]}>{label}</Text>
      <TextInput style={inputStyle} {...textInputProps} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
  },
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 15,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
})