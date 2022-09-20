import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {EventStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Events from "../screens/home/events/Events";
import EventDetails from "../screens/home/events/EventDetails";
import AddEditEvent from "../screens/home/events/AddEditEvent";
import * as React from "react";

const EventStack = createNativeStackNavigator<EventStackParamList>();

export default function EventNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <EventStack.Navigator
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
      <EventStack.Screen name="Events" component={Events} options={({ navigation }) => ({
        title: "Wydarzenia",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditEvent")}>
            <Ionicons name='add' size={32} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <EventStack.Screen name="EventDetails" component={EventDetails} options={({ navigation, route }) => ({
        title: "Szczegóły wydarzenia",
        // headerRight: () => (
        //   <TouchableOpacity onPress={() => navigation.navigate("AddEditEvent", {eventId: route.params.eventId})}>
        //     <Feather name='edit' size={24} style={{ color: textColor,}} />
        //   </TouchableOpacity>
        // ),
      })} />
      <EventStack.Screen name="AddEditEvent" component={AddEditEvent} options={({ navigation, route }) => ({
        title: route.params && route.params.event ? "Edytuj wydarzenie" : "Nowe wydarzenie",
      })} />

    </EventStack.Navigator>
  );
}