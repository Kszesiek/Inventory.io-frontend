import {ActivityIndicator, FlatList, StyleProp, StyleSheet, TextStyle} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../../store/store";
import {TouchableCard} from "../../../../components/Themed/TouchableCard";
import {PropertiesStackScreenProps} from "../../../../types";
import {Property} from "../../../../store/properties";
import {useEffect, useState} from "react";
import {getAllProperties} from "../../../../endpoints/properties";

export default function Members({ navigation, route }: PropertiesStackScreenProps<'Properties'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const properties: Array<Property> = useSelector((state: IRootState) => state.properties.properties)
  const [arePropertiesLoaded, setArePropertiesLoaded] = useState<boolean | undefined>(undefined);

  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    async function getProperties() {
      setArePropertiesLoaded(await getAllProperties(dispatch, demoMode));
    }
    getProperties();
  }, []);

  const boldedText: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans Bold',
  }

  if (arePropertiesLoaded === undefined) {
    return <View style={styles.noContentContainer}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.noContentText}>Ładowanie danych z serwera...</Text>
    </View>
  }

  if (!arePropertiesLoaded) {
    return <View style={styles.noContentContainer}>
      <Text style={[styles.noContentText, {fontSize: 16}]}>Nie udało się załadować właściwości.</Text>
      <Text style={styles.noContentText}>Podczas połączenia z serwerem wystąpił problem.</Text>
    </View>
  }

  return <FlatList
    style={{...styles.flatList, backgroundColor}}
    contentContainerStyle={{flexGrow: 1, paddingBottom: 20,}}
    data={properties}
    ListEmptyComponent={
      <View style={styles.noContentContainer}>
        <Text style={[styles.noContentText, {fontSize: 16}]}>Brak właściwości przedmiotów do wyświetlenia.</Text>
        <Text style={styles.noContentText}>Aby dodać właściwość, użyj przycisku u góry ekranu.</Text>
      </View>}
    renderItem={({item}: {item: Property}) => {
      return (
        <TouchableCard style={styles.card} onPress={() => navigation.navigate("PropertyDetails", { propertyId: item.id })}>
          <Text style={boldedText}>{item.name}</Text>
        </TouchableCard>
      )
    }}
  />
}

const styles = StyleSheet.create({
  noContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContentText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flatList: {
    width: '100%',
    padding: 5,
  },
  card: {
    padding: 10,
    margin: 10,
  },
})