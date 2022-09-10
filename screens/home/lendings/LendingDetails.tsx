import {
  isLendingForEvent,
  isLendingPrivate,
  lendingActions,
  LendingForEvent,
  LendingPrivate
} from "../../../store/lendings";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {displayDateTimePeriod} from "../../../utilities/date";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {LendingStackScreenProps} from "../../../types";
import Detail from "../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";

export default function LendingDetails({ navigation, route }: LendingStackScreenProps<'LendingDetails'>) {
  const dispatch = useDispatch();
  const lending: LendingForEvent | LendingPrivate = useSelector((state: IRootState) =>
    state.lendings.lendings.find((item: LendingForEvent | LendingPrivate) => item.lendingId === route.params.lendingId)!)

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: useThemeColor({}, "text"),
  }

  const backgroundColor = useThemeColor({}, "background");

  async function deletePressed() {
    console.log("delete button pressed");
    navigation.replace("Lendings");
    await dispatch(lendingActions.removeLending({lendingId: lending.lendingId}));
  }

  function editPressed() {
    navigation.navigate("AddEditLending", {lending: lending});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      {isLendingForEvent(lending) ?
        <Detail name="Wydarzenie">
          <Text style={[styles.text, property]}>{lending.eventName}</Text>
        </Detail>
      : isLendingPrivate(lending) ?
        <Detail name="Użytkownik">
          <Text style={[styles.text, property]}>{lending.username}</Text>
        </Detail>
      : <Text>ERROR</Text>
      }
      <Detail name="Termin">
        <Text style={[styles.text, property]}>{displayDateTimePeriod(new Date(lending.startDate), new Date(lending.endDate))}</Text>
      </Detail>
      <Detail name="Przedmioty">
        { Array.from(lending.itemNames).map((itemName: string, index) => (
          <Text key={index} style={styles.text}><Text style={styles.ordinalNumber}>{index + 1}.</Text> {itemName}</Text>
        ))}
      </Detail>
      <Detail name="Notatki">
        <Text style={[styles.text, property]}>{lending.notes}</Text>
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
    // elevation: 10,
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
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