import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {MembersStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import * as React from "react";
import {Member} from "../../../../store/members";
import {IRootState} from "../../../../store/store";
import {removeMember} from "../../../../endpoints/members";

export default function MemberDetails({ navigation, route }: MembersStackScreenProps<'MemberDetails'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const textColor = useThemeColor({}, 'text');
  const deleteColor = useThemeColor({}, "delete");
  const backgroundColor = useThemeColor({}, "background");
  const members: Member[] = useSelector((state: IRootState) => state.members.members);
  const member: Member | undefined = members.find((member) => member.id === route.params.memberId);

  // useEffect(() => {
  //   async function fetchMember() {
  //     await getMember(route.params.memberId, demoMode);
  //     setIsMemberLoaded(true);
  //   }
  //   fetchMember();
  // }, []);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: !!member ? () => (
  //       <TouchableOpacity onPress={() => navigation.navigate("AddEditMember", {memberId: route.params.memberId})}>
  //         <Feather name='edit' size={24} style={{color: textColor}}/>
  //       </TouchableOpacity>
  //     ) : undefined,
  //   })
  // }, [member])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: textColor,
  }

  async function deletePressed() {
    console.log("delete button pressed");
    const response: boolean = await removeMember(route.params.memberId);
    if (response)
      navigation.goBack();
  }

  function editPressed() {
    navigation.navigate("AddEditMember", {memberId: route.params.memberId});
  }

  // if (!isMemberLoaded) {
  //   return <View style={styles.loadingView}>
  //     <ActivityIndicator color={tintColor} size="large" />
  //     <Text style={styles.loadingText}>Wczytywanie danych z serwera...</Text>
  //   </View>
  // }

  if (!member) {
    return <View style={styles.loadingView}>
      <Text style={styles.loadingText}>Błąd połączenia z serwerem.</Text>
    </View>
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa użytkownika">
        <Text style={[styles.text, property]}>{member.username}</Text>
      </Detail>
      <Detail name="Imię i nazwisko">
        <Text style={[styles.text, property]}>{member.name} {member.surname}</Text>
      </Detail>
      <Detail name="Adres e-mail">
        <Text style={[styles.text, property]}>{member.email}</Text>
      </Detail>
      <Detail name="ID użytkownika">
        <Text style={[styles.text, property]}>{member.id}</Text>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: deleteColor}]} onPress={deletePressed}>Usuń</OpacityButton>
        {/*<OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>*/}
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
  },
})