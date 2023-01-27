import React, {useState} from "react";
import {View, Text, useThemeColor, TextInput} from "../Themed";
import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {TouchableCard} from "../Themed/TouchableCard";
import {Item} from "../../store/items";
import {FontAwesome} from "@expo/vector-icons";
import {getAllItems} from "../../endpoints/items";
import {useFocusEffect} from "@react-navigation/native";

type propsType = {
  chosenItems: Item[]
  setChosenItems: React.Dispatch<React.SetStateAction<Item[]>>
  footerComponent?: React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined
}

export default function ItemsChooser({chosenItems, setChosenItems, footerComponent}: propsType) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const [items, setItems] = useState<Item[]>([]);
  const [textInput, setTextInput] = useState<string>("");
  const [itemsToShow, setItemsToShow] = useState<Item[]>([]);

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'cardBackground');
  const backgroundColor = useThemeColor({} ,'background');

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  useFocusEffect(
    React.useCallback(() => {
    async function getPossibleItems() {
      const items: Item[] | null = await getAllItems(dispatch, demoMode);
      if (!!items) {
        setItems(items);
        setItemsToShow(items);
      }
    }
    getPossibleItems();
  }, []));

  function searchButtonPressed() {
    setItemsToShow(items.filter((item) => item.name.toLowerCase().includes(textInput.toLowerCase())))
  }

  return (
    <FlatList
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
            onPress={() => setChosenItems((prevItems) => {
              const isPropertySelected: boolean = prevItems.some((item_) => item_.itemId === item.itemId);
              if (isPropertySelected)
                return prevItems.filter((item_) => item_.itemId !== item.itemId);
              else return [
                ...prevItems,
                item,
              ];
            })}
          >
            <Text style={[
              boldedText,
              chosenItems.some((item_) => item_.itemId === item.itemId) && {color: textColor}
            ]}>{item.name}</Text>
          </TouchableCard>
        )
      }}
      ListFooterComponent={footerComponent}
      ListEmptyComponent={
        <View style={styles.listEmptyView}>
          <Text style={styles.listEmptyText}>
            Brak przedmiotów do wyświetlenia.
          </Text>
        </View>}
    />
  )
}

const styles = StyleSheet.create({
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