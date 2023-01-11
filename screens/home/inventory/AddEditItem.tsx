import {Alert, Animated, FlatList, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {InventoryStackScreenProps} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {
  Item,
  isItem,
  itemActions,
} from "../../../store/items";
import {writeOutArray} from "../../../utilities/enlist";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {IRootState} from "../../../store/store";
import {Category} from "../../../store/categories";
import {Modalize} from "react-native-modalize";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import * as React from "react";
import CategoriesChooser from "../../../components/CategoriesChooser";
import {Warehouse} from "../../../store/warehouses";
import WarehouseChooser from "../../../components/WarehouseChooser";

export type ValidValuePair<Type> = {
  value: Type
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair<string>,
  category_id: ValidValuePair<string>,
  warehouse_id: ValidValuePair<string | undefined>,
}

export default function AddEditItem({ navigation, route }: InventoryStackScreenProps<'AddEditItem'>) {
  const dispatch = useDispatch();
  const categories = useSelector((state: IRootState) => state.categories.categories);
  const warehouses = useSelector((state: IRootState) => state.warehouses.warehouses);

  const item: Item | undefined = route.params?.item;
  const isEditing = !!item;

  const [category, setCategory] = useState<Category | undefined>(!!item ? categories.find(
    (_category: Category) => _category.id === item.categoryId) : undefined);
  const categoriesModalizeRef = useRef<Modalize>(null);

  const [warehouse, setWarehouse] = useState<Warehouse | undefined>(!!item ? warehouses.find(
    (_warehouse: Warehouse) => _warehouse.id === item.warehouseId) : undefined);
  const warehousesModalizeRef = useRef<Modalize>(null);

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");
  const tintColor = useThemeColor({}, "tint");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: !!item && isItem(item) ? item.name : "",
        isInvalid: false,
      },
      category_id: {
        value: !!item && isItem(item) ? item.categoryId : "",
        isInvalid: false,
      },
      warehouse_id: {
        value: !!item && isItem(item) ? item.warehouseId : undefined,
        isInvalid: false,
      },
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edytuj wypożyczenie" : "Stwórz wypożyczenie"
    });
  }, [navigation, isEditing])

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

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length >= 0;
    const categoryIsValid: boolean = categories.findIndex(category => category.id === inputs.category_id.value) !== -1;
    const warehouseIsValid: boolean = inputs.warehouse_id.value === undefined || warehouses.findIndex(warehouse => warehouse.id === inputs.warehouse_id.value) !== -1;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        category_id: {
          value: currentInputs.category_id.value,
          isInvalid: !categoryIsValid,
        },
        warehouse_id: {
          value: currentInputs.warehouse_id.value,
          isInvalid: !warehouseIsValid,
        }
      }
    });

    if (!nameIsValid || !categoryIsValid || !warehouseIsValid) {
      const wrongDataArray: string[] = []
      if (!categoryIsValid)
        wrongDataArray.push("category")
      if (!nameIsValid)
        wrongDataArray.push("item name")
      if (!warehouseIsValid)
        wrongDataArray.push("warehouse")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const itemData: Item = isItem(item) ?
      {
        itemId: item.itemId,
        name: inputs.name.value,
        categoryId: inputs.category_id.value,
        warehouseId: inputs.warehouse_id.value,
      }
    :
      {
        itemId: Math.random().toString(),
        name: inputs.name.value,
        categoryId: inputs.category_id.value,
        warehouseId: inputs.warehouse_id.value,
      }

    if (isEditing) {
      const response = await dispatch(itemActions.modifyItem({item: itemData}));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(itemActions.addItem({item: itemData}));

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
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
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const categoryComponent = <View key="category" style={styles.propertyContainer}>
    <Text style={[styles.propertyLabel, inputs.category_id.isInvalid && {color: cancelColor}]}>Kategoria</Text>
    <TouchableCard
      style={[styles.card, inputs.category_id.isInvalid && {backgroundColor: cancelColor}]}
      onPress={categoryPressed}
    >
      {!!category ?
        <Text style={{fontSize: 18, paddingVertical: 3}}>{category.name} ({category.short_name})</Text>
        :
        <Text style={{fontSize: 16, paddingVertical: 4, fontStyle: 'italic'}}>wybierz kategorię...</Text>}
    </TouchableCard>
  </View>

  const warehouseComponent = <View key="warehouse" style={styles.propertyContainer}>
    <Text style={[styles.propertyLabel, inputs.warehouse_id.isInvalid && {color: cancelColor}]}>Magazyn</Text>
    <TouchableCard
      style={[styles.card, inputs.warehouse_id.isInvalid && {backgroundColor: cancelColor}]}
      onPress={warehousePressed}
    >
      {!!warehouse ?
        <>
          <Text style={{fontFamily: 'Source Sans Bold', paddingBottom: 5, fontSize: 16, color: tintColor}}>{warehouse.name}</Text>
          <Text style={{fontSize: 16}}>{`${warehouse.street} ${warehouse.streetNumber}`}</Text>
          <Text style={{fontSize: 16}}>{`${warehouse.postalCode ? `${warehouse.postalCode} ` : ''}${warehouse.city}${warehouse.country ? `, ${warehouse.country}` : ''}`}</Text>
        </>
        :
        <Text style={{fontSize: 16, paddingVertical: 4, fontStyle: 'italic'}}>wybierz magazyn...</Text>}
    </TouchableCard>
  </View>

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!item ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    itemNameComponent,
    categoryComponent,
    warehouseComponent,
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
  propertyContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
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
});