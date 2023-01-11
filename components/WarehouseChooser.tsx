import React from "react";
import {View, Text, useThemeColor} from "./Themed";
import {FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Warehouse} from "../store/warehouses";
import {useSelector} from "react-redux";
import {IRootState} from "../store/store";
import {TouchableCard} from "./Themed/TouchableCard";

type propsType = {
  selectedWarehouse: Warehouse | undefined
  setSelectedWarehouse: React.Dispatch<React.SetStateAction<Warehouse | undefined>>
}

export default function WarehouseChooser({selectedWarehouse, setSelectedWarehouse}: propsType) {
  const warehouses: Warehouse[] = useSelector((state: IRootState) => state.warehouses.warehouses);
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
      data={warehouses}
      ListEmptyComponent={
      <View style={styles.listEmptyView}>
        <Text style={styles.listEmptyText}>
          Ta organizacja nie posiada magazynów. Aby przyporządkować przedmioty do magazynów, dodaj magazyny do organizacji.
        </Text>
      </View>}
      renderItem={({item}) => {
        return (
          <TouchableCard
            style={[
              styles.card,
              item.id === selectedWarehouse?.id && {backgroundColor: tintColor}
            ]}
            onPress={() => setSelectedWarehouse((prevWarehouse) => {return prevWarehouse?.id === item.id ? undefined : item})}
          >
            <Text style={[boldedText, item.id === selectedWarehouse?.id && {color: textColor}]}>{item.name}</Text>
            <Text style={{textAlign: 'center'}}>{item.street} {item.streetNumber}</Text>
            <Text style={{textAlign: 'center'}}>{`${item.postalCode ? `${item.postalCode} ` : ''}${item.city}${item.country ? `, ${item.country}` : ''}`}</Text>

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