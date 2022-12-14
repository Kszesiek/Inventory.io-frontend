import {TextInput, useThemeColor, View, Text} from "../../../components/Themed";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {FontAwesome} from "@expo/vector-icons";
import {Animated, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Item} from "../../../store/items";
import {InventoryStackScreenProps} from "../../../types";
import {useEffect, useRef, useState} from "react";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import * as React from "react";
import {Modalize} from "react-native-modalize";
import {Category} from "../../../store/categories";
import CategoriesChooser from "../../../components/CategoriesChooser";

export default function Inventory({ navigation, route }: InventoryStackScreenProps<'Inventory'>) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, 'tint');

  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const items = useSelector((state: IRootState) => state.items.items);
  const categories = useSelector((state: IRootState) => state.categories.categories);
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>(items);

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
    console.log("useEffect triggered");
    getMatchingItems();
  }, [chosenText, chosenCategory, chosenFilters])

  function searchButtonPressed() {
    console.log("search button pressed");
    setChosenText(textInput);
    setChosenCategory(selectedCategory);
    setChosenFilters(selectedFilters);
  }

  function cardPressed(itemId: string) {
    console.log("Item pressed");
    navigation.navigate("ItemDetails", { itemId: itemId });
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
          Potwierd??
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
          Potwierd??
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

  function getMatchingItems() {
    if (demoMode) {
      const itemsCategorized: Item[] = items.filter((item) => {
        if (chosenCategory === undefined) {
          return true;
        } else {
          return checkCategoryAffiliation(item.categoryId, chosenCategory.id);
        }
      });

      const itemsFiltered: Item[] = itemsCategorized;

      const itemsSearched: Item[] = itemsFiltered.filter((item) => {
        return item.name.toLowerCase().includes(chosenText.toLowerCase());
      });
      setItemsToDisplay(itemsSearched);
    } else {
      setItemsToDisplay([]); // TODO: ADD SEARCHING ON SERVER SIDE
    }
  }

  function checkCategoryAffiliation<CategoryId extends typeof categories[number]["id"]>(itemCategoryId: CategoryId, chosenCategoryId: CategoryId): boolean {
    let currentCategory: Category | undefined = categories.find((category: Category) => category.id === itemCategoryId);

    while (currentCategory !== undefined) {
      if (currentCategory.id === chosenCategoryId) {
        return true;
      }

      currentCategory = categories.find((category: Category) => category.id === currentCategory!.parent_category_id);
    }
    return false;
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
                backgroundColor: useThemeColor({}, 'tint'),
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
          <Text style={[styles.noContentText, {fontSize: 16}]}>Brak przedmiot??w do wy??wietlenia{!!chosenCategory && " w tej kategorii"}.</Text>
          <Text style={styles.noContentText}>Aby doda?? przedmiot, u??yj przycisku u g??ry ekranu.</Text>
        </View>}
      renderItem={(item: ListRenderItemInfo<Item>) => {
        return (
          <TouchableCard key={item.item.itemId} style={styles.card} onPress={() => cardPressed(item.item.itemId)}>
            <Text style={[styles.cardText, itemTitle]}>{item.item.name}</Text>
            <Text style={styles.cardText}>Kategoria: {categories.find(category => category.id === item.item.categoryId)?.name || <Text style={{fontStyle: 'italic', fontSize: 13}}>nieznana kategoria</Text>}</Text>
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