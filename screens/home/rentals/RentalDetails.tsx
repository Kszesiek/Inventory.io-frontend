import {rentalsActions, Rental} from "../../../store/rentals";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {displayDateTimePeriod} from "../../../utilities/date";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {ScrollView, StyleProp, StyleSheet, TextStyle, TouchableOpacity} from "react-native";
import {RentalStackScreenProps} from "../../../types";
import Detail from "../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {IRootState} from "../../../store/store";
import {Member} from "../../../store/members";
import {getMember} from "../../../endpoints/members";
import {Item} from "../../../store/items";
import {getFilteredItems} from "../../../endpoints/items";
import {Modalize} from "react-native-modalize";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {useFocusEffect} from "@react-navigation/native";

export default function RentalDetails({ navigation, route }: RentalStackScreenProps<'RentalDetails'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const deleteColor = useThemeColor({}, "delete")
  const backgroundColor = useThemeColor({}, "background");

  const rentals: Rental[] = useSelector((state: IRootState) => state.rentals.rentals);
  const rental: Rental | undefined = rentals.find((rental) => rental.rentalId === route.params.rentalId);
  const members: Member[] = useSelector((state: IRootState) => state.members.members);
  const username: string | undefined = members.find((user) => user.id === rental?.userId)?.username;
  const [rentalItems, setRentalItems] = useState<Item[]>([]);

  const user: Member | undefined = members.find(item_ => item_.id === rental?.userId);
  const [isUserLoaded, setIsUserLoaded] = useState<boolean | undefined>(user === undefined ? undefined : true);

  useFocusEffect(
    React.useCallback(() => {
    async function getRentalUser() {
      if (!rental)
        return;
      setIsUserLoaded(!!(await getMember(rental.userId, demoMode)));
    }
    async function getRentalItems() {
      if (!rental)
        return;
      setRentalItems(await getFilteredItems(dispatch, undefined, undefined, undefined, rental?.rentalId, demoMode) || []);
    }

    getRentalUser();
    getRentalItems();
  }, [rental]));

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!rental ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditRental", {rentalId: rental.rentalId})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [rental])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: textColor,
  }

  async function deletePressed() {
    console.log("delete button pressed");
    await dispatch(rentalsActions.removeRental(route.params.rentalId));
    navigation.goBack();
  }

  function editPressed() {
    navigation.navigate("AddEditRental", {rentalId: route.params.rentalId});
  }

  if (!rental) {
    return <View style={styles.replacementView}>
      <Text style={styles.replacementText}>Błąd połączenia z serwerem.</Text>
    </View>
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa">
        <Text style={[styles.text, property]}>{rental.name}</Text>
      </Detail>
      <Detail name="Użytkownik">
        <Text style={[styles.text, property]}>{isUserLoaded ? username : <Text style={{fontStyle: 'italic'}}>wczytywanie danych...</Text>}</Text>
      </Detail>
      <Detail name="Termin">
        <Text style={[styles.text, property]}>{displayDateTimePeriod(new Date(rental.startDate), new Date(rental.endDate))}</Text>
      </Detail>
      <Detail name="Opis">
        <Text style={[styles.text, property]}>{rental.description}</Text>
      </Detail>
      <Detail name="Przedmioty">
        {/*<Text style={{fontStyle: 'italic'}}>Not yet implemented</Text>*/}
        {rentalItems.length > 0 ? Array.from(rentalItems).map((item: {itemId: string, name: string}, index) => (
          <Text key={index} style={styles.text}><Text style={styles.ordinalNumber}>{index + 1}.</Text> {item.name}</Text>
        )) : <Text style={styles.replacementText}>Brak przedmiotów przypisanych do tego wypożyczenia.</Text>}
        <TouchableCard style={[styles.openModalButton, {backgroundColor: tintColor}]} onPress={() => navigation.navigate("AddItemsToRental", {rentalId: route.params.rentalId})}>
          <Text style={{textAlign: 'center'}} numberOfLines={1}>Zmień przypsane przedmioty</Text>
        </TouchableCard>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: deleteColor}]} onPress={deletePressed}>Usuń</OpacityButton>
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
  ordinalNumber: {
    fontSize: 12,
  },
  replacementView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replacementText: {
    fontStyle: 'italic',
  },

  openModalButton: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
})