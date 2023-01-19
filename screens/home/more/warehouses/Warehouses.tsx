import {ActivityIndicator, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
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
  const [isDataLoaded, setIsDataLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getWarehouses() {
      setIsDataLoaded(await getAllWarehouses(dispatch, demoMode));
    }
    getWarehouses();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  if (isDataLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!isDataLoaded) {
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
    renderItem={(warehouse: ListRenderItemInfo<Warehouse>) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("WarehouseDetails", { warehouse: warehouse.item })}>
          <Text style={boldedText}>{warehouse.item.name}</Text>
          {/*<Text style={{textAlign: 'center'}}>{warehouse.item.longitude}, {warehouse.item.latitude}</Text>*/}
          <Text style={{textAlign: 'center'}}>{warehouse.item.street} {warehouse.item.streetNumber}</Text>
          <Text style={{textAlign: 'center'}}>{`${warehouse.item.postalCode && `${warehouse.item.postalCode} `}${warehouse.item.city}${warehouse.item.country && `, ${warehouse.item.country}`}`}</Text>
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