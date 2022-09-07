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
  // const [items, setItems] = useState(data || [] as ValidValuePair[])

  const cardBackground = useThemeColor({}, "cardBackground");
  const errorColor = useThemeColor({}, "delete");

  // function addItem() {
  //   console.log(`Adding new item`)
  //   const newItems = data;
  //   newItems.push({value: "", isInvalid: false} as ValidValuePair);
  //   setItems([...newItems]);
  // }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, data?.some(item => item.isInvalid) && {color: errorColor}]}>Przedmioty</Text>
      {data?.length > 0 ? <FlatList
        style={[styles.innerContainer, ]} // styles.card, {backgroundColor: cardBackground}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) =>
          <View key={index} style={{backgroundColor: item.isInvalid ? errorColor : 'transparent', borderRadius: 10, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.text, styles.ordinalNumber]}>{index + 1}.</Text>
            <TextInput
              style={[styles.card, styles.input, {backgroundColor: cardBackground}]}
              multiline={true}
              value={data[index].value}
              onChangeText={(text) => onChangeText(text, index)}
            />
            <TouchableOpacity onPress={() => {
              onDeleteItem(index)
              // deletePressed(index)
            }}>
              <MaterialIcons name="delete-outline" size={24} color={errorColor} />
            </TouchableOpacity>

          </View>
          //   <Input
          //   label={undefined}
          //   isInvalid={inputs.startDate.isInvalid}
          //   style={styles.input}
          //   // onErrorText="Please enter a date between 2000-01-01 and 2029-12-31 following template YYYY-MM-DD"
          //   textInputProps={{
          //   placeholder: "YYYY-MM-DD",
          //   maxLength: 10,
          //   onChangeText: inputChangedHandler.bind(null, "startDate"),
          //   value: inputs.startDate.value,
          // }}
          //   />
        }
      /> : <></>}
      <OpacityButton
        textProps={{style: {fontSize: 15}}}
        style={[styles.addItem, data?.length === 0 && {marginTop: 20, marginBottom: 20} /* don't ask me about the margins... */]}
        onPress={onAddItem} //addItem}
      >Dodaj przedmiot</OpacityButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  innerContainer: {
    // paddingVertical: 6,
    // paddingHorizontal: 10,
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
})
