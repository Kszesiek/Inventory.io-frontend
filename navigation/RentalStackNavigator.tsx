import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {RentalStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Rentals from "../screens/home/rentals/Rentals";
import RentalDetails from "../screens/home/rentals/RentalDetails";
import AddEditRental from "../screens/home/rentals/AddEditRental";
import * as React from "react";
import AddItemsToRental from "../screens/home/rentals/AddItemsToRental";

const LendingStack = createNativeStackNavigator<RentalStackParamList>();

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
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        ),
      })}
    >
      <LendingStack.Screen name="Rentals" component={Rentals} options={({ navigation }) => ({
        title: "Wypożyczenia",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditRental")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <LendingStack.Screen name="RentalDetails" component={RentalDetails} options={({ navigation, route }) => ({
        title: "Szczegóły wypożyczenia",
        // headerRight: () => (
        //   <TouchableOpacity onPress={() => navigation.navigate("AddEditRental", {lendingId: route.params.lendingId})}>
        //     <Feather name='edit' size={24} style={{ color: textColor,}} />
        //   </TouchableOpacity>
        // ),
      })} />
      <LendingStack.Screen name="AddEditRental" component={AddEditRental} options={({ navigation, route }) => ({
        title: route.params && route.params.rentalId ? "Edytuj wypożyczenie" : "Nowe wypożyczenie",
      })} />
      <LendingStack.Screen name="AddItemsToRental" component={AddItemsToRental} options={({ navigation, route }) => ({
        title: "Wybierz przedmioty",
      })} />
    </LendingStack.Navigator>
  );
}