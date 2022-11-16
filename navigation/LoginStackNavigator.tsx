import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {LoginStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {BackHandler, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import SignInScreen from "../screens/login/SignInScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPassword";
import ResetPasswordScreen from "../screens/login/ResetPassword";
import AppSettings from "../screens/AppSettings";
import * as React from "react";

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, "header");

  return (
    <LoginStack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        title: "",
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        ),
      })}
    >
      <LoginStack.Screen name="SignIn" component={SignInScreen} options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AppSettings")}>
            <Ionicons name='construct' size={32} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={BackHandler.exitApp}>
            <Ionicons name='close' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <LoginStack.Screen name="Register" component={RegisterScreen} />
      <LoginStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <LoginStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <LoginStack.Screen name="AppSettings" component={AppSettings} options={{
        title: 'Ustawienia',
        headerTitleAlign: 'center',
        headerTransparent: false,
        headerStyle: {backgroundColor: headerColor},
        headerTitleStyle: {color: textColor},
      }} />

    </LoginStack.Navigator>
  );
}