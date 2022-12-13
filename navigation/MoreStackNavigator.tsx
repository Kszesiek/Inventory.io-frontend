import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MoreStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import More from "../screens/home/More";
import * as React from "react";
import HenryStickmin from "../screens/HenryStickmin";

const MoreStack = createNativeStackNavigator<MoreStackParamList>();

export default function MoreNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <MoreStack.Navigator
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
      <MoreStack.Screen name="More" component={More} options={({ navigation }) => ({
        title: "Więcej",
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />

      <MoreStack.Screen name="HenryStickmin" component={HenryStickmin} options={({ navigation }) => ({

        title: "Feel distracted yet?",
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
    </MoreStack.Navigator>
  );
}