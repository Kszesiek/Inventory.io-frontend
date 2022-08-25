import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {IoniconCard} from "../../components/Themed/IoniconCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";

type User = {
  userId: string,
  username: string,
  name: string,
  surname: string,
}

const users: User[] = [
  {
    userId: "eed0be02-f83e-46c8-a4aa-2dcae02dc12f",
    username: "itsmejohndoe",
    name: "John",
    surname: "Doe",
  },
  {
    userId: "b517ed77-5ce5-4457-ba1e-b8a1fba4d376",
    username: "JustClarence",
    name: "Clarence",
    surname: "Walter",
  },
  {
    userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
    username: "YourGuyRoy",
    name: "Roy",
    surname: "Whitings",
  },
  {
    userId: "7f7feb57-d63d-4fc4-b60c-8281c5c8109c",
    username: "TheRealGlobetrotterGrover",
    name: "Grover",
    surname: "Globetrotter",
  },
]

type Event = {
  eventId: string,
  name: string,
  startDate: Date,
  endDate: Date,
}

type Lending = {
  lendingId: string,
  itemId: string,
  startDate?: Date,
  endDate?: Date,
}

type LendingForEvent = Lending & {
  eventId: string,
}

type LendingPrivate = Lending & {
  userId: string
  startDate: Date,
  endDate: Date,
}

type Item = {
  itemId: string,
  name: string,
}

const items: Item[] = [
  {
    itemId: "90f9f31a-ae21-49be-9ea9-74366f722c1f",
    name: "shelf",
  },
  {
    itemId: "b60f7689-8251-4a06-aae9-984c1cf78e01",
    name: "widower",
  },
  {
    itemId: "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
    name: "metal",
  },
  {
    itemId: "c1544eea-b3a0-4680-ad62-4778fc3c1893",
    name: "stand",
  },
]

const events: Event[] = [
  {
    eventId: "a2b114f3-0b2c-4fb3-98a8-762d87c161ee",
    name: "Annual Garage Band Competition",
    startDate: new Date(2022, 9, 2, 14),
    endDate: new Date(2022, 9, 2, 22),
  },
  {
    eventId: "e97982f8-7dd1-49cb-b207-60957aadb7d3",
    name: "Elka Country Music Festival",
    startDate: new Date(2022, 9, 8, 10),
    endDate: new Date(2022, 9, 11, 2),
  },
  {
    eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
    name: "Open Doors at Amplitron",
    startDate: new Date(2022, 8, 3),
    endDate: new Date(2022, 8, 3),
  },
]

const lendings: Array<LendingPrivate | LendingForEvent> = [
  {
    lendingId: "c1544eea-b3a0-4680-ad62-4778fc3c1893",
    itemId: "90f9f31a-ae21-49be-9ea9-74366f722c1f",
    eventId: "5e509adc-dd63-4312-9db8-e4c02f5a4bbb",
  },
  {
    lendingId: "65c50cf0-390a-484f-9c3a-efb073a50dfc",
    itemId: "6158bfc4-a8b2-4eae-9320-c2a77474fb2c",
    userId: "f141ec5f-3d2b-4e71-a4ba-1a72f872c4ab",
    startDate: new Date(2022, 8, 31, 20),
    endDate: new Date(2022, 9, 1, 10),
  },
]

export default function Homescreen() {
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
              data={events}
              renderItem={(event) => {
                let startDate: string = event.item.startDate.toLocaleDateString()
                let endDate: string = event.item.endDate.toLocaleDateString()
                let startHour: string = event.item.startDate.toLocaleTimeString().slice(0, -3)
                let endHour: string = event.item.endDate.toLocaleTimeString().slice(0, -3)

                return (
                  <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                    <Text style={{fontWeight: 'bold', textAlign: 'center', fontSize: 15}}>{event.item.name}</Text>
                    <Text style={{textAlign: 'center'}}>Początek: {startDate} {startHour}</Text>
                    <Text style={{textAlign: 'center'}}>Koniec: {endDate} {endHour}</Text>
                  </View>
                )}}
            />
            <OpacityButton onPress={showMoreEventsPressed} textProps={{style: {fontSize: 16}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>
          </Card>
          <Card style={styles.menuCard}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
            <FlatList
              style={styles.flatList}
              data={lendings}
              renderItem={(lending) => {
                let username: string | undefined
                let eventName: string | undefined

                if ("eventId" in lending.item) {
                  const eventId = lending.item.eventId;
                  const event: Event = events.find(event => event.eventId === eventId)!;
                  lending.item.startDate = event.startDate;
                  lending.item.endDate = event.endDate;
                  eventName = event.name;
                }

                const startDate: string = lending.item.startDate!.toLocaleDateString();
                const endDate: string = lending.item.endDate!.toLocaleDateString();
                const startHour: string = lending.item.startDate!.toLocaleTimeString().slice(0, -3);
                const endHour: string = lending.item.endDate!.toLocaleTimeString().slice(0, -3);

                const itemName: string = items.find(item => item.itemId === lending.item.itemId)!.name;
                if ("userId" in lending.item) {
                  const userId = lending.item.userId;
                  username = users.find(user => user.userId === userId)!.username;
                }

                return (
                  <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                    {username ?
                      <Text style={{textAlign: 'center'}}>Użytkownik <Text style={boldedText}>{username}</Text> wypożyczył <Text style={boldedText}>{itemName}</Text></Text>
                      :
                      <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemName}</Text> na wydarzenie <Text style={boldedText}>{eventName}</Text></Text>
                    }
                    <Text style={{textAlign: 'center'}}>Początek: {startDate} {startHour}</Text>
                    <Text style={{textAlign: 'center'}}>Koniec: {endDate} {endHour}</Text>
                  </View>
                )}}></FlatList>
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