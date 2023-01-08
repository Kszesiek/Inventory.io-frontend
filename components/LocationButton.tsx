import {OpacityButton} from "./Themed/OpacityButton";
import * as Location from "expo-location";
import {Alert, StyleSheet} from "react-native";
import * as React from "react";
import {LocationGeocodedAddress} from "expo-location";

type props = {
  onConfirmLocation: (address: Location.LocationGeocodedAddress) => void
}

export function LocationButton({onConfirmLocation}: props) {
  return (
    <OpacityButton
      style={styles.locationButton}
      textStyle={{fontSize: 15}}
      onPress={async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        Alert.alert("Odczytywanie lokalizacji urządzenia...", "Operacja może zająć kilka sekund...", [], {cancelable: true})
        let location = await Location.getCurrentPositionAsync();
        Location.reverseGeocodeAsync(location.coords).then((address: LocationGeocodedAddress[]) => {
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
                onPress: () => onConfirmLocation(address[0])
              },
            ]
          )
        })
      }}
    >
      Użyj bieżącej lokalizacji
    </OpacityButton>
  );
}

const styles = StyleSheet.create({
  locationButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
})