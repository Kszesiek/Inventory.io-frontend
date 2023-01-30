/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {Ionicons} from '@expo/vector-icons';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
  useDrawerProgress
} from '@react-navigation/drawer';
import * as React from 'react';
import {ColorSchemeName, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {HomeStackParamList,} from '../types';
import {Text, useThemeColor, View} from "../components/Themed";
import Animated, {Adaptable} from "react-native-reanimated";

import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {useEffect} from "react";
import LoginNavigator from "./LoginStackNavigator";
import HomeTabNavigator from "./HomeTabNavigator";
import CreateOrganization from "../screens/organizations/CreateOrganization";
// import JoinOrganization from "../screens/organizations/JoinOrganization";
import WelcomeStackNavigator from "./WelcomeStackNavigator";
import useCachedResources from "../hooks/useCachedResources";
import {Organization, organizationsActions} from "../store/organizations";
import Logo from "../assets/images/inventory.png";
import {TouchableCard} from "../components/Themed/TouchableCard";
// import {categoryActions} from "../store/categories";
// import {eventActions} from "../store/events";
// import {itemActions} from "../store/items";
// import {rentalsActions} from "../store/rentals";
// import {membersActions} from "../store/members";
// import {userActions} from "../store/users";
// import {warehousesActions} from "../store/warehouses";
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
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {backgroundColor: headerColor},
      }}
    >
      <HomeStack.Screen name="HomeDrawer">{() => HomeDrawerNavigator({organizations: props.organizations})}</HomeStack.Screen>
      <HomeStack.Screen name="CreateOrganizationHome" component={CreateOrganization} options={{
        headerShown: true,
        headerTitle: 'Załóż organizację',
      }}  />
      {/*<HomeStack.Screen name="JoinOrganization" component={JoinOrganization} options={{
      {/*  headerShown: true,*/}
      {/*  headerTitle: 'Dołącz do organizacji',*/}
      {/*}} />*/}
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
    props.navigation.navigate("CreateOrganizationHome", { doesGoBack: true });
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
  const tintBackgroundColor = useThemeColor({}, "tintBackground");
  const tintColor = useThemeColor({}, "tint")
  const dispatch = useDispatch();
  useEffect(() => {
    async function loadData () {
      await Promise.all([
        // dispatch(eventActions.loadEvents(demoData[props.organizations[0].id].events)),
        // dispatch(itemActions.loadItems(demoData[props.organizations[0].id].items)),
        // dispatch(lendingActions.loadLendings(demoData[props.organizations[0].id].rentals)),
        // dispatch(userActions.loadUsers(demoData[props.organizations[0].id].users)),
        // dispatch(membersActions.loadMembers(demoData[props.organizations[0].id].users)), // going to change that most likely
        // dispatch(categoryActions.loadCategories(demoData[props.organizations[0].id].categories)),
        // dispatch(warehousesActions.loadWarehouses(demoData[props.organizations[0].id].warehouses)),
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
        drawerActiveBackgroundColor: tintBackgroundColor,
        drawerActiveTintColor: tintColor,
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
              // const isDemo: boolean = demoData.hasOwnProperty(organization.id);
              Promise.all([
                dispatch(organizationsActions.setCurrentOrganization(organization)),
                // dispatch(eventActions.loadEvents(isDemo ? demoData[organization.id].events : [])),
                // dispatch(itemActions.loadItems(isDemo ? demoData[organization.id].items : [])),
                // dispatch(lendingActions.loadLendings(isDemo ? demoData[organization.id].rentals : [])),
                // dispatch(userActions.loadUsers(isDemo ? demoData[organization.id].users : [])),
                // dispatch(membersActions.loadMembers(isDemo ? demoData[organization.id].users : [])), // going to change that most likely
                // dispatch(categoryActions.loadCategories(isDemo ? demoData[organization.id].categories : [])),
                // dispatch(warehousesActions.loadWarehouses(isDemo ? demoData[organization.id].warehouses : [])),
              ])
            }
          }}
        />
        )
      )
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