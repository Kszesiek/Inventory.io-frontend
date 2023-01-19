import {ActivityIndicator, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {isLendingForEvent, isLendingPrivate, LendingForEvent, LendingPrivate} from "../../../store/lendings";
import {displayDateTimePeriod} from "../../../utilities/date";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {enlistItems} from "../../../utilities/enlist";
import {LendingStackScreenProps} from "../../../types";
import {Member} from "../../../store/members";
import {useEffect, useState} from "react";
import {getAllLendings} from "../../../endpoints/lendings";
import {getAllMembers} from "../../../endpoints/members";

export default function Lendings({ navigation, route }: LendingStackScreenProps<'Lendings'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const lendings: Array<LendingForEvent | LendingPrivate> = useSelector((state: IRootState) => state.lendings.lendings)
  const members: Member[] = useSelector((state: IRootState) => state.members.members)
  const [areLendingsLoaded, setAreLendingsLoaded] = useState<boolean | undefined>(undefined);
  const [areUsersLoaded, setAreUsersLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getLendings() {
      setAreLendingsLoaded(await getAllLendings(dispatch, demoMode));
    }
    async function getUsers() {
      setAreUsersLoaded(await getAllMembers(dispatch, demoMode))
    }
    getLendings();
    if (members.length === 0)
      getUsers();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  if (areLendingsLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!areLendingsLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować wypożyczeń.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1}}
    data={lendings.slice(0, 20)}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak wypożyczeń do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać wypożyczenie, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={(renderItem: ListRenderItemInfo<LendingForEvent | LendingPrivate>) => {
      const lending: LendingForEvent | LendingPrivate = renderItem.item;
      const itemsListed: string = enlistItems(lending.items.map(item => item.name));
      const username = isLendingPrivate(lending) ? members.find((member) =>
        member.id === lending.userId)?.username : undefined;

      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("LendingDetails", { lending: lending })}>
            {isLendingForEvent(lending) ?
              <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemsListed}</Text> na wydarzenie <Text style={boldedText}>{lending.eventName}</Text></Text>
            : isLendingPrivate(lending) ?
                <Text style={{textAlign: 'center'}}>{areUsersLoaded ? (<Text>Użytkownik <Text style={boldedText}>{username}</Text></Text>) : "Jeden z użytkowników"} wypożyczył <Text style={boldedText}>{itemsListed}</Text></Text>
            : <Text>ERROR</Text>
            }
            <Text style={styles.dateLabel}>{displayDateTimePeriod(new Date(lending.startDate), new Date(lending.endDate))}</Text>
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
  menuCard: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 7,
  },
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
  dateLabel: {
    textAlign: 'center',
    marginTop: 5,
  },
})