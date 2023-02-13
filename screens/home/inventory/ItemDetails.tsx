import {ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {InventoryStackScreenProps} from "../../../types";
import {IRootState} from "../../../store/store";
import Detail from "../../../components/Detail";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {useEffect, useState} from "react";
import {Item, itemActions} from "../../../store/items";
import {CategoryExtended} from "../../../store/categories";
import {Warehouse} from "../../../store/warehouses";
import {getWarehouse} from "../../../endpoints/warehouses";
import {getCategory} from "../../../endpoints/categories";
import {Property} from "../../../store/properties";
import {getItem} from "../../../endpoints/items";
import {useFocusEffect} from "@react-navigation/native";

export default function ItemDetails({ navigation, route }: InventoryStackScreenProps<'ItemDetails'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const deleteColor = useThemeColor({}, "delete");

  const item: Item | undefined = useSelector((state: IRootState) => state.items.items.find(
    (item) => item.itemId === route.params.itemId));

  const [category, setCategory] = useState<CategoryExtended | null | undefined>(undefined);
  const [warehouse, setWarehouse] = useState<Warehouse | null | undefined>(undefined);
  // const [properties, setProperties] = useState<Property[]>([]);

  const [isItemLoaded, setIsItemLoaded] = useState<boolean>(!!item);
  const [isWarehouseLoaded, setIsWarehouseLoaded] = useState<boolean>(false);
  const [isCategoryLoaded,  setIsCategoryLoaded]  = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!item ? () => (
        <TouchableOpacity onPress={editPressed}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [item])

  useEffect(() => {
    async function getItemWarehouse() {
      if (!item || item.warehouseId === undefined || item.warehouseId === null)
        return;

      const itemWarehouse = await getWarehouse(dispatch, item.warehouseId, demoMode);

      setWarehouse(itemWarehouse);
      setIsWarehouseLoaded(true);
    }
    async function getItemCategory() {
      if (!item)
        return;
      const itemCategory = await getCategory(dispatch, item.categoryId, demoMode);
      if (itemCategory !== undefined)
        setCategory(itemCategory);
      setIsCategoryLoaded(true);
    }

    // async function getItemProperties() {
    //   if (!item)
    //     return;
    //
    //   const properties: Property[] | null = await getPropertiesForCategory(item.categoryId);
    //   if (!!properties)
    //     setProperties(properties);
    // }

    // getItemProperties();
    getItemCategory();
    getItemWarehouse();
  }, [item]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const item = await getItem(dispatch, route.params.itemId, demoMode);
        setIsItemLoaded(!!item);
      })();
    }, [])
  );

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Inventory");
    await dispatch(itemActions.removeItem({itemId: route.params.itemId}));
  }

  function editPressed() {
    navigation.navigate("AddEditItem", {itemId: route.params.itemId}); //  category: category || undefined, warehouse: warehouse || undefined
  }

  function warehouseDescription(): JSX.Element {
    if (!item || item.warehouseId === undefined || item.warehouseId === null)
      return <Text style={styles.detailsReplacementText}>nie przyporządkowano do magazynu</Text>
    else if (!isWarehouseLoaded)
      return <ActivityIndicator color={tintColor} size="large" />
        // <Text style={styles.detailsReplacementText}>ładowanie danych...</Text>
    else if (warehouse === undefined)
      return <Text style={styles.detailsReplacementText}>błąd połączenia z serwerem</Text>
    else if (warehouse === null)
      return <Text style={styles.detailsReplacementText}>nieznany magazyn</Text>
    else return (
      <>
        <Text style={{fontFamily: 'Source Sans Bold', paddingBottom: 5,}}>{warehouse.name}</Text>
        {warehouse.city && warehouse.street && warehouse.streetNumber && <>
          <Text style={styles.text}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={styles.text}>{`${warehouse.postalCode ? `${warehouse.postalCode} ` : ''}${warehouse.city}${warehouse.country ? `, ${warehouse.country}` : ''}`}</Text>
        </>}
      </>
    );
  }

  function categoryDescription(): JSX.Element {
    if (!isCategoryLoaded)
      return <Text style={styles.detailsReplacementText}>wczytywanie danych...</Text>
    else if (category === undefined)
      return <Text style={styles.detailsReplacementText}>błąd połączenia z serwerem</Text>
    else if (category === null)
      return <Text style={styles.detailsReplacementText}>nieznana kateogria</Text>
    else
      return <Text style={styles.text}>{category.name + " (" + category.short_name + ")"}</Text>
  }

  if (!isItemLoaded)
    return <View style={styles.loadingView}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.loadingText}>Wczytywanie danych z serwera...</Text>
    </View>

  if (!item)
    return <View style={styles.loadingView}>
      <Text style={styles.loadingText}>Błąd połączenia z serwerem.</Text>
    </View>

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa przedmiotu">
        <Text style={styles.text}>{item.name}</Text>
      </Detail>
      <Detail name="Opis przedmiotu">
        <Text style={styles.text}>{(!!item.description && item.description.length > 0) ? item.description : <Text style={styles.detailsReplacementText}>przedmiot nie posiada opisu</Text>}</Text>
      </Detail>
      <Detail name="Kategoria">
        {categoryDescription()}
      </Detail>
      <Detail name="Magazyn">
        {warehouseDescription()}
      </Detail>
      <Detail name="Właściwości">
        {
          (!category?.properties || category.properties.length === 0) ?
            <Text style={styles.detailsReplacementText}>Brak właściwości przypisanych do tej kategorii</Text>
            : undefined
        }
        {
          category?.properties && category.properties.length > 0 && item.values?.map((value) => {
            const property: Property | undefined = category.properties.find((property) => property.id === value.property_id);
            return !!property ? <Text key={property.id}>{property?.name}: {property.property_type_id !== 3 ? value.value : value.value === 'true' ? "Tak  ✔️" : "Nie  ❌"}</Text> : undefined;
          })
        }
        {
          category?.properties && category.properties.length > 0 && item.values !== undefined && <OpacityButton
                style={styles.propertiesButton}
                textStyle={styles.propertiesButtonText}
                onPress={() => navigation.navigate("EditItemProperties", {itemId: route.params.itemId, categoryId: category.id})}
            >
                Edytuj właściwości przedmiotu
            </OpacityButton>
        }
      </Detail>



      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton
          style={[styles.editButton, {backgroundColor: deleteColor}]}
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
  propertiesButton: {
    paddingVertical: 4,
    alignSelf: 'center',
    marginTop: 8,
  },
  propertiesButtonText: {
    fontSize: 14,
  },
  text: {
    fontSize: 16,
  },
  detailsReplacementText: {
    fontStyle: "italic",
    fontSize: 13,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
  },
  // warehouseButton: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 5,
  //   marginTop: 10,
  //   alignSelf: 'center',
  // },
  // modalStyle: {
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   marginTop: 25,
  //   flex: 1,
  // },
  // warehouseDrawerButton: {
  //   margin: 15,
  //   paddingVertical: 8,
  // },
  // warehouseDrawerTitle: {
  //   fontSize: 22,
  //   marginVertical: 5,
  //   marginHorizontal: 20,
  //   textAlign: 'center',
  // },
})