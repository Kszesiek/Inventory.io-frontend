import {Alert, ScrollView, StyleSheet, ViewStyle} from "react-native";
import {useThemeColor, View, Text} from "../../../../components/Themed";
import {PropertiesStackScreenProps} from "../../../../types";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Property, PropertyTemplate} from "../../../../store/properties";
import {createProperty, modifyProperty} from "../../../../endpoints/properties";
import {IRootState} from "../../../../store/store";
import HighlightChooser from "../../../../components/HighlightChooser";
import * as React from "react";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  description: ValidValuePair,
}

export default function AddEditProperty({ navigation, route }: PropertiesStackScreenProps<'AddEditProperty'>) {
  const dispatch = useDispatch();
  const demoMode: boolean = useSelector((state: IRootState) => state.appWide.demoMode);
  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const properties = useSelector((state: IRootState) => state.properties.properties);
  const property = properties.find((property) => property.id === route.params?.propertyId);
  const [propertyType, setPropertyType] = useState<number>(property?.property_type_id || 0);

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: property?.name || "",
        isInvalid: false,
      },
      description: {
        value: property?.description || "",
        isInvalid: false,
      },
    });

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const descriptionIsValid: boolean = inputs.description.value.trim().length >= 0 && inputs.description.value.trim().length < 100;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        description: {
          value: currentInputs.description.value,
          isInvalid: !descriptionIsValid,
        },
      }
    });

    if (!nameIsValid || !descriptionIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!descriptionIsValid)
        wrongDataArray.push("description")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const propertyTemplate: PropertyTemplate = {
      name: inputs.name.value,
      description: inputs.description.value,
      property_type_id: propertyType,
      // unit_id: 1,
    }

    console.log(route.params?.propertyId !== undefined)

    let response: Property | false;
    if (route.params?.propertyId !== undefined) {
      response = await modifyProperty(dispatch, route.params.propertyId, propertyTemplate, demoMode);

      console.log("edit response:");
      console.log(response);
    } else {
      response = await createProperty(dispatch, propertyTemplate, demoMode);

      console.log("add response:");
      console.log(response);
    }

    if (!!response)
      if (!!route.params?.propertyId) {
        navigation.goBack();
      } else {
        navigation.replace("PropertyDetails", {propertyId: response.id});
      }

    // isProperty(response) && navigation.goBack();
    // isProperty(response) && navigation.replace("PropertyDetails", {propertyId: response.id});
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

  // ACTUAL FORM FIELDS

  const nameComponent = <Input
    key="name"
    label="Nazwa właściwości"
    isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "nazwa właściwości",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  let highlightChooserStyle: ViewStyle = {
    flex: 1,
  }

  if (!!route.params?.propertyId)
    highlightChooserStyle.opacity = 0.5;

  const propertyTypeComponent = <View style={{padding: 5}} key="type">
    <Text style={styles.label}>Typ wartości</Text>
    <HighlightChooser
      data={[{key: 1, label: 'tekst'}, {key: 2, label: 'liczba'}, {key: 3, label: 'bool'}]} // , {key: 4, label: 'data'}
      defaultOption={propertyType}
      onPress={(option) => setPropertyType(option)}
      style={highlightChooserStyle}
      touchableOpacityProps={{disabled: !!route.params?.propertyId}}
    />
    {!!route.params?.propertyId && <Text style={{color: 'yellow', fontStyle: 'italic', paddingLeft: 10, fontSize: 12, paddingTop: 4,}}>Ta właściwość nie może już zostać zmieniona.</Text>}
  </View>

  const descriptionComponent = <Input
    key="description"
    label="Opis"
    isInvalid={inputs.description.isInvalid}
    textInputProps={{
      placeholder: "opis właściwości...",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "description"),
      value: inputs.description.value,
      multiline: true,
    }}
  />

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!property ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    propertyTypeComponent,
    descriptionComponent,
  ]

  return (
    <ScrollView
      style={{
        ...styles.container,
        backgroundColor: backgroundColor,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      nestedScrollEnabled={true}
    >
      {listElements}
      {buttonsComponent}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
});