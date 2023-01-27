import {useThemeColor, View} from "../../components/Themed";
import * as React from "react";
import {Alert, FlatList, StyleSheet} from "react-native";
import Input from "../../components/Input";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {HomeStackScreenProps, WelcomeStackScreenProps} from "../../types";
import {writeOutArray} from "../../utilities/enlist";
import {OrganizationTemplate, isOrganization} from "../../store/organizations";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {IRootState} from "../../store/store";
import {createOrganization} from "../../endpoints/organizations";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair
  short_name: ValidValuePair
  description: ValidValuePair
}

export default function CreateOrganization({ navigation, route }: WelcomeStackScreenProps<'CreateOrganizationWelcome'> | HomeStackScreenProps<'CreateOrganizationHome'>) {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, 'background');
  const cancelColor = useThemeColor({}, "delete");

  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const doesGoBack = route.params?.doesGoBack;

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
  {
    name: {
      value: "",
      isInvalid: false,
    },
    short_name: {
      value: "",
      isInvalid: false,
    },
    description: {
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
    const short_nameIsValid: boolean = inputs.short_name.value.trim().length >= 0;
    const descriptionIsValid: boolean = inputs.description.value.trim().length >= 0;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        short_name: {
          value: currentInputs.short_name.value,
          isInvalid: !short_nameIsValid,
        },
        description: {
          value: currentInputs.description.value,
          isInvalid: !descriptionIsValid,
        },
      }
    });

    if (!nameIsValid || !short_nameIsValid || !descriptionIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("organization name")
      if (!short_nameIsValid)
        wrongDataArray.push("short name")
      if (!descriptionIsValid)
        wrongDataArray.push("description")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const organizationTemplate: OrganizationTemplate = {
      name: inputs.name.value,
      short_name: inputs.short_name.value,
      description:  inputs.description.value,
    }

    const response = await createOrganization(dispatch, organizationTemplate, demoMode);

    if (!isOrganization(response)) {
      Alert.alert('Nie udało się założyć organizacji', 'Sprawdź dane organizacji i spróbuj ponownie.');
      return;
    }

    doesGoBack && navigation.canGoBack() && navigation.goBack();
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
      placeholder: "nazwa twojej organizacji...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
      autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const shortNameComponent = <Input
    label="Skrót organizacji"
    isInvalid={inputs.name.isInvalid}
    // onErrorText="Please enter a description containing under 20 characters"
    textInputProps={{
      placeholder: "skrót twojej organizacji...",
      maxLength: 10,
      onChangeText: inputChangedHandler.bind(null, "short_name"),
      value: inputs.short_name.value,
      autoCorrect: false,  // default is true
      autoCapitalize: 'none',  // default is sentences
      multiline: false,
    }} />

  const descriptionComponent = <Input
    label="Opis organizacji"
    isInvalid={inputs.name.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "opis twojej organizacji...",
      maxLength: 4000,
      onChangeText: inputChangedHandler.bind(null, "description"),
      value: inputs.description.value,
      autoCorrect: true,  // default is true
      autoCapitalize: 'sentences',  // default is sentences
      multiline: true,
    }} />

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{"Załóż"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    shortNameComponent,
    descriptionComponent,
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