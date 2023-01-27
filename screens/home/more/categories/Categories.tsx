import {ActivityIndicator, FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {CategoriesStackScreenProps} from "../../../../types";
import {Category} from "../../../../store/categories";
import {useEffect, useState} from "react";
import {getAllCategories} from "../../../../endpoints/categories";

export default function Categories({ navigation, route }: CategoriesStackScreenProps<'Categories'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const [areCategoriesLoaded, setAreCategoriesLoaded] = useState<boolean | undefined>(undefined);
  const categories: Array<Category> = useSelector((state: IRootState) => state.categories.categories);
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getCategories() {
      setAreCategoriesLoaded(await getAllCategories(dispatch, demoMode));
    }
    getCategories();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  if (areCategoriesLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!areCategoriesLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować kategorii.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1}}
    data={categories}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak kategorii do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać kategorię, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={({item} : {item: Category}) => {
      const parentCategory: Category | undefined = categories.find((cat: Category) => cat.id === item.parent_category_id)
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("CategoryDetails", {categoryId: item.id})}>
          <Text style={{...boldedText, fontSize: 16}}>{item.name}</Text>
          <Text style={{textAlign: 'center'}}>skrót: {item.short_name}</Text>
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