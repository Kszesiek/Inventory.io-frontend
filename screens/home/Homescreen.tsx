import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {IoniconCard} from "../../components/Themed/IoniconCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {useSelector} from "react-redux";
import {store} from "../../store/store";
import {Event} from "../../store/events";
import {Item} from "../../store/items";
import {User} from "../../store/users";
import {LendingForEvent, LendingPrivate} from "../../store/lendings";
import {displayDateTimePeriod} from "../../utilities/date";

export default function Homescreen() {
  const events: Map<string, Event> = useSelector((state: typeof store.dispatch.prototype) => state.events.events)
  const items: Map<string, Item> = useSelector((state: typeof store.dispatch.prototype) => state.items.items)
  const users: Map<string, User> = useSelector((state: typeof store.dispatch.prototype) => state.users.users)
  const lendings: Map<string, LendingForEvent | LendingPrivate> = useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings)

  const boldedText: StyleProp<TextStyle> = {
    fontWeight: 'bold',
    color: useThemeColor({}, "tint"),
  }

  function showMoreEventsPressed() {
    console.log("show more events pressed");
  }

  function showMoreLendingsPressed() {
    console.log("show more lendings pressed");
  }

  function searchShortcutPressed() {
    console.log("search shortcut pressed");
  }

  function barcodeShortcutPressed() {
    console.log("barcode shortcut pressed");
  }

  function settingsShortcutPressed() {
    console.log("settings shortcut pressed");
  }

  return (
      <View style={styles.mainContainer}>
        <View style={{...styles.verticalContainer, flex: 4}}>
          <Card style={styles.menuCard}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>
            <FlatList
              style={styles.flatList}
              data={Array.from(events.values())}
              renderItem={(event) => {
                return (
                  <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                    <Text style={[boldedText, {textAlign: 'center'}]}>{event.item.name}</Text>
                    <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(event.item.startDate, event.item.endDate)}</Text>
                  </View>
                )}}
            />
            <OpacityButton onPress={showMoreEventsPressed} textProps={{style: {fontSize: 16}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>
          </Card>
          <Card style={styles.menuCard}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
            <FlatList
              style={styles.flatList}
              data={Array.from(lendings.values())}  // .slice(0, 3)
              renderItem={(lending: ListRenderItemInfo<LendingForEvent | LendingPrivate>) => {
                let username: string | undefined
                let eventName: string | undefined

                if (lending.item instanceof LendingForEvent) {
                  const event = events.get(lending.item.eventId) ?? { name: undefined, startDate: undefined, endDate: undefined};
                  eventName = event.name;
                  lending.item.startDate = event.startDate;
                  lending.item.endDate = event.endDate;
                }

                if (lending.item instanceof LendingPrivate) {
                  username = users.get(lending.item.userId)?.username ?? 'undefined';
                }

                const itemName: string = items.get(lending.item.itemId)?.name ?? 'undefined';

                console.log(displayDateTimePeriod(lending.item.startDate!, lending.item.endDate!));

                return (
                  <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                    {username ?
                      <Text style={{textAlign: 'center'}}>Użytkownik <Text style={boldedText}>{username}</Text> wypożyczył <Text style={boldedText}>{itemName}</Text></Text>
                      :
                      <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemName}</Text> na wydarzenie <Text style={boldedText}>{eventName}</Text></Text>
                    }
                    <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(lending.item.startDate, lending.item.endDate)}</Text>
                  </View>
                )}} />
            <OpacityButton onPress={showMoreLendingsPressed} textProps={{style: {fontSize: 16}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>
          </Card>
        </View>
        <View style={{...styles.verticalContainer, flex: 1}}>
          <IoniconCard
            iconName="barcode"
            iconSize={50}
            style={{
              marginVertical: 5,
              paddingLeft: 4,
            }}
            onPress={barcodeShortcutPressed}
          />
          <IoniconCard
            iconName="search"
            iconSize={40}
            style={{
              marginVertical: 5,
            }}
            onPress={searchShortcutPressed}
          />
          <IoniconCard
            iconName="construct"
            iconSize={40}
            style={{
              marginVertical: 5,
            }}
            onPress={settingsShortcutPressed}
          />
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  verticalContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  menuCard: {
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,

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
  flatList: {
    width: '100%',
    padding: 5
  },
  showMoreButton: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
})