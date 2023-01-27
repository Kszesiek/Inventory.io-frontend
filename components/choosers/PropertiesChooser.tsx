import React from "react";
import {View, Text, useThemeColor} from "../Themed";
import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Property} from "../../store/properties";
import {useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {TouchableCard} from "../Themed/TouchableCard";

type propsType = {
  selectedProperties: Property[]
  setSelectedProperties: React.Dispatch<React.SetStateAction<Property[]>>
}

export default function PropertiesChooser({selectedProperties, setSelectedProperties}: propsType) {
  const properties: Property[] = useSelector((state: IRootState) => state.properties.properties);
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
    color: tintColor,
  }

  return (
    <FlatList
      style={{...styles.flatList, backgroundColor: useThemeColor({}, 'background')}}
      contentContainerStyle={{flexGrow: 1}}
      data={properties}
      ListEmptyComponent={
        <View style={styles.listEmptyView}>
          <Text style={styles.listEmptyText}>
            Ta organizacja nie posiada właściwości przedmiotów. Aby przyporządkować właściwości do kategorii, dodaj właściwości przemdiotów do organizacji.
          </Text>
        </View>}
      renderItem={({item}) => {
        return (
          <TouchableCard
            key={item.id}
            style={[
              styles.card,
              selectedProperties.some((property) => property.id === item.id) && {backgroundColor: tintColor}
            ]}
            onPress={() => setSelectedProperties((prevProperties) => {
              const isPropertySelected: boolean = prevProperties.some((property) => property.id === item.id);
              if (isPropertySelected)
              return prevProperties.filter((property) => property.id !== item.id);
              else return [
                ...prevProperties,
                item,
              ];
            })}
          >
            <Text style={[
              boldedText,
              selectedProperties.some((property) => property.id === item.id) && {color: textColor}
            ]}>{item.name}</Text>
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