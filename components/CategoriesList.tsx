import {Category} from "../store/categories";
import * as React from "react";
import {useState} from "react";
import CategoriesListItem from "./CategoriesListItem";

type props = {
  categories: Category[]
}

type CategoryNode = {
  category: Category
  children: CategoryNode[]
}

export default function CategoriesList({categories}: props) {

  const [chosenCategory, setChosenCategory] = useState<string>("");

  function onCategoryPress(categoryId: string) {
    chosenCategory === categoryId
    ?
      setChosenCategory("")
    :
      setChosenCategory(categoryId);
  }

  return (
    <>
      {categories.map((category: Category) => {
        if (category.parentCategoryId !== undefined)
          return;

        return (
          <CategoriesListItem
            category={category}
            categories={categories}
            onPress={onCategoryPress}
            chosenCategoryId={chosenCategory}
          />
        )
      })}
    </>
  );
}