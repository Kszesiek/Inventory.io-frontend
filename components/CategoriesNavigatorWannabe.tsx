import * as React from "react";
import {Animated, StyleSheet, useWindowDimensions} from "react-native";
import {useRef, useState} from "react";
import {View, Text, useThemeColor} from "./Themed";
import {Category} from "../store/categories";
import {useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {TouchableCard} from "./Themed/TouchableCard";
import {TouchableText} from "./Themed/TouchableText";

export default function CategoriesNavigatorWannabe({currentCategory, setCurrentCategory}: {currentCategory: Category | undefined, setCurrentCategory: React.Dispatch<React.SetStateAction<Category | undefined>>}) {
  const screen = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');

  const categories: Category[] = useSelector((state: IRootState) => state.categories.categories)

  const [currentWindow, setCurrentWindow] = useState<1|2>(1);
  const firstWindow = useRef(new Animated.Value(0)).current;
  const secondWindow = useRef(new Animated.Value(screen.width)).current;

  const [firstCategoriesList, setFirstCategoriesList] = useState<Category[]>(categories.filter((category) => category.parentCategoryId === undefined));
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

  function goToSubcategory(whichWindow: 1 | 2, newCategoryId: string | undefined) {
    const newWindow = whichWindow === 1 ? 2 : 1;
    if (newWindow === 1) {
      setFirstCategoriesList(categories.filter((item) => item.parentCategoryId === newCategoryId));
    } else {
      setSecondCategoriesList(categories.filter((item) => item.parentCategoryId === newCategoryId));
    }
    setCurrentCategory(categories.find((category) => category.categoryId === newCategoryId));

    changeScreen( (!!currentCategory && newCategoryId === currentCategory.parentCategoryId) ? 'backwards' : 'forwards');
  }

  function previousScreen() {
    changeScreen('backwards');
  }

  function nextScreen() {
    changeScreen('forwards');
  }

  return (
    <View style={{flexGrow: 1, justifyContent: 'flex-end',}}>
      <Animated.View style={{...styles.container, backgroundColor/*: 'red'*/, right: firstWindow, zIndex: currentWindow === 1 ? -1 : -2}}>
        <Text style={{backgroundColor: 'magenta'}}>WINDOW 1 / Current: {currentWindow}</Text>
        {!!currentCategory && !!currentCategory.parentCategoryId &&
          // <TouchableText
          //   onPress={() => goToSubcategory(1, currentCategory?.parentCategoryId)}
          // >
          //   {"< powrót"}
          // </TouchableText>
          <TouchableCard key={'backwards'} style={styles.categoryCard} onPress={() => goToSubcategory(1, currentCategory?.parentCategoryId)}>
            <Text style={{fontSize: 22}}>powrót</Text>
          </TouchableCard>
        }
        {firstCategoriesList.map((item) =>
          <TouchableCard key={item.categoryId} style={styles.categoryCard}  onPress={() => goToSubcategory(1, item.categoryId)}>
            <Text style={{fontSize: 22}}>{item.name}</Text>
          </TouchableCard>
        )}
      </Animated.View>
      <Animated.View style={{...styles.container, backgroundColor/*: 'blue'*/, right: secondWindow, zIndex: currentWindow === 2 ? -1 : -2}}>
        <Text style={{backgroundColor: 'magenta'}}>WINDOW 2 / Current: {currentWindow}</Text>
        {!!currentCategory &&
            <TouchableCard key={'backwards'} style={styles.categoryCard} onPress={() => goToSubcategory(2, currentCategory?.parentCategoryId)}>
                <Text style={{fontSize: 22}}>powrót</Text>
            </TouchableCard>
        }
        {secondCategoriesList.map((item) =>
          <TouchableCard
            key={item.categoryId}
            style={[
              styles.categoryCard,
              // currentCategory?.categoryId === item.categoryId && categories.find((catItem: Category) => catItem.parentCategoryId === item.categoryId) === undefined && {backgroundColor: tintColor}
            ]}
            onPress={() => {
              // if (categories.find((catItem: Category) => catItem.parentCategoryId === item.categoryId) !== undefined) {
                goToSubcategory(2, item.categoryId);
              // }
            }}
          >
            <Text style={{fontSize: 22}}>{item.name}</Text>
          </TouchableCard>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'stretch',
    position: 'absolute',
  },
  categoryCard: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
})