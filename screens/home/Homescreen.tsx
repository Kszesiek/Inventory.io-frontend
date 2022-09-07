import {ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, TextInput, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {TouchableCard} from "../../components/Themed/TouchableCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {useSelector} from "react-redux";
import {store} from "../../store/store";
import {Event} from "../../store/events";
import {isLendingForEvent, isLendingPrivate, LendingForEvent, LendingPrivate} from "../../store/lendings";
import {displayDateTimePeriod} from "../../utilities/date";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import enlistItems from "../../utilities/enlist";
import {HomeTabScreenProps} from "../../types";

export default function Homescreen({ navigation, route }: HomeTabScreenProps<'Homescreen'>) {
  const events: Array<Event> = useSelector((state: typeof store.dispatch.prototype) => state.events.events)
  const lendings: Array<LendingForEvent | LendingPrivate> = useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  function showMoreEventsPressed() {
    console.log("show more events pressed");
    navigation.navigate("Events");
  }

  function showMoreLendingsPressed() {
    console.log("show more lendings pressed");
    navigation.navigate("LendingsNavigator");
  }

  function searchShortcutPressed() {
    console.log("search shortcut pressed");
  }

  function barcodeShortcutPressed() {
    console.log("barcode shortcut pressed");
  }

  return (
    <ScrollView style={{...styles.mainContainer, backgroundColor: useThemeColor({}, 'background')}}>
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
          <MaterialCommunityIcons name="barcode-scan" size={35} color={useThemeColor({}, 'background')} />
        </TouchableCard>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Wyszukaj w inwentarzu..."
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
          <FontAwesome name="search" size={30} color={useThemeColor({}, 'background')} />
        </TouchableCard>
      </View>
      <Card key="events" style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>
        <View style={styles.list}>
        { events.slice(0, 3).map((event: Event) => (
            <View key={event.eventId} style={{backgroundColor: 'transparent', marginTop: 8}}>
              <Text style={[boldedText, {textAlign: 'center'}]}>{event.name}</Text>
              <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(event.startDate), new Date(event.endDate))}</Text>
            </View>
          ))}
        </View>
        {events.length > 3 && <OpacityButton onPress={showMoreEventsPressed} textProps={{style: {fontSize: 15}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
      </Card>
      <Card key="lendings" style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
        <View style={styles.list}>
          {lendings.slice(0, 3).map((lending: LendingForEvent | LendingPrivate) => {
            const itemsListed: string = enlistItems(lending.itemNames);

            return (<View key={lending.lendingId} style={{backgroundColor: 'transparent', marginTop: 8}}>
              {isLendingForEvent(lending) ?
                <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemsListed}</Text> na
                wydarzenie <Text style={boldedText}>{lending.eventName}</Text></Text>
              : isLendingPrivate(lending) ?
                <Text style={{textAlign: 'center'}}>Użytkownik <Text
                  style={boldedText}>{lending.username}</Text> wypożyczył <Text
                  style={boldedText}>{itemsListed}</Text></Text>
              : <Text>ERROR</Text>
              }
              <Text
                style={{textAlign: 'center'}}>{displayDateTimePeriod(new Date(lending.startDate), new Date(lending.endDate))}</Text>
            </View>
            )
          })}
        </View>
        {lendings.length > 3 && <OpacityButton onPress={showMoreLendingsPressed} textProps={{style: {fontSize: 15}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: 10,
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
})