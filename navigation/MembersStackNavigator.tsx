import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MembersStackParamList} from "../types";
import {useThemeColor} from "../components/Themed";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Members from "../screens/home/more/members/Members";
import MemberDetails from "../screens/home/more/members/MemberDetails";
import AddEditMember from "../screens/home/more/members/AddEditMember";
import * as React from "react";

const MembersStack = createNativeStackNavigator<MembersStackParamList>();

export default function MembersNavigator() {
  const textColor = useThemeColor({}, 'text');
  const headerColor = useThemeColor({}, 'header');

  return (
    <MembersStack.Navigator
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
      <MembersStack.Screen name="Members" component={Members} options={({ navigation }) => ({
        title: "Człowkowie organizacji",
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate("AddEditMember")}>
            <Ionicons name='add' size={36} style={{ color: textColor}}  />
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
          </TouchableOpacity>
        )
      })} />
      <MembersStack.Screen name="MemberDetails" component={MemberDetails} options={{
        title: "Szczegóły użytkownika",
      }} />
      <MembersStack.Screen name="AddEditMember" component={AddEditMember} options={({ navigation, route }) => ({
        title: route.params && route.params.member ? "Edytuj użytkownika" : "Nowy użytkownik",
      })} />

    </MembersStack.Navigator>
  );
}