/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
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
import {ColorSchemeName, Image, Pressable, StyleSheet, TouchableOpacity} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/old screens/ModalScreen';
import NotFoundScreen from '../screens/old screens/NotFoundScreen';
import TabOneScreen from '../screens/old screens/TabOneScreen';
import TabTwoScreen from '../screens/old screens/TabTwoScreen';
import {
  HomeStackParamList,
  OldRootStackParamList,
  OldRootTabParamList,
  RootTabScreenProps,
} from '../types';
import {Text, useThemeColor, View} from "../components/Themed";
import Animated, {Adaptable} from "react-native-reanimated";

import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {useEffect} from "react";
import {eventActions} from "../store/events";
import {demoData} from "../constants/demoData";
import {itemActions} from "../store/items";
import {lendingActions} from "../store/lendings";
import {userActions} from "../store/users";
import LoginNavigator from "./LoginStackNavigator";
import HomeTabNavigator from "./HomeTabNavigator";
import CreateOrganization from "../screens/organizations/CreateOrganization";
// import JoinOrganization from "../screens/organizations/JoinOrganization";
import WelcomeStackNavigator from "./WelcomeStackNavigator";
import useCachedResources from "../hooks/useCachedResources";
import {categoryActions} from "../store/categories";
import {Organization, organizationsActions} from "../store/organizations";
import Logo from "../assets/images/inventory.png";
import {TouchableCard} from "../components/Themed/TouchableCard";
// import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const chosenTheme: "light" | "dark" | null | undefined = useSelector((state: IRootState) => state.appWide.theme === 'auto' ? colorScheme : state.appWide.theme);
  const organizations = useSelector((state: IRootState) => state.organizations.organizations);
  const username = useSelector((state: IRootState) => state.appWide.username);

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer
        // linking={LinkingConfiguration}
        theme={chosenTheme === 'dark' ? DarkTheme : DefaultTheme}>

        {!username ?
          <LoginNavigator/>
          :
          organizations.length > 0 ?
            <HomeStackNavigator organizations={organizations} />
            // <HomeDrawerNavigator organizations={organizations}/>
            :
            <WelcomeStackNavigator/>
        }
      </NavigationContainer>
    );
  }
}

// ROOT

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator(props: {organizations: Organization[]}) {
  const headerColor = useThemeColor({}, 'header');

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {backgroundColor: headerColor},
      }}
    >
      <HomeStack.Screen name="HomeDrawer">{() => HomeDrawerNavigator({organizations: props.organizations})}</HomeStack.Screen>
      <HomeStack.Screen name="CreateOrganization" component={CreateOrganization} options={{
        headerShown: true,
        headerTitle: 'Załóż organizację',
      }}  />
      <HomeStack.Screen name="JoinOrganization" component={CreateOrganization} options={{ // TODO: Change to JoinOrganization once it is created
        headerShown: true,
        headerTitle: 'Dołącz do organizacji',
      }} />

    </HomeStack.Navigator>
  );
}

// HOME DRAWER

const HomeDrawer = createDrawerNavigator();

function CustomHomeDrawerContent(props: DrawerContentComponentProps) {
  const progress = useDrawerProgress() as Adaptable<number>;
  const textColor = useThemeColor({}, 'text');

  const translateX = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  function createOrganizationPressed() {
    console.log("create organization pressed");
    props.navigation.navigate("CreateOrganization", { doesGoBack: true });
  }

  function profileSettingsPressed() {
    console.log("profile settings pressed");
    // props.navigation.navigate("SomeProfileScreenOrNavigator");
  }

  return (
    <>
      <DrawerContentScrollView {...props}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <View style={drawerStyles.titleView}>
            <Text style={drawerStyles.titleText}>Twoje organizacje</Text>
            <TouchableOpacity onPress={createOrganizationPressed} style={drawerStyles.titleAddButton}>
              <Ionicons name='add' size={28} color={textColor} />
            </TouchableOpacity>
          </View>
          <DrawerItemList {...props} />
        </Animated.View>
      </DrawerContentScrollView>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <TouchableCard style={drawerStyles.profileView} onPress={profileSettingsPressed}>
          <View style={drawerStyles.organizationPictureContainer}>
            <Image source={Logo} style={drawerStyles.organizationPicture} resizeMode='contain' />
          </View>
          <Text style={drawerStyles.profileUsername}>USERNAME</Text>
          <TouchableOpacity onPress={profileSettingsPressed} style={drawerStyles.profileSettingsContainer}>
            <Ionicons name='settings' size={26} color={textColor} />
          </TouchableOpacity>
        </TouchableCard>
      </Animated.View>
    </>
  );
}


function HomeDrawerNavigator(props: {organizations: Organization[]}) {
  const headerColor = useThemeColor({}, 'header');
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadData () {
      await Promise.all([
        dispatch(eventActions.loadEvents(demoData[props.organizations[0].id].events)),
        dispatch(itemActions.loadItems(demoData[props.organizations[0].id].items)),
        dispatch(lendingActions.loadLendings(demoData[props.organizations[0].id].lendings)),
        dispatch(userActions.loadUsers(demoData[props.organizations[0].id].users)),
        dispatch(categoryActions.loadCategories(demoData[props.organizations[0].id].categories)),
      ])
    }
    loadData()
  }, [])

  return (
    <HomeDrawer.Navigator
      useLegacyImplementation
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: headerColor},
        drawerActiveBackgroundColor: useThemeColor({}, "tintBackground"),
        drawerActiveTintColor: useThemeColor({}, "tint"),
      }}
      drawerContent={(props) => <CustomHomeDrawerContent {...props} />}
    >
      {props.organizations.map((organization: Organization) => (
        <HomeDrawer.Screen
          key={organization.id}
          name={organization.name}
          component={HomeTabNavigator}
          options={{
            unmountOnBlur: true,
          }}
          listeners={{
            drawerItemPress: (e) => {
              const isDemo: boolean = demoData.hasOwnProperty(organization.id);
              dispatch(organizationsActions.changeOrganization(organization));
              dispatch(eventActions.loadEvents(isDemo ? demoData[organization.id].events : []));
              dispatch(itemActions.loadItems(isDemo ? demoData[organization.id].items : []));
              dispatch(lendingActions.loadLendings(isDemo ? demoData[organization.id].lendings : []));
              dispatch(userActions.loadUsers(isDemo ? demoData[organization.id].users : []));
            }
          }}
        />
        )
      )
        // :
        // <HomeDrawer.Screen
        //   key={"\n"}
        //   name={"Brak organizacji do wyświetlenia"}
        //   component={Welcome} // {CreateOrganizationScreen}
        //   options={{
        //     // headerRight: ({tintColor}) => (
        //     //   <TouchableOpacity onPress={() => navigation.goBack()}>
        //     //     <Ionicons name="log-out" color={tintColor} size={30} style={{padding: 10}} />
        //     //   </TouchableOpacity>
        //     // ),
        //     drawerStyle: {
        //       flexGrow: 1,
        //       // backgroundColor: 'red',
        //       // justifyContent: 'center',
        //     },
        //     drawerItemStyle: {
        //       // display: 'none'
        //       marginTop: 50,
        //       backgroundColor: 'transparent', // 'yellow',
        //       flex: 1,
        //     },
        //     drawerLabelStyle: {
        //       fontStyle: 'italic',
        //       color: textColor,
        //       opacity: 0.6,
        //       flexGrow: 1,
        //     },
        //   }}
        // />
        }
    </HomeDrawer.Navigator>
  );
}

const drawerStyles = StyleSheet.create({
  titleView: {
    marginLeft: 12,
    marginTop: 40,
    marginBottom: 30,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  titleText: {
    fontSize: 18,
    flex: 1,
    textAlignVertical: 'center',
  },
  titleAddButton: {
    paddingHorizontal: 10,
  },
  profileView: {
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 10,
    marginHorizontal: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  organizationPictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  organizationPicture: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  profileUsername: {
    textAlignVertical: 'center',
    fontSize: 18,
    flex: 1,
  },
  profileSettingsContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
})













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
