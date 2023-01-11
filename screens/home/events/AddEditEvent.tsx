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
import * as Location from "expo-location";
import * as React from "react";
import {LocationButton} from "../../../components/LocationButton";

export type ValidValuePair<Type> = {
  value: Type
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair<string>,
  startDate: ValidValuePair<string>,
  endDate: ValidValuePair<string>,
  country: ValidValuePair<string | undefined>,
  city: ValidValuePair<string>,
  postalCode: ValidValuePair<string | undefined>,
  street: ValidValuePair<string>,
  streetNumber: ValidValuePair<string>,
}

export default function AddEditEvent({ navigation, route }: EventStackScreenProps<'AddEditEvent'>) {
  const dispatch = useDispatch();

  const event = route.params?.event;
  const isEditing = !!event;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, 'text');
  const cancelColor = useThemeColor({}, "delete");
  const placeholderTextColor = getPlaceholderColor(textColor, textColor);

  const [startDate, setStartDate] = useState<Date>(!!event && isEvent(event) ? new Date(event.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(!!event && isEvent(event) ? new Date(event.endDate) : new Date());
  const [showStartDateDialog, setShowStartDateDialog] = useState<boolean>(false);
  const [showStartTimeDialog, setShowStartTimeDialog] = useState<boolean>(false);
  const [showEndDateDialog, setShowEndDateDialog] = useState<boolean>(false);
  const [showEndTimeDialog, setShowEndTimeDialog] = useState<boolean>(false);

  // const [location, setLocation] = useState<Location.LocationObject | null>(null);

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
    country: {
      value: !!event && isEvent(event) ? event.country || "" : "",
      isInvalid: false,
    },
    city: {
      value: !!event && isEvent(event) ? event.city || ""  : "",
      isInvalid: false,
    },
    postalCode: {
      value: !!event && isEvent(event) ? event.postalCode || ""  : "",
      isInvalid: false,
    },
    street: {
      value: !!event && isEvent(event) ? event.street || ""  : "",
      isInvalid: false,
    },
    streetNumber: {
      value: !!event && isEvent(event) ? event.streetNumber || ""  : "",
      isInvalid: false,
    },
  });

  useEffect(() => {
    console.log("StartDate changed");
    if (startDate === undefined) {
      console.warn("Start date undefined!");
      return;
    }
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        startDate: {value: startDate.toISOString(), isInvalid: false},
      }
    })
  }, [startDate]);

  useEffect(() => {
    console.log("EndDate changed");
    if (endDate === undefined) {
      console.warn("End date undefined!");
      return;
    }
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
    const countryIsValid: boolean = inputs.country.value === undefined || inputs.country.value.trim().length < 100;
    const cityIsValid: boolean = inputs.city.value.trim().length > 0 && inputs.city.value.trim().length < 100;
    const postalCodeIsValid: boolean = inputs.postalCode.value === undefined || inputs.postalCode.value.trim().length < 100;
    const streetIsValid: boolean = inputs.street.value.trim().length > 0 && inputs.street.value.trim().length < 100;
    const streetNumberIsValid: boolean = inputs.streetNumber.value.trim().length > 0 && inputs.streetNumber.value.trim().length < 100;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        startDate: {
          value: currentInputs.startDate.value,
          isInvalid: !startDateIsValid,
        },
        endDate: {
          value: currentInputs.endDate.value,
          isInvalid: !endDateIsValid,
        },
        country: {
          value: !!currentInputs.country.value && currentInputs.country.value.length > 0 ? currentInputs.country.value : undefined,
          isInvalid: !countryIsValid,
        },
        city: {
          value: currentInputs.city.value,
          isInvalid: !cityIsValid,
        },
        postalCode: {
          value: !!currentInputs.postalCode.value && currentInputs.postalCode.value.length > 0 ? currentInputs.postalCode.value : undefined,
          isInvalid: !postalCodeIsValid,
        },
        street: {
          value: currentInputs.street.value,
          isInvalid: !streetIsValid,
        },
        streetNumber: {
          value: currentInputs.streetNumber.value,
          isInvalid: !streetNumberIsValid,
        },
      }
    });

    if (!nameIsValid || !startDateIsValid || !endDateIsValid || !startEndTimeIsValid || !countryIsValid || !cityIsValid || !postalCodeIsValid || !streetIsValid || !streetNumberIsValid) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!nameIsValid)
        wrongDataArray.push("event name")
      if (!startEndTimeIsValid)
        wrongDataArray.push("start and end time of date")
      if (!countryIsValid)
        wrongDataArray.push("country")
      if (!cityIsValid)
        wrongDataArray.push("city")
      if (!postalCodeIsValid)
        wrongDataArray.push("postal code")
      if (!streetIsValid)
        wrongDataArray.push("street")
      if (!streetNumberIsValid)
        wrongDataArray.push("street number")

      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const eventData: Event = !!event && isEvent(event) ?
      {
        eventId: event.eventId,
        name: inputs.name.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
        country: !!inputs.country.value && inputs.country.value.length > 0 ? inputs.country.value : undefined,
        city: inputs.city.value,
        postalCode: !!inputs.postalCode.value && inputs.postalCode.value.length > 0 ? inputs.postalCode.value : undefined,
        street: inputs.street.value,
        streetNumber: inputs.streetNumber.value,
      }
      :
      {
        eventId: Math.random().toString(),
        name: inputs.name.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
        country: !!inputs.country.value && inputs.country.value.length > 0 ? inputs.country.value : undefined,
        city: inputs.city.value,
        postalCode: !!inputs.postalCode.value && inputs.postalCode.value.length > 0 ? inputs.postalCode.value : undefined,
        street: inputs.street.value,
        streetNumber: inputs.streetNumber.value,
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

  const useCurrentLocationButton = <LocationButton
    onConfirmLocation={(address: Location.LocationGeocodedAddress) => {
      setInputs((currentInputValues: typeof inputs) => { return {
        ...currentInputValues,
        country: {value: address.country, isInvalid: false},
        city: {value: address.city, isInvalid: false},
        postalCode: {value: address.postalCode, isInvalid: false},
        street: {value: address.street, isInvalid: false},
        streetNumber: {value: address.streetNumber, isInvalid: false},
      }})
    }}
  />

  const countryComponent = <Input
    key="country"
    label="Kraj"
    isInvalid={inputs.country.isInvalid}
    textInputProps={{
      placeholder: "kraj",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "country"),
      value: inputs.country.value,
    }}
  />

  const cityComponent = <Input
    key="city"
    label="Miasto"
    isInvalid={inputs.city.isInvalid}
    textInputProps={{
      placeholder: "miasto",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "city"),
      value: inputs.city.value,
    }}
  />

  const postalCodeComponent = <Input
    key="postalCode"
    label="Kod pocztowy"
    isInvalid={inputs.postalCode.isInvalid}
    textInputProps={{
      placeholder: "kod pocztowy",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "postalCode"),
      value: inputs.postalCode.value,
    }}
  />

  const streetComponent = <Input
    key="street"
    label="Ulica"
    isInvalid={inputs.street.isInvalid}
    textInputProps={{
      placeholder: "ulica",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "street"),
      value: inputs.street.value,
    }}
  />

  const streetNumberComponent = <Input
    key="streetNumber"
    label="Numer budynku / mieszkania"
    isInvalid={inputs.streetNumber.isInvalid}
    textInputProps={{
      placeholder: "numer budynku / mieszkania",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "streetNumber"),
      value: inputs.streetNumber.value,
    }}
  />

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!event ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    eventNameComponent,
    startDateComponent,
    endDateComponent,
    useCurrentLocationButton,
    countryComponent,
    cityComponent,
    postalCodeComponent,
    streetComponent,
    streetNumberComponent,
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