import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LendingStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Lendings from "../screens/home/lendings/Lendings";
import LendingDetails from "../screens/home/lendings/LendingDetails";
import AddEditLending from "../screens/home/lendings/AddEditLending";
import * as React from "react";

const LendingStack = createNativeStackNavigator<LendingStackParamList>();

export default function LendingNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <LendingStack.Navigator
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerTintColor: textColor,
        headerStyle: {backgroundColor: headerColor},
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={30} style={{ color: textColor}} />
          </TouchableOpacity>
        ),
      })}
    >
      <LendingStack.Screen name="Lendings" component={Lendings} options={({ navigation }) => ({
        title: "Wypożyczenia",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditLending")}>
            <Ionicons name='add' size={32} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <LendingStack.Screen name="LendingDetails" component={LendingDetails} options={({ navigation, route }) => ({
        title: "Szczegóły wypożyczenia",
        // headerRight: () => (
        //   <TouchableOpacity onPress={() => navigation.navigate("AddEditLending", {lendingId: route.params.lendingId})}>
        //     <Feather name='edit' size={24} style={{ color: textColor,}} />
        //   </TouchableOpacity>
        // ),
      })} />
      <LendingStack.Screen name="AddEditLending" component={AddEditLending} options={({ navigation, route }) => ({
        title: route.params && route.params.lending ? "Edytuj wydarzenie" : "Nowe wydarzenie",
      })} />

    </LendingStack.Navigator>
  );
}