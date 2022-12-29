import {Category} from "../store/categories";
import {TouchableCard} from "./Themed/TouchableCard";
import {Ionicons} from "@expo/vector-icons";
import {Text, TouchableOpacity, useThemeColor} from "./Themed";
import * as React from "react";
import {StyleSheet} from "react-native";
import {useState} from "react";

type props = {
  category: Category
  categories: Category[]
  onPress: (categoryId: string) => void
  chosenCategoryId: string
  indent?: number
}

export default function CategoriesListItem({category, categories, onPress, chosenCategoryId, indent = 0}: props) {
  const textColor = useThemeColor({}, 'text');
  const chosenColor = useThemeColor({}, "tint");
  const [areChildrenVisible, setChildrenVisible] = useState<boolean>(false);

  return (
    <>
      <TouchableCard
        key={category.id}
        style={[
          styles.card,
          {marginLeft: 20 + 20 * indent},
          chosenCategoryId === category.id && {backgroundColor: chosenColor},
        ]}
        onPress={() => onPress(category.id)}
      >
        <Text style={styles.cardText}>{category.name}</Text>
        {
          categories.findIndex((item: Category) => item.parent_category_id === category.id) >= 0 &&
            <TouchableOpacity
              onPress={() => setChildrenVisible(!areChildrenVisible)}
              style={styles.showMoreCategories}
            >
              <Ionicons name={areChildrenVisible ? 'chevron-up' : 'chevron-down'} size={25} color={textColor}/>
            </TouchableOpacity>
        }
      </TouchableCard>
      {
        areChildrenVisible && categories.filter((item: Category) => item.parent_category_id === category.id).map((item: Category) =>
          <CategoriesListItem
            key={item.id}
            category={item}
            categories={categories}
            indent={indent + 1}
            onPress={onPress}
            chosenCategoryId={chosenCategoryId}
          />
        )
      }
    </>
    )
}

const styles = StyleSheet.create({
  cardText: {
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  card: {
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
  },
  showMoreCategories: {
    paddingHorizontal: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
})