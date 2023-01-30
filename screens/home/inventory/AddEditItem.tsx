import {Alert, Animated, FlatList, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {InventoryStackScreenProps} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Item, ItemTemplate, Value} from "../../../store/items";
import {writeOutArray} from "../../../utilities/enlist";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {IRootState} from "../../../store/store";
import {Category, CategoryExtended, isCategory, isCategoryExtended} from "../../../store/categories";
import {Modalize} from "react-native-modalize";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import * as React from "react";
import CategoriesChooser from "../../../components/choosers/CategoriesChooser";
import {Warehouse} from "../../../store/warehouses";
import WarehouseChooser from "../../../components/choosers/WarehouseChooser";
import {getAllWarehouses} from "../../../endpoints/warehouses";
import {getAllCategories, getCategory} from "../../../endpoints/categories";
import {addItem, modifyItem} from "../../../endpoints/items";
import {defaultValue, Property} from "../../../store/properties";
import {getPropertiesForCategory} from "../../../endpoints/properties";
import Switch from "../../../components/Themed/Switch";
import Card from "../../../components/Themed/Card";

export type ValidValuePair<Type> = {
  value: Type
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair<string>,
  description: ValidValuePair<string>,
}

export default function AddEditItem({ navigation, route }: InventoryStackScreenProps<'AddEditItem'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const categories : Category[]  = useSelector((state: IRootState) => state.categories.categories);
  const warehouses : Warehouse[] = useSelector((state: IRootState) => state.warehouses.warehouses);
  const [properties, setProperties] = useState<Property[]>([]);
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState<boolean | undefined>(categories.length === 0 ? undefined : true);
  const [areWarehousesLoaded, setAreWarehousesLoaded] = useState<boolean | undefined>(warehouses.length === 0 ? undefined : true);
  const [arePropertiesLoaded, setArePropertiesLoaded] = useState<boolean | undefined>(undefined);

  const item: Item | undefined = useSelector((state: IRootState) => state.items.items.find((item_) => item_.itemId === route.params?.itemId));
  const categoryFromState: Category | undefined = useSelector((state: IRootState) => state.categories.categories.find((category) => category.id === item?.categoryId));
  const warehouseFromState: Warehouse | undefined = useSelector((state: IRootState) => state.warehouses.warehouses.find((warehouse) => warehouse.id === item?.warehouseId));

  const [category, setCategory] = useState<CategoryExtended | Category | undefined>(categoryFromState);
  const [warehouse, setWarehouse] = useState<Warehouse | undefined>(warehouseFromState);
  const categoriesModalizeRef = useRef<Modalize>(null);
  const warehousesModalizeRef = useRef<Modalize>(null);

  const [isExtendedCategoryLoaded, setIsExtendedCategoryLoaded] = useState<boolean | undefined>(isCategoryExtended(category));

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");
  const tintColor = useThemeColor({}, "tint");

  async function getWarehouses() {
    setAreWarehousesLoaded(await getAllWarehouses(dispatch, demoMode));
  }
  async function getCategories() {
    setAreCategoriesLoaded(await getAllCategories(dispatch, demoMode));
  }
  async function getProperties() {
    if (!category)
      return;
    const properties: Property[] | null = await getPropertiesForCategory(category?.id, demoMode);
    Array.isArray(properties) && setProperties(properties);
    setArePropertiesLoaded(!!properties);
  }
  async function getExtendedCategory() {
    setIsExtendedCategoryLoaded(false);
    const extendedCategory: CategoryExtended | null | undefined = await getCategory(dispatch, (category as Category).id, demoMode);
    if (!isCategoryExtended(extendedCategory))
    //   setCategory(extendedCategory);
    // else
      console.error("Fetching extended category resulted in " + extendedCategory + ", which means that " +
        (extendedCategory === null ? "server did not recognize given category!" :
          "there was an unexpected response from server or other connectivity issues!"));
    else {
      setProperties(extendedCategory.properties);
    }
    setIsExtendedCategoryLoaded(true);
  }

  useEffect(() => {
    getWarehouses();
    getProperties();
    !route.params?.itemId && getCategories();
    // if (isCategory(category) && !isCategoryExtended(category)) {
    //   console.log("getExtendedCategory in useEffect[]");
    //   getExtendedCategory();
    // }
  }, []);

  useEffect(() => {
    if (isCategory(category) && !isCategoryExtended(category)) {
      console.log("getExtendedCategory in useEffect[category]");
      getExtendedCategory();
    }
  }, [category]);

  const [propertyInputs, setPropertyInputs] = useState<{[key: number]: ValidValuePair<string | number | boolean>}>({}); //  | number | boolean | Date

  const [inputs, setInputs] = useState<inputValuesType>(
    {
      name: {
        value: !!item ? item.name : "",
        isInvalid: false,
      },
      description: {
        value: !!item ? item.description || "" : "",
        isInvalid: false,
      },
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !!item ? "Edytuj przedmiot" : "Dodaj przedmiot"
    });
  }, [navigation, item])

  useEffect(() => {
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        category_id: {value: category?.id || "", isInvalid: false},
      }
    })
  }, [category])

  useEffect(() => {
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        warehouse_id: {value: warehouse?.id || undefined, isInvalid: false},
      }
    })
  }, [warehouse])

  useEffect(() => {
    setPropertyInputs((prevState) => {
      let newState: typeof propertyInputs = {};

      properties.forEach((property) => {
        newState[property.id] = {
          value: prevState[property.id]?.value || defaultValue(property),
          isInvalid: false,
        };
      })

      return newState;
    })
  }, [properties]);

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.length < 100;
    const descriptionIsValid: boolean = inputs.name.value.trim().length >= 0 && inputs.name.value.length < 1000;
    const categoryIsValid: boolean = !!category; // categories.findIndex(category => category.id === inputs.category_id.value) !== -1;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        description: {
          value: currentInputs.description.value,
          isInvalid: !descriptionIsValid,
        },
      }
    });

    if (!nameIsValid || !descriptionIsValid || !categoryIsValid) {
      const wrongDataArray: string[] = []
      if (!categoryIsValid)
        wrongDataArray.push("category")
      if (!nameIsValid)
        wrongDataArray.push("item name")
      if (!descriptionIsValid)
        wrongDataArray.push("description")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const itemTemplate: ItemTemplate = {
      name: inputs.name.value,
      group_id: category!.id,
      description: inputs.description.value,
      status_id: 5,  // This will be added... someday
      values: properties.map((property) => ({
        value: propertyInputs[property.id].value,
        property_id: property.id,
      } as Value)),
      warehouse_id: warehouse?.id || undefined,
    }

    console.log(itemTemplate);

    let response: false | Item;

    if (!!item) {
      response = await modifyItem(dispatch, item.itemId, itemTemplate, demoMode);

      console.log("edit response:");
      console.log(response);
    } else {
      response = await addItem(dispatch, itemTemplate, demoMode);

      console.log("add response:");
      console.log(response);
    }

    if (response)
      if (route.params?.itemId)
        navigation.goBack();
      else
        navigation.replace("ItemDetails", {itemId: response.itemId});
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

  function propertyInputChangedHandler<InputParam extends keyof typeof propertyInputs>(inputIdentifier: InputParam, enteredValue: string | number | boolean) {
    console.log(`${inputIdentifier} value changed`);
    console.log(`entered value: ${enteredValue}`);
    setPropertyInputs((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, isInvalid: false},
      }
    });
    console.log(propertyInputs);
  }

  function Categories() {
    return (
      <Animated.View style={{flex: 1}}>
        <CategoriesChooser
          currentCategory={category}
          setCurrentCategory={setCategory}
        />
        <OpacityButton
          style={styles.bottomDrawerConfirmButton}
          onPress={() => categoriesModalizeRef.current?.close()}
        >
          Potwierdź
        </OpacityButton>
      </Animated.View>
    )
  }

  function categoryPressed() {
    console.log("category pressed");
    categoriesModalizeRef.current?.open();
  }

  function chooseWarehouse() {
    return (
      <Animated.View style={{flex: 1, marginTop: 10,}}>
        <Text style={[styles.warehouseDrawerTitle, {color: tintColor}]}>Wybierz magazyn</Text>
        <WarehouseChooser
          selectedWarehouse={warehouse}
          setSelectedWarehouse={setWarehouse}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <OpacityButton
            style={styles.warehouseDrawerButton}
            onPress={async () => {
              warehousesModalizeRef.current?.close();
            }}
          >
            Potwierdź
          </OpacityButton>
        </View>
      </Animated.View>
    )
  }

  function warehousePressed() {
    console.log("warehouse pressed");
    warehousesModalizeRef.current?.open();
  }

  // ACTUAL FORM FIELDS

  const itemNameComponent = <Input
    label="Nazwa przedmiotu"
    isInvalid={inputs.name.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "nazwa przedmiotu",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const itemDescriptionComponent = <Input
    label="Opis przedmiotu"
    isInvalid={inputs.description.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "opis przedmiotu",
      maxLength: 1000,
      onChangeText: inputChangedHandler.bind(null, "description"),
      value: inputs.description.value,
      multiline: true,
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const categoryComponent = <View key="category" style={styles.propertyContainer}>
    <Text style={[styles.propertyLabel, /* inputs.category_id.isInvalid || !category && {color: cancelColor} */]}>Kategoria</Text>
    <TouchableCard
      style={[styles.card, /* inputs.category_id.isInvalid || !category && {backgroundColor: cancelColor},  */ (!areCategoriesLoaded || !!route.params?.itemId) && {opacity: 0.6}]}
      onPress={categoryPressed}
      props={{disabled: !areCategoriesLoaded || !!route.params?.itemId}}
    >
      {!!category ?
        <Text style={{fontSize: 18, paddingVertical: 3}}>{category.name} ({category.short_name})</Text>
        :
        <Text style={{fontSize: 16, paddingVertical: 4, fontStyle: 'italic'}}>{areCategoriesLoaded ? "wybierz kategorię..." : "wczytywanie kategorii..."}</Text>}
    </TouchableCard>
    {!!route.params?.itemId && <Text style={{color: 'yellow', fontStyle: 'italic', paddingLeft: 10, fontSize: 12,}}>Ta właściwość nie może już zostać zmieniona.</Text>}
  </View>

  const warehouseComponent = <View key="warehouse" style={styles.propertyContainer}>
    <Text style={styles.propertyLabel}>Magazyn</Text>
    <TouchableCard
      style={[styles.card, !areWarehousesLoaded && {opacity: 0.6}]}
      onPress={warehousePressed}
      props={{disabled: !areWarehousesLoaded}}
    >
      {!!warehouse ?
        <>
          <Text style={{fontFamily: 'Source Sans Bold', paddingBottom: 5, fontSize: 16, color: tintColor}}>{warehouse.name}</Text>
          <Text style={{fontSize: 16}}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={{fontSize: 16}}>{`${warehouse.postalCode ? `${warehouse.postalCode} ` : ''}${warehouse.city}${warehouse.country ? `, ${warehouse.country}` : ''}`}</Text>
        </>
        :
        <Text style={{fontSize: 16, paddingVertical: 4, fontStyle: 'italic'}}>{areWarehousesLoaded ? "wybierz magazyn..." : "wczytywanie magazynów..."}</Text>}
    </TouchableCard>
  </View>

  const valuesComponent = <View key="values">
    {
      properties.length > 0 && properties.map((property) => {
        if (property.property_type_id === 1 || property.property_type_id === 2)
          return <Input
            key={property.id}
            label={property.name}
            isInvalid={false} // inputs.description.isInvalid
            textInputProps={{
              placeholder: property.name.toLowerCase() + "...",
              maxLength: 100,
              onChangeText: (text) => {
                if (property.property_type_id === 2 && isNaN(Number(text)))
                  return;

                propertyInputChangedHandler(property.id, text);
              },
              value: propertyInputs[property.id]?.value.toString() || undefined,
              multiline: false,
              keyboardType: property.property_type_id === 2 ? "numeric" : "default",
              // autoCorrect: false,  // default is true
              // autoCapitalize: 'sentences',  // default is sentences
            }} />
        if (property.property_type_id === 3) {
          return <View style={{marginHorizontal: 4, marginVertical: 8,}} key={property.id}>
            <Text style={styles.booleanPropertyLabel}>{property.name}</Text>
            <Card style={styles.booleanPropertyCard} key={property.id}>
              <Text style={styles.booleanPropertyLabel}>{property.name}</Text>
              <Switch
                isEnabled={propertyInputs[property.id]?.value as boolean}
                setIsEnabled={propertyInputChangedHandler.bind(null, property.id)}
                // setIsEnabled={(value) => setPropertyInputs((prevState) => ({
                //   ...prevState,
                //   [property.id]: {value: value, isInvalid: false},
                // }))}
              />
            </Card>
          </View>
        }
        return;
      })
    }
  </View>

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!item ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    itemNameComponent,
    itemDescriptionComponent,
    categoryComponent,
    warehouseComponent,
    // valuesComponent,
  ]

  return <>
    <FlatList
      data={listElements}
      renderItem={item => item.item}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{backgroundColor, ...styles.container}}
      ListFooterComponent={buttonsComponent}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
    />
    <Modalize
      ref={categoriesModalizeRef}
      modalStyle={{...styles.modalStyle, backgroundColor}}
      customRenderer={Categories()}
    />
    <Modalize
      ref={warehousesModalizeRef}
      modalStyle={{...styles.modalStyle, backgroundColor}}
      customRenderer={chooseWarehouse()}
    />
  </>
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
  bottomDrawerConfirmButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
    alignSelf: 'center',
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
  warehouseDrawerTitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  warehouseDrawerButton: {
    margin: 15,
    paddingVertical: 8,
  },
  booleanPropertyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 4,
    borderRadius: 10,
  },
  booleanPropertyLabel: {
    fontSize: 16,
  },
  propertyContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
});