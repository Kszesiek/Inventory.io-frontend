import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {Text, TextInput, useThemeColor, View} from "./Themed";
import {OpacityButton} from "./Themed/OpacityButton";
import {ValidValuePair} from "../screens/home/lendings/AddEditLending";
import {MaterialIcons} from "@expo/vector-icons";
import * as React from "react";

type propsType = {
  data: ValidValuePair[]
  onChangeText: (enteredValue: string, index?: number) => void
  onAddItem: () => void
  onDeleteItem: (index: number) => void
}

export default function ExpandableItemList ({data, onChangeText, onAddItem, onDeleteItem}: propsType) {
  const cardBackground = useThemeColor({}, "cardBackground");
  const errorColor = useThemeColor({}, "delete");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, data.some(item => item.isInvalid) && {color: errorColor}]}>Przedmioty</Text>
      {data?.length > 0 ? <FlatList
        contentContainerStyle={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) =>
          <View key={index} style={styles.itemView}>
            <Text style={[styles.text, styles.ordinalNumber]}>{index + 1}.</Text>
            <TextInput
              style={[styles.card, styles.input, {backgroundColor: item.isInvalid ? errorColor :  cardBackground}]}
              multiline={true}
              value={data[index].value}
              onChangeText={(text) => onChangeText(text, index)}
            />
            <TouchableOpacity onPress={() => {
              onDeleteItem(index)
            }}>
              <MaterialIcons name="delete-outline" size={24} color={errorColor} />
            </TouchableOpacity>

          </View>
        }
      /> : <Text style={{fontStyle: 'italic', textAlign: 'center', marginVertical: 6}}>
        {'Żaden przedmiot nie został dodany do wypożyczenia.\nDodaj przedmioty, aby móc utworzyć wypożyczenie.'}
      </Text>}
      <OpacityButton
        textStyle={{fontSize: 15}}
        style={styles.addItem}
        onPress={onAddItem}
      >Dodaj przedmiot</OpacityButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  flatList: {
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontFamily: 'Source Sans',
    fontSize: 16,
    marginVertical: 3,
  },
  ordinalNumber: {
    fontSize: 20,
  },
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 15,
  },
  addItem: {
    paddingHorizontal: 40,
    paddingVertical: 6,
    marginTop: 5,
    alignSelf: 'center',
  },
  input: {
    margin: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    flex: 1,
  },
  itemView: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
})
