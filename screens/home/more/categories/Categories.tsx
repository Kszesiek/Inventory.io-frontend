import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {CategoriesStackScreenProps} from "../../../../types";
import {Category} from "../../../../store/categories";

export default function Categories({ navigation, route }: CategoriesStackScreenProps<'Categories'>) {
  const categories: Array<Category> = useSelector((state: IRootState) => state.categories.categories)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
    contentContainerStyle={{flexGrow: 1}}
    data={categories.slice(0, 20)}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak kategorii do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać kategorię, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={(category: ListRenderItemInfo<Category>) => {
      const parentCategory: Category | undefined = categories.find((cat: Category) => cat.id === category.item.parent_category_id)
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("CategoryDetails", {categoryId: category.item.id})}>
          <Text style={{...boldedText, fontSize: 16}}>{category.item.name}</Text>
          <Text style={{textAlign: 'center'}}>skrót: {category.item.short_name}</Text>
          {!!parentCategory && <Text style={{textAlign: 'center'}}>Kategoria
              nadrzędna: {parentCategory.name} ({parentCategory.short_name})</Text>}
        </TouchableCard>
      )
    }}
  />
}

const styles = StyleSheet.create({
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
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
})