import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {CategoriesStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {useEffect} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {Category, categoryActions} from "../../../../store/categories";

export default function CategoryDetails({ navigation, route }: CategoriesStackScreenProps<'CategoryDetails'>) {
  const dispatch = useDispatch();
  const textColor = useThemeColor({}, 'text');
  const category: Category = useSelector((state: IRootState) =>
    state.categories.categories.find((item: Category) => item.id === route.params.categoryId)!)
  const parentCategory: Category | undefined = useSelector((state: IRootState) =>
    state.categories.categories.find((item: Category) => item.id === category.parent_category_id)!)

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!category ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditCategory", {category: category})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [category])

  const backgroundColor = useThemeColor({}, "background");

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Categories");
    await dispatch(categoryActions.removeCategory(category.id));
  }

  function editPressed() {
    navigation.navigate("AddEditCategory", {category: category});
  }

  return (
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
          <Text style={[styles.text, {fontStyle: 'italic'}]}>brak kategorii nadrzędnej</Text>}
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]} onPress={deletePressed}>Usuń</OpacityButton>
        <OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>
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
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
})