import {Alert, ScrollView, StyleSheet, View as DefaultView} from "react-native";
import {getPlaceholderColor, Text, useThemeColor, View} from "../../../components/Themed";
import {LendingStackScreenProps} from "../../../types";
import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
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
import {IRootState} from "../../../store/store";
import {Member} from "../../../store/members";
import DateTimePicker from "@react-native-community/datetimepicker";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {displayDate, displayTime} from "../../../utilities/date";

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
  const userId: string = useSelector((state: IRootState) => state.appWide.userId) || "ABC";
  const members: Member[] = useSelector((state: IRootState) => state.members.members);

  const lending = route.params?.lending;
  const isEditing = !!lending;

  const [lendingType, setLendingType] = useState(isEditing ? isLendingPrivate(lending) ? 'private' : 'event' : lendingTypes[0].key)

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, 'text');
  const cancelColor = useThemeColor({}, "delete");
  const placeholderTextColor = getPlaceholderColor(textColor, textColor);

  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState<boolean>(false);
  const [chosenUserId, setChosenUserId] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | undefined>(!!lending ? new Date(lending.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(!!lending ? new Date(lending.endDate) : undefined);
  const [showStartDateDialog, setShowStartDateDialog] = useState<boolean>(false);
  const [showStartTimeDialog, setShowStartTimeDialog] = useState<boolean>(false);
  const [showEndDateDialog, setShowEndDateDialog] = useState<boolean>(false);
  const [showEndTimeDialog, setShowEndTimeDialog] = useState<boolean>(false);

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      itemNames: !!lending ?
        lending.items.map((item) => {
          return ({value: item.name, isInvalid: false} as ValidValuePair)
        })
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
      value: !!lending ? lending.notes || "" : "",
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
    const itemsAreValid: boolean[] = inputs.itemNames.map((item) => item.value.trim().length > 0 && item.value.trim().length < 100);
    const usernameIsValid: boolean = isLendingPrivate(lending) ? (inputs.username.value.trim().length > 0 && inputs.username.value.trim().length < 100) : true;
    const eventNameIsValid: boolean = isLendingForEvent(lending) ? (inputs.eventName.value.trim().length > 0 && inputs.eventName.value.trim().length < 100) : true;

    setInputs((currentInputs: inputValuesType) => {
      return {
        itemNames:
          currentInputs.itemNames.map((item, index) => {
            return (
              {
                value: item.value,
                isInvalid: !itemsAreValid[index]
              } as ValidValuePair
            )
          }),
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

    if (!notesIsValid || !startDateIsValid || !endDateIsValid || !usernameIsValid || !eventNameIsValid || itemsAreValid.length === 0 || itemsAreValid.some(item => !item)) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!notesIsValid)
        wrongDataArray.push("notes")
      if (itemsAreValid.some(item => !item))
        wrongDataArray.push("some list items")
      if (itemsAreValid.length === 0)
        wrongDataArray.push("list of items")
      if (!usernameIsValid)
        wrongDataArray.push("username")
      if (!eventNameIsValid)
        wrongDataArray.push("event name")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const lendingData: LendingPrivate | LendingForEvent = isLendingPrivate(lending) ?
      {
        lendingId: lending.lendingId,
        items: inputs.itemNames.map(item => {return {itemId: Math.random().toString(), name: item.value}}),
        userId: userId!,
        username: inputs.username.value,
        startDate: inputs.startDate.value,
        endDate: inputs.endDate.value,
        notes: inputs.notes.value,
      }
      : isLendingForEvent(lending) ?
        {
          lendingId: lending.lendingId,
          items: inputs.itemNames.map(item => {return {itemId: Math.random().toString(), name: item.value}}),
          startDate: inputs.startDate.value,
          endDate: inputs.endDate.value,
          eventId: Math.random().toString(), // trzeba będzie zmienić
          eventName: inputs.eventName.value,
          notes: inputs.notes.value,
        }
      :
        {
          lendingId: Math.random().toString(),
          items: inputs.itemNames.map(item => {return {itemId: Math.random().toString(), name: item.value}}),
          userId: userId!,
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

  const lendingTypeComponent = !isEditing ? <View
    style={{marginHorizontal: 5, marginBottom: 15,}}
    key="lendingType"
  >
    <Text style={{fontSize: 16, marginBottom: 4}}>Typ wypożyczenia</Text>
    <HighlightChooser
        data={lendingTypes}
        onPress={setLendingType}
    />
  </View> : undefined

  const usernameComponent = lendingType === 'private' ?
    <DefaultView
      style={{
        marginHorizontal: 4,
        marginVertical: 8,
      }}
      key="username"
    >
      <Text numberOfLines={1} style={{
        fontSize: 16,
        marginBottom: 4,
      }}>
        Nazwa użytkownika
      </Text>
      <DropDownPicker
        open={isUsersDropdownOpen}
        value={chosenUserId}
        items={members.map((member) => ({
            label: member.username,
            value: member.id,
          }))}
        searchable={true}
        setOpen={setUsersDropdownOpen}
        setValue={setChosenUserId}
        placeholder="wybierz użytkownika..."
        placeholderStyle={{color: "grey", fontSize: 16,}}
        textStyle={{color: 'white'}}
        closeOnBackPressed={true}
        theme={backgroundColor === '#1E2E3D' ? 'DARK' : "LIGHT"}
        style={{...styles.dropdown, backgroundColor: cardColor}}
        dropDownContainerStyle={{...styles.dropdown, backgroundColor: cardColor}}
        scrollViewProps={{
          nestedScrollEnabled: false,
        }}
        listMode="SCROLLVIEW"
        mode="BADGE"
        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
      />
    </DefaultView>
    : undefined

  const eventNameComponent = lendingType === 'event' ? <Input
    key="eventName"
    label="Nazwa wydarzenia"
    isInvalid={inputs.eventName.isInvalid}
    textInputProps={{
      placeholder: "nazwa wydarzenia",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "eventName"),
      value: inputs.eventName.value,
    }}
  /> : undefined

  const startDateComponent = <View style={styles.dateRow} key="startDate">
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

  const endDateComponent = <View style={styles.dateRow} key="endDate">
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

  const notesComponent = <Input
    key="notes"
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
    key="itemsList"
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

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!lending ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    lendingTypeComponent,
    usernameComponent,
    eventNameComponent,
    startDateComponent,
    endDateComponent,
    itemsListComponent,
    notesComponent,
  ]

  return (
    <>
      <ScrollView
        style={{
          ...styles.container,
          backgroundColor: backgroundColor,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
        scrollEnabled={!isUsersDropdownOpen}
      >
        {listElements}
        <View key="buttonsFiller" style={{flex: 1}} />
        {buttonsComponent}
        {/*{<>*/}
        {/*    <View key="date"    style={{paddingVertical: 100, backgroundColor: 'purple'}}/>*/}
        {/*    <View key="notes"   style={{paddingVertical: 100, backgroundColor: 'green' }}/>*/}
        {/*    <View key="items"   style={{paddingVertical: 100, backgroundColor: 'red'   }}/>*/}
        {/*    <View key="buttons" style={{paddingVertical: 100, backgroundColor: 'pink'  }}/>*/}
        {/*    <View key="last"    style={{paddingVertical: 100, backgroundColor: 'orange'}}/>*/}
        {/*  </>}*/}
      </ScrollView>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  dropdown: {
    borderWidth: 0,
    elevation: 5,
  },
  input: {
    flex: 1,
  },
  dateTouchableCard: {
    borderRadius: 10,
    alignItems: 'stretch',
  },
  dateItem: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
});


// <FlatList
//   data={listElements}
//   renderItem={item => item.item || <></>}
//   keyExtractor={(item, index) => index.toString()}
//   contentContainerStyle={{backgroundColor, zIndex: zIdx -= 1, ...styles.container}}
//   nestedScrollEnabled={true}
//   scrollEnabled={!isUsersDropdownOpen}
//   // ListHeaderComponent={<DropDownPicker
//   //   open={isUsersDropdownOpen}
//   //   value={chosenUserId}
//   //   items={users.map((user) => {
//   //     return {
//   //       label: user.username,
//   //       value: user.userId,
//   //     }})
//   //   }
//   //   searchable={true}
//   //   setOpen={setUsersDropdownOpen}
//   //   setValue={setChosenUserId}
//   //   placeholder="wybierz użytkownika..."
//   //   placeholderStyle={{color: "grey"}}
//   //   textStyle={{color: 'white'}}
//   //   closeOnBackPressed={true}
//   //   theme={"DARK"}
//   //   // zIndex={100}
//   //   // setItems={setItems}
//   //   style={{
//   //     borderWidth: 0,
//   //     elevation: 5,
//   //     backgroundColor: '#273444',
//   //     marginVertical: 5,
//   //     // zIndex: 10000,
//   //   }}
//   //   dropDownContainerStyle={{
//   //     borderWidth: 0,
//   //     elevation: 5,
//   //     backgroundColor: '#273444',
//   //   }}
//   //   // arrowIconStyle={{backgroundColor: 'green'}}
//   //   // multiple={true}
//   //   mode="BADGE"
//   //   badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
//   // />}
//   // ListHeaderComponentStyle={{ zIndex: 1000 }}
//   ListFooterComponent={buttonsComponent}
//   ListFooterComponentStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
// />