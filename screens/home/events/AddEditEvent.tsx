import {Alert, FlatList, StyleSheet} from "react-native";
import {useThemeColor, View, Text, getPlaceholderColor} from "../../../components/Themed";
import DateTimePicker from '@react-native-community/datetimepicker';
import {EventStackScreenProps} from "../../../types";
import {useDispatch} from "react-redux";
import {useEffect, useLayoutEffect, useState} from "react";
import {
  Event,
  isEvent,
  eventActions,
} from "../../../store/events";
import {writeOutArray} from "../../../utilities/enlist";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {displayDate, displayTime} from "../../../utilities/date";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  startDate: ValidValuePair,
  endDate: ValidValuePair,
}

export default function AddEditEvent({ navigation, route }: EventStackScreenProps<'AddEditEvent'>) {
  const dispatch = useDispatch();

  const event = route.params?.event;
  const isEditing = !!event;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, 'text');
  const cancelColor = useThemeColor({}, "delete");
  const placeholderTextColor = getPlaceholderColor(textColor, textColor);

  const [startDate, setStartDate] = useState<Date | undefined>(!!event && isEvent(event) ? new Date(event.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(!!event && isEvent(event) ? new Date(event.endDate) : undefined);
  const [showStartDateDialog, setShowStartDateDialog] = useState<boolean>(false);
  const [showStartTimeDialog, setShowStartTimeDialog] = useState<boolean>(false);
  const [showEndDateDialog, setShowEndDateDialog] = useState<boolean>(false);
  const [showEndTimeDialog, setShowEndTimeDialog] = useState<boolean>(false);


  const [inputs, setInputs]: [inputValuesType, Function] = useState(
  {
    name: {
      value: !!event && isEvent(event) ? event.name : "",
      isInvalid: false,
    },
    startDate: {
      value: !!event && isEvent(event) ? event.startDate.slice(0, 10) : "",
      isInvalid: false,
    },
    endDate: {
      value: !!event && isEvent(event) ? event.endDate.slice(0, 10) : "",
      isInvalid: false,
    },
  });

  useEffect(() => {
    console.log("StartDate changed");
    if (startDate === undefined)
      return;
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        startDate: {value: startDate.toISOString(), isInvalid: false},
      }
    })
  }, [startDate]);

  useEffect(() => {
    console.log("EndDate changed");
    if (endDate === undefined)
      return;
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        endDate: {value: endDate.toISOString(), isInvalid: false},
      }
    })
  }, [endDate]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edytuj wydarzenie" : "Stwórz wydarzenie"
    });
  }, [navigation, isEditing])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const startDateIsValid: boolean = new Date(inputs.startDate.value).toString() !== "Invalid Date";
    const endDateIsValid: boolean = new Date(inputs.endDate.value).toString() !== "Invalid Date";
    const nameIsValid: boolean = inputs.name.value.trim().length > 0;
    const startEndTimeIsValid: boolean = !startDateIsValid || !endDateIsValid || new Date(inputs.endDate.value) >= new Date(inputs.startDate.value);

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        startDate: {
          value: currentInputs.startDate.value,
          isInvalid: !startDateIsValid || !startEndTimeIsValid,
        },
        endDate: {
          value: currentInputs.endDate.value,
          isInvalid: !endDateIsValid || !startEndTimeIsValid,
        },
      }
    });

    if (!nameIsValid || !startDateIsValid || !endDateIsValid || !startEndTimeIsValid) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!nameIsValid)
        wrongDataArray.push("event name")
      if (!startEndTimeIsValid)
        wrongDataArray.push("start and end time od date")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const eventData: Event = isEvent(event) ?
      {
        eventId: event.eventId,
        name: inputs.name.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
      }
      :
      {
        eventId: Math.random().toString(),
        name: inputs.name.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
      }

    if (isEditing) {
      const response = await dispatch(eventActions.modifyEvent({event: eventData}));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(eventActions.addEvent({event: eventData}));

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
  }

  function inputChangedHandler<InputParam extends keyof typeof inputs>(inputIdentifier: InputParam, enteredValue: string) {
    console.log(`${inputIdentifier} value changed`);
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, isInvalid: false},
      }
    })
  }

  // ACTUAL FORM FIELDS

  const eventNameComponent = <Input
    label="Nazwa wydarzenia"
    isInvalid={inputs.name.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "nazwa wydarzenia",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const startDateComponent = <View style={styles.dateRow}>
    <View style={{...styles.dateItem, flex: 5}}>
      <Text numberOfLines={1} style={{
        fontSize: 16,
        marginBottom: 4,
      }}>
        Data rozpoczęcia
      </Text>
      <TouchableCard
        style={[styles.dateTouchableCard, inputs.startDate.isInvalid && {backgroundColor: cancelColor}]}
        onPress={() => {
          setShowStartDateDialog(true);
        }}
      >
        <Text numberOfLines={1} style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 18,
        }}>
          {!!startDate ? displayDate(startDate) : <Text style={{fontStyle: "italic", fontSize: 14, color: placeholderTextColor}}>wybierz datę</Text>}
        </Text>
      </TouchableCard>
    </View>
    <View style={{flex: 4, ...styles.dateItem}}>
      <Text style={{
        fontSize: 16,
        marginBottom: 4,
      }}>
        Godzina rozpoczęcia
      </Text>
      <TouchableCard
        style={[styles.dateTouchableCard, inputs.startDate.isInvalid && {backgroundColor: cancelColor}]}
        onPress={() => {
          setShowStartTimeDialog(true);
        }}
      >
        <Text style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 18,
        }}>
          {!!startDate ? displayTime(startDate) : <Text style={{fontStyle: "italic", fontSize: 14, color: placeholderTextColor}}>wybierz godzinę</Text>}
        </Text>
      </TouchableCard>
    </View>
  </View>

  const endDateComponent = <View style={styles.dateRow}>
    <View style={{flex: 5, ...styles.dateItem}}>
      <Text numberOfLines={1} style={{
        fontSize: 16,
        marginBottom: 4,
      }}>
        Data zakończenia
      </Text>
      <TouchableCard
        style={[styles.dateTouchableCard, inputs.endDate.isInvalid && {backgroundColor: cancelColor}]}
        onPress={() => {
          setShowEndDateDialog(true);
        }}
      >
        <Text numberOfLines={1} style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 18,
        }}>
          {!!endDate ? displayDate(endDate) : <Text style={{fontStyle: "italic", fontSize: 14, color: placeholderTextColor}}>wybierz datę</Text>}
        </Text>
      </TouchableCard>
    </View>
    <View style={{flex: 4, ...styles.dateItem}}>
      <Text style={{
        fontSize: 16,
        marginBottom: 4,
      }}>
        Godzina zakończenia
      </Text>
      <TouchableCard
        style={[styles.dateTouchableCard, inputs.endDate.isInvalid && {backgroundColor: cancelColor}]}
        onPress={() => {
          setShowEndTimeDialog(true);
        }}
      >
        <Text style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          fontSize: 18,
        }}>
          {!!endDate ? displayTime(endDate) : <Text style={{fontStyle: "italic", fontSize: 14, color: placeholderTextColor}}>wybierz godzinę</Text>}
        </Text>
      </TouchableCard>
    </View>
  </View>

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!event ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    eventNameComponent,
    startDateComponent,
    endDateComponent,
  ]

  return (
    <>
      <FlatList
        data={listElements}
        renderItem={item => item.item}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{backgroundColor, ...styles.container}}
        ListFooterComponent={buttonsComponent}
        ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
      />
      { showStartDateDialog && <DateTimePicker
          mode={"date"}
          firstDayOfWeek={1}
          locale={"pl-PL"}
          value={startDate|| new Date()}
          is24Hour={true}
          display="default"
          maximumDate={!!endDate ? endDate : undefined}
          onChange={(event, date) => {
            setShowStartDateDialog(false);
            date && date.setUTCSeconds(0, 0) && setStartDate(date);
          }}
      />}
      { showStartTimeDialog && <DateTimePicker
        // positiveButton={{label: 'OK', textColor: 'green'}}
        // negativeButton={{label: 'BBB', textColor: 'red'}}
        // textColor={textColor}
        mode={"time"}
        firstDayOfWeek={1}
        locale={"pl-PL"}
        value={startDate|| new Date()}
        is24Hour={true}
        // display="spinner"
        maximumDate={!!endDate ? endDate : undefined}
        onChange={(event, date) => {
          setShowStartTimeDialog(false);
          date && date.setUTCSeconds(0, 0) && setStartDate(date);
        }}
      />}
      { showEndDateDialog && <DateTimePicker
          mode={"date"}
          firstDayOfWeek={1}
          locale={"pl-PL"}
          value={endDate|| new Date()}
          is24Hour={true}
          display="default"
          minimumDate={!!startDate ? startDate : undefined}
          onChange={(event, date) => {
            setShowEndDateDialog(false);
            date && date.setUTCSeconds(0, 0) && setEndDate(date);
          }}
      />}
      { showEndTimeDialog && <DateTimePicker
        // positiveButton={{label: 'OK', textColor: 'green'}}
        // negativeButton={{label: 'BBB', textColor: 'red'}}
        // textColor={textColor}
          mode={"time"}
          firstDayOfWeek={1}
          locale={"pl-PL"}
          value={endDate|| new Date()}
          is24Hour={true}
        // display="spinner"
          minimumDate={!!startDate ? startDate : undefined}
          onChange={(event, date) => {
            setShowEndTimeDialog(false);
            date && date.setUTCSeconds(0, 0) && setEndDate(date);
          }}
      />}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dateRow: {
    flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
  },
  dateTouchableCard: {
    // shadowColor: 'black',
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 5,
    borderRadius: 10,
    alignItems: 'stretch',
  },
  dateItem: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
});