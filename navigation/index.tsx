/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 */
import {FontAwesome} from '@expo/vector-icons';
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
import {ColorSchemeName, Pressable, StyleSheet} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/old screens/ModalScreen';
import NotFoundScreen from '../screens/old screens/NotFoundScreen';
import TabOneScreen from '../screens/old screens/TabOneScreen';
import TabTwoScreen from '../screens/old screens/TabTwoScreen';
import {
  OldRootStackParamList,
  OldRootTabParamList,
  RootTabScreenProps,
} from '../types';
import {Text, useThemeColor, View} from "../components/Themed";
import Animated, {Adaptable} from "react-native-reanimated";
import {OpacityButton} from "../components/Themed/OpacityButton";
// import LinkingConfiguration from './LinkingConfiguration';

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
import WelcomeStackNavigator from "./WelcomeStackNavigator";
import useCachedResources from "../hooks/useCachedResources";

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const chosenTheme: "light" | "dark" | null | undefined = useSelector((state: IRootState) => state.appWide.theme === 'auto' ? colorScheme : state.appWide.theme);
  const organizations = useSelector((state: IRootState) => state.organizations.organizations);
  const token = useSelector((state: IRootState) => state.appWide.token);

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NavigationContainer
        // linking={LinkingConfiguration}
        theme={chosenTheme === 'dark' ? DarkTheme : DefaultTheme}>

        {!token ?
          <LoginNavigator/>
          :
          organizations.length > 0 ?
            <HomeDrawerNavigator organizations={organizations}/>
            :
            <WelcomeStackNavigator/>
        }
      </NavigationContainer>
    );
  }
}

// ROOT

// const RootStack = createNativeStackNavigator<RootStackParamList>();
//
// function RootNavigator() {
//
//   return (
//     <RootStack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//
//       <RootStack.Screen name="Login" component={LoginNavigator} />
//       <RootStack.Screen name="Home">{() => HomeDrawerNavigator({organizations})}</RootStack.Screen>
//       <RootStack.Screen name="Welcome" component={Welcome} />
//       <RootStack.Screen name="CreateOrganization" component={CreateOrganization} options={{
//         headerShown: true,
//         headerTitleAlign: 'center',
//         headerTitle: 'Załóż organizację',
//         headerStyle: {backgroundColor: headerColor},
//       }} />
//     </RootStack.Navigator>
//   );
// }

// HOME DRAWER

const HomeDrawer = createDrawerNavigator();

function CustomHomeDrawerContent(props: DrawerContentComponentProps) {
  const progress = useDrawerProgress() as Adaptable<number>;

  const translateX = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  function createOrganizationPressed() {
    console.log("create organization pressed");
    props.navigation.navigate("CreateOrganization");
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
            textStyle={{fontSize: 16}}
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


function HomeDrawerNavigator(props: {organizations: OrganizationDetails[]}) {
  const headerColor = useThemeColor({}, 'header');
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadData () {
      await Promise.all([
        dispatch(eventActions.loadEvents(demoData[props.organizations[0].organizationId].events)),
        dispatch(itemActions.loadItems(demoData[props.organizations[0].organizationId].items)),
        dispatch(lendingActions.loadLendings(demoData[props.organizations[0].organizationId].lendings)),
        dispatch(userActions.loadUsers(demoData[props.organizations[0].organizationId].users)),
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
      {props.organizations.map((organization: OrganizationDetails) => (
        <HomeDrawer.Screen
          key={organization.organizationId}
          name={organization.name}
          component={HomeTabNavigator}
          options={{
            unmountOnBlur: true,
          }}
          listeners={{
            drawerItemPress: (e) => {
              const isDemo: boolean = demoData.hasOwnProperty(organization.organizationId);
              dispatch(eventActions.loadEvents(isDemo ? demoData[organization.organizationId].events : []));
              dispatch(itemActions.loadItems(isDemo ? demoData[organization.organizationId].items : []));
              dispatch(lendingActions.loadLendings(isDemo ? demoData[organization.organizationId].lendings : []));
              dispatch(userActions.loadUsers(isDemo ? demoData[organization.organizationId].users : []));
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
