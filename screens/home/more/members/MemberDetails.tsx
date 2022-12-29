import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ScrollView, StyleProp, StyleSheet, TextStyle, TouchableOpacity} from "react-native";
import {MembersStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {useEffect} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {Member, membersActions} from "../../../../store/members";

export default function MemberDetails({ navigation, route }: MembersStackScreenProps<'MemberDetails'>) {
  const dispatch = useDispatch();
  const textColor = useThemeColor({}, 'text');
  const member: Member = useSelector((state: IRootState) =>
    state.members.members.find((item: Member) => item.id === route.params.memberId)!)

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!member ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditMember", {member: member})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [member])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: useThemeColor({}, "text"),
  }

  const backgroundColor = useThemeColor({}, "background");

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Members");
    await dispatch(membersActions.removeMember(member.id));
  }

  function editPressed() {
    navigation.navigate("AddEditMember", {member: member});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa użytkownika">
        <Text style={[styles.text, property]}>{member.username}</Text>
      </Detail>
      <Detail name="Imię i nazwisko">
        <Text style={[styles.text, property]}>{member.name} {member.surname}</Text>
      </Detail>
      <Detail name="ID użytkownika">
        <Text style={[styles.text, property]}>{member.id}</Text>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]} onPress={deletePressed}>Usuń</OpacityButton>
        <OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  mainCard: {
    margin: 15,
    padding: 10,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // elevation: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  editButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  text: {
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
})