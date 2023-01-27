import {RentalStackScreenProps} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Text, TextInput, useThemeColor, View} from "../../../components/Themed";
import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import * as React from "react";
import {useState} from "react";
import {Item} from "../../../store/items";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {FontAwesome} from "@expo/vector-icons";
import {useFocusEffect} from "@react-navigation/native";
import {getAllItems, getFilteredItems} from "../../../endpoints/items";
import {addItemToRental, removeItemFromRental} from "../../../endpoints/rentals";

export default function AddItemsToRental({ navigation, route }: RentalStackScreenProps<'AddItemsToRental'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");

  const [chosenItems, setChosenItems] = useState<Item[]>([]);

  const [textInput, setTextInput] = useState<string>("");
  const [itemsToShow, setItemsToShow] = useState<Item[]>([]);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  useFocusEffect(
    React.useCallback(() => {
      async function getAvailableItems() {
        const items: Item[] | null = await getAllItems(dispatch, demoMode);
        if (!!items) {
          setItemsToShow(items);
        }
      }
      async function getRentalItems() {
        const items: Item[] | null = await getFilteredItems(dispatch, undefined, undefined, undefined, route.params.rentalId, demoMode);
        if (!!items) {
          setChosenItems(items);
        }
      }
      getAvailableItems();
      getRentalItems();
    }, []));

  async function itemPressed(item: Item) {
    const itemAlreadyChosen: boolean = chosenItems.some((item_) => item_.itemId === item.itemId);
    let response: boolean;
    if (itemAlreadyChosen)
      response = await removeItemFromRental(route.params.rentalId, item.itemId, demoMode);
    else
      response = await addItemToRental(route.params.rentalId, item.itemId, demoMode);

    response && setChosenItems((prevItems) => {
      if (itemAlreadyChosen)
        return prevItems.filter((item_) => item_.itemId !== item.itemId);
      else return [
        ...prevItems,
        item,
      ];
    })
  }

  async function searchButtonPressed() {
    const response = await getFilteredItems(dispatch, textInput, undefined, undefined, undefined, demoMode);
    if (!!response)
      setItemsToShow(response.filter((item) => item.name.toLowerCase().includes(textInput.toLowerCase())));
  }

   return <FlatList
      style={[styles.flatList, {backgroundColor}]}
      contentContainerStyle={{flexGrow: 1}}
      data={itemsToShow}
      ListHeaderComponent={<View key="searchbar" style={[styles.searchBar, {backgroundColor: cardColor}]}>
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
      </View>}
      renderItem={({item}) => {
        return (
          <TouchableCard
            key={item.itemId}
            style={[
              styles.card,
              chosenItems.some((item_) => item_.itemId === item.itemId) && {backgroundColor: tintColor}
            ]}
            onPress={() => itemPressed(item)}
          >
            <Text style={[
              boldedText,
              chosenItems.some((item_) => item_.itemId === item.itemId) && {color: textColor}
            ]}>{item.name}</Text>
          </TouchableCard>
        )
      }}
      ListEmptyComponent={
        <View style={styles.listEmptyView}>
          <Text style={styles.listEmptyText}>
            Brak przedmiotów do wyświetlenia.
          </Text>
        </View>}
    />
  //   <View style={{flexDirection: 'row', justifyContent: 'center'}}>
  //     <OpacityButton
  //       style={[styles.button, {backgroundColor: errorColor}]}
  //       onPress={navigation.goBack}
  //     >
  //       Anuluj
  //     </OpacityButton>
  //     <OpacityButton
  //       style={styles.button}
  //       onPress={onSubmitPressed}
  //     >
  //       Potwierdź
  //     </OpacityButton>
  //   </View>
  // </View>
}

const styles = StyleSheet.create({
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
    overflow: 'hidden',
  },
  button: {
    margin: 15,
    paddingVertical: 8,
  },
  flatList: {
    width: '100%',
    padding: 5,
    paddingTop: 0,
  },
  card: {
    padding: 10,
    margin: 10,
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 15,
    elevation: 5,
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
  listEmptyView: {
    margin: 10,
    justifyContent: 'center',
    flex: 1,
  },
  listEmptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
})