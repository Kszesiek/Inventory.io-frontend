import {Alert, BackHandler, ScrollView, StyleProp, StyleSheet, TextStyle, ActivityIndicator} from "react-native";
import {Text, TextInput, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {TouchableCard} from "../../components/Themed/TouchableCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {Event} from "../../store/events";
import {isLendingForEvent, isLendingPrivate, LendingForEvent, LendingPrivate} from "../../store/lendings";
import {displayDateTimePeriod} from "../../utilities/date";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import {enlistItems} from "../../utilities/enlist";
import {HomescreenStackScreenProps} from "../../types";
import {useCallback, useEffect, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";

import {Member} from "../../store/members";
import {getLatestEvents} from "../../endpoints/events";
import {getLatestLendings} from "../../endpoints/lendings";

export default function Homescreen({ navigation, route }: HomescreenStackScreenProps<'Homescreen'>) {
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const [nearestEvents, setNearestEvents] = useState<Array<Event> | null>(null);
  const [nearestLendings, setNearestLendings] = useState<Array<LendingForEvent | LendingPrivate> | null>(null);

  const members: Member[] = useSelector((store: IRootState) => store.members.members);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, "tint");

  const [textToSearch, setTextToSearch] = useState<string>('');

  useEffect(() => {
    async function getNearestEvents() {
      setNearestEvents(await getLatestEvents(demoMode));
    }
    async function getNearestLendings() {
      setNearestLendings(await getLatestLendings(demoMode));
    }
    getNearestEvents();
    getNearestLendings();
  }, [])

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
    console.log("show more lendings pressed");
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
      <View key="searchbar" style={{...styles.searchBar, backgroundColor: useThemeColor({}, 'cardBackground')}}>
        <TouchableCard
          style={[styles.searchBarButton, {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            paddingLeft: 2,
            backgroundColor: useThemeColor({}, 'tint'),
          }]
        }
          onPress={barcodeShortcutPressed}
        >
          <MaterialCommunityIcons name="barcode-scan" size={36} color={useThemeColor({}, 'background')} />
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
            backgroundColor: useThemeColor({}, 'tint'),
          }]
          }
          onPress={searchShortcutPressed}
        >
          <FontAwesome name="search" size={32} color={useThemeColor({}, 'background')} />
        </TouchableCard>
      </View>
      <Card key="events" style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>
        {
          nearestEvents !== null ?
            <>
              <View style={styles.list}>
              {nearestEvents.length > 0 ? nearestEvents.slice(0, 3).map((event: Event) => (
                  <View key={event.eventId} style={{backgroundColor: 'transparent', marginTop: 8}}>
                    <Text style={[boldedText, {textAlign: 'center'}]}>{event.name}</Text>
                    <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(event.startDate), new Date(event.endDate))}</Text>
                  </View>
                )) :
                <Text style={styles.noContentText}>Brak wydarzeń do wyświetlenia</Text>}
            </View>
            {nearestEvents.length > 3 && <OpacityButton onPress={showMoreEventsPressed} textStyle={{fontSize: 15}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
          </>
          :
          <View style={styles.spinnerView}>
            <ActivityIndicator color={tintColor} size="large" />
          </View>
        }
      </Card>
      <Card key="lendings" style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
        {
          nearestLendings !== null ?
          <>
            <View style={styles.list}>
              {nearestLendings.length > 0 ? nearestLendings.slice(0, 3).map((lending: LendingForEvent | LendingPrivate) => {
                const itemsListed: string = enlistItems(lending.items.map(item => item.name));
                const username: string | undefined = isLendingPrivate(lending) ? members.find((member) => member.id === lending.userId)?.username || undefined : undefined;
                return (<View key={lending.lendingId} style={{backgroundColor: 'transparent', marginTop: 8}}>
                  {isLendingForEvent(lending) ?
                    <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemsListed}</Text> na
                    wydarzenie <Text style={boldedText}>{lending.eventName}</Text></Text>
                  : isLendingPrivate(lending) ?
                    <Text style={{textAlign: 'center'}}>Użytkownik <Text
                      style={boldedText}>{username}</Text> wypożyczył <Text
                      style={boldedText}>{itemsListed}</Text></Text>
                  : <Text>ERROR</Text>
                  }
                  <Text
                    style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(lending.startDate), new Date(lending.endDate))}</Text>
                  </View>
                  )
              }) :
                <Text style={styles.noContentText}>Brak wypożyczeń do wyświetlenia</Text>
              }
            </View>
            {nearestLendings.length > 3 && <OpacityButton onPress={showMoreLendingsPressed} textStyle={{fontSize: 15}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
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
  }
})