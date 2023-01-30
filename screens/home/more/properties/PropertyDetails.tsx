import {Text, useThemeColor, View} from "../../../../components/Themed";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {ActivityIndicator, ScrollView, StyleProp, StyleSheet, TextStyle, TouchableOpacity} from "react-native";
import {PropertiesStackScreenProps} from "../../../../types";
import Detail from "../../../../components/Detail";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Feather} from "@expo/vector-icons";
import * as React from "react";
import {mapPropertyType, Property} from "../../../../store/properties";
import {IRootState} from "../../../../store/store";
import {getProperty, removeProperty} from "../../../../endpoints/properties";
import {useFocusEffect} from "@react-navigation/native";

export default function PropertyDetails({ navigation, route }: PropertiesStackScreenProps<'PropertyDetails'>) {
  const dispatch = useDispatch();
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const textColor = useThemeColor({}, 'text');
  const deleteColor = useThemeColor({}, "delete");
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, "background");
  const properties = useSelector((state: IRootState) => state.properties.properties);
  const [property, setProperty] = useState<Property | null | undefined>(properties.find((property) => property.id === route.params.propertyId));
  const [isPropertyLoaded, setIsPropertyLoaded] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      async function getItemProperty() {
        setProperty(await getProperty(dispatch, route.params.propertyId, demoMode));
        setIsPropertyLoaded(true);
      }
      getItemProperty();
  }, []));

  useEffect(() => {
    navigation.setOptions({
      headerRight: !!property ? () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddEditProperty", {propertyId: route.params.propertyId})}>
          <Feather name='edit' size={24} style={{color: textColor}}/>
        </TouchableOpacity>
      ) : undefined,
    })
  }, [property])

  const itemProp: StyleProp<TextStyle> = {
    fontFamily: 'Source Sans',
    color: textColor,
  }

  async function deletePressed() {
    console.log("delete button pressed");
    removeProperty(dispatch, route.params.propertyId, demoMode);
    navigation.goBack();
  }

  function editPressed() {
    navigation.navigate("AddEditProperty", {propertyId: route.params.propertyId});
  }

  if (!isPropertyLoaded) {
    return <View style={styles.loadingView}>
      <ActivityIndicator color={tintColor} size="large" />
      <Text style={styles.loadingText}>Wczytywanie danych z serwera...</Text>
    </View>
  }

  if (!property) {
    return <View style={styles.loadingView}>
      <Text style={styles.loadingText}>Błąd połączenia z serwerem.</Text>
    </View>
  }

  return (
    <ScrollView contentContainerStyle={{backgroundColor, ...styles.container}}>
      <Detail name="Nazwa właściwości">
        <Text style={[styles.text, itemProp]}>{property.name}</Text>
      </Detail>
      <Detail name="Typ">
        <Text style={[styles.text, itemProp]}>{mapPropertyType(property.property_type_id)}</Text>
      </Detail>
      <Detail name="Opis">
        { property.description && property.description.length > 0 ?
            <Text style={[styles.text, itemProp]}>{property.description}</Text>
          :
            <Text style={[styles.text, itemProp, {fontStyle: 'italic', fontSize: 14,}]}>właściwość nie posiada opisu</Text>
        }
      </Detail>

      <View style={{flexGrow: 1}}/>
      <View style={styles.editButtonContainer}>
        <OpacityButton style={[styles.editButton, {backgroundColor: deleteColor}]} onPress={deletePressed}>Usuń</OpacityButton>
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
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontStyle: 'italic',
  },
})