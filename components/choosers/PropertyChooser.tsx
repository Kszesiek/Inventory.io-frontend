import React from "react";
import {View, Text, useThemeColor} from "../Themed";
import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Property} from "../../store/properties";
// import {useSelector} from "react-redux";
// import {IRootState} from "../../store/store";
import {TouchableCard} from "../Themed/TouchableCard";

type propsType = {
  selectedProperty: Property | undefined
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | undefined>>
  propertiesToChooseFrom: Property[]
}

export default function PropertyChooser({selectedProperty, setSelectedProperty, propertiesToChooseFrom}: propsType) {
  // const properties: Property[] = useSelector((state: IRootState) => state.properties.properties);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
  }

  return (
    <FlatList
      style={{...styles.flatList, backgroundColor}}
      contentContainerStyle={{flexGrow: 1}}
      data={propertiesToChooseFrom}
      ListEmptyComponent={
        <View style={styles.listEmptyView}>
          <Text style={styles.listEmptyText}>
            Brak właściwości możliwych do dodania do tej kategorii. Możesz dodać więcej właściwości do organizacji korzystając z ekranu właściwości przedmiotów.
          </Text>
        </View>}
      renderItem={({item}) => {
        return (
          <TouchableCard
            style={[
              styles.card,
              item.id === selectedProperty?.id && {backgroundColor: tintColor}
            ]}
            onPress={() => setSelectedProperty((prevProperty) => {return prevProperty?.id === item.id ? undefined : item})}
          >
            <Text style={[boldedText, item.id === selectedProperty?.id && {color: textColor}]}>{item.name}</Text>
          </TouchableCard>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
  listEmptyView: {
    margin: 10,
    justifyContent: 'center',
    flex: 1,
  },
  listEmptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
})