import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {WarehousesStackScreenProps} from "../../../../types";
import {Warehouse} from "../../../../store/warehouses";

export default function Warehouses({ navigation, route }: WarehousesStackScreenProps<'Warehouses'>) {
  const members: Array<Warehouse> = useSelector((state: IRootState) => state.warehouses.warehouses)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
    contentContainerStyle={{flexGrow: 1}}
    data={members.slice(0, 20)}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak magazynów do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać magazyn, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={(warehouse: ListRenderItemInfo<Warehouse>) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("WarehouseDetails", { warehouseId: warehouse.item.id })}>
          <Text style={boldedText}>{warehouse.item.name}</Text>
          <Text style={{textAlign: 'center'}}>{warehouse.item.longitude}, {warehouse.item.latitude}</Text>
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