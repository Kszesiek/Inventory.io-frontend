import * as React from "react";
import {Animated, FlatList, StyleSheet, useWindowDimensions} from "react-native";
import {useRef, useState} from "react";
import {View, Text, useThemeColor, TouchableOpacity} from "./Themed";
import {Category} from "../store/categories";
import {useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {TouchableCard} from "./Themed/TouchableCard";
import {Ionicons} from "@expo/vector-icons";

export default function CategoriesNavigatorWannabe({currentCategory, setCurrentCategory}: {currentCategory: Category | undefined, setCurrentCategory: React.Dispatch<React.SetStateAction<Category | undefined>>}) {
  const screen = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const categories: Category[] = useSelector((state: IRootState) => state.categories.categories)
  const [categoriesTree, setCategoriesTree] = useState<Category[]>([]);

  const [currentWindow, setCurrentWindow] = useState<1|2>(1);
  const firstWindow = useRef(new Animated.Value(0)).current;
  const secondWindow = useRef(new Animated.Value(screen.width)).current;

  const [firstCategoriesList, setFirstCategoriesList] = useState<Category[]>(categories.filter((category) => category.parentCategoryId === currentCategory?.categoryId));
  const [secondCategoriesList, setSecondCategoriesList] = useState<Category[]>([]);

  const animDuration: number = 300;

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
      setFirstCategoriesList(categories.filter((item) => item.parentCategoryId === newCategoryId));
    } else {
      setSecondCategoriesList(categories.filter((item) => item.parentCategoryId === newCategoryId));
    }
    setCurrentCategory(categories.find((category) => category.categoryId === newCategoryId));

    changeScreen(animationDirection || (!!currentCategory && newCategoryId === currentCategory.parentCategoryId) ? 'backwards' : 'forwards');
  }

  function goBackInCategoriesTree(categoryId: string) {
    let newCategoriesTree: typeof categoriesTree = categoriesTree;
    while(newCategoriesTree.length > 0 && newCategoriesTree[0].categoryId !== categoryId) {
      newCategoriesTree = newCategoriesTree.slice(1, categoriesTree.length);
    }
    setCategoriesTree(newCategoriesTree);
  }

  function numberedCategoriesList(screenID: 1 | 2) {
    return (
      <Animated.View style={{...styles.container, backgroundColor, right: screenID === 1 ? firstWindow : secondWindow, zIndex: currentWindow === screenID ? -1 : -2}}>
        <Text style={{backgroundColor: 'magenta'}}>WINDOW {screenID} / Current: {currentWindow}</Text>
        {!!currentCategory &&
          <TouchableCard
            key={'backwards'}
            style={styles.categoryCard}
            onPress={() => {
              goToSubcategory(screenID, currentCategory?.parentCategoryId);
              setCategoriesTree(categoriesTree.slice(1, categoriesTree.length));
            }}
          >
            <Text style={{fontSize: 20}}>powrót</Text>
          </TouchableCard>
        }
        {(screenID === 1 ? firstCategoriesList : secondCategoriesList).map((item: Category) =>
          <TouchableCard
            key={item.categoryId}
            style={styles.categoryCard}
            onPress={() => {
              goToSubcategory(screenID, item.categoryId);
              setCategoriesTree([item].concat(categoriesTree));
            }}
          >
            <Text style={{fontSize: 20}}>{item.name}</Text>
          </TouchableCard>
        )}
      </Animated.View>
    )
  }

  return (
    <View style={{flexGrow: 1,}}>
      <View style={{borderRadius: 12, marginHorizontal: 10, overflow: 'hidden', marginBottom: 10,}}>
        <FlatList
          horizontal={true}
          inverted={true}
          data={categoriesTree}
          style={{
            backgroundColor: 'blue',
          }}
          contentContainerStyle={{
            backgroundColor: backgroundColor,
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
          keyExtractor={item => item.categoryId}
          ListFooterComponentStyle={{flexDirection: 'row'}}
          ListFooterComponent={
            <>
              <TouchableOpacity
                style={[
                  styles.categoryTreeItem,
                  {backgroundColor: !!currentCategory ? cardBackgroundColor : tintColor}
                ]}
                onPress={() => {
                  console.log("setting categories tree to empty...");
                  setCategoriesTree([]);
                  console.log("..and changing screen");
                  goToSubcategory(currentWindow, undefined, 'backwards');
                }}
              >
                <Text style={styles.categoryTreeLabel}>wszystkieeeeeeeeeeeeee</Text>
              </TouchableOpacity>
              {/*{!!currentCategory && <Ionicons name='chevron-forward' size={16} style={{ color: textColor, alignSelf: 'center'}} />}*/}
            </>
          }
          renderItem={({item}) => {
            return (<View style={{flexDirection: 'row', backgroundColor: 'transparent', height: '100%'}}>
              <Ionicons name='chevron-forward' size={16} style={{ color: textColor, alignSelf: 'center'}} />
              <TouchableOpacity
                style={[
                  styles.categoryTreeItem,
                  {backgroundColor: (categoriesTree.length > 0 && categoriesTree[0] === item) ? tintColor : cardBackgroundColor}
                ]}
                onPress={() => {
                  goToSubcategory(currentWindow, item.categoryId, 'backwards');
                  goBackInCategoriesTree(item.categoryId);
                }}
              >
                <Text style={styles.categoryTreeLabel}>{item.name}</Text>
              </TouchableOpacity>
            </View>)
          }}
        />
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
    alignItems: 'stretch',
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
})