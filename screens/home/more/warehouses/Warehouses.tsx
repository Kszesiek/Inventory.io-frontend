import {ActivityIndicator, FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {WarehousesStackScreenProps} from "../../../../types";
import {Warehouse} from "../../../../store/warehouses";
import {useEffect, useState} from "react";
import {getAllWarehouses} from "../../../../endpoints/warehouses";

export default function Warehouses({ navigation, route }: WarehousesStackScreenProps<'Warehouses'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const warehouses: Array<Warehouse> | null = useSelector((state: IRootState) => state.warehouses.warehouses);
  const [areWarehousesLoaded, setAreWarehousesLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getWarehouses() {
      setAreWarehousesLoaded(await getAllWarehouses(dispatch, demoMode));
    }
    getWarehouses();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  if (areWarehousesLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!areWarehousesLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować magazynów.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1}}
    data={warehouses}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak magazynów do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać magazyn, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={({item}) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("WarehouseDetails", { warehouseId: item.id })}>
          <Text style={boldedText}>{item.name}</Text>
          {/*<Text style={{textAlign: 'center'}}>{warehouse.item.longitude}, {warehouse.item.latitude}</Text>*/}
          {item.street && item.streetNumber && item.city && <>
            <Text style={{textAlign: 'center'}}>{item.street} {item.streetNumber}</Text>
            <Text style={{textAlign: 'center'}}>{`${item.postalCode ? `${item.postalCode} ` : ""}${item.city}${item.country ? `, ${item.country}` : ""}`}</Text>
          </>}
        </TouchableCard>
      )
    }}
  />
}

const styles = StyleSheet.create({
  noContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
})