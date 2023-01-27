import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {PropertiesStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Properties from "../screens/home/more/properties/Properties";
import PropertyDetails from "../screens/home/more/properties/PropertyDetails";
import AddEditProperty from "../screens/home/more/properties/AddEditProperty";
import * as React from "react";

const PropertiesStack = createNativeStackNavigator<PropertiesStackParamList>();

export default function PropertiesNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <PropertiesStack.Navigator
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
      <PropertiesStack.Screen name="Properties" component={Properties} options={({ navigation }) => ({
        title: "Właściwości przedmiotów",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditProperty")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <PropertiesStack.Screen name="PropertyDetails" component={PropertyDetails} options={{
        title: "Szczegóły właściwości",
      }} />
      <PropertiesStack.Screen name="AddEditProperty" component={AddEditProperty} options={({ navigation, route }) => ({
        title: route.params && route.params.propertyId ? "Edytuj właściwość" : "Nowa właściwość",
      })} />

    </PropertiesStack.Navigator>
  );
}