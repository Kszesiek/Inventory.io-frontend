import {Alert, FlatList, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {LendingStackScreenProps} from "../../../types";
import {useLayoutEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
  LendingForEvent,
  LendingPrivate,
  lendingActions,
  isLendingPrivate,
  isLendingForEvent, isLending
} from "../../../store/lendings";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import HighlightChooser from "../../../components/HighlightChooser";
import ExpandableItemList from "../../../components/ExpandableItemList";
import {writeOutArray} from "../../../utilities/enlist";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  username: ValidValuePair,
  eventName: ValidValuePair,
  itemNames: ValidValuePair[],
  startDate: ValidValuePair,
  endDate: ValidValuePair,
  notes: ValidValuePair,
}

const lendingTypes = [
  { 'key': "private", label: 'prywatne' },
  { 'key': "event", label: 'na wydarzenie' },
];

export default function AddEditLending({ navigation, route }: LendingStackScreenProps<'AddEditLending'>) {
  const dispatch = useDispatch();

  const lending = route.params?.lending;
  const isEditing = !!lending;

  const [lendingType, setLendingType] = useState(isEditing ? isLendingPrivate(lending) ? 'private' : 'event' : lendingTypes[0].key)

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
  {
    itemNames: !!lending ?
      lending.itemNames.map((item) => {return ({value: item, isInvalid: false} as ValidValuePair)})
      :
      [] as ValidValuePair[],
    eventName: {
      value: !!lending && isLendingForEvent(lending) ? lending.eventName : "",
      isInvalid: false,
    },
    username: {
      value: !!lending && isLendingPrivate(lending) ? lending.username : "",
      isInvalid: false,
    },
    startDate: {
      value: !!lending && isLending(lending) ? lending.startDate.slice(0, 10) : "",
      isInvalid: false,
    },
    endDate: {
      value: !!lending && isLending(lending) ? lending.endDate.slice(0, 10) : "",
      isInvalid: false,
    },
    notes: {
      value: !!lending ? lending.notes : "",
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
    const startDateIsValid: boolean = !isLendingForEvent(lending) ? (dateRegex.test(inputs.startDate.value) && new Date(inputs.startDate.value).toString() !== "Invalid Date") : true;
    const endDateIsValid: boolean = !isLendingForEvent(lending) ? (dateRegex.test(inputs.endDate.value) && new Date(inputs.endDate.value).toString() !== "Invalid Date") : true;
    const notesIsValid: boolean = inputs.notes.value.trim().length >= 0;
    const itemsAreValid: boolean[] = inputs.itemNames.map((item) => {return (item.value.trim().length > 0 && item.value.trim().length < 100)});
    const usernameIsValid: boolean = isLendingPrivate(lending) ? (inputs.username.value.trim().length > 0 && inputs.username.value.trim().length < 100) : true;
    const eventNameIsValid: boolean = isLendingForEvent(lending) ? (inputs.eventName.value.trim().length > 0 && inputs.eventName.value.trim().length < 100) : true;

      setInputs((currentInputs: inputValuesType) => {
      return {
        itemNames: [
          currentInputs.itemNames.map((item, index) => {
            return (
              {
                value: item.value,
                isInvalid: !itemsAreValid[index]
              } as ValidValuePair
            )
          })
        ],
        eventName: {
          value: currentInputs.eventName.value,
          isInvalid: !eventNameIsValid,
        },
        username: {
          value: currentInputs.username.value,
          isInvalid: !usernameIsValid,
        },
        startDate: {
          value: currentInputs.startDate.value,
          isInvalid: !startDateIsValid,
        },
        endDate: {
          value: currentInputs.endDate.value,
          isInvalid: !endDateIsValid,
        },
        notes: {
          value: currentInputs.notes.value,
          isInvalid: !notesIsValid,
        }
      }
    });

    if (!notesIsValid || !startDateIsValid || !endDateIsValid || !usernameIsValid || !eventNameIsValid || !itemsAreValid.some(item => !item)) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!notesIsValid)
        wrongDataArray.push("notes")
      if (itemsAreValid.some(item => !item))
        wrongDataArray.push("some list items")
      if (!usernameIsValid)
        wrongDataArray.push("username")
      if (!eventNameIsValid)
        wrongDataArray.push("event name")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check the ${wrongDataString} and try again.`);
      return;
    }

    const lendingData: LendingPrivate | LendingForEvent = isLendingPrivate(lending) ?
      {
        lendingId: lending.lendingId,
        itemNames: inputs.itemNames.map(item => item.value), // inputs.itemNames.map(item => {return item.value}),
        username: inputs.username.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
        notes: inputs.notes.value,
      }
      : isLendingForEvent(lending) ?
        {
          lendingId: lending.lendingId,
          itemNames: inputs.itemNames.map(item => item.value), // inputs.itemNames.map(item => {return item.value}),
          startDate: inputs.startDate.value,
          endDate: inputs.endDate.value,
          eventName: inputs.eventName.value,
          notes: inputs.notes.value,
        }
      :
        {
          lendingId: Math.random().toString(),
          itemNames: inputs.itemNames.map(item => item.value),
          username: "GenericUsername",
          startDate: inputs.startDate.value,
          endDate: inputs.endDate.value,
          notes: inputs.notes.value,
        }

    if (isEditing) {
      const response = await dispatch(lendingActions.modifyLending({lending: lendingData}));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(lendingActions.addLending({lending: lendingData}));

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
  }

  function inputChangedHandler<InputParam extends keyof typeof inputs>(inputIdentifier: InputParam, enteredValue: string, index?: number) {
    console.log(`${inputIdentifier} value changed`);
    setInputs((currentInputValues: typeof inputs) => {
      // return {
      //   ...currentInputValues,
      //   [inputIdentifier]: {value: enteredValue, isInvalid: false},
      // }

      if (Array.isArray(inputs[inputIdentifier]) && index !== undefined) {
        const newValues = currentInputValues.itemNames
        newValues[index] = {value: enteredValue, isInvalid: false}
        return {
          ...currentInputValues,
          [inputIdentifier]: newValues,
        }
      } else {
        return {
          ...currentInputValues,
          [inputIdentifier]: {value: enteredValue, isInvalid: false},
        }
      }
    })
  }

  // ACTUAL FORM FIELDS

  const lendingTypeComponent = !isEditing ? <>
        <Text style={{fontSize: 16, marginBottom: 4}}>Typ wypożyczenia</Text>
        <HighlightChooser
            data={lendingTypes}
            onPress={setLendingType}
        />
    </> : <></>

  const usernameComponent = lendingType === 'private' ? <Input // isLendingPrivate(lending)
      label="Nazwa użytkownika"
      isInvalid={inputs.username.isInvalid}
      textInputProps={{
        placeholder: "nazwa użytkownika",
        maxLength: 40,
        onChangeText: inputChangedHandler.bind(null, "username"),
        value: inputs.username.value,
      }}
  /> : <></>

  const eventNameComponent = lendingType === 'event' ? <Input // isLendingForEvent(lending)
      label="Nazwa wydarzenia"
      isInvalid={inputs.eventName.isInvalid}
      textInputProps={{
        placeholder: "nazwa wydarzenia",
        maxLength: 40,
        onChangeText: inputChangedHandler.bind(null, "eventName"),
        value: inputs.eventName.value,
      }}
  /> : <></>

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

  const notesComponent = <Input
    label="Notatki"
    isInvalid={inputs.notes.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "tu wpisz notatki...",
      multiline: true,
      value: inputs.notes.value,
      onChangeText: inputChangedHandler.bind(null, "notes"),
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  const itemsListComponent = <ExpandableItemList
    data={inputs.itemNames}
    onChangeText={inputChangedHandler.bind(null, "itemNames")}
    onAddItem={inputChangedHandler.bind(null, "itemNames", "", inputs.itemNames.length)}
    onDeleteItem={(index: number) => {

      setInputs((currentInputValues: typeof inputs) => {
        const newValues = currentInputValues.itemNames
        newValues.splice(index, 1);

        return {
          ...currentInputValues,
          ["itemNames"]: [...newValues],
        }
      })}}
    />

  const buttonsComponent = <View style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!lending ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    lendingTypeComponent,
    usernameComponent,
    eventNameComponent,
    dateComponent,
    itemsListComponent,
    notesComponent,
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

// TAK, TO JEST JEDEN COMPONENT
// <ModalSelector
//   data={lendingTypes}
//   initValue="dotknij, aby wybrać typ wypożyczenia..."
//   disabled={isEditing}
//   animationType="fade"
//   backdropPressToClose={true}
//   selectStyle={{
//     backgroundColor: useThemeColor({}, 'cardBackground'),
//     borderWidth: 0,
//     marginHorizontal: 4,
//     marginVertical: 8,
//     shadowColor: 'black',
//     shadowOpacity: 0.26,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     elevation: 5,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   }}
//   initValueTextStyle={{
//     fontSize: 18,
//     fontFamily: 'Source Sans',
//     textAlign: 'left',
//     color: getPlaceholderColor(),
//   }}
//   selectTextStyle={{
//     fontSize: 18,
//     fontFamily: 'Source Sans',
//     textAlign: 'left',
//     color: getPlaceholderColor(),
//   }}
//   cancelStyle={{backgroundColor: cancelColor}}
//   cancelTextStyle={{color: useThemeColor({}, 'buttonText')}}
//   cancelText="Anuluj"
//   onChange={(option) => {setIsPrivate(option.key === "private"); setLendingType(option.label) }}
// >
//   <TextInput
//     style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30}}
//     editable={false}
//     placeholder="Wybierz typ wypożyczenia"
//     value={lendingType} />
// </ModalSelector>