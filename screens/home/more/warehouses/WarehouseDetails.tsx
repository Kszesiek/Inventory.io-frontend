import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, TextStyle, TouchableOpacity} from "react-native";
import {WarehousesStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {useEffect, useState} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {Warehouse, warehousesActions} from "../../../../store/warehouses";
import {Item} from "../../../../store/items";
import {getFilteredItems} from "../../../../endpoints/items";

export default function WarehouseDetails({ navigation, route }: WarehousesStackScreenProps<'WarehouseDetails'>) {
  const dispatch = useDispatch();
  const demoMode: boolean = useSelector((state: IRootState) => state.appWide.demoMode);
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor({}, "delete");
  const backgroundColor = useThemeColor({}, "background");
  const warehouses: Warehouse[] = useSelector((state: IRootState) => state.warehouses.warehouses);
  const warehouse: Warehouse | undefined = warehouses.find((warehouse) => warehouse.id === route.params.warehouseId);
  const [itemsInWarehouse, setItemsInWarehouse] = useState<Item[] | undefined | null>(undefined);
  const [isWarehouseLoaded, setIsWarehouseLoaded] = useState<boolean>(false);


  useEffect(() => {
    async function getItemsInWarehouse() {
      setItemsInWarehouse(await getFilteredItems(dispatch, undefined, undefined, route.params.warehouseId, undefined, demoMode));
      setIsWarehouseLoaded(true);
    }
    getItemsInWarehouse();
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!warehouse ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditWarehouse", {warehouseId: route.params.warehouseId})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [warehouse])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: textColor,
  }

  async function deletePressed() {
    console.log("delete button pressed");
    await dispatch(warehousesActions.removeWarehouse(route.params.warehouseId));
    navigation.goBack();
  }

  function editPressed() {
    navigation.navigate("AddEditWarehouse", {warehouseId: route.params.warehouseId});
  }

  if (!isWarehouseLoaded) {
    return <View style={styles.loadingView}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.loadingText}>Wczytywanie danych z serwera...</Text>
    </View>
  }

  if (!warehouse) {
    return <View style={styles.loadingView}>
      <Text style={styles.loadingText}>Błąd połączenia z serwerem.</Text>
    </View>
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa magazynu" key="name">
        <Text style={[styles.text, property]}>{warehouse.name}</Text>
      </Detail>
      {warehouse.city && warehouse.street && warehouse.streetNumber && <Detail name="Lokalizacja" key="location">
          <Text style={styles.text}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={styles.text}>{`${warehouse.postalCode ? `${warehouse.postalCode} ` : ''}${warehouse.city}${warehouse.country ? `, ${warehouse.country}` : ''}`}</Text>
      </Detail>}
      <Detail name="Przedmioty w magazynie" key="items">
        {
          itemsInWarehouse === undefined ?
            <>
              <ActivityIndicator color={tintColor} size="large" />
              <Text style={{fontStyle: "italic"}}>Wczytywanie przedmiotów...</Text>
            </>
          : itemsInWarehouse === null ?
              <Text style={{fontStyle: "italic"}}>Błąd połączenia z serwerem.</Text>
          : !itemsInWarehouse || itemsInWarehouse.length === 0 ?
          <Text style={{fontStyle: "italic"}}>Brak przedmiotów w tym magazynie</Text>
          : itemsInWarehouse.map((item: Item, index: number) => (
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
        <OpacityButton style={[styles.editButton, {backgroundColor: errorColor}]} onPress={deletePressed}>Usuń</OpacityButton>
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
  },
})