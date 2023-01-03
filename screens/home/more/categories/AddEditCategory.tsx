import {Alert, Animated, ScrollView, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {CategoriesStackScreenProps} from "../../../../types";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Category, categoryActions} from "../../../../store/categories";
import {IRootState} from "../../../../store/store";
import CategoriesChooser from "../../../../components/CategoriesChooser";
import * as React from "react";
import {Modalize} from "react-native-modalize";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  short_name: ValidValuePair,
  parent_category_id: ValidValuePair,
}

export default function AddEditCategory({ navigation, route }: CategoriesStackScreenProps<'AddEditCategory'>) {
  const dispatch = useDispatch();

  const category = route.params?.category;
  const categories = useSelector((state: IRootState) => state.categories.categories);
  const [parentCategory, setParentCategory] = useState<Category | undefined>(categories.find(
    (item: Category) => item.id === category?.parent_category_id) || undefined);
  const categoriesModalizeRef = useRef<Modalize>(null);

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      name: {
        value: category?.name || "",
        isInvalid: false,
      },
      short_name: {
        value: category?.short_name || "",
        isInvalid: false,
      },
      parent_category_id: {
        value: category?.parent_category_id || "",
        isInvalid: false,
      },
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !!category ? "Edytuj kategorię" : "Stwórz kategorię"
    });
  }, [navigation, !!category])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  useEffect(() => {
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        parent_category_id: {value: parentCategory?.id || "", isInvalid: false},
      }
    })
  }, [parentCategory])

  async function submitPressed() {
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const shortNameIsValid: boolean = inputs.short_name.value.trim().length > 0 && inputs.short_name.value.trim().length < 100;
    const parentIsValid: boolean = inputs.parent_category_id.value.trim().length > 0 && inputs.parent_category_id.value.trim().length < 100;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        short_name: {
          value: currentInputs.short_name.value,
          isInvalid: !shortNameIsValid,
        },
        parent_category_id: {
          value: currentInputs.parent_category_id.value,
          isInvalid: !parentIsValid,
        },
      }
    });

    if (!nameIsValid || !shortNameIsValid || !parentIsValid) {
      const wrongDataArray: string[] = []
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!shortNameIsValid)
        wrongDataArray.push("short name")
      if (!parentIsValid)
        wrongDataArray.push("parent ID")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const categoryData: Category = {
      name: inputs.name.value,
      short_name: inputs.short_name.value,
      parent_category_id: inputs.parent_category_id.value,
      id: !!category ? category.id : Math.random().toString(),
    }

    if (!!category) {
      const response = await dispatch(categoryActions.modifyCategory(categoryData));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(categoryActions.addCategory(categoryData));

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
          currentCategory={parentCategory}
          setCurrentCategory={setParentCategory}
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

  function parentPressed() {
    console.log("parent pressed");
    categoriesModalizeRef.current?.open();
  }

  function parentClosed() {
    if (parentCategory === undefined || category === undefined)
      return;

    let categoriesPath: string[] = [parentCategory.id];
    let currCategory: Category = parentCategory;

    while (currCategory.parent_category_id !== undefined) {
      currCategory = categories.find((item: Category) => item.id === currCategory.parent_category_id)!;
      categoriesPath.push(currCategory.id);
    }

    if (categoriesPath.includes(category.id)) {
      Alert.alert("Niepoprawna kategoria nadrzędna", `Kategoria ${parentCategory.name} nie może być nadrzędną dla kategorii ${category.name}. Wybierz inną kategorię nadrzędną.`)
      setParentCategory(categories.find((item: Category) => item.id === category.parent_category_id) || undefined);
    }
  }

  // ACTUAL FORM FIELDS

  const nameComponent = <Input
    key="name"
    label="Nazwa"
    isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "nazwa kategorii",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  const shortNameComponent = <Input
    key="short_name"
    label="Skrót nazwy"
    isInvalid={inputs.short_name.isInvalid}
    textInputProps={{
      placeholder: "skrót nazwy kategorii",
      maxLength: 10,
      onChangeText: inputChangedHandler.bind(null, "short_name"),
      value: inputs.short_name.value,
    }}
  />

  const parentIdComponent = <View key="parent" style={styles.propertyContainer}>
    <Text style={[styles.propertyLabel, inputs.short_name.isInvalid && {color: cancelColor}]}>Kategoria nadrzędna</Text>
    <TouchableCard
      style={styles.card}
      onPress={parentPressed}
    >
      {!!parentCategory ?
        <Text style={{fontSize: 18, paddingVertical: 3}}>{parentCategory.name} ({parentCategory.short_name})</Text>
      :
        <Text style={{fontSize: 16, paddingVertical: 4, fontStyle: 'italic'}}>brak kategorii nadrzędnej</Text>}
    </TouchableCard>
  </View>

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!category ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    shortNameComponent,
    parentIdComponent,
  ]

  return (
    <>
      <ScrollView
        style={{
          ...styles.container,
          backgroundColor: backgroundColor,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        {listElements}
        {buttonsComponent}
      </ScrollView>
      <Modalize
        ref={categoriesModalizeRef}
        modalStyle={{...styles.modalStyle, backgroundColor}}
        customRenderer={Categories()}
        onClose={() => {
          console.log("Helooo?")
          parentClosed()
        }}

      />
    </>


  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  propertyContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bottomDrawerConfirmButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
});