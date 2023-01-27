import {ActivityIndicator, FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {Rental} from "../../../store/rentals";
import {displayDateTimePeriod} from "../../../utilities/date";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {enlistItems} from "../../../utilities/enlist";
import {RentalStackScreenProps} from "../../../types";
import {Member} from "../../../store/members";
import React, {useEffect, useState} from "react";
import {getAllRentals} from "../../../endpoints/rentals";
import {getMembersByIds} from "../../../endpoints/members";
import {useFocusEffect} from "@react-navigation/native";
import {Item} from "../../../store/items";
import {getFilteredItems} from "../../../endpoints/items";

export default function Rentals({ navigation, route }: RentalStackScreenProps<'Rentals'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const rentals: Array<Rental> = useSelector((state: IRootState) => state.rentals.rentals);
  const members: Member[] = useSelector((state: IRootState) => state.members.members);
  const [areRentalsLoaded, setAreRentalsLoaded] = useState<boolean | undefined>(undefined);
  const [areUsersLoaded, setAreUsersLoaded] = useState<boolean | undefined>(undefined);

  const [rentalItems, setRentalItems] = useState<{[key: number]: Item[]}>({});

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useFocusEffect(React.useCallback(() => {
    async function getLendings() {
      setAreRentalsLoaded(await getAllRentals(dispatch, demoMode));
    }
    async function getUsersByIds() {
      const userIds: string[] = [...new Set(rentals.map((lending) => lending.userId))];
      setAreUsersLoaded(await getMembersByIds(dispatch, userIds, demoMode));
    }
    getLendings().then(getUsersByIds);
  }, []));

  useEffect(() => {
    async function getRentalItems() {
      for (const rental of rentals) {
        const items = await getFilteredItems(dispatch, undefined, undefined, undefined, rental.rentalId, demoMode);
        setRentalItems((prevState) => ({
          ...prevState,
          [rental.rentalId]: items || [],
        }))
      }
    }
    getRentalItems();
  }, [rentals]);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  if (areRentalsLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serwera...</Text>
    </View>
  }

  if (!areRentalsLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować wypożyczeń.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1}}
    data={rentals}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak wypożyczeń do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać wypożyczenie, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={({item}) => {
      const rental: Rental = item;
      const items: Item[] | undefined = rentalItems[rental.rentalId];
      const itemsListed: string = !items ? "" :
        enlistItems(items.map(item => item.name));
      const username: string | undefined = members.find((member) => member.id === rental.userId)?.username;

      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("RentalDetails", {rentalId: rental.rentalId})}>
          <Text style={boldedText}>{rental.name}</Text>
          <Text style={{textAlign: 'center'}}>{areUsersLoaded ? (
            <Text>Użytkownik <Text style={boldedText}>{username}</Text> </Text>) : "Jeden z użytkowników "}wypożyczył <Text style={boldedText}>{itemsListed}</Text></Text>
            <Text style={styles.dateLabel}>{displayDateTimePeriod(new Date(rental.startDate), new Date(rental.endDate))}</Text>
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