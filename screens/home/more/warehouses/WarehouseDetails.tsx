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

export default function WarehouseDetails({ navigation, route }: WarehousesStackScreenProps<'WarehouseDetails'>) {
  const dispatch = useDispatch();
  const textColor = useThemeColor({}, 'text');
  const warehouse: Warehouse = useSelector((state: IRootState) =>
    state.warehouses.warehouses.find((item: Warehouse) => item.id === route.params.warehouseId)!)

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
      <Detail name="Nazwa magazynu">
        <Text style={[styles.text, property]}>{warehouse.name}</Text>
      </Detail>
      {warehouse.country && warehouse.city && warehouse.postalCode && warehouse.street && warehouse.streetNumber && <Detail name="Lokalizacja">
          <Text style={styles.text}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={styles.text}>{`${warehouse.postalCode} ${warehouse.city}, ${warehouse.country}`}</Text>
      </Detail>}

      {/*<Detail name="Długość geograficzna">*/}
      {/*  <Text style={[styles.text, property]}>{warehouse.longitude}</Text>*/}
      {/*</Detail>*/}
      {/*<Detail name="Szerokość geograficzna">*/}
      {/*  <Text style={[styles.text, property]}>{warehouse.latitude}</Text>*/}
      {/*</Detail>*/}

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
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
    // elevation: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
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