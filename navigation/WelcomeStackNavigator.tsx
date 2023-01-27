import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {WelcomeStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import Welcome from "../screens/firstLogIn/Welcome";
import CreateOrganization from "../screens/organizations/CreateOrganization";

const WelcomeStack = createNativeStackNavigator<WelcomeStackParamList>();

export default function WelcomeStackNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, "header");

  return (
    <WelcomeStack.Navigator
      screenOptions={({ navigation }) => ({
        headerTintColor: textColor,
        headerStyle: {backgroundColor: headerColor},
        headerTitleAlign: 'center',
        headerShown: false,
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        ),
      })}
    >
      <WelcomeStack.Screen name="Welcome" component={Welcome} />
      <WelcomeStack.Screen name="CreateOrganizationWelcome" component={CreateOrganization} options={{
        headerShown: true,
        headerTitle: 'Załóż organizację',
      }} />
      {/*<WelcomeStack.Screen name="JoinOrganization" component={CreateOrganization} />*/}

    </WelcomeStack.Navigator>
  );
}