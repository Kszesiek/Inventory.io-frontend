import {Animated, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {InventoryStackScreenProps} from "../../../types";
import {IRootState} from "../../../store/store";
import Detail from "../../../components/Detail";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Item, itemActions} from "../../../store/items";
import {Category} from "../../../store/categories";
import {Warehouse} from "../../../store/warehouses";
import {Modalize} from "react-native-modalize";
import WarehouseChooser from "../../../components/WarehouseChooser";

export default function ItemDetails({ navigation, route }: InventoryStackScreenProps<'ItemDetails'>) {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cancelColor = useThemeColor({}, "delete");
  const tintColor = useThemeColor({}, "tint");

  const item: Item = useSelector((state: IRootState) =>
    state.items.items.find((item: Item) => item.itemId === route.params.itemId)!);
  const category: Category | undefined = useSelector((state: IRootState) =>
    state.categories.categories.find(item_ => item_.id === item.categoryId));
  const warehouse: Warehouse | undefined = useSelector((state: IRootState) =>
    state.warehouses.warehouses.find(item_ => item_.id === item.warehouseId));

  const warehouseModalizeRef = useRef<Modalize>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>(warehouse);

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!item ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditItem", {item: item})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [item])

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Inventory");
    await dispatch(itemActions.removeItem({itemId: item.itemId}));
  }

  function editPressed() {
    navigation.navigate("AddEditItem", {item: item});
  }

  function changeWarehousePressed() {
    warehouseModalizeRef.current?.open();
  }

  function warehouseDescription(): JSX.Element {
    if (item.warehouseId === undefined) return (
      <Text style={{fontStyle: 'italic', fontSize: 13}}>nie przyporządkowano do magazynu</Text>
    ); else if (warehouse === undefined) return (
      <Text style={{fontStyle: 'italic', fontSize: 13}}>nieznany magazyn</Text>
    ); else return (
      <>
        <Text style={{fontFamily: 'Source Sans Bold', paddingBottom: 5,}}>{warehouse.name}</Text>
        {warehouse.city && warehouse.street && warehouse.streetNumber && <>
          <Text style={styles.text}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={styles.text}>{`${warehouse.postalCode ? `${warehouse.postalCode} ` : ''}${warehouse.city}${warehouse.country ? `, ${warehouse.country}` : ''}`}</Text>
        </>}
      </>
    );
  }

  function chooseWarehouse() {
    return (
      <Animated.View style={{flex: 1, marginTop: 10,}}>
        <Text style={[styles.warehouseDrawerTitle, {color: tintColor}]}>Wybierz magazyn</Text>
        <WarehouseChooser
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <OpacityButton
            style={[styles.warehouseDrawerButton, {backgroundColor: cancelColor}]}
            onPress={() => warehouseModalizeRef.current?.close()}
          >
            Anuluj
          </OpacityButton>
          <OpacityButton
            style={styles.warehouseDrawerButton}
            onPress={async () => {
              await dispatch(itemActions.modifyItem({item: {...item, warehouseId: selectedWarehouse?.id || undefined}}))
              warehouseModalizeRef.current?.close();
            }}
          >
            Potwierdź
          </OpacityButton>
        </View>
      </Animated.View>
    )
  }

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
        <Detail name="Nazwa przedmiotu">
          <Text style={styles.text}>{item.name}</Text>
        </Detail>
        <Detail name="Kategoria">
          <Text style={styles.text}>{!!category ? category.name + " (" + category.short_name + ")" : <Text style={{fontStyle: 'italic', fontSize: 13}}>nieznana kategoria</Text>}</Text>
        </Detail>
        <Detail name="Magazyn">
          {warehouseDescription()}
          <OpacityButton
            style={styles.warehouseButton}
            textStyle={{fontSize: 15}}
            onPress={changeWarehousePressed}
          >
            Zmień magazyn
          </OpacityButton>
        </Detail>

        <View style={{flexGrow: 1}}/>
        <View style={styles.editButtonContainer}>
          <OpacityButton
            style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]}
            onPress={deletePressed}
          >
            Usuń
          </OpacityButton>
          <OpacityButton
            style={styles.editButton}
            onPress={editPressed}
          >
            Edytuj
          </OpacityButton>
        </View>
      </ScrollView>
      <Modalize
        ref={warehouseModalizeRef}
        modalStyle={{...styles.modalStyle, backgroundColor}}
        customRenderer={chooseWarehouse()}
      />
    </>
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
    fontSize: 16,
  },
  ordinalNumber: {
    fontSize: 12,
  },
  warehouseButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
  warehouseDrawerButton: {
    margin: 15,
    paddingVertical: 8,
  },
  warehouseDrawerTitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
})