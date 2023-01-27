import {Alert, ScrollView, StyleSheet, View as DefaultView} from "react-native";
import {getPlaceholderColor, Text, useThemeColor, View} from "../../../components/Themed";
import {RentalStackScreenProps} from "../../../types";
import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import {Rental, RentalTemplate} from "../../../store/rentals";
import Input from "../../../components/Input";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../utilities/enlist";
import {IRootState} from "../../../store/store";
import {Member} from "../../../store/members";
import DateTimePicker from "@react-native-community/datetimepicker";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import {displayDate, displayTime} from "../../../utilities/date";
import colors from "../../../constants/Colors";
import {getAllMembers} from "../../../endpoints/members";
import {addRental, getRental, modifyRental} from "../../../endpoints/rentals";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  name: ValidValuePair,
  startDate: ValidValuePair,
  endDate: ValidValuePair,
  description: ValidValuePair,
}

export default function AddEditRental({ navigation, route }: RentalStackScreenProps<'AddEditRental'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const rentals: Rental[] = useSelector((state: IRootState) => state.rentals.rentals);
  const rental: Rental | undefined = rentals.find((rental) => rental.rentalId === route.params?.rentalId);

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, 'text');
  const cancelColor = useThemeColor({}, "delete");
  const placeholderTextColor = getPlaceholderColor(textColor, textColor);

  const [isUsersDropdownOpen, setUsersDropdownOpen] = useState<boolean>(false);
  const [chosenUserId, setChosenUserId] = useState<string>(rental?.userId || "");

  const members: Member[] = useSelector((state: IRootState) => state.members.members);
  const [areMembersLoaded, setAreMembersLoaded] = useState<boolean | undefined>(members.length === 0 ? undefined : true);

  const [startDate, setStartDate] = useState<Date>(!!rental ? new Date(rental.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(!!rental ? new Date(rental.endDate) : new Date());
  const [showStartDateDialog, setShowStartDateDialog] = useState<boolean>(false);
  const [showStartTimeDialog, setShowStartTimeDialog] = useState<boolean>(false);
  const [showEndDateDialog, setShowEndDateDialog] = useState<boolean>(false);
  const [showEndTimeDialog, setShowEndTimeDialog] = useState<boolean>(false);

  useEffect(() => {
    async function getMembers() {
      setAreMembersLoaded(await getAllMembers(dispatch, demoMode));
    }
    getMembers();
    async function getRentalDetails() {
      if (route.params?.rentalId)
        await getRental(dispatch, route.params.rentalId, demoMode);
    }
    getRentalDetails();
  }, []);

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
    name: {
      value: !!rental ? rental.name : "",
      isInvalid: false,
    },
    startDate: {
      value: !!rental ? rental.startDate.slice(0, 10) : "",
      isInvalid: false,
    },
    endDate: {
      value: !!rental ? rental.endDate.slice(0, 10) : "",
      isInvalid: false,
    },
    description: {
      value: !!rental ? rental.description || "" : "",
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
      console.warn("Start date undefined!");
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
      title: !!route.params?.rentalId ? "Edytuj wypożyczenie" : "Stwórz wypożyczenie"
    });
  }, [navigation, route.params])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    if (inputs.startDate.value.length === 0) {
      console.warn("startDate value is empty!");
    }
    if (inputs.endDate.value.length === 0) {
      console.warn("endDate value is empty!");
    }

    const startDateIsValid: boolean = new Date(inputs.startDate.value).toString() !== "Invalid Date";
    const endDateIsValid: boolean = new Date(inputs.endDate.value).toString() !== "Invalid Date";
    const startEndTimeIsValid: boolean = !startDateIsValid || !endDateIsValid || new Date(inputs.endDate.value) >= new Date(inputs.startDate.value);
    const userIdIsValid: boolean = chosenUserId.length > 0;
    const nameIsValid: boolean = inputs.description.value.trim().length >= 0 && inputs.description.value.length < 100;
    const descriptionIsValid: boolean = inputs.description.value.trim().length >= 0 && inputs.description.value.length < 1000;

    setInputs((currentInputs: inputValuesType) => {
      return {
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        userId: {
          value: chosenUserId,
          isInvalid: !userIdIsValid,
        },
        startDate: {
          value: currentInputs.startDate.value,
          isInvalid: !startDateIsValid,
        },
        endDate: {
          value: currentInputs.endDate.value,
          isInvalid: !endDateIsValid,
        },
        description: {
          value: currentInputs.description.value,
          isInvalid: !descriptionIsValid,
        },
      }
    });

    if (!nameIsValid || !descriptionIsValid || !startDateIsValid || !endDateIsValid || !startEndTimeIsValid || !userIdIsValid) {
      const wrongDataArray: string[] = []
      if (!startDateIsValid)
        wrongDataArray.push("start date")
      if (!endDateIsValid)
        wrongDataArray.push("end date")
      if (!startEndTimeIsValid)
        wrongDataArray.push("start and end time of date")
      if (!descriptionIsValid)
        wrongDataArray.push("description")
      if (!userIdIsValid)
        wrongDataArray.push("user")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const rentalTemplate: RentalTemplate = {
      borrower_id: chosenUserId,
      name: inputs.name.value,
      start_time: inputs.startDate.value,
      end_time: inputs.endDate.value,
      description: inputs.description.value,
    }

    if (!!route.params?.rentalId) {
      const response = await modifyRental(dispatch, rentalTemplate, route.params.rentalId, demoMode);

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await addRental(dispatch, rentalTemplate, demoMode);

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
  }

  function inputChangedHandler<InputParam extends keyof typeof inputs>(inputIdentifier: InputParam, enteredValue: string, index?: number) {
    console.log(`${inputIdentifier} value changed`);
    setInputs((currentInputValues: typeof inputs) => (
      // if (Array.isArray(inputs[inputIdentifier]) && index !== undefined) {
      //   const newValues = currentInputValues.itemNames
      //   newValues[index] = {value: enteredValue, isInvalid: false}
      //   return {
      //     ...currentInputValues,
      //     [inputIdentifier]: newValues,
      //   }
      // } else {
      //         return
      {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, isInvalid: false},
      }
    ))
  }

  // ACTUAL FORM FIELDS

  const nameComponent = <Input
    key="name"
    label="Nazwa wypożyczenia"
    isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "nazwa wypożyczenia...",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  const usernameComponent = <DefaultView
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
        disabled={!areMembersLoaded}
        placeholder="wybierz użytkownika..."
        searchPlaceholder="Wyszukaj użytkownika..."
        textStyle={{color: textColor}}
        closeOnBackPressed={true}
        theme={backgroundColor === colors.dark.background ? 'DARK' : "LIGHT"}
        style={{...styles.dropdown, backgroundColor: cardColor}}
        dropDownContainerStyle={{...styles.dropdown, backgroundColor: cardColor}}
        searchTextInputStyle={{borderColor: backgroundColor, elevation: 5, backgroundColor: cardColor}}
        scrollViewProps={{
          nestedScrollEnabled: false,
        }}
        listMode="SCROLLVIEW"
        mode="BADGE"
        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
      />
    </DefaultView>

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
    key="description"
    label="Opis"
    isInvalid={inputs.description.isInvalid}
    // onErrorText="Please enter a description containing under 4000 characters"
    textInputProps={{
      placeholder: "opis...",
      multiline: true,
      value: inputs.description.value,
      onChangeText: inputChangedHandler.bind(null, "description"),
      // autoCorrect: false,  // default is true
      // autoCapitalize: 'sentences',  // default is sentences
    }} />

  // const itemsListComponent = <ExpandableItemList
  //   key="itemsList"
  //   data={inputs.itemNames}
  //   onChangeText={inputChangedHandler.bind(null, "itemNames")}
  //   onAddItem={inputChangedHandler.bind(null, "itemNames", "", inputs.itemNames.length)}
  //   onDeleteItem={(index: number) => {
  //
  //     setInputs((currentInputValues: typeof inputs) => {
  //       const newValues = currentInputValues.itemNames
  //       newValues.splice(index, 1);
  //
  //       return {
  //         ...currentInputValues,
  //         ["itemNames"]: [...newValues],
  //       }
  //     })}}
  //   />

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!rental ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    nameComponent,
    usernameComponent,
    startDateComponent,
    endDateComponent,
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
      </ScrollView>
      { showStartDateDialog && <DateTimePicker
          mode={"date"}
          firstDayOfWeek={1}
          locale={"pl-PL"}
          value={startDate}
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
          value={startDate}
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
          value={endDate}
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
          value={endDate}
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