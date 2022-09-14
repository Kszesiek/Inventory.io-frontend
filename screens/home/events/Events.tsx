import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import {Event} from "../../../store/events";

import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {displayDateTimePeriod} from "../../../utilities/date";
import {EventStackScreenProps} from "../../../types";

export default function Events({ navigation, route }: EventStackScreenProps<'Events'>) {
  const events: Array<Event> = useSelector((state: IRootState) => state.events.events)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  return (
    <FlatList
      style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
      contentContainerStyle={{flexGrow: 1}}
      data={events.slice(0, 20)}
      ListEmptyComponent={
        <View style={styles.noContentContainer}>
          <Text style={[styles.noContentText, {fontSize: 16}]}>Brak wydarzeń do wyświetlenia.</Text>
          <Text style={styles.noContentText}>Aby dodać wydarzenie, użyj przycisku u góry ekranu.</Text>
        </View>}
      renderItem={(event: ListRenderItemInfo<Event>) => {
        return (
          <TouchableCard style={styles.card} onPress={() => navigation.navigate("EventDetails", { eventId: event.item.eventId })}>
            <Text style={[{textAlign: 'center'}, boldedText]}>{event.item.name}</Text>
            <Text style={styles.dateLabel}>{displayDateTimePeriod(new Date(event.item.startDate), new Date(event.item.endDate))}</Text>
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
})