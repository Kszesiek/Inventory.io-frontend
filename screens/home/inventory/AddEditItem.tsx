import {Alert, FlatList, StyleSheet} from "react-native";
import {useThemeColor, View} from "../../../components/Themed";
import {InventoryStackScreenProps} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {useLayoutEffect, useState} from "react";
import {
  Item,
  isItem,
  itemActions,
} from "../../../store/items";
import {writeOutArray} from "../../../utilities/enlist";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {IRootState} from "../../../store/store";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  category: ValidValuePair,
}

export default function AddEditItem({ navigation, route }: InventoryStackScreenProps<'AddEditItem'>) {
  const dispatch = useDispatch();
  const categories = useSelector((state: IRootState) => state.categories.categories)

  const item: Item | undefined = route.params?.item;
  const isEditing = !!item;

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: !!item && isItem(item) ? item.name : "",
        isInvalid: false,
      },
      category: {
        value: !!item && isItem(item) ? categories.find(category => category.id === item.categoryId)?.name || "" : "",
        isInvalid: false,
      },
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edytuj wypożyczenie" : "Stwórz wypożyczenie"
    });
  }, [navigation, isEditing])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length >= 0;
    const categoryIsValid: boolean = categories.findIndex(category => category.name === inputs.category.value) !== -1;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        category: {
          value: currentInputs.category.value,
          isInvalid: !categoryIsValid,
        },
      }
    });

    if (!nameIsValid || !categoryIsValid) {
      const wrongDataArray: string[] = []
      if (!categoryIsValid)
        wrongDataArray.push("category")
      if (!nameIsValid)
        wrongDataArray.push("item name")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const itemData: Item = isItem(item) ?
      {
        itemId: item.itemId,
        name: inputs.name.value,
        categoryId: categories.find(category => category.name === inputs.category.value)!.id,
      }
      :
      {
        itemId: Math.random().toString(),
        name: inputs.name.value,
        categoryId: categories.find(category => category.name === inputs.category.value)!.id,
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

  const categoryComponent = <Input
    label="Kategoria"
    isInvalid={inputs.category.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "nazwa kategorii",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "category"),
      value: inputs.category.value,
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!item ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    itemNameComponent,
    categoryComponent,
  ]

  return (
    <FlatList
      data={listElements}
      renderItem={item => item.item}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{backgroundColor, ...styles.container}}
      ListFooterComponent={buttonsComponent}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
    />
  )
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
  }
});