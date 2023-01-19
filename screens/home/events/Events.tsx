import {ActivityIndicator, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Event} from "../../../store/events";

import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {displayDateTimePeriod} from "../../../utilities/date";
import {EventStackScreenProps} from "../../../types";
import {useEffect, useState} from "react";
import {getAllEvents} from "../../../endpoints/events";

export default function Events({ navigation, route }: EventStackScreenProps<'Events'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const events: Array<Event> | null = useSelector((state: IRootState) => state.events.events);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getEvents() {
      setIsDataLoaded(await getAllEvents(dispatch, demoMode));
    }
    getEvents();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  if (isDataLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serewra...</Text>
    </View>
  }

  if (!isDataLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować wydarzeń.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return (
    <FlatList
      style={{...styles.flatList, backgroundColor}}
      contentContainerStyle={{flexGrow: 1}}
      data={events.slice(0, 20)}
      ListEmptyComponent={
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {fontSize: 16}]}>Brak wydarzeń do wyświetlenia.</Text>
          <Text style={styles.noContentText}>Aby dodać wydarzenie, użyj przycisku u góry ekranu.</Text>
        </View>}
      renderItem={(event: ListRenderItemInfo<Event>) => {
        return (
          <TouchableCard style={styles.card} onPress={() => navigation.navigate("EventDetails", { event: event.item })}>
            <Text style={[{textAlign: 'center'}, boldedText]}>{event.item.name}</Text>
            <Text style={styles.dateLabel}>{displayDateTimePeriod(new Date(event.item.startDate), new Date(event.item.endDate))}</Text>
            {event.item.city && event.item.street && event.item.streetNumber &&
              <View style={styles.addressView}>
                <Text style={{textAlign: 'center'}}>{event.item.street} {event.item.streetNumber}</Text>
                  <Text style={{textAlign: 'center'}}>{`${event.item.postalCode ? `${event.item.postalCode} ` : ''}${event.item.city}${event.item.country ? `, ${event.item.country}` : ''}`}</Text>
              </View>}

          </TouchableCard>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  noContentContainer: {
    flex: 1,
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
    padding: 5
  },
  card: {
    padding: 10,
    margin: 10,
  },
  dateLabel: {
    textAlign: 'center',
    marginTop: 5,
  },
  addressView: {
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
})