import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {WarehousesStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Warehouses from "../screens/home/more/warehouses/Warehouses";
import WarehouseDetails from "../screens/home/more/warehouses/WarehouseDetails";
import AddEditWarehouse from "../screens/home/more/warehouses/AddEditWarehouse";
import * as React from "react";

const WarehousesStack = createNativeStackNavigator<WarehousesStackParamList>();

export default function MembersNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <WarehousesStack.Navigator
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
      <WarehousesStack.Screen name="Warehouses" component={Warehouses} options={({ navigation }) => ({
        title: "Magazyny",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditWarehouse")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <WarehousesStack.Screen name="WarehouseDetails" component={WarehouseDetails} options={{
        title: "Szczegóły magazynu",
      }} />
      <WarehousesStack.Screen name="AddEditWarehouse" component={AddEditWarehouse} options={({ navigation, route }) => ({
        title: route.params && route.params.warehouse ? "Edytuj magazyn" : "Nowy magazyn",
      })} />

    </WarehousesStack.Navigator>
  );
}