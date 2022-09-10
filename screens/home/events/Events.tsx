import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor} from "../../../components/Themed";
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
      data={events.slice(0, 20)}
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