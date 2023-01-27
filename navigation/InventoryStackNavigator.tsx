import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {InventoryStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import Inventory from "../screens/home/inventory/Inventory";
import ItemDetails from "../screens/home/inventory/ItemDetails";
import AddEditItem from "../screens/home/inventory/AddEditItem";
import EditItemProperties from "../screens/home/inventory/EditItemProperties";

const InventoryStack = createNativeStackNavigator<InventoryStackParamList>();

export default function InventoryNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <InventoryStack.Navigator
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
      <InventoryStack.Screen name="Inventory" component={Inventory} options={({ navigation }) => ({
        title: "Inwentarz",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditItem")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <InventoryStack.Screen name="ItemDetails" component={ItemDetails} options={({ navigation, route }) => ({
        title: "Szczegóły przedmiotu",
      })} />
      <InventoryStack.Screen name="AddEditItem" component={AddEditItem} options={({ navigation, route }) => ({
        title: route.params && route.params.itemId ? "Edytuj przedmiot" : "Dodaj przedmiot",
      })} />
      <InventoryStack.Screen name="EditItemProperties" component={EditItemProperties} options={({ navigation, route }) => ({
        title: "Edytuj właściwości przedmiotu",
      })} />

    </InventoryStack.Navigator>
  );
}