import {Alert, BackHandler, ScrollView, StyleProp, StyleSheet, TextStyle, ActivityIndicator} from "react-native";
import {Text, TextInput, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {TouchableCard} from "../../components/Themed/TouchableCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {Event} from "../../store/events";
import {Rental} from "../../store/rentals";
import {displayDateTimePeriod} from "../../utilities/date";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import {enlistItems} from "../../utilities/enlist";
import {HomescreenStackScreenProps} from "../../types";
import React, {useCallback, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Member} from "../../store/members";
import {getLatestEvents} from "../../endpoints/events";
import {getLatestRentals} from "../../endpoints/rentals";
import {getMembersByIds} from "../../endpoints/members";
import {Item} from "../../store/items";
import {getFilteredItems} from "../../endpoints/items";

export default function Homescreen({ navigation, route }: HomescreenStackScreenProps<'Homescreen'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const [nearestEvents, setNearestEvents] = useState<Array<Event> | null>(null);
  const [nearestRentals, setNearestRentals] = useState<Rental[] | null>(null);
  const [rentalsItems, setRentalsItems] = useState<{[key: number]: Item[]}>({});

  const members: Member[] = useSelector((store: IRootState) => store.members.members);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'cardBackground');
  const tintColor = useThemeColor({}, "tint");

  const [textToSearch, setTextToSearch] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      async function getNearestEvents() {
        setNearestEvents(await getLatestEvents(demoMode));
      }
      async function getNearestLendings() {
        const latestRentals: Rental[] | null = await getLatestRentals(demoMode);
        setNearestRentals(latestRentals);
        let userIds: string[] = [];
        latestRentals !== null && latestRentals.forEach((lending) => {
          userIds.push(lending.userId);
        })
        userIds.length > 0 && await getMembersByIds(dispatch, userIds, demoMode);
      }
      getNearestEvents();
      getNearestLendings();
    }, [])
  );


  useFocusEffect(
    React.useCallback(() => {
      async function getRentalsItems() {
        if (!nearestRentals)
          return;

        for (const rental of nearestRentals) {
          const rentalItems: Item[] | null = await getFilteredItems(dispatch, undefined, undefined, undefined, rental.rentalId, demoMode);
          !!rentalItems && setRentalsItems((prevState) => ({
            ...prevState,
            [rental.rentalId]: rentalItems
          }))
        }
      }
      getRentalsItems();
    }, [nearestRentals])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Wyjście z aplikacji",
          "Czy chcesz opuścić aplikację?",
          [
            {
              text: "Nie",
              style: "cancel",
            },
            {
              text: "Tak",
              onPress: BackHandler.exitApp,
            }
          ]
        );
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  function showMoreEventsPressed() {
    console.log("show more events pressed");
    navigation.getParent()!.navigate("EventNavigator");
  }

  function showMoreLendingsPressed() {
    console.log("show more rentals pressed");
    navigation.getParent()!.navigate("LendingNavigator");
  }

  function searchShortcutPressed() {
    console.log(`search shortcut pressed. Searching for: "${textToSearch}"`);
    navigation.getParent()?.navigate("InventoryNavigator", {
      screen: 'Inventory',
      params: {searchPhrase: textToSearch},
    });
  }

  function barcodeShortcutPressed() {
    console.log("barcode shortcut pressed");
    navigation.navigate("BarcodeScanner");
  }

  return (
    <ScrollView style={{...styles.mainContainer, backgroundColor}}>
      <View key="searchbar" style={{...styles.searchBar, backgroundColor: cardColor}}>
        <TouchableCard
          style={[styles.searchBarButton, {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            paddingLeft: 2,
            backgroundColor: tintColor,
          }]
        }
          onPress={barcodeShortcutPressed}
        >
          <MaterialCommunityIcons name="barcode-scan" size={36} color={backgroundColor} />
        </TouchableCard>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Wyszukaj w inwentarzu..."
          value={textToSearch}
          onChangeText={setTextToSearch}
        />
        <TouchableCard
          style={[styles.searchBarButton, {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            paddingRight: 2,
            backgroundColor: tintColor,
          }]
          }
          onPress={searchShortcutPressed}
        >
          <FontAwesome name="search" size={32} color={backgroundColor} />
        </TouchableCard>
      </View>
      {/*<Card key="events" style={styles.menuCard}>*/}
      {/*  <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>*/}
      {/*  {*/}
      {/*    nearestEvents !== null ?*/}
      {/*      <>*/}
      {/*        <View style={styles.list}>*/}
      {/*        {nearestEvents.length > 0 ? nearestEvents.slice(0, 3).map((event: Event) => (*/}
      {/*            <View key={event.eventId} style={{backgroundColor: 'transparent', marginTop: 8}}>*/}
      {/*              <Text style={[boldedText, {textAlign: 'center'}]}>{event.name}</Text>*/}
      {/*              <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(event.startDate), new Date(event.endDate))}</Text>*/}
      {/*            </View>*/}
      {/*          )) :*/}
      {/*          <Text style={styles.noContentText}>Brak wydarzeń do wyświetlenia</Text>}*/}
      {/*      </View>*/}
      {/*      {nearestEvents.length > 3 && <OpacityButton onPress={showMoreEventsPressed} textStyle={{fontSize: 15}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}*/}
      {/*    </>*/}
      {/*    :*/}
      {/*    <View style={styles.spinnerView}>*/}
      {/*      <ActivityIndicator color={tintColor} size="large" />*/}
      {/*    </View>*/}
      {/*  }*/}
      {/*</Card>*/}
      <Card key="lendings" style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
        {
          nearestRentals !== null ?
          <>
            <View style={styles.list}>
              {nearestRentals.length > 0 ? nearestRentals.slice(0, 3).map((rental: Rental) => {
                const username: string | undefined = members.find((member) => member.id === rental.userId)?.username || undefined;
                return (<View key={rental.rentalId} style={{backgroundColor: 'transparent', marginTop: 8}}>
                    <Text style={[boldedText, {textAlign: 'center'}]}>{rental.name}</Text>
                    <Text style={{textAlign: 'center'}}>
                      {!!username ? (<Text>Użytkownik <Text style={boldedText}>{username}</Text> </Text>) : "Jeden z użytkowników "}
                      wypożyczył <Text
                      style={boldedText}>{enlistItems(rentalsItems[rental.rentalId]?.map(item => item.name))}</Text></Text>
                  {/*: <Text>ERROR</Text>*/}
                  {/*}*/}
                  <Text
                    style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(rental.startDate), new Date(rental.endDate))}</Text>
                  </View>
                  )
              }) :
                <Text style={styles.noContentText}>Brak wypożyczeń do wyświetlenia</Text>
              }
            </View>
            {nearestRentals.length > 3 && <OpacityButton onPress={showMoreLendingsPressed} textStyle={{fontSize: 15}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
          </>
          :
            <View style={styles.spinnerView}>
              <ActivityIndicator color={tintColor} size="large" />
            </View>
        }
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  searchBar: {
    flexDirection: 'row',
    borderRadius: 12,
    marginHorizontal: 10,
    margin: 15,
    elevation: 5,
  },
  searchBarButton: {
    height: 40,
    width: 55,
    borderRadius: 12,
  },
  searchBarInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  menuCard: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  shortcutContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  shortcut: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 1,
    marginVertical: 5,
  },
  list: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  showMoreButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 10,
  },
  barcodeScannerContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContentText: {
    padding: 10,
    fontStyle: 'italic',
  },
  spinnerView: {
    backgroundColor: 'transparent',
    padding: 20
  },
})