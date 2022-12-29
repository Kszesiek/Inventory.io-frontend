import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {CategoriesStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Categories from "../screens/home/more/categories/Categories";
import CategoryDetails from "../screens/home/more/categories/CategoryDetails";
import AddEditCategory from "../screens/home/more/categories/AddEditCategory";
import * as React from "react";

const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>();

export default function CategoriesNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <CategoriesStack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerTintColor: textColor,
        headerStyle: {backgroundColor: headerColor},
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        ),
      })}
    >
      <CategoriesStack.Screen name="Categories" component={Categories} options={({ navigation }) => ({
        title: "Kategorie",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditCategory")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <CategoriesStack.Screen name="CategoryDetails" component={CategoryDetails} options={{
        title: "Szczegóły kategorii",
      }} />
      <CategoriesStack.Screen name="AddEditCategory" component={AddEditCategory} options={({ navigation, route }) => ({
        title: route.params && route.params.category ? "Edytuj kategorię" : "Nowa kategoria",
      })} />

    </CategoriesStack.Navigator>
  );
}