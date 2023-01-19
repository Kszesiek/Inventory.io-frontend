import {TextInput, useThemeColor, View, Text} from "../../../components/Themed";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {FontAwesome} from "@expo/vector-icons";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleProp,
  StyleSheet,
  TextStyle
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Item} from "../../../store/items";
import {InventoryStackScreenProps} from "../../../types";
import {useEffect, useRef, useState} from "react";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import * as React from "react";
import {Modalize} from "react-native-modalize";
import {Category} from "../../../store/categories";
import CategoriesChooser from "../../../components/CategoriesChooser";
import {getAllItems, getFilteredItems} from "../../../endpoints/items";
import {getAllCategories} from "../../../endpoints/categories";

export default function Inventory({ navigation, route }: InventoryStackScreenProps<'Inventory'>) {
  const dispatch = useDispatch();

  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, 'tint');

  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const [areItemsLoaded, setAreItemsLoaded] = useState<boolean | undefined>(undefined);
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState<boolean | undefined>(undefined);

  const categories = useSelector((state: IRootState) => state.categories.categories);
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>();

  // changed instantly
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);
  const [textInput, setTextInput] = useState<string>(route.params?.searchPhrase || "");

  // changed when pressing search button
  const [chosenCategory, setChosenCategory] = useState<Category | undefined>(undefined);
  const [chosenFilters, setChosenFilters] = useState<any[]>([]);
  const [chosenText, setChosenText] = useState<string>(route.params?.searchPhrase || "");

  const categoriesModalizeRef = useRef<Modalize>(null);
  const filtersModalizeRef = useRef<Modalize>(null);

  async function fetchItems() {
    const loadedItems = await getAllItems(dispatch, demoMode);
    setAreItemsLoaded(!!loadedItems);
    if(!!loadedItems)
      setItemsToDisplay(loadedItems);
  }
  async function fetchCategories() {
    setAreCategoriesLoaded(await getAllCategories(dispatch, demoMode));
  }

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [])

  const itemTitle: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
    fontSize: 15,
    marginBottom: 5,
  }

  // For searching from the homescreen
  useEffect(() => {
    const searchPhrase = route.params?.searchPhrase || ""
    setTextInput(searchPhrase);
    setSelectedCategory(undefined);
    setChosenText(searchPhrase);
    setChosenCategory(undefined);
  }, [route.params?.searchPhrase]);

  // for every change in categories, filters or phrase to search
  useEffect(() => {
    demoMode && getMatchingItems();
  }, [chosenText, chosenCategory, chosenFilters])

  function searchButtonPressed() {
    console.log("search button pressed");
    setChosenText(textInput);
    setChosenCategory(selectedCategory);
    setChosenFilters(selectedFilters);
  }

  function cardPressed(item: Item) {
    console.log("Item pressed");
    navigation.navigate("ItemDetails", { item: item });
  }

  function Categories() {
    return (
      <Animated.View style={{flex: 1}}>
        <CategoriesChooser
          currentCategory={selectedCategory}
          setCurrentCategory={setSelectedCategory}
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

  function Filters() {
    return (
      <>
        <Text style={[styles.modalTitle, {color: tintColor}]}>Filtry</Text>
        <OpacityButton
          style={styles.bottomDrawerConfirmButton}
          onPress={() => filtersModalizeRef.current?.close()}
        >
          Potwierdź
        </OpacityButton>
      </>
      )
  }

  function categoriesPressed() {
    console.log("categories pressed");
    categoriesModalizeRef.current?.open();
  }

  function filtersPressed() {
    console.log("filters pressed");
    filtersModalizeRef.current?.open();
  }

  async function getMatchingItems() {
    setAreItemsLoaded(undefined);

    const loadedItems = await getFilteredItems(dispatch, chosenText, chosenCategory?.id, demoMode);

    setAreItemsLoaded(!!loadedItems);

    if(!!loadedItems)
      setItemsToDisplay(loadedItems);
  }

  if (areItemsLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!areItemsLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować wydarzeń.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return (
    <>
      <FlatList
      style={{backgroundColor}}
      contentContainerStyle={styles.flatList}
      data={itemsToDisplay}
      ListHeaderComponent={
        <View>
          <View key="filterbar" style={styles.filterBar}>
            <TouchableCard style={styles.filterButton} onPress={categoriesPressed}>
              <Text style={{textAlign: 'center'}} numberOfLines={1}>Kategoria: {!!selectedCategory ? selectedCategory.name : "wszystkie"}</Text>
            </TouchableCard>
            <TouchableCard style={styles.filterButton} onPress={filtersPressed}>
              <Text style={{textAlign: 'center'}} numberOfLines={1}>Filtry</Text>
            </TouchableCard>
          </View>
          <View key="searchbar" style={{...styles.searchBar, backgroundColor: cardBackgroundColor}}>
            <TextInput
              style={styles.searchBarInput}
              placeholder="Wyszukaj w inwentarzu..."
              value={textInput}
              onChangeText={setTextInput}
            />
            <TouchableCard
              style={[styles.searchBarButton, {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                paddingRight: 2,
                backgroundColor: tintColor,
              }]}
              onPress={searchButtonPressed}
            >
              <FontAwesome name="search" size={32} color={backgroundColor} />
            </TouchableCard>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {fontSize: 16}]}>Brak przedmiotów do wyświetlenia{!!chosenCategory && " w tej kategorii"}.</Text>
          <Text style={styles.noContentText}>Aby dodać przedmiot, użyj przycisku u góry ekranu.</Text>
        </View>}
      renderItem={({item}) => {
        return (
          <TouchableCard key={item.itemId} style={styles.card} onPress={() => cardPressed(item)}>
            <Text style={[styles.cardText, itemTitle]}>{item.name}</Text>
            {<Text style={styles.cardText}>Kategoria: {categories.find(category => category.id === item.categoryId)?.name || <Text style={{fontStyle: 'italic', fontSize: 13}}>{!areCategoriesLoaded ? "pobieranie danych..." : "nieznana kategoria"}</Text>}</Text>}
          </TouchableCard>
        )
      }}
    />
    <Modalize
      ref={categoriesModalizeRef}
      modalStyle={{...styles.modalStyle, backgroundColor}}
      customRenderer={Categories()}
    />
    <Modalize
      ref={filtersModalizeRef}
      modalStyle={{...styles.modalStyle, backgroundColor}}
    >
      {Filters()}
    </Modalize>
  </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  flatList: {
    flexGrow: 1,
    paddingBottom: 15,
    width: '100%',
    paddingHorizontal: 5,
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 15,
    elevation: 5,
  },
  filterBar: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 15,
  },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'stretch',
  },
  searchBarButton: {
    height: 40,
    width: 55,
    borderRadius: 12,
  },
  searchBarInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  card: {
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  cardText: {
    textAlign: 'left',
    width: '100%',
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 1,
  },
  bottomDrawerConfirmButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  noContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})