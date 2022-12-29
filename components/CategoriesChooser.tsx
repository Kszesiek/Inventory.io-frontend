import * as React from "react";
import {Animated, ScrollView, StyleSheet, useWindowDimensions} from "react-native";
import {useRef, useState} from "react";
import {View, Text, useThemeColor, TouchableOpacity} from "./Themed";
import {Category} from "../store/categories";
import {useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {TouchableCard} from "./Themed/TouchableCard";
import {Ionicons} from "@expo/vector-icons";

type props = {
  currentCategory: Category | undefined
  setCurrentCategory: React.Dispatch<React.SetStateAction<Category | undefined>>
}

export default function CategoriesChooser({currentCategory, setCurrentCategory}: props) {
  const screen = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const categories: Category[] = useSelector((state: IRootState) => state.categories.categories)
  const [categoriesTree, setCategoriesTree] = useState<Category[]>(findCategoriesTree());

  const [currentWindow, setCurrentWindow] = useState<1|2>(1);
  const firstWindow = useRef(new Animated.Value(0)).current;
  const secondWindow = useRef(new Animated.Value(screen.width)).current;
  const categoriesScrollViewRef = useRef<ScrollView>(null);

  const [firstCategoriesList, setFirstCategoriesList] = useState<Category[]>(categories.filter((category) => category.parent_category_id === currentCategory?.id));
  const [secondCategoriesList, setSecondCategoriesList] = useState<Category[]>([]);

  const animDuration: number = 300;

  function findCategoriesTree(): Category[] {
    if (currentCategory === undefined)
      return [];

    let categoriesPath: Category[] = [currentCategory];
    let currCategory: Category = currentCategory;

    while (currCategory.parent_category_id !== undefined) {
      currCategory = categories.find((item: Category) => item.id === currCategory.parent_category_id)!;
      categoriesPath.push(currCategory);
    }

    return categoriesPath.reverse()
  }

  function changeScreen(direction: 'forwards' | 'backwards') {
    if (currentWindow === 1 && direction === 'forwards')
      secondWindow.setValue(-screen.width)
    else if (currentWindow === 1 && direction === 'backwards')
      secondWindow.setValue(screen.width)
    else if (currentWindow === 2 && direction === 'forwards')
      firstWindow.setValue(-screen.width)
    else if (currentWindow === 2 && direction === 'backwards')
      firstWindow.setValue(screen.width)

    setCurrentWindow(currentWindow === 1 ? 2 : 1);

    Animated.parallel([
      Animated.timing(currentWindow === 1 ? firstWindow : secondWindow, {
        toValue: direction === 'forwards' ? screen.width / 2 : -screen.width / 2,
        duration: animDuration,
        useNativeDriver: false,
      }),
      Animated.timing(currentWindow === 1 ? secondWindow : firstWindow, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: false,
      }),
    ]).start();
  }

  function goToSubcategory(whichWindow: 1 | 2, newCategoryId: string | undefined, animationDirection?: 'forwards' | 'backwards') {
    const newWindow = whichWindow === 1 ? 2 : 1;
    if (newWindow === 1) {
      setFirstCategoriesList(categories.filter((item) => item.parent_category_id === newCategoryId));
    } else {
      setSecondCategoriesList(categories.filter((item) => item.parent_category_id === newCategoryId));
    }
    setCurrentCategory(categories.find((category) => category.id === newCategoryId));

    changeScreen(animationDirection || (!!currentCategory && newCategoryId === currentCategory.parent_category_id) ? 'backwards' : 'forwards');
  }

  function goBackInCategoriesTree(categoryId: string) {
    let newCategoriesTree: typeof categoriesTree = categoriesTree;
    while(newCategoriesTree.length > 0 && newCategoriesTree.slice(-1)[0].id !== categoryId) {
      newCategoriesTree = newCategoriesTree.slice(0, -1);
    }
    setCategoriesTree(newCategoriesTree);
  }

  function numberedCategoriesList(screenID: 1 | 2) {
    return (
      <Animated.ScrollView
        style={{
          ...styles.container,
          backgroundColor,
          right: screenID === 1 ? firstWindow : secondWindow, zIndex: currentWindow === screenID ? -1 : -2
        }}
        contentContainerStyle={{
          alignItems: 'stretch',
          paddingTop: 5,
          paddingBottom: 20,
          flexGrow: 1,
        }}
      >
        {/*<Text style={{backgroundColor: 'magenta'}}>WINDOW {screenID} / Current: {currentWindow}</Text>*/}
        {(screenID === 1 ? firstCategoriesList : secondCategoriesList).map((item: Category) =>
          <TouchableCard
            key={item.id}
            style={styles.categoryCard}
            onPress={() => {
              goToSubcategory(screenID, item.id);
              setCategoriesTree(categoriesTree.concat([item]));
            }}
          >
            <Text style={{fontSize: 20}}>{item.name}</Text>
          </TouchableCard>
        )}
        {(screenID === 1 ? firstCategoriesList : secondCategoriesList).length === 0 &&
          <View style={styles.noContentContainer}>
            <Text style={styles.noContentText}>Ta kategoria nie posiada podkategorii.</Text>
          </View>
        }
      </Animated.ScrollView>
    )
  }

  return (
    <View style={{flexGrow: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10, }}>
        <TouchableOpacity
          style={{height: !currentCategory ? 0 : undefined, }} // trick to make it invisible (changing opacity makes a fading animation)
          disabled={!currentCategory}
          onPress={() => {
            goToSubcategory(currentWindow, currentCategory?.parent_category_id);
            setCategoriesTree(categoriesTree.slice(0, categoriesTree.length - 1));
          }}
        >
          <Ionicons name="chevron-back" color={textColor} size={30} style={{marginHorizontal: 5}} />
        </TouchableOpacity>
        <Text
          style={[styles.title, {color: tintColor}]}
          numberOfLines={1}
        >
          Kategoria: {currentCategory === undefined ? "wszystkie" : currentCategory?.name || <Text style={[styles.title, {color: tintColor, fontStyle: 'italic'}]}>nieznana kategoria</Text>}</Text>
        <View style={{opacity: 0}}>
          <Ionicons name="chevron-back" color={textColor} size={30} style={{marginHorizontal: 5}} />
        </View>
      </View>
      <View style={{borderRadius: 12, marginHorizontal: 10, overflow: 'hidden', marginBottom: 10,}}>
        <ScrollView
          ref={categoriesScrollViewRef}
          horizontal={true}
          onContentSizeChange={() => {
            if (categoriesScrollViewRef.current === null) {
              console.log("Cateogries ScrollView ref is NULL!")
            }
            categoriesScrollViewRef.current?.scrollToEnd({animated: true});
          }}
          style={{flexGrow: 1}}
        >
          <TouchableOpacity
            style={[
              styles.categoryTreeItem,
              {backgroundColor: !!currentCategory ? cardBackgroundColor : tintColor}
            ]}
            onPress={() => {
              if (currentCategory !== undefined) {
                console.log("setting categories tree to empty and changing screen");
                setCategoriesTree([]);
                goToSubcategory(currentWindow, undefined, 'backwards');
              }
            }}
          >
            <Text style={styles.categoryTreeLabel}>wszystkie</Text>
          </TouchableOpacity>

          {categoriesTree.map((item: Category) => {return (
            <View style={{flexDirection: 'row', backgroundColor: 'transparent'}} key={item.name}>
              <Ionicons name='chevron-forward' size={16} style={{ color: textColor, alignSelf: 'center'}} />
              <TouchableOpacity
                style={[
                  styles.categoryTreeItem,
                  {backgroundColor: (categoriesTree.length > 0 && categoriesTree[categoriesTree.length - 1] === item) ? tintColor : cardBackgroundColor}
                ]}
                onPress={() => {
                  if (item.id !== currentCategory?.id) {
                    goToSubcategory(currentWindow, item.id, 'backwards');
                    goBackInCategoriesTree(item.id);
                  }
                }}
              >
                <Text style={styles.categoryTreeLabel}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          )})}
        </ScrollView>
      </View>
      <View style={{flex: 1}}>
        {numberedCategoriesList(1)}
        {numberedCategoriesList(2)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    paddingHorizontal: 10,
  },
  categoryCard: {
    padding: 10,
    marginVertical: 5,
  },
  categoryTreeItem: {
    borderRadius: 12,
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  categoryTreeLabel: {
    fontSize: 14,
  },
  title: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 22,
    flex: 1,
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