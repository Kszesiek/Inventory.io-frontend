import {ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {eventActions} from "../../../store/events";
import {useDispatch, useSelector} from "react-redux";
import {EventStackScreenProps} from "../../../types";
import {Event} from "../../../store/events";
import {store} from "../../../store/store";
import Detail from "../../../components/Detail";
import {displayDateTimePeriod} from "../../../utilities/date";
import {OpacityButton} from "../../../components/Themed/OpacityButton";

export default function EventDetails({ navigation, route }: EventStackScreenProps<'EventDetails'>) {
  const dispatch = useDispatch();
  const event: Event = useSelector((state: typeof store.dispatch.prototype) =>
    state.events.events.find((item: Event) => item.eventId === route.params.eventId))

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: useThemeColor({}, "text"),
  }

  const backgroundColor = useThemeColor({}, "background");

  async function deletePressed() {
    console.log("delete button pressed");
    await dispatch(eventActions.removeEvent({eventId: event.eventId}));
    navigation.goBack();
  }

  function editPressed() {
    navigation.navigate("AddEditEvent", {event: event});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa wydarzenia">
        <Text style={[styles.text, property]}>{event.name}</Text>
      </Detail>
      <Detail name="Termin">
        <Text style={[styles.text, property]}>{displayDateTimePeriod(new Date(event.startDate), new Date(event.endDate))}</Text>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]} onPress={deletePressed}>Usuń</OpacityButton>
        <OpacityButton style={styles.editButton} onPress={editPressed}>Edytuj</OpacityButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  mainCard: {
    margin: 15,
    padding: 10,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  editButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  text: {
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
  ordinalNumber: {
    fontSize: 12,
  },
})