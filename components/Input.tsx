import {StyleSheet, TextInput, TextInputProps, TextStyle, ViewStyle} from "react-native";
import {Text, View} from "./Themed";

type props = {
  label: string
  textInputProps?: TextInputProps
  isInvalid: boolean
  // onErrorText: string
  style?: ViewStyle
}

function Input({label, textInputProps, style, isInvalid}: props) {
  const inputStyle: TextStyle[] = [styles.input]

  if (textInputProps?.multiline) {
    inputStyle.push(styles.multilineInput);
  }
  if (isInvalid) {
    inputStyle.push(styles.invalidInput);
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, isInvalid && styles.invalidLabel]}>{label}</Text>
      <TextInput style={inputStyle} {...textInputProps} />
    </View>
  )
}

export default Input;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
    label: {
    fontSize: 14,
      color: 'yellow',
      marginBottom: 4,
  },
  input: {
    backgroundColor: 'orange',
      color: 'red',
      padding: 6,
      borderRadius: 10,
      fontSize: 18,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  invalidLabel: {
    color: 'blue',
  },
  invalidInput: {
    backgroundColor: 'green',
  },
})