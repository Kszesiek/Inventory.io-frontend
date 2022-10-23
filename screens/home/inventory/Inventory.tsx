import {TextInput, useThemeColor, View, Text} from "../../../components/Themed";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {FontAwesome} from "@expo/vector-icons";
import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Item} from "../../../store/items";
import {InventoryStackScreenProps} from "../../../types";
import {useRef} from "react";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import * as React from "react";
import {Modalize} from "react-native-modalize";

export default function Inventory({ navigation, route }: InventoryStackScreenProps<'Inventory'>) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, 'tint');

  const items = useSelector((state: IRootState) => state.items.items);
  const categories = useSelector((state: IRootState) => state.categories.categories);

  const categoriesModalizeRef = useRef<Modalize>(null);
  const filtersModalizeRef = useRef<Modalize>(null);

  const itemTitle: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
    fontSize: 15,
    marginBottom: 5,
  }

  function searchShortcutPressed() {
    console.log("search button pressed");
  }

  function cardPressed(itemId: string) {
    console.log("Item pressed");
    navigation.navigate("ItemDetails", { itemId: itemId });
  }

  function Categories() {
    return (
      <>
        <Text style={{textAlign: 'center', fontSize: 26, color: tintColor, letterSpacing: 1,}}>Wybierz kategorię</Text>
        <OpacityButton
          style={styles.bottomDrawerConfirmButton}
          onPress={() => categoriesModalizeRef.current?.close()}
        >
          Potwierdź
        </OpacityButton>
      </>
    )
  }

  function Filters() {
    return (
      <>
        <Text style={{textAlign: 'center', fontSize: 26, color: tintColor, letterSpacing: 1,}}>Filtry</Text>
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

  return (
    <>
      <FlatList
      style={{backgroundColor}}
      contentContainerStyle={styles.flatList}
      data={items}
      ListHeaderComponent={
        <View>
          <View key="filterbar" style={styles.filterBar}>
            <TouchableCard style={styles.filterButton} onPress={categoriesPressed}>
              <Text>Kategorie</Text>
            </TouchableCard>
            <TouchableCard style={styles.filterButton} onPress={filtersPressed}>
              <Text>Filtry</Text>
            </TouchableCard>
          </View>
          <View key="searchbar" style={{...styles.searchBar, backgroundColor: cardBackgroundColor}}>
            <TextInput
              style={styles.searchBarInput}
              placeholder="Wymszukaj w inwentarzu..."
            />
            <TouchableCard
              style={[styles.searchBarButton, {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                paddingRight: 2,
                backgroundColor: useThemeColor({}, 'tint'),
              }]}
              onPress={searchShortcutPressed}
            >
              <FontAwesome name="search" size={30} color={backgroundColor} />
            </TouchableCard>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {fontSize: 16}]}>Brak przedmiotów do wyświetlenia.</Text>
          <Text style={styles.noContentText}>Aby dodać przedmiot, użyj przycisku u góry ekranu.</Text>
        </View>}
      renderItem={(item: ListRenderItemInfo<Item>) => {return (
        <TouchableCard style={styles.card} onPress={() => cardPressed(item.item.itemId)}>
          <Text style={[styles.cardText, itemTitle]}>{item.item.name}</Text>
          <Text style={styles.cardText}>Kategoria: {categories.find(category => category.categoryId === item.item.categoryId)?.name || <Text style={{fontStyle: 'italic', fontSize: 13}}>nieznana kategoria</Text>}</Text>
        </TouchableCard>
      )
      }}
    />
    <Modalize
      ref={categoriesModalizeRef}
      modalStyle={{...styles.modalStyle, backgroundColor}}
    >
      {Categories()}
    </Modalize>
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
    padding: 7,
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 5,
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
    marginTop: 40,
    flex: 1,
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