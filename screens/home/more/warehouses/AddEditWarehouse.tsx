import {Alert, ScrollView, StyleSheet} from "react-native";
import {useThemeColor, View} from "../../../../components/Themed";
import {WarehousesStackScreenProps} from "../../../../types";
import {useLayoutEffect, useState} from "react";
import {useDispatch} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Warehouse, warehousesActions} from "../../../../store/warehouses";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  location: ValidValuePair,
}

export default function AddEditWarehouse({ navigation, route }: WarehousesStackScreenProps<'AddEditWarehouse'>) {
  const dispatch = useDispatch();

  const warehouse = route.params?.warehouse;

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: !!warehouse ? warehouse.name : "",
        isInvalid: false,
      },
      location: {
        value: !!warehouse ? warehouse.location : "",
        isInvalid: false,
      },
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !!warehouse ? "Edytuj magazyn" : "Utwórz magazyn"
    });
  }, [navigation, !!warehouse])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const locationIsValid: boolean = true;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        location: {
          value: currentInputs.location.value,
          isInvalid: !locationIsValid,
        },
      }
    });

    if (!nameIsValid || !locationIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!locationIsValid)
        wrongDataArray.push("location")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const warehouseData: Warehouse = {
      name: inputs.name.value,
      location: inputs.location.value,
      id: !!warehouse ? warehouse.id : Math.random().toString(),
    }

    if (!!warehouse) {
      const response = await dispatch(warehousesActions.modifyWarehouse(warehouseData));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(warehousesActions.addWarehouse(warehouseData));

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
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
    label="Nazwa magazynu"
    isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "nazwa magazynu",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  const locationComponent = <Input
    key="surname"
    label="Lokalizacja"
    isInvalid={inputs.location.isInvalid}
    textInputProps={{
      placeholder: "lokalizacja",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "location"),
      value: inputs.location.value,
    }}
  />

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!warehouse ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    locationComponent,
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
  }
});