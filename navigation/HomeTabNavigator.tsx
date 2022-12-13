import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeTabParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Feather, Ionicons} from "@expo/vector-icons";
import * as React from "react";
import LendingNavigator from "./LendingStackNavigator";
import EventNavigator from "./EventStackNavigator";
import HomescreenNavigator from "./HomescreenStackNavigator";
import InventoryNavigator from "./InventoryStackNavigator";
import MoreNavigator from "./MoreStackNavigator";

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

export default function HomeTabNavigator(props: {navigation: any, route: any}) {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <HomeTab.Navigator
      initialRouteName="HomescreenNavigator"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={() => props.navigation.navigate("HomescreenNavigator")}>
            <Ionicons name="chevron-back" color={textColor} size={36} style={{padding: 10}} />
          </TouchableOpacity>
        ),
        headerTintColor: textColor,
        headerStyle: {backgroundColor: headerColor},
        tabBarActiveBackgroundColor: useThemeColor({}, "tintBackground"),
        tabBarActiveTintColor: useThemeColor({}, "tint"),
        tabBarInactiveBackgroundColor: headerColor,
        tabBarStyle: {
          height: 55,
        },
        tabBarIconStyle: {
          scaleX: 1.2,
          scaleY: 1.2,
          marginTop: 2,
        },
        tabBarLabelStyle: {
          fontFamily: "Source Sans",
          fontSize: 12,
          marginBottom: 4,
        }
      }}
    >
      <HomeTab.Screen
        name="HomescreenNavigator"
        component={HomescreenNavigator}
        options={{
          tabBarLabel: "Strona główna",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          // headerLeft: ({tintColor}) => (
          //   <TouchableOpacity onPress={props.navigation.openDrawer}>
          //     <Ionicons name="menu" color={tintColor} size={36} style={{padding: 10}} />
          //   </TouchableOpacity>
          // ),
          // headerRight: ({tintColor}) => (
          //   <TouchableOpacity onPress={() => props.navigation.replace("Login")}>
          //     <Ionicons name="log-out" color={tintColor} size={36} style={{padding: 10}} />
          //   </TouchableOpacity>
          // ),
        }} />
      <HomeTab.Screen
        name="InventoryNavigator"
        component={InventoryNavigator}
        options={{
          tabBarLabel: "Inwentarz",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="LendingNavigator"
        component={LendingNavigator}
        options={{
          tabBarLabel: "Wypożyczenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="push" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="EventNavigator"
        component={EventNavigator}
        options={{
          tabBarLabel: "Wydarzenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="MoreNavigator"
        component={MoreNavigator}
        options={{
          tabBarLabel: "Więcej",
          tabBarIcon: ({color, size}) => (
            <Feather name="more-horizontal" size={size} color={color} />
          ),
        }} />
    </HomeTab.Navigator>
  )
}