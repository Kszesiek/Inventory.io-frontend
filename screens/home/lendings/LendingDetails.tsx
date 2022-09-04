import {LendingForEvent, LendingPrivate} from "../../../store/lendings";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {displayDateTimePeriod} from "../../../utilities/date";
import {OpacityButton} from "../../../components/Themed/OpacityButton";
import {FlatList, ListRenderItemInfo, ScrollView, StyleProp, StyleSheet, TextStyle} from "react-native";
import {LendingStackScreenProps} from "../../../types";
import {useSelector} from "react-redux";
import {store} from "../../../store/store";
import Detail from "../../../components/Detail";

export default function LendingDetails({ navigation, route }: LendingStackScreenProps<'LendingDetails'>) {
  const lendingId: string = route.params.lendingId;
  const lendings: Map<string, LendingForEvent | LendingPrivate> = useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings)

  const lending: LendingForEvent | LendingPrivate = lendings.get(lendingId)! //useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings[lendingId])

  const property: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: useThemeColor({}, "text"),
  }

  const backgroundColor = useThemeColor({}, "background");

  function deletePressed() {
    console.log("delete button pressed");
  }

  function editPressed() {
    navigation.navigate("AddEditLending", {lendingId: lendingId});
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      {lending instanceof LendingForEvent ?
        <Detail name="Wydarzenie">
          <Text style={[styles.text, property]}>{lending.eventName}</Text>
        </Detail>
        :
        <Detail name="Użytkownik">
          <Text style={[styles.text, property]}>{lending.username}</Text>
        </Detail>
      }
      <Detail name="Termin">
        <Text style={[styles.text, property]}>{displayDateTimePeriod(lending.startDate, lending.endDate)}</Text>
      </Detail>
      <Detail name="Przedmioty">
        <FlatList
          data={lending.itemNames}
          renderItem={(itemName: ListRenderItemInfo<string>) => {
            return (
              <Text style={styles.text}><Text style={styles.ordinalNumber}>{itemName.index + 1}.</Text> {itemName.item}</Text>
            )}}
        />
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={{...styles.editButton, backgroundColor: useThemeColor({}, "delete")}} onPress={deletePressed}>
          Usuń
        </OpacityButton>
        <OpacityButton style={styles.editButton} onPress={editPressed}>
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