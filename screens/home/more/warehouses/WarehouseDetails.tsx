import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ScrollView, StyleProp, StyleSheet, TextStyle, TouchableOpacity} from "react-native";
import {WarehousesStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {useEffect} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {Warehouse, warehousesActions} from "../../../../store/warehouses";
import {Item} from "../../../../store/items";

export default function WarehouseDetails({ navigation, route }: WarehousesStackScreenProps<'WarehouseDetails'>) {
  const dispatch = useDispatch();
  const textColor = useThemeColor({}, 'text');
  const warehouse: Warehouse = useSelector((state: IRootState) =>
    state.warehouses.warehouses.find((item: Warehouse) => item.id === route.params.warehouseId)!);
  const itemsInWarehouse: Item[] = useSelector((state: IRootState) =>
    state.items.items.filter((item) => item.warehouseId === warehouse.id));

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!warehouse ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditWarehouse", {warehouse: warehouse})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [warehouse])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: useThemeColor({}, "text"),
  }

  const backgroundColor = useThemeColor({}, "background");

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Warehouses");
    await dispatch(warehousesActions.removeWarehouse(warehouse.id));
  }

  function editPressed() {
    navigation.navigate("AddEditWarehouse", {warehouse: warehouse});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa magazynu" key="name">
        <Text style={[styles.text, property]}>{warehouse.name}</Text>
      </Detail>
      {warehouse.city && warehouse.street && warehouse.streetNumber && <Detail name="Lokalizacja" key="location">
          <Text style={styles.text}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={styles.text}>{`${warehouse.postalCode && `${warehouse.postalCode} `}${warehouse.city}${warehouse.country && `, ${warehouse.country}`}`}</Text>
      </Detail>}
      <Detail name="Przedmioty w magazynie" key="items">
        {itemsInWarehouse.length === 0 ?
          <Text style={{fontStyle: "italic"}}>Brak przedmiotów w tym magazynie</Text>
        :
          itemsInWarehouse.map((item: Item, index: number) => (
            <Text key={item.itemId}>{index + 1}. {item.name}</Text>
          ))
        }
      </Detail>

      {/*<Detail name="Długość geograficzna">*/}
      {/*  <Text style={[styles.text, property]}>{warehouse.longitude}</Text>*/}
      {/*</Detail>*/}
      {/*<Detail name="Szerokość geograficzna">*/}
      {/*  <Text style={[styles.text, property]}>{warehouse.latitude}</Text>*/}
      {/*</Detail>*/}

      <View style={{flexGrow: 1}} key="spacer" />
      <View style={styles.editButtonContainer} key="bottomButtons">
        <OpacityButton style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]} onPress={deletePressed}>Usuń</OpacityButton>
        <OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  mainCard: {
    margin: 15,
    padding: 10,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  editButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  text: {
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
})