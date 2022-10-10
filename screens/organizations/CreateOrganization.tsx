import {useThemeColor, View} from "../../components/Themed";
import * as React from "react";
import {Alert, FlatList, StyleSheet} from "react-native";
import Input from "../../components/Input";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {WelcomeStackScreenProps} from "../../types";
import {writeOutArray} from "../../utilities/enlist";
import {Organization, organizationsActions} from "../../store/organizations";
import {OpacityButton} from "../../components/Themed/OpacityButton";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair
}

export default function CreateOrganization({ navigation, route }: WelcomeStackScreenProps<'CreateOrganization'>) {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, 'background');
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
  {
    name: {
      value: "",
      isInvalid: false,
    },
  });

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length >= 0;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
      }
    });

    if (!nameIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("organization name")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const organizationData: Organization = {
      organizationId: Math.random().toString(),
      name: inputs.name.value,
    }

    await dispatch(organizationsActions.addOrganization(organizationData));
  }

  function inputChangedHandler<InputParam extends keyof typeof inputs>(inputIdentifier: InputParam, enteredValue: string) {
    console.log(`${inputIdentifier} value changed`);
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, isInvalid: false},
      }
    })
  }

  const nameComponent = <Input
    label="Nazwa organizacji"
    isInvalid={inputs.name.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "nazwa twojej organizacji",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
      autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
      multiline: true,

    }} />

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{"Załóż"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
  ]

  return (
    <FlatList
      data={listElements}
      renderItem={item => item.item}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{backgroundColor, ...styles.container}}
      ListFooterComponent={buttonsComponent}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 15,
  },
})