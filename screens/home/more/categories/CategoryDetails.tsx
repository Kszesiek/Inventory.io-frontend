import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ActivityIndicator, Animated, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {CategoriesStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {useEffect, useRef, useState} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {Category, categoryActions, CategoryExtended, isCategoryExtended} from "../../../../store/categories";
import {getCategory, removeCategory} from "../../../../endpoints/categories";
import {Modalize} from "react-native-modalize";
import {Property} from "../../../../store/properties";
import PropertiesChooser from "../../../../components/choosers/PropertiesChooser";
import {addPropertyToGroup} from "../../../../endpoints/properties";
import {useFocusEffect} from "@react-navigation/native";

export default function CategoryDetails({ navigation, route }: CategoriesStackScreenProps<'CategoryDetails'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cancelColor = useThemeColor({}, 'delete');
  const categories = useSelector((state: IRootState) => state.categories.categories);
  const [category, setCategory] = useState<Category | CategoryExtended | undefined | null>(categories.find((category) => category.id === route.params.categoryId));
  const [isCategoryExtendedLoaded,  setIsCategoryExtendedLoaded]  = useState<boolean | undefined>(undefined);
  const parentCategory: Category | CategoryExtended | undefined = useSelector((state: IRootState) =>
    state.categories.categories.find((item: Category) => item.id === category?.parent_category_id)!);

  const propertiesModalizeRef = useRef<Modalize>(null);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>(isCategoryExtended(category) ? category.properties : []);

  useFocusEffect(
    React.useCallback(() => {
    async function getExtendedCategory() {
      const extendedCategory: CategoryExtended | null | undefined = await getCategory(dispatch, route.params.categoryId, demoMode);
      setIsCategoryExtendedLoaded(!!extendedCategory);
      !!extendedCategory && setCategory(extendedCategory);
    }
    getExtendedCategory();
  }, [!!category]));

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!category ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditCategory", {categoryId: category.id})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [category])

  async function deletePressed() {
    if (!category)
      return;

    console.log("delete button pressed");
    navigation.goBack();
    removeCategory(dispatch, route.params.categoryId, demoMode);
    await dispatch(categoryActions.removeCategory(category.id));
  }

  function editPressed() {
    if (!category)
      return;

    navigation.navigate("AddEditCategory", {categoryId: category.id});
  }

  function propertiesComponent() {
    if (isCategoryExtendedLoaded === undefined)
      return <>
        <ActivityIndicator color={tintColor} size="large" />
        <Text style={[styles.text, styles.detailsReplacementText]}>ładowanie danych...</Text>
        </>
    if (!isCategoryExtendedLoaded || !isCategoryExtended(category))
      return <Text style={[styles.text, styles.detailsReplacementText]}>błąd połączenia z serwerem</Text>
    if (category.properties.length === 0)
      return <Text style={[styles.text, styles.detailsReplacementText, {textAlign: 'center'}]}>ta kategoria nie ma przypisanych właściwości</Text>
    return category.properties.map((property, index) => (
      <Text key={property.id} style={styles.text}>{index + 1}. {property.name}</Text>
    ))
  }

  function changePropertiesPressed() {
    if (!isCategoryExtended(category))
      return;

    navigation.navigate("EditCategoryProperties", {categoryId: category.id, properties: category.properties}); // , properties: isCategoryExtended(category) ? category.properties : []
    // propertiesModalizeRef.current?.open();
  }

  function chooseProperties() {
    if (!category)
      return;

    return (
      <Animated.View style={{flex: 1, marginTop: 10,}}>
        <Text style={[styles.propertiesDrawerTitle, {color: tintColor}]}>Dodaj właściwości</Text>
        <PropertiesChooser
          selectedProperties={selectedProperties}
          setSelectedProperties={setSelectedProperties}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <OpacityButton
            style={[styles.addPropertiesButton, {backgroundColor: cancelColor}]}
            onPress={() => propertiesModalizeRef.current?.close()}
          >
            Anuluj
          </OpacityButton>
          <OpacityButton
            style={styles.addPropertiesButton}
            onPress={async () => {
              propertiesModalizeRef.current?.close();
              selectedProperties.forEach((property) =>
                addPropertyToGroup(dispatch, property.id, category.id, demoMode))
            }}
          >
            Potwierdź
          </OpacityButton>
        </View>
      </Animated.View>
    )
  }

  if (category === null) {
    return <View>

    </View>
  }

  if (category === undefined) {
    return <View style={styles.loadingView}>
      <Text style={styles.loadingText}>{isCategoryExtendedLoaded ? "Błąd wczytywania danych z serwera." : "Wczytywanie danych z serwera..."}</Text>
    </View>
  }

  return (
    <>
      <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
        <Detail name="Nazwa">
          <Text style={styles.text}>{category.name}</Text>
        </Detail>
        <Detail name="Skrót nazwy">
          <Text style={styles.text}>{category.short_name}</Text>
        </Detail>
        <Detail name="Kategoria nadrzędna">
          {!!parentCategory ?
            <Text style={styles.text}>{parentCategory.name} ({parentCategory.short_name})</Text>
            :
            <Text style={[styles.text, styles.detailsReplacementText]}>brak kategorii nadrzędnej</Text>}
        </Detail>
        <Detail name="Właściwości">
          {propertiesComponent()}
          {isCategoryExtended(category) && <OpacityButton
            style={styles.propertiesButton}
            textStyle={{fontSize: 15}}
            onPress={changePropertiesPressed}
          >
            Edytuj właściwości kategorii
          </OpacityButton>}
        </Detail>

        <View style={{flexGrow: 1}}/>
        <View style={styles.editButtonContainer}>
          <OpacityButton style={[styles.editButton, {backgroundColor: cancelColor}]} onPress={deletePressed}>Usuń</OpacityButton>
          <OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>
        </View>
      </ScrollView>
      <Modalize
        ref={propertiesModalizeRef}
        modalStyle={{...styles.modalStyle, backgroundColor}}
        customRenderer={chooseProperties()}
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
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
  detailsReplacementText: {
    fontStyle: 'italic',
  },
  propertiesButton: {
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
  addPropertiesButton: {
    margin: 15,
    paddingVertical: 8,
  },
  propertiesDrawerTitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    fontStyle: 'italic',
  },
})