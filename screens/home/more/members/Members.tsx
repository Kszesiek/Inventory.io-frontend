import {ActivityIndicator, FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {MembersStackScreenProps} from "../../../../types";
import {Member} from "../../../../store/members";
import {useEffect, useState} from "react";
import {getAllMembers} from "../../../../endpoints/members";

export default function Members({ navigation, route }: MembersStackScreenProps<'Members'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const members: Array<Member> = useSelector((state: IRootState) => state.members.members)
  const [isDataLoaded, setIsDataLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getMembers() {
      setIsDataLoaded(await getAllMembers(dispatch, demoMode));
    }
    getMembers();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  if (isDataLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!isDataLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować członków organizacji.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1}}
    data={members.slice(0, 20)}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak członków organizacji do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać członka, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={({item}: {item: Member}) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("MemberDetails", { member: item })}>
          <Text style={boldedText}>{item.username}</Text>
          <Text style={{textAlign: 'center'}}>{item.name} {item.surname}</Text>
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