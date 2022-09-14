/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {Feather, FontAwesome, Ionicons} from '@expo/vector-icons';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerProgress
} from '@react-navigation/drawer';
import * as React from 'react';
import {ColorSchemeName, Pressable, StyleSheet, TouchableOpacity, BackHandler} from 'react-native';

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
  // HomeDrawerParamList,
  HomeTabParamList,
  LendingStackParamList, EventStackParamList,
} from '../types';
import SignInScreen from "../screens/login/SignInScreen";
import RegisterScreen from "../screens/login/RegisterScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPassword";
import ResetPasswordScreen from "../screens/login/ResetPassword";
import AppSettings from "../screens/AppSettings";
import Homescreen from "../screens/home/Homescreen";
import Inventory from "../screens/home/Inventory";
import Events from "../screens/home/events/Events";
import Lendings from "../screens/home/lendings/Lendings";
import More from "../screens/home/More";
import {Text, useThemeColor, View} from "../components/Themed";
import Animated, {Adaptable} from "react-native-reanimated";
import {OpacityButton} from "../components/Themed/OpacityButton";
import LendingDetails from "../screens/home/lendings/LendingDetails";
import AddEditLending from "../screens/home/lendings/AddEditLending";
import EventDetails from "../screens/home/events/EventDetails";
import AddEditEvent from "../screens/home/events/AddEditEvent";
// import LinkingConfiguration from './LinkingConfiguration';

import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {useEffect} from "react";
import {eventActions} from "../store/events";
import {demoData} from "../constants/demoData";
import {itemActions} from "../store/items";
import {lendingActions} from "../store/lendings";
import {userActions} from "../store/users";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const chosenTheme: "light" | "dark" | null | undefined = useSelector((state: IRootState) => state.appWide.theme === 'auto' ? colorScheme : state.appWide.theme);

  return (
    <NavigationContainer
      // linking={LinkingConfiguration}
      theme={chosenTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// ROOT

const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const organizations = useSelector((state: IRootState) => state.organizations.organizations)

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Login" component={LoginNavigator} />
      <RootStack.Screen name="Home" options={{ headerShown: false, }}>{() => HomeDrawerNavigator(organizations)}</RootStack.Screen>
    </RootStack.Navigator>
  );
}

// LOGIN

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

function LoginNavigator() {
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
            <Ionicons name='chevron-back' size={30} style={{ color: textColor}} />
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

// HOME DRAWER

const HomeDrawer = createDrawerNavigator();

function CustomHomeDrawerContent(props: DrawerContentComponentProps) {
  const progress = useDrawerProgress() as Adaptable<number>;

  const translateX = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  function createOrganizationPressed() {
    console.log("create organization pressed")
  }

  return (
    <>
      <DrawerContentScrollView {...props}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <View style={drawerStyles.titleView}>
            <Text style={drawerStyles.titleText}>Twoje organizacje</Text>
          </View>
          <DrawerItemList {...props} />
        </Animated.View>
      </DrawerContentScrollView>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <View style={drawerStyles.bottomView}>
          <OpacityButton
            style={drawerStyles.bottomButton}
            textProps={{style: {fontSize: 16}}}
            onPress={createOrganizationPressed}
          >
            Utwórz organizację
          </OpacityButton>
        </View>
      </Animated.View>
    </>
  );
}

type OrganizationDetails = {
  organizationId: string,
  name: string
};


function HomeDrawerNavigator(props: OrganizationDetails[]) {
  const headerColor = useThemeColor({}, 'header');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    async function loadData () {
      await Promise.all([
        dispatch(eventActions.loadEvents(demoData[props[0].organizationId].events)),
        dispatch(itemActions.loadItems(demoData[props[0].organizationId].items)),
        dispatch(lendingActions.loadLendings(demoData[props[0].organizationId].lendings)),
        dispatch(userActions.loadUsers(demoData[props[0].organizationId].users)),
      ])
    }
    loadData()
    console.log('HomeDrawer useEffect')
  }, [])

  return (
    // <Provider store={store}>
    <HomeDrawer.Navigator
      useLegacyImplementation
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: headerColor},
        drawerActiveBackgroundColor: useThemeColor({}, "tintBackground"),  // Czy potrzebujemy tego? Może lepiej zostawić złotą poświatę?
        drawerActiveTintColor: useThemeColor({}, "tint"),
      }}
      drawerContent={(props) => <CustomHomeDrawerContent {...props} />}
    >
      {props.map((organization: OrganizationDetails) => (
        <HomeDrawer.Screen
          key={organization.organizationId}
          name={organization.name}
          component={HomeTabNavigator}
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault()

              navigation.dispatch({
                ...CommonActions.reset({
                  index: 0,
                  routes: [{
                    name: "Home",
                  }]
                })
              });

              navigation.dispatch({
                ...CommonActions.reset({
                  index: 0,
                  routes: [{
                    name: organization.name,
                  }]
                })
              })
              dispatch(eventActions.loadEvents(demoData[organization.organizationId].events))
              dispatch(itemActions.loadItems(demoData[organization.organizationId].items))
              dispatch(lendingActions.loadLendings(demoData[organization.organizationId].lendings))
              dispatch(userActions.loadUsers(demoData[organization.organizationId].users))
            }
          }}
        />
        )
      )}
    </HomeDrawer.Navigator>
    // </Provider>
  );
}

const drawerStyles = StyleSheet.create({
  titleView: {
    marginLeft: 12,
    marginTop: 40,
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  titleText: {
    fontSize: 18,
  },
  bottomView: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  bottomButton: {
    paddingVertical: 8,
  },
})

// HOME TAB

const HomeTab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabNavigator(props: {navigation: any, route: any}) {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <HomeTab.Navigator
      initialRouteName="Homescreen"
      screenOptions={{
        headerTitleAlign: "center",
        headerLeft: () => (
        <TouchableOpacity onPress={() => props.navigation.navigate("Homescreen")}>
          <Ionicons name="chevron-back" color={textColor} size={30} style={{padding: 10}} />
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
        name="Homescreen"
        component={Homescreen}
        options={{
          title: "Strona główna",
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
          title: "Inwentarz",
          tabBarLabel: "Inwentarz",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="LendingNavigator"
        component={LendingNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Wypożyczenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="push" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="EventNavigator"
        component={EventNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Wydarzenia",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} />
      <HomeTab.Screen
        name="More"
        component={More}
        options={{
          title: "Więcej",
          tabBarLabel: "Więcej",
          tabBarIcon: ({color, size}) => (
            <Feather name="more-horizontal" size={size} color={color} />
          ),
        }} />
    </HomeTab.Navigator>
  )
}

// LENDING STACK

const LendingStack = createNativeStackNavigator<LendingStackParamList>();

function LendingNavigator() {
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
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditLending", {lendingId: route.params.lendingId})}>
            <Feather name='edit' size={24} style={{ color: textColor,}} />
          </TouchableOpacity>
        ),
      })} />
      <LendingStack.Screen name="AddEditLending" component={AddEditLending} options={({ navigation, route }) => ({
        title: route.params && route.params.lending ? "Edytuj wydarzenie" : "Nowe wydarzenie",
      })} />

    </LendingStack.Navigator>
  );
}

// EVENT STACK

const EventStack = createNativeStackNavigator<EventStackParamList>();

function EventNavigator() {
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
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditEvent", {eventId: route.params.eventId})}>
            <Feather name='edit' size={24} style={{ color: textColor,}} />
          </TouchableOpacity>
        ),
      })} />
      <EventStack.Screen name="AddEditEvent" component={AddEditEvent} options={({ navigation, route }) => ({
        title: route.params && route.params.event ? "Edytuj wydarzenie" : "Nowe wydarzenie",
      })} />

    </EventStack.Navigator>
  );
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
