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
  // latitude: ValidValuePair<number>,
  // longitude: ValidValuePair<number>,
  country: ValidValuePair<string>,
  city: ValidValuePair<string>,
  postalCode: ValidValuePair<string>,
  street: ValidValuePair<string>,
  streetNumber: ValidValuePair<string>,
}

export default function AddEditWarehouse({ navigation, route }: WarehousesStackScreenProps<'AddEditWarehouse'>) {
  const dispatch = useDispatch();

  const warehouse = route.params?.warehouse;

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [location, setLocation] = useState<Location.LocationObject | null>(null
    // !!warehouse ?
    //   {
    //     coords: {
    //       longitude: warehouse.longitude,
    //       latitude: warehouse.latitude,
    //     },
    //     timestamp: Date.now(),
    //   } as Location.LocationObject
    // :
    //   null
  );

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: !!warehouse ? warehouse.name : "",
        isInvalid: false,
      },
      // longitude: {
      //   value: !!warehouse ? warehouse.longitude : 0.,
      //   isInvalid: false,
      // },
      // latitude: {
      //   value: !!warehouse ? warehouse.latitude : 0.,
      //   isInvalid: false,
      // },
      country: {
        value: !!warehouse ? warehouse.country : "",
        isInvalid: false,
      },
      city: {
        value: !!warehouse ? warehouse.city : "",
        isInvalid: false,
      },
      postalCode: {
        value: !!warehouse ? warehouse.postalCode : "",
        isInvalid: false,
      },
      street: {
        value: !!warehouse ? warehouse.street : "",
        isInvalid: false,
      },
      streetNumber: {
        value: !!warehouse ? warehouse.streetNumber : "",
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
    // const longitudeIsValid: boolean = inputs.longitude.value >= -90 && inputs.longitude.value <= 90;
    // const latitudeIsValid: boolean = inputs.longitude.value >= -180 && inputs.longitude.value <= 180;
    const countryIsValid: boolean = inputs.country.value.trim().length > 0 && inputs.country.value.trim().length < 100;
    const cityIsValid: boolean = inputs.city.value.trim().length > 0 && inputs.city.value.trim().length < 100;
    const postalCodeIsValid: boolean = inputs.postalCode.value.trim().length > 0 && inputs.postalCode.value.trim().length < 100;
    const streetIsValid: boolean = inputs.street.value.trim().length > 0 && inputs.street.value.trim().length < 100;
    const streetNumberIsValid: boolean = inputs.streetNumber.value.trim().length > 0 && inputs.streetNumber.value.trim().length < 100;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        // longitude: {
        //   value: currentInputs.longitude.value,
        //   isInvalid: !longitudeIsValid,
        // },
        // latitude: {
        //   value: currentInputs.latitude.value,
        //   isInvalid: !latitudeIsValid,
        // },
        country: {
          value: currentInputs.country.value,
          isInvalid: !countryIsValid,
        },
        city: {
          value: currentInputs.city.value,
          isInvalid: !cityIsValid,
        },
        postalCode: {
          value: currentInputs.postalCode.value,
          isInvalid: !postalCodeIsValid,
        },
        street: {
          value: currentInputs.street.value,
          isInvalid: !streetIsValid,
        },
        streetNumber: {
          value: currentInputs.streetNumber.value,
          isInvalid: !streetNumberIsValid,
        },
      }
    });

    if (!nameIsValid || /* !longitudeIsValid || !latitudeIsValid || */ !countryIsValid || !cityIsValid || !postalCodeIsValid || !streetIsValid || !streetNumberIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("name")
      // if (!longitudeIsValid)
      //   wrongDataArray.push("longitude")
      // if (!latitudeIsValid)
      //   wrongDataArray.push("latitude")
      if (!countryIsValid)
        wrongDataArray.push("country")
      if (!cityIsValid)
        wrongDataArray.push("city")
      if (!postalCodeIsValid)
        wrongDataArray.push("postal code")
      if (!streetIsValid)
        wrongDataArray.push("street")
      if (!streetNumberIsValid)
        wrongDataArray.push("street number")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const warehouseData: Warehouse = {
      name: inputs.name.value,
      // longitude: inputs.longitude.value,
      // latitude: inputs.latitude.value,
      city: inputs.city.value,
      country: inputs.country.value,
      postalCode: inputs.postalCode.value,
      street: inputs.street.value,
      streetNumber: inputs.streetNumber.value,
      id: !!warehouse ? warehouse.id : Math.random().toString()
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
      Alert.alert("Odczytywanie lokalizacji urządzenia...", "Operacja może zająć kilka sekund...", [], {cancelable: true})
      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
      Location.reverseGeocodeAsync(location.coords).then((address) => {
        console.log(address)
        Alert.alert(
          "Odczytano lokalizację urządzenia",
          `Lokalizacja urządzenia została odczytana jako:\n
          (${location.coords.longitude}, ${location.coords.latitude})
          ${address[0].street} ${address[0].streetNumber}
          ${address[0].postalCode} ${address[0].city}, ${address[0].country}\n\nCzy chcesz nadać magazynowi tę lokalizację?`,
          [
            {
              text: "Nie",
              style: "cancel",
            },
            {
              text: "Tak",
              onPress: () => {
                setInputs((currentInputValues: typeof inputs) => {
                  return {
                    ...currentInputValues,
                    country: {value: address[0].country, isInvalid: false},
                    city: {value: address[0].city, isInvalid: false},
                    postalCode: {value: address[0].postalCode, isInvalid: false},
                    street: {value: address[0].street, isInvalid: false},
                    streetNumber: {value: address[0].streetNumber, isInvalid: false},
                  }
                })
              },
            }
          ]
        )
      })
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

  const countryComponent = <Input
    key="country"
    label="Kraj"
    isInvalid={inputs.country.isInvalid}
    textInputProps={{
      placeholder: "kraj",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "country"),
      value: inputs.country.value,
    }}
  />

  const cityComponent = <Input
    key="city"
    label="Miasto"
    isInvalid={inputs.city.isInvalid}
    textInputProps={{
      placeholder: "miasto",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "city"),
      value: inputs.city.value,
    }}
  />

  const postalCodeComponent = <Input
    key="postalCode"
    label="Kod pocztowy"
    isInvalid={inputs.postalCode.isInvalid}
    textInputProps={{
      placeholder: "kod pocztowy",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "postalCode"),
      value: inputs.postalCode.value,
    }}
  />

  const streetComponent = <Input
    key="street"
    label="Ulica"
    isInvalid={inputs.street.isInvalid}
    textInputProps={{
      placeholder: "ulica",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "street"),
      value: inputs.street.value,
    }}
  />

  const streetNumberComponent = <Input
    key="streetNumber"
    label="Numer budynku / mieszkania"
    isInvalid={inputs.streetNumber.isInvalid}
    textInputProps={{
      placeholder: "numer budynku / mieszkania",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "streetNumber"),
      value: inputs.streetNumber.value,
    }}
  />

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!warehouse ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    // locationComponent,
    useCurrentLocationButton,
    countryComponent,
    cityComponent,
    postalCodeComponent,
    streetComponent,
    streetNumberComponent,
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