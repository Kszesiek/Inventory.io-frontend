import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomescreenStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import Homescreen from "../screens/home/Homescreen";
import BarcodeScanner from "../screens/home/BarcodeScanner";
import {useDispatch} from "react-redux";
import {appWideActions} from "../store/appWide";

const HomescreenStack = createNativeStackNavigator<HomescreenStackParamList>();

export default function HomescreenNavigator(props: {navigation: any, route: any}) {
  const dispatch = useDispatch();
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <HomescreenStack.Navigator
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
      <HomescreenStack.Screen
        name="Homescreen"
        component={Homescreen}
        options={{
          title: "Strona główna",
          headerLeft: ({tintColor}) => (
            <TouchableOpacity onPress={props.navigation.openDrawer}>
              <Ionicons name="menu" color={tintColor} size={30} style={{padding: 10}} />
            </TouchableOpacity>
          ),
          headerRight: ({tintColor}) => (
            <TouchableOpacity onPress={() => dispatch(appWideActions.signOut())}>
              <Ionicons name="log-out" color={tintColor} size={30} style={{padding: 10}} />
            </TouchableOpacity>
          ),
        }} />
      <HomescreenStack.Screen
        name={"BarcodeScanner"}
        component={BarcodeScanner}
        options={{
          presentation: 'modal',
          title: 'Skanuj kod kreskowy przedmiotu',
        }}
      />


    </HomescreenStack.Navigator>
  );
}