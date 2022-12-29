import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {MembersStackScreenProps} from "../../../../types";
import {Member} from "../../../../store/members";

export default function Members({ navigation, route }: MembersStackScreenProps<'Members'>) {
  const members: Array<Member> = useSelector((state: IRootState) => state.members.members)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
    contentContainerStyle={{flexGrow: 1}}
    data={members.slice(0, 20)}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak członków organizacji do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać członka, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={(member: ListRenderItemInfo<Member>) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("MemberDetails", { memberId: member.item.id })}>
          <Text style={boldedText}>{member.item.username}</Text>
          <Text style={{textAlign: 'center'}}>{member.item.name} {member.item.surname}</Text>
        </TouchableCard>
      )
    }}
  />
}

const styles = StyleSheet.create({
  noContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
})