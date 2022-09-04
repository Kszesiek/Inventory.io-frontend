import {FlatList, ListRenderItemInfo, ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, TextInput, useThemeColor, View} from "../../components/Themed";
import Card from "../../components/Themed/Card";
import {TouchableCard} from "../../components/Themed/TouchableCard";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {useSelector} from "react-redux";
import {store} from "../../store/store";
import {Event} from "../../store/events";
import {LendingForEvent, LendingPrivate} from "../../store/lendings";
import {displayDateTimePeriod} from "../../utilities/date";
import {FontAwesome, MaterialCommunityIcons} from "@expo/vector-icons";
import enlistItems from "../../utilities/enlist";
import {HomeTabScreenProps} from "../../types";

export default function Homescreen({ navigation, route }: HomeTabScreenProps<'Homescreen'>) {
  const events: Map<string, Event> = useSelector((state: typeof store.dispatch.prototype) => state.events.events)
  const lendings: Map<string, LendingForEvent | LendingPrivate> = useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings)

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
      <View style={{...styles.searchBar, backgroundColor: useThemeColor({}, 'cardBackground')}}>
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
      <Card style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Nadchodzące wydarzenia</Text>
        <FlatList
          style={styles.flatList}
          data={Array.from(events.values()).slice(0, 3)}
          renderItem={(event) => {
            return (
              <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                <Text style={[boldedText, {textAlign: 'center'}]}>{event.item.name}</Text>
                <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(event.item.startDate, event.item.endDate)}</Text>
              </View>
            )}}
        />

        <View style={styles.showMoreContainer}>
          {events.size > 3 && <OpacityButton onPress={showMoreEventsPressed} textProps={{style: {fontSize: 15}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
        </View>
      </Card>
      <Card style={styles.menuCard}>
        <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Ostatnie wypożyczenia</Text>
        <FlatList
          style={styles.flatList}
          data={Array.from(lendings.values()).slice(0, 3)}
          renderItem={(lending: ListRenderItemInfo<LendingForEvent | LendingPrivate>) => {
            const itemsListed = enlistItems(lending.item.itemNames);

            return (
              <View style={{backgroundColor: 'transparent', marginTop: 8}}>
                {lending.item instanceof LendingForEvent ?
                  <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemsListed}</Text> na wydarzenie <Text style={boldedText}>{lending.item.eventName}</Text></Text>
                  :
                  <Text style={{textAlign: 'center'}}>Użytkownik <Text style={boldedText}>{lending.item.username}</Text> wypożyczył <Text style={boldedText}>{itemsListed}</Text></Text>
                }
                <Text style={{textAlign: 'center'}}>{displayDateTimePeriod(lending.item.startDate, lending.item.endDate)}</Text>
              </View>
            )}} />
        <View style={styles.showMoreContainer}>
          {lendings.size > 3 && <OpacityButton onPress={showMoreLendingsPressed} textProps={{style: {fontSize: 15}}} style={styles.showMoreButton}>Pokaż więcej</OpacityButton>}
        </View>
      </Card>
      {/*<View style={{flex: 1}}/>*/}
      {/*<View style={styles.barcodeScannerContainer}>*/}
        {/*<OpacityButton textProps={{style: {fontSize: 18}}} onPress={() => {}}>*/}
        {/*  Skanuj kod kreskowy*/}
        {/*</OpacityButton>*/}
      {/*</View>*/}
    </ScrollView>
    // <IconCard
    //   style={{
    //     height: 70,
    //     width: 80,
    //     backgroundColor: useThemeColor({}, 'tint'),
    //     position: 'absolute',
    //     bottom: 20,
    //     right: 15,
    //   }}
    //   onPress={barcodeShortcutPressed}
    // >
    //   <MaterialCommunityIcons name="barcode-scan" size={50} color={useThemeColor({}, 'background')} />
    // </IconCard>
    // <View style={styles.mainContainer}>
    //   <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
    //   {/*<IconCard*/}
    //   {/*  iconName="search"*/}
    //   {/*  iconSize={40}*/}
    //   {/*  style={{*/}
    //   {/*    marginVertical: 5,*/}
    //   {/*  }}*/}
    //   {/*  onPress={searchShortcutPressed}*/}
    //   {/*/>*/}
    //   {/*<IconCard*/}
    //   {/*  iconName="construct"*/}
    //   {/*  iconSize={40}*/}
    //   {/*  style={{*/}
    //   {/*    marginVertical: 5,*/}
    //   {/*  }}*/}
    //   {/*  onPress={settingsShortcutPressed}*/}
    //   {/*/>*/}
    // </View>
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
  flatList: {
    width: '100%',
    padding: 5
  },
  showMoreButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  showMoreContainer: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  barcodeScannerContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})