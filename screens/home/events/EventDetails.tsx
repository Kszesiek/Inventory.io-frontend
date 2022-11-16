import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {eventActions} from "../../../store/events";
import {useDispatch, useSelector} from "react-redux";
import {EventStackScreenProps} from "../../../types";
import {Event} from "../../../store/events";
import {IRootState} from "../../../store/store";
import Detail from "../../../components/Detail";
import {displayDateTimePeriod} from "../../../utilities/date";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {useEffect} from "react";

export default function EventDetails({ navigation, route }: EventStackScreenProps<'EventDetails'>) {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const event: Event = useSelector((state: IRootState) =>
    state.events.events.find((item: Event) => item.eventId === route.params.eventId)!)

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!event ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditEvent", {event: event})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [event])

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Events");
    await dispatch(eventActions.removeEvent({eventId: event.eventId}));
  }

  function editPressed() {
    navigation.navigate("AddEditEvent", {event: event});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa wydarzenia">
        <Text style={styles.text}>{event.name}</Text>
      </Detail>
      <Detail name="Termin">
        <Text style={styles.text}>{displayDateTimePeriod(new Date(event.startDate), new Date(event.endDate))}</Text>
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton
          style={[styles.editButton, {backgroundColor: useThemeColor({}, "delete")}]}
          onPress={deletePressed}
        >
          Usuń
        </OpacityButton>
        <OpacityButton
          style={styles.editButton}
          onPress={editPressed}
        >
          Edytuj
        </OpacityButton>
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
    fontSize: 16,
    marginVertical: 3,
  },
  ordinalNumber: {
    fontSize: 12,
  },
})