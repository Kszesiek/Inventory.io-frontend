/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import {ColorSchemeName, Pressable, TouchableOpacity} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/old screens/ModalScreen';
import NotFoundScreen from '../screens/old screens/NotFoundScreen';
import TabOneScreen from '../screens/old screens/TabOneScreen';
import TabTwoScreen from '../screens/old screens/TabTwoScreen';
import {
  RootStackParamList,
  LoginStackParamList,
  OldRootStackParamList,
  OldRootTabParamList,
  RootTabScreenProps,
  HomeDrawerParamList,
  HomeTabParamList,
} from '../types';
import SignInScreen from "../screens/login/SignInScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPassword";
import ResetPasswordScreen from "../screens/login/ResetPassword";
import AppSettings from "../screens/AppSettings";
import Homescreen from "../screens/home/Homescreen";
import Inventory from "../screens/home/Inventory";
import Events from "../screens/home/Events";
import Lending from "../screens/home/Lending";
import ManageOrganization from "../screens/home/ManageOrganization";
import {useThemeColor} from "../components/Themed";
// import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// ROOT

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Login" component={LoginNavigator} />
      <RootStack.Screen name="Home" component={HomeDrawerNavigator} options={{ headerShown: false, }} />
    </RootStack.Navigator>
  );
}

// LOGIN

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

function LoginNavigator() {
  return (
    <LoginStack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTransparent: true,
        title: "",
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={30} style={{ color: useThemeColor({}, 'text')}} />
          </TouchableOpacity>
        ),
      })}
    >
      <LoginStack.Screen name="SignIn" component={SignInScreen} options={({ navigation }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AppSettings")}>
            <Ionicons name='settings' size={35} style={{ color: useThemeColor({light: '#333', dark: '#fff'}, 'text')}} />
          </TouchableOpacity>
        ),
        headerLeft: () => <></>,
      })} />
      <LoginStack.Screen name="Register" component={RegisterScreen} />
      <LoginStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <LoginStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <LoginStack.Screen name="AppSettings" component={AppSettings} />

    </LoginStack.Navigator>
  );
}

// HOME DRAWER

const HomeDrawer = createDrawerNavigator<HomeDrawerParamList>();

type OrganizationDetails = {name: string};

function HomeDrawerNavigator(props: OrganizationDetails[]) {
  return (
    <HomeDrawer.Navigator
      screenOptions={{
        headerShown: false,
      }}

    >
      <HomeDrawer.Screen
        name="OrganizationTabNavigator"
        component={HomeTabNavigator}
      />
    </HomeDrawer.Navigator>
  );
}

// HOME TAB

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabNavigator(props: {navigation: any, route: any}) {  // OrganizationDetails
  return (
    <HomeTab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerLeft: () => (
        <TouchableOpacity onPress={props.navigation.openDrawer}>
        <Ionicons name="arrow-back" color={useThemeColor({}, "text")} size={30} style={{padding: 10}} />
        </TouchableOpacity>
        ),
        headerTintColor: useThemeColor({}, "text"),
      }}
      >
      <HomeTab.Screen
        name="Homescreen"
        component={Homescreen}
        options={{
          tabBarLabel: "Strona główna",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerLeft: ({tintColor}) => (
            <TouchableOpacity onPress={props.navigation.openDrawer}>
              <Ionicons name="menu" color={tintColor} size={30} style={{padding: 10}} />
            </TouchableOpacity>
          ),
          headerRight: ({tintColor}) => (
            <TouchableOpacity onPress={() => props.navigation.replace("Login")}>
              <Ionicons name="log-out" color={tintColor} size={30} style={{padding: 10}} />
            </TouchableOpacity>
          ),
      }} />
      <HomeTab.Screen
        name="Inventory"
        component={Inventory}
        options={{
          tabBarLabel: "Inwentarz",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="Lending"
        component={Lending}
        options={{
          tabBarLabel: "Wypożyczenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="push" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarLabel: "Wydarzenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="ManageOrganization"
        component={ManageOrganization}
        options={{
          tabBarLabel: "Zarządzanie",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="terminal" size={size} color={color} />
          ),
        }} />
    </HomeTab.Navigator>
  )
}












/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<OldRootStackParamList>();

function OldRootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<OldRootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
