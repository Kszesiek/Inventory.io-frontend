import {Alert, ScrollView, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {WarehousesStackScreenProps} from "../../../../types";
import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Warehouse, warehousesActions} from "../../../../store/warehouses";
import * as Location from 'expo-location';
import * as React from "react";
import Card from "../../../../components/Themed/Card";

export type ValidValuePair<ValueType> = {
  value: ValueType
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair<string>,
  latitude: ValidValuePair<number>,
  longitude: ValidValuePair<number>,
}

export default function AddEditWarehouse({ navigation, route }: WarehousesStackScreenProps<'AddEditWarehouse'>) {
  const dispatch = useDispatch();

  const warehouse = route.params?.warehouse;

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [location, setLocation] = useState<Location.LocationObject | null>(!!warehouse ?
    {
      coords: {
        longitude: warehouse.longitude,
        latitude: warehouse.latitude,
      },
      timestamp: Date.now(),
    } as Location.LocationObject
      :
    null
  );

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: !!warehouse ? warehouse.name : "",
        isInvalid: false,
      },
      longitude: {
        value: !!warehouse ? warehouse.longitude : 0.,
        isInvalid: false,
      },
      latitude: {
        value: !!warehouse ? warehouse.latitude : 0.,
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

  useEffect(() => {
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        longitude: {value: location?.coords.longitude || "", isInvalid: false},
        latitude: {value: location?.coords.latitude || "", isInvalid: false},
      }
    })
  }, [location])

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const longitudeIsValid: boolean = inputs.longitude.value >= -90 && inputs.longitude.value <= 90;
    const latitudeIsValid: boolean = inputs.longitude.value >= -180 && inputs.longitude.value <= 180;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        longitude: {
          value: currentInputs.longitude.value,
          isInvalid: !longitudeIsValid,
        },
        latitude: {
          value: currentInputs.latitude.value,
          isInvalid: !latitudeIsValid,
        },
      }
    });

    if (!nameIsValid || !longitudeIsValid || !latitudeIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!longitudeIsValid)
        wrongDataArray.push("longitude")
      if (!latitudeIsValid)
        wrongDataArray.push("latitude")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const warehouseData: Warehouse = {
      name: inputs.name.value,
      longitude: inputs.longitude.value,
      latitude: inputs.latitude.value,
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

  const useCurrentLocationButton = <OpacityButton
    style={styles.locationButton}
    textStyle={{fontSize: 15}}
    onPress={async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {

        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }}
  >
    Użyj bieżącej lokalizacji
  </OpacityButton>

  const locationComponent = !!location ? <View key="location">
    <View style={styles.locationRow}>
      <View style={{...styles.locationItem}}>
        <Text numberOfLines={1} style={styles.propertyLabel}>
          Długość geograficzna
        </Text>
        <Card style={styles.locationCard}>
          <Text style={styles.locationText}>{location.coords.longitude}</Text>
        </Card>
      </View>
      <View style={{width: 8}} />
      <View style={styles.locationItem}>
        <Text numberOfLines={1} style={styles.propertyLabel}>
          Szerokość geograficzna
        </Text>
        <Card style={styles.locationCard}>
          <Text style={styles.locationText}>{location.coords.latitude}</Text>
        </Card>
      </View>
    </View>
    {useCurrentLocationButton}
  </View>
    :
  <View style={styles.locationItem} key="location">
    <Text numberOfLines={1} style={styles.propertyLabel}>
      Lokalizacja
    </Text>
    <Card style={{padding: 10, borderRadius: 10,}}>
      <Text style={{fontStyle: "italic", textAlign: 'center', margin: 10,}}>Nie podano lokalizacji</Text>
      {useCurrentLocationButton}
    </Card>
  </View>

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
    flexGrow: 1,
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
  propertyContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  propertyLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  card: {
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 18,
  },
  locationRow: {
    flexDirection: 'row',
  },
  locationItem: {
    marginHorizontal: 5,
    marginVertical: 8,
    flex: 1,
  },
  locationButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 10,
    alignSelf: 'center',
  },
  locationText: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  locationCard: {
    borderRadius: 10,
    alignItems: 'stretch',
  },
});