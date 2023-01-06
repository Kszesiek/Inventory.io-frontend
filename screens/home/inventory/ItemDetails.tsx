import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {InventoryStackScreenProps} from "../../../types";
import {IRootState} from "../../../store/store";
import Detail from "../../../components/Detail";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {useEffect} from "react";
import {Item, itemActions} from "../../../store/items";
import {Category} from "../../../store/categories";

export default function ItemDetails({ navigation, route }: InventoryStackScreenProps<'ItemDetails'>) {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const item: Item = useSelector((state: IRootState) =>
    state.items.items.find((item: Item) => item.itemId === route.params.itemId)!);
  const category: Category | undefined = useSelector((state: IRootState) =>
    state.categories.categories.find(item_ => item_.id === item.categoryId));

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!item ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditItem", {item: item})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [item])

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Inventory");
    await dispatch(itemActions.removeItem({itemId: item.itemId}));
  }

  function editPressed() {
    navigation.navigate("AddEditItem", {item: item});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa przedmiotu">
        <Text style={styles.text}>{item.name}</Text>
      </Detail>
      <Detail name="Kategoria">
        <Text style={styles.text}>{!!category ? category.name + " (" + category.short_name + ")" : <Text style={{fontStyle: 'italic', fontSize: 13}}>nieznana kategoria</Text>}</Text>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton
          style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]}
          onPress={deletePressed}
        >
          Usuń
        </OpacityButton>
        <OpacityButton
          style={styles.editButton}
          onPress={editPressed}
        >
          Edytuj
        </OpacityButton>
      </View>
    </ScrollView>
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
    fontSize: 16,
    marginVertical: 3,
  },
  ordinalNumber: {
    fontSize: 12,
  },
})