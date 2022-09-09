import {Alert, FlatList, StyleSheet} from "react-native";
import {useThemeColor, View} from "../../../components/Themed";
import {EventStackScreenProps} from "../../../types";
import {useDispatch} from "react-redux";
import {useLayoutEffect, useState} from "react";
import {
  Event,
  isEvent,
  eventActions,
} from "../../../store/events";
import {writeOutArray} from "../../../utilities/enlist";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";

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
  const cancelColor = useThemeColor({}, "delete");

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edytuj wypożyczenie" : "Stwórz wypożyczenie"
    });
  }, [navigation, isEditing])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const dateRegex = /^20(0[0-9]|1[0-9]|2[0-9])-(0[1-9]|1[0-2])-(0[1-9]|1\d|2\d|3[01])$/;
    const startDateIsValid: boolean = dateRegex.test(inputs.startDate.value) && new Date(inputs.startDate.value).toString() !== "Invalid Date";
    const endDateIsValid: boolean = dateRegex.test(inputs.endDate.value) && new Date(inputs.endDate.value).toString() !== "Invalid Date";
    const nameIsValid: boolean = inputs.name.value.trim().length >= 0;

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
      }
    });

    if (!nameIsValid || !startDateIsValid || !endDateIsValid) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!nameIsValid)
        wrongDataArray.push("event name")

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

  const dateComponent = <View style={styles.dateAmountRow}>
    <Input
      label="Data początku"
      isInvalid={inputs.startDate.isInvalid}
      style={styles.input}
      // onErrorText="Please enter a date between 2000-01-01 and 2029-12-31 following template YYYY-MM-DD"
      textInputProps={{
        placeholder: "YYYY-MM-DD",
        maxLength: 10,
        onChangeText: inputChangedHandler.bind(null, "startDate"),
        value: inputs.startDate.value,
      }}
    />
    <View style={{width: 10}}/>
    <Input
      label="Data końca"
      isInvalid={inputs.endDate.isInvalid}
      style={styles.input}
      // onErrorText="Please enter a date between 2000-01-01 and 2029-12-31 following template YYYY-MM-DD"
      textInputProps={{
        placeholder: "YYYY-MM-DD",
        maxLength: 10,
        onChangeText: inputChangedHandler.bind(null, "endDate"),
        value: inputs.endDate.value,
      }}
    />
  </View>

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!event ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    eventNameComponent,
    dateComponent,
  ]

  return (
    <FlatList
      data={listElements}
      renderItem={item => item.item}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{backgroundColor, ...styles.container}}
      ListFooterComponent={buttonsComponent}
      ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dateAmountRow: {
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
  }
});