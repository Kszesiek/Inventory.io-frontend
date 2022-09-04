import {FlatList, ListRenderItemInfo, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor} from "../../../components/Themed";
import {LendingForEvent, LendingPrivate} from "../../../store/lendings";
import {displayDateTimePeriod} from "../../../utilities/date";
import {useSelector} from "react-redux";
import {store} from "../../../store/store";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import enlistItems from "../../../utilities/enlist";
import {LendingStackScreenProps} from "../../../types";

export default function Lendings({ navigation, route }: LendingStackScreenProps<'Lendings'>) {
  const lendings: Map<string, LendingForEvent | LendingPrivate> = useSelector((state: typeof store.dispatch.prototype) => state.lendings.lendings)

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: useThemeColor({}, "tint"),
  }

  return (
    <FlatList
      style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
      data={Array.from(lendings.values()).slice(0, 20)}
      renderItem={(lending: ListRenderItemInfo<LendingForEvent | LendingPrivate>) => {
        const itemsListed: string = enlistItems(lending.item.itemNames);

        return (
          <TouchableCard style={styles.card} onPress={() => navigation.navigate("LendingDetails", { lendingId: lending.item.lendingId })}>
              {lending.item instanceof LendingForEvent ?
                <Text style={{textAlign: 'center'}}>Wypożyczono <Text style={boldedText}>{itemsListed}</Text> na wydarzenie <Text style={boldedText}>{lending.item.eventName}</Text></Text>
                :
                <Text style={{textAlign: 'center'}}>Użytkownik <Text style={boldedText}>{lending.item.username}</Text> wypożyczył <Text style={boldedText}>{itemsListed}</Text></Text>
              }
              <Text style={styles.dateLabel}>{displayDateTimePeriod(lending.item.startDate, lending.item.endDate)}</Text>
          </TouchableCard>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  menuCard: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 7,
  },
  flatList: {
    width: '100%',
    padding: 5
  },
  card: {
    padding: 10,
    margin: 10,
  },
  dateLabel: {
    textAlign: 'center',
    marginTop: 5,
  },
})