import {FlatList, StyleSheet} from "react-native";
import {Text, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {IoniconCard} from "../../components/Themed/IoniconCard";

type Event = {
  name: string,
  start_date: Date,
  end_date: Date,
}

const events: Event[] = [
  {
    name: "Annual Garage Band Competition",
    start_date: new Date(2022, 9, 2, 14),
    end_date: new Date(2022, 9, 2, 22),
  },
  {
    name: "Elka Country Music Festival",
    start_date: new Date(2022, 9, 8, 10),
    end_date: new Date(2022, 9, 11, 2),
  },
  {
    name: "Open Doors at Amplitron",
    start_date: new Date(2022, 8, 3),
    end_date: new Date(2022, 8, 3),
  },
]

export default function Homescreen() {
  return (
    <View style={styles.mainContainer}>
      <View style={{...styles.verticalContainer, flex: 3}}>
        <Card style={styles.menuCard}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>
          <FlatList
            style={styles.flatList}
            data={events}
            renderItem={(event) => {
              let startDate: string = event.item.start_date.toLocaleDateString()
              let endDate: string = event.item.end_date.toLocaleDateString()
              let startHour: string = event.item.start_date.toLocaleTimeString().slice(0, -3)
              let endHour: string = event.item.end_date.toLocaleTimeString().slice(0, -3)

              return (
                <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{event.item.name}</Text>
                  <Text style={{textAlign: 'center'}}>Początek: {startDate} {startHour}</Text>
                  <Text style={{textAlign: 'center'}}>Koniec: {endDate} {endHour}</Text>
                </View>
              )}}
          />
        </Card>
      </View>
      <View style={{...styles.verticalContainer, flex: 1}}>
        <IoniconCard
          iconName="barcode"
          iconSize={64}
          style={{
            marginVertical: 5,
          }}
        />
        <IoniconCard
          iconName="search"
          iconSize={48}
          style={{
            marginVertical: 5,
          }}
        />

        {/*<Card style={styles.shortcut}>*/}
        {/*  <TouchableOpacity onPress={() => console.log('pressed!')} style={{backgroundColor: 'transparent', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>*/}
        {/*    <Ionicons name="barcode" size={64} color={useThemeColor({}, 'text')} style={{backgroundColor: 'transparent'}} />*/}
        {/*  </TouchableOpacity>*/}
        {/*</Card>*/}


        {/*<Card style={styles.shortcut}>*/}
        {/*  <Ionicons name="search" size={48} color={useThemeColor({}, 'text')} />*/}
        {/*</Card>*/}
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
})