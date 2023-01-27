import {Animated, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {CategoriesStackScreenProps} from "../../../../types";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {Property} from "../../../../store/properties";
import {IRootState} from "../../../../store/store";
import * as React from "react";
import Card from "../../../../components/Themed/Card";
import {MaterialIcons} from "@expo/vector-icons";
import {Modalize} from "react-native-modalize";
import {addPropertyToGroup, getAllProperties, removePropertyFromGroup} from "../../../../endpoints/properties";
import PropertyChooser from "../../../../components/choosers/PropertyChooser";
import { CommonActions } from "@react-navigation/native";

export default function EditCategoryProperties({ navigation, route }: CategoriesStackScreenProps<'EditCategoryProperties'>) {
  const dispatch = useDispatch();
  const demoMode: boolean = useSelector((state: IRootState) => state.appWide.demoMode);

  const propertyModalizeRef = useRef<Modalize>(null);
  const properties: Property[] = useSelector((state: IRootState) => state.properties.properties);
  const [chosenProperty, setChosenProperty] = useState<Property | undefined>(undefined);
  const [categoryProperties, setCategoryProperties] = useState<Property[]>(route.params.properties);

  const backgroundColor = useThemeColor({}, "background");
  const errorColor = useThemeColor({}, "delete");
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    async function getProperties() {
      getAllProperties(dispatch, demoMode);
    }
    getProperties();
  }, []);

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={styles.button} onPress={() => {
      navigation.dispatch(state => {
        // Remove the last 2 routes from current list of routes
        const routes = state.routes.slice(0, -2);

        // Reset the state to the new state with updated list of routes
        return CommonActions.reset({
          ...state,
          index: routes.length - 1,
          routes
        });
      });

      navigation.navigate("CategoryDetails", {categoryId: route.params.categoryId});
    }}>Zatwierdź</OpacityButton>
  </View>

  async function onDeleteProperty (propertyId: number) {
    console.log('deleting property...');
    const response = await removePropertyFromGroup(dispatch, propertyId, route.params.categoryId, demoMode);
    if (response) {
      setCategoryProperties((prevProperties) => prevProperties.filter((property) => property.id !== propertyId));
    }
  }

  async function onAddProperty (property: Property) {
    console.log('adding property...');
    const response = await addPropertyToGroup(dispatch, property.id, route.params.categoryId, demoMode);
    if (response) {
      setCategoryProperties((prevProperties) => [
        ...prevProperties,
        property,
      ]);
    }
  }

  function chooseProperty() {
    return (
      <Animated.View style={{flex: 1, marginTop: 10,}}>
        <Text style={[styles.propertyDrawerTitle, {color: tintColor}]}>Wybierz właściwość</Text>
        <PropertyChooser
          selectedProperty={chosenProperty}
          setSelectedProperty={setChosenProperty}
          propertiesToChooseFrom={properties.filter((property) => categoryProperties.every((_property) => _property.id !== property.id))}
        />
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <OpacityButton
            style={[styles.propertyDrawerButton, {backgroundColor: errorColor}]}
            onPress={async () => propertyModalizeRef.current?.close()}
          >
            Anuluj
          </OpacityButton>
          <OpacityButton
            style={[styles.propertyDrawerButton, !chosenProperty && {opacity: 0.5}]}
            props={{disabled: !chosenProperty}}
            onPress={async () => {
              if (!chosenProperty)
                return;

              onAddProperty(chosenProperty);
              propertyModalizeRef.current?.close();
            }}
          >
            Potwierdź
          </OpacityButton>
        </View>
      </Animated.View>
    )
  }

  return (
    <>
      <ScrollView
        style={{
          ...styles.container,
          backgroundColor: backgroundColor,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        {categoryProperties.map((property,index) => (
          <View style={styles.itemView} key={property.id}>
            <Text style={[styles.text, styles.ordinalNumber]}>{index + 1}.</Text>
            <Card style={styles.card}>
              <Text style={[styles.text, {paddingHorizontal: 8}]}>{property.name}</Text>
            </Card>
            <TouchableOpacity onPress={() => onDeleteProperty(property.id)}>
              <MaterialIcons name="delete-outline" size={30} color={errorColor}/>
            </TouchableOpacity>
          </View>
        ))}
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <OpacityButton
            style={[styles.addPropertiesButton]}
            onPress={() => propertyModalizeRef.current?.open()}
            textStyle={{fontSize: 16}}
          >
            Dodaj właściwość
          </OpacityButton>
        </View>
        {buttonsComponent}
      </ScrollView>
      <Modalize
        ref={propertyModalizeRef}
        modalStyle={{...styles.modalStyle, backgroundColor}}
        customRenderer={chooseProperty()}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  itemView: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    padding: 5,
    margin: 10,
    // borderRadius: 10,
  },
  addPropertiesButton: {
    margin: 15,
    paddingVertical: 6,
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
  propertyDrawerTitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  propertyDrawerButton: {
    margin: 15,
    paddingVertical: 8,
  },
});